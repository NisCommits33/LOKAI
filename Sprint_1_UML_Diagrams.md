# UML Diagrams: Sprint 1 (Authentication & Onboarding)

## 1. Use Case Diagram
This diagram illustrates the primary interactions between different actors and the Lok.ai system.

```mermaid
graph TD
    %% Styling
    classDef actor stroke:#333,stroke-width:2px,fill:#f9f9f9
    classDef usecase stroke:#666,stroke-width:1px,fill:#fff,rx:20,ry:20
    classDef package fill:#f0f4f8,stroke:#d0d7de,stroke-width:2px

    User((Public User)):::actor
    OrgAdmin((Organization Admin)):::actor
    SuperAdmin((Super Admin)):::actor
    
    subgraph LokaiAuth ["Lok.ai Auth & Onboarding"]
        direction TB
        UC1([Login with Google]):::usecase
        UC2([Profile Setup]):::usecase
        UC3([Apply for Institutional Access]):::usecase
        UC4([Submit Verification Request]):::usecase
        UC5([Approve/Reject Organization]):::usecase
        UC6([Approve/Reject Member]):::usecase
        UC7([Access Public Quizzes]):::usecase
        UC8([Access Org Resources]):::usecase
    end

    User --> UC1
    User --> UC2
    User --> UC7
    User --> UC4
    
    OrgAdmin --> UC1
    OrgAdmin --> UC3
    OrgAdmin --> UC6
    OrgAdmin --> UC8
    
    SuperAdmin --> UC1
    SuperAdmin --> UC5

    class LokaiAuth package
```

---

## 2. Class Diagram (Data Model)
This diagram shows the relationship between core entities in the database.

```mermaid
classDiagram
    direction LR
    class User {
        +UUID id
        +String email
        +String fullName
        +String role
        +String verificationStatus
        +UUID organizationId
        +UUID departmentId
        +DateTime createdAt
    }
    
    class Organization {
        +UUID id
        +String name
        +String code
        +Boolean isActive
        +DateTime createdAt
    }
    
    class OrganizationApplication {
        +UUID id
        +String name
        +String code
        +String status
        +String applicantEmail
        +DateTime createdAt
    }
    
    class Department {
        +UUID id
        +UUID organizationId
        +String name
    }

    User "0..*" --o "1" Organization : belongs to
    User "0..*" --o "0..1" Department : works in
    Department "0..*" --* "1" Organization : part of
    OrganizationApplication "1" ..> "1" Organization : results in
    
    style User fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Organization fill:#f9f9f9,stroke:#333,stroke-width:2px
    style OrganizationApplication fill:#fff,stroke:#666,stroke-dasharray: 5 5
```

---

## 3. Sequence Diagram: Google OAuth Login
The flow of asynchronous authentication and profile synchronization.

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant F as Frontend (Next.js)
    participant S as Supabase Auth
    participant G as Google OAuth
    participant DB as Supabase DB (Users)

    rect rgb(240, 244, 248)
    Note over U, G: Authentication Phase
    U->>F: Click "Continue with Google"
    F->>S: signInWithOAuth(provider: 'google')
    S->>G: Redirect to Google Login
    G-->>S: Return OAuth Token
    S-->>F: Redirect to /auth/callback
    end

    rect rgb(255, 255, 255)
    Note over F, DB: Synchronization Phase
    F->>S: getSession()
    S-->>F: Return User Session
    F->>DB: Fetch user profile (sync)
    alt Profile Missing
        F->>DB: Insert new user profile
    end
    F->>U: Redirect to Dashboard / Profile Setup
    end
```

---

## 4. Sequence Diagram: Organization Registration
How institutional access is requested and handled.

```mermaid
sequenceDiagram
    autonumber
    participant A as Applicant (Admin)
    participant F as Frontend
    participant S as Supabase Auth
    participant DB as Supabase DB

    A->>F: Fill Org Registration Form
    F->>S: signUp(email, password)
    S-->>F: User Created (org_admin role)
    F->>DB: Insert application (status: 'pending')
    DB-->>F: Success
    F->>A: Redirect to /organization/pending
```

---

## 5. Activity Diagram: User Onboarding
The logic path for new vs existing users.

```mermaid
flowchart TD
    Start([User Signs In]) --> Auth{Authenticated?}
    Auth -- No --> Login[Login Page]
    Auth -- Yes --> ProfileCheck{Profile Completed?}
    
    ProfileCheck -- No --> Setup[Profile Setup Page]
    Setup --> Submit[Submit Details]
    Submit --> ProfileCheck
    
    ProfileCheck -- Yes --> Role{User Role?}
    
    Role -- Public --> Dashboard[Public Dashboard]
    Role -- Org Admin --> PendingCheck{Application Approved?}
    
    PendingCheck -- Pending --> PendingUI[Pending Page]
    PendingCheck -- Approved --> OrgDashboard[Org Dashboard]
    
    Dashboard --> Verify[Request Org Verification]
    Verify --> VerificationPending[Verification Pending]

    style Start fill:#f9f9f9,stroke:#333
    style Auth fill:#fff,stroke:#333,stroke-width:2px
    style ProfileCheck fill:#fff,stroke:#333,stroke-width:2px
    style Role fill:#fff,stroke:#333,stroke-width:2px
```

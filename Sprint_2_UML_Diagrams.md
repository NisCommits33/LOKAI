# UML Diagrams: Sprint 2 (Institutional Onboarding & Verification)

## 1. Use Case Diagram
Defining functional boundaries for Public Users, Org Admins, and Super Admins.

```mermaid
graph LR
    %% Actors
    U((Public User)):::actor
    OA((Org Admin)):::actor
    SA((Super Admin)):::actor

    subgraph Lokai_Sprint2 ["Lok.ai Institutional System"]
        direction TB
        UC1([Register Organization]):::usecase
        UC2([Google Auth & Sync]):::usecase
        UC3([Setup Profile]):::usecase
        UC4([Submit Verification]):::usecase
        UC5([Approve/Reject Org]):::usecase
        UC6([Verify Registry Members]):::usecase
        UC7([Manage Departments]):::usecase
    end

    %% Interactions
    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4

    OA --> UC2
    OA --> UC6
    OA --> UC7

    SA --> UC2
    SA --> UC5

    %% Styling
    classDef actor stroke:#333,stroke-width:2px,fill:#f9f9f9
    classDef usecase stroke:#666,stroke-width:1px,fill:#fff,rx:15,ry:15
    class Lokai_Sprint2 package
```

---

## 2. Class Diagram (Institutional Data Model)
Schema relationships for organizations, departments, and members.

```mermaid
classDiagram
    class User {
        +UUID id
        +String full_name
        +String email
        +String role
        +UUID organization_id
        +UUID department_id
        +UUID job_level_id
        +String verification_status
        +String employee_id
        +DateTime verified_at
    }

    class Organization {
        +UUID id
        +String name
        +String code
        +Boolean is_active
        +DateTime created_at
    }

    class OrganizationApplication {
        +UUID id
        +String name
        +String code
        +String applicant_email
        +String status
        +DateTime created_at
    }

    class Department {
        +UUID id
        +UUID organization_id
        +String name
    }

    class JobLevel {
        +UUID id
        +String name
        +String grade
    }

    User "0..*" --o "0..1" Organization : works in
    User "0..*" --o "0..1" Department : assigned to
    User "0..*" --o "0..1" JobLevel : holds
    Department "0..*" --* "1" Organization : part of
    OrganizationApplication "1" ..> "1" Organization : promotes to
    
    style User fill:#f9f9f9,stroke:#333
    style Organization fill:#f9f9f9,stroke:#333
    style OrganizationApplication fill:#fff,stroke:#666,stroke-dasharray: 5 5
```

---

## 3. Sequence Diagrams

### 3.1 Organization Registration
The process of an institution joining the platform.

```mermaid
sequenceDiagram
    autonumber
    participant A as Applicant (Admin)
    participant F as Frontend
    participant S as Supabase Auth
    participant DB as Supabase DB

    A->>F: Enter Org Details & Admin Info
    F->>S: signUp(email, password)
    S-->>F: User Created (UUID)
    F->>DB: Insert record 'organization_applications' (pending)
    DB-->>F: Success
    F->>A: Show "Application Under Review" instructions
```

### 3.2 Employee Verification Request
A user requesting to be verified by their organization.

```mermaid
sequenceDiagram
    autonumber
    participant U as User (Public)
    participant F as Frontend
    participant DB as Supabase DB

    U->>F: Select Org, Dept, & Job Level
    U->>F: Input Employee ID
    F->>DB: Update profile status to 'pending'
    DB-->>F: Profile Updated
    F->>U: Show "Awaiting Verification" Screen
```

### 3.3 Admin Verification Action
The Org Admin reviewing and finalizing the membership.

```mermaid
sequenceDiagram
    autonumber
    participant OA as Org Admin
    participant F as Frontend
    participant DB as Supabase DB
    participant U as Member (User)

    OA->>F: Review Member Request
    alt Approved
        OA->>F: Click "Verify"
        F->>DB: Update User (status: 'verified', role: 'employee')
        DB-->>F: Update Success
        F-->>U: Access to Org Resources Granted
    else Rejected
        OA->>F: Click "Reject" (w/ Reason)
        F->>DB: Update User (status: 'rejected', org_id: null)
        DB-->>F: Update Success
        F-->>U: Error shown with Rejection Reason
    end
```

---

## 4. Activity Diagram: Verification Lifecycle
The end-to-end logical path for institutional identity.

```mermaid
flowchart TD
    Start([Visit Lok.ai]) --> Auth{Logged In?}
    Auth -- No --> Login[Login / Register]
    Login --> Auth
    Auth -- Yes --> ProfileCheck{Profile Setup?}
    
    ProfileCheck -- No --> Setup[Profile Setup UI]
    Setup --> ProfileCheck
    
    ProfileCheck -- Yes --> Role{Role?}
    Role -- Public --> Verify[Submit Verification Form]
    Role -- Org Admin --> Manage[Admin Dashboard]
    
    Verify --> StatePending((Status: Pending))
    StatePending --> AdminReview{Admin Review}
    
    AdminReview -- Approve --> StateVerified((Status: Verified))
    StateVerified --> RoleEmployee[Role: Employee]
    RoleEmployee --> Success([End: Access Granted])
    
    AdminReview -- Reject --> StateRejected((Status: Rejected))
    StateRejected --> Fix[Adjust Details]
    Fix --> Verify
```

---

## 5. Data Flow Diagram (DFD Level 1)
Tracking the movement of data between entities and stores.

```mermaid
graph TD
    %% Actors
    ActorUser([User])
    ActorAdmin([Org Admin])
    ActorSAdmin([Super Admin])

    %% Processes
    ProcReg[[1.0 Org Registration]]
    ProcAuth[[2.0 Auth & Sync]]
    ProcVerify[[3.0 Verification Work]]
    ProcMgmt[[4.0 Registry Mgmt]]

    %% Stores
    StoreUser[(D1: User Profiles)]
    StoreOrg[(D2: Organizations)]
    StoreApp[(D3: Applications)]

    %% Data Flows
    ActorUser -- Org Info --> ProcReg
    ProcReg -- App Record --> StoreApp
    
    ActorSAdmin -- Decision --> ProcMgmt
    ProcMgmt -- Create Record --> StoreOrg
    
    ActorUser -- Google Token --> ProcAuth
    ProcAuth -- Sync Data --> StoreUser
    
    ActorUser -- ID Details --> ProcVerify
    ProcVerify -- Pending Status --> StoreUser
    
    ActorAdmin -- Verify Action --> ProcMgmt
    ProcMgmt -- Verified Status --> StoreUser
```

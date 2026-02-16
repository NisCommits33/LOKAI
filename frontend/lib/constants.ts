export const ROLES = {
    SUPER_ADMIN: 'super_admin' as const,
    ORG_ADMIN: 'org_admin' as const,
    EMPLOYEE: 'employee' as const,
    PUBLIC: 'public' as const,
};

export const VERIFICATION_STATUS = {
    PUBLIC: 'public' as const,
    PENDING: 'pending' as const,
    VERIFIED: 'verified' as const,
    REJECTED: 'rejected' as const,
};

export const PROCESSING_STATUS = {
    PENDING: 'pending' as const,
    PROCESSING: 'processing' as const,
    COMPLETED: 'completed' as const,
    FAILED: 'failed' as const,
};

export type AppRole = typeof ROLES[keyof typeof ROLES];
export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
export type ProcessingStatus = typeof PROCESSING_STATUS[keyof typeof PROCESSING_STATUS];

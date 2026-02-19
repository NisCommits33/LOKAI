import * as z from "zod"

export const employeeVerificationSchema = z.object({
    organization_id: z.string().uuid("Please select an organization"),
    employee_id: z.string().min(3, "Employee ID must be at least 3 characters"),
    department_id: z.string().uuid().optional(),
    job_level_id: z.string().uuid().optional(),
})

export type EmployeeVerificationValues = z.infer<typeof employeeVerificationSchema>

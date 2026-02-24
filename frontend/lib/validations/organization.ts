import * as z from "zod"

export const organizationSchema = z.object({
    orgName: z.string().min(3, "Organization name must be at least 3 characters"),
    orgCode: z.string().min(2, "Organization code must be at least 2 characters").max(20),
    orgDesc: z.string().optional(),
    address: z.string().min(5, "Address must be at least 5 characters"),
    contactPhone: z.string().optional(),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    email: z.string().email("Please enter a valid government email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    applicantName: z.string().min(3, "Applicant name must be at least 3 characters"),
})

export type OrganizationFormValues = z.infer<typeof organizationSchema>

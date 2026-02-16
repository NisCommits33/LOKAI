"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase/client"
import { organizationSchema, type OrganizationFormValues } from "@/lib/validations/organization"

export default function OrganizationRegisterPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrganizationFormValues>({
        resolver: zodResolver(organizationSchema),
    })

    const onSubmit = async (data: OrganizationFormValues) => {
        setIsSubmitting(true)

        try {
            // 1. Create the user with email/password
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: `${data.orgName} Admin`,
                        role: "org_admin",
                    },
                },
            })

            if (authError) throw authError

            // 2. Submit the organization application
            const { error: appError } = await supabase.from("organization_applications").insert({
                name: data.orgName,
                code: data.orgCode,
                description: data.orgDesc,
                address: data.address,
                contact_email: data.email,
                applicant_name: `${data.orgName} Admin`,
                applicant_email: data.email,
                status: "pending",
            })

            if (appError) throw appError

            toast.success("Application submitted successfully!")
            router.push("/organization/pending")
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="py-12 bg-gray-50 flex-1">
            <Container>
                <div className="mx-auto max-w-2xl">
                    <Card className="shadow-lg border-none">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-black text-primary">Register Your Organization</CardTitle>
                            <CardDescription className="text-base pt-2">
                                Apply for a LokAI organization account to manage your resources.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="orgName">Organization Name</Label>
                                        <Input id="orgName" {...register("orgName")} placeholder="e.g. Ministry of Finance" className={errors.orgName ? "border-destructive" : ""} />
                                        {errors.orgName && <p className="text-xs text-destructive font-medium">{errors.orgName.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="orgCode">Organization Code</Label>
                                        <Input id="orgCode" {...register("orgCode")} placeholder="e.g. MOF-NP" className={errors.orgCode ? "border-destructive" : ""} />
                                        {errors.orgCode && <p className="text-xs text-destructive font-medium">{errors.orgCode.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgDesc">Description (Optional)</Label>
                                    <Textarea id="orgDesc" {...register("orgDesc")} placeholder="Briefly describe your organization's purpose" rows={3} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Full Address</Label>
                                    <Input id="address" {...register("address")} placeholder="e.g. Singha Durbar, Kathmandu" className={errors.address ? "border-destructive" : ""} />
                                    {errors.address && <p className="text-xs text-destructive font-medium">{errors.address.message}</p>}
                                </div>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground font-bold tracking-wider">Admin Credentials</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Admin Email</Label>
                                        <Input id="email" type="email" {...register("email")} placeholder="admin@org.gov.np" className={errors.email ? "border-destructive" : ""} />
                                        {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Admin Password</Label>
                                        <Input id="password" type="password" {...register("password")} className={errors.password ? "border-destructive" : ""} />
                                        {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting Application..." : "Complete Registration"}
                                </Button>
                                <p className="text-xs text-center text-gray-400 leading-relaxed px-6">
                                    By registering, you confirm you are an authorized representative of the organization.
                                    Applications are manually reviewed by our superadmin team.
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </Container>
        </div>
    )
}


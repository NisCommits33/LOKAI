"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/AuthProvider"
import { employeeVerificationSchema, type EmployeeVerificationValues } from "@/lib/validations/profile"
import { VERIFICATION_STATUS } from "@/lib/constants"

export default function ProfileVerifyPage() {
    const { user, profile } = useAuth()
    const [organizations, setOrganizations] = useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EmployeeVerificationValues>({
        resolver: zodResolver(employeeVerificationSchema),
    })

    useEffect(() => {
        const fetchOrgs = async () => {
            const { data } = await supabase.from("organizations").select("id, name").eq("is_active", true)
            setOrganizations(data || [])
        }
        fetchOrgs()
    }, [])

    const onSubmit = async (data: EmployeeVerificationValues) => {
        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from("users")
                .update({
                    organization_id: data.organization_id,
                    employee_id: data.employee_id,
                    verification_status: VERIFICATION_STATUS.PENDING,
                    verification_requested_at: new Date().toISOString(),
                })
                .eq("id", user?.id)

            if (error) throw error
            toast.success("Verification request sent!")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Failed to send request")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (profile?.verification_status === VERIFICATION_STATUS.PENDING) {
        return (
            <div className="py-20 bg-gray-50 flex-1 flex items-center">
                <Container>
                    <Card className="max-w-md mx-auto text-center shadow-xl border-none">
                        <CardHeader>
                            <div className="mx-auto mb-4 bg-amber-100 text-amber-600 rounded-full h-16 w-16 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl font-bold">Verification Pending</CardTitle>
                            <CardDescription className="text-base font-medium">
                                Your request to join **{profile.organizations?.name}** is being reviewed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">
                                Once verified, you will have official access to your department&apos;s documents and quizzes.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                                Return to Dashboard
                            </Button>
                        </CardFooter>
                    </Card>
                </Container>
            </div>
        )
    }

    if (profile?.verification_status === VERIFICATION_STATUS.VERIFIED) {
        return (
            <div className="py-20 bg-gray-50 flex-1 flex items-center">
                <Container>
                    <Card className="max-w-md mx-auto text-center shadow-xl border-none">
                        <CardHeader>
                            <div className="mx-auto mb-4 bg-green-100 text-green-600 rounded-full h-16 w-16 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl font-bold text-green-700">Verified Member</CardTitle>
                            <CardDescription className="text-base">
                                You are a verified member of **{profile.organizations?.name}**.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button className="w-full" onClick={() => router.push("/dashboard")}>
                                Go to Library
                            </Button>
                        </CardFooter>
                    </Card>
                </Container>
            </div>
        )
    }

    return (
        <div className="py-12 bg-gray-50 flex-1">
            <Container>
                <div className="max-w-xl mx-auto">
                    <Card className="shadow-lg border-none overflow-hidden">
                        <div className="h-2 bg-primary w-full" />
                        <CardHeader>
                            <CardTitle className="text-2xl font-black italic">Employee Verification</CardTitle>
                            <CardDescription className="text-base pt-1">
                                Join your official organization to access internal preparation materials.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Select Organization</Label>
                                    <Select onValueChange={(v: string) => setValue("organization_id", v)}>
                                        <SelectTrigger className={errors.organization_id ? "border-destructive italic text-destructive" : ""}>
                                            <SelectValue placeholder="Choosing your office..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {organizations.map((org) => (
                                                <SelectItem key={org.id} value={org.id}>
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.organization_id && <p className="text-xs text-destructive font-bold">{errors.organization_id.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employee_id">Official Employee ID</Label>
                                    <Input id="employee_id" {...register("employee_id")} placeholder="e.g. MOF-2080-123" className={errors.employee_id ? "border-destructive italic" : ""} />
                                    {errors.employee_id && <p className="text-xs text-destructive font-bold">{errors.employee_id.message}</p>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button type="submit" className="w-full h-12 text-lg font-black shadow-md hover:scale-[1.01] transition-transform" disabled={isSubmitting}>
                                    {isSubmitting ? "Requesting..." : "Submit for Verification"}
                                </Button>
                                <p className="text-xs text-center text-gray-400">
                                    Your ID will be manually verified by your organization&apos;s admin.
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </Container>
        </div>
    )
}

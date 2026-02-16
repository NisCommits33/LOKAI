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
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { BadgeCheck, Clock, ShieldCheck, Building2, UserCheck, ArrowRight, AlertCircle } from "lucide-react"

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

    // Pending State UI
    if (profile?.verification_status === VERIFICATION_STATUS.PENDING) {
        return (
            <div className="py-20 bg-white flex-1 flex items-center min-h-screen">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="mb-8">
                            <BackButton />
                        </div>
                        <Card className="text-center shadow-none border border-slate-100 overflow-hidden bg-white">
                            <CardHeader className="pt-12 px-10">
                                <div className="mx-auto mb-8 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl h-16 w-16 flex items-center justify-center">
                                    <Clock className="w-8 h-8 animate-pulse" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Review Pending</CardTitle>
                                <CardDescription className="text-sm pt-3 font-medium text-slate-500">
                                    Your application for **{profile.organizations?.name || 'your office'}** is being processed.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-10 pb-6">
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                    Institutional administrators are manually verifying your credentials.
                                    Expect access within 24-48 hours.
                                </p>
                            </CardContent>
                            <CardFooter className="px-10 pb-12">
                                <Button className="w-full h-11 text-sm font-bold rounded-xl bg-slate-900 text-white shadow-none" onClick={() => router.push("/dashboard")}>
                                    Return to Dashboard
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </Container>
            </div>
        )
    }

    // Verified State UI
    if (profile?.verification_status === VERIFICATION_STATUS.VERIFIED) {
        return (
            <div className="py-20 bg-white flex-1 flex items-center min-h-screen">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="mb-8">
                            <BackButton />
                        </div>
                        <Card className="text-center shadow-none border border-slate-100 overflow-hidden bg-white">
                            <CardHeader className="pt-12 px-10">
                                <div className="mx-auto mb-8 bg-green-50 text-green-600 rounded-xl h-16 w-16 flex items-center justify-center border border-green-100">
                                    <BadgeCheck className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Access Granted</CardTitle>
                                <CardDescription className="text-sm pt-3 font-medium text-slate-500">
                                    You are officially verified for **{profile.organizations?.name}**.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-10 pb-6">
                                <p className="text-slate-400 text-sm font-medium">
                                    Unrestricted access to the ministerial library and official quizzes is now enabled.
                                </p>
                            </CardContent>
                            <CardFooter className="px-10 pb-12">
                                <Button className="w-full h-11 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-none" onClick={() => router.push("/dashboard")}>
                                    Open Dashboard
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </Container>
            </div>
        )
    }

    // Default Submission Form
    return (
        <div className="py-12 bg-white flex-1 min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl mx-auto"
                >
                    <div className="mb-10">
                        <BackButton />
                    </div>

                    <Card className="shadow-none border border-slate-100 overflow-hidden bg-white">
                        <CardHeader className="pt-12 px-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="bg-slate-50 text-slate-400 border-none font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">Verification Flow</div>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Identity Confirmation</h1>
                            <p className="text-slate-500 pt-3 text-base font-medium leading-relaxed">
                                Link your account to an organization to unlock professional study materials.
                            </p>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-8 px-10 pb-8 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                                        Partner Organization
                                    </Label>
                                    <Select onValueChange={(v: string) => setValue("organization_id", v)}>
                                        <SelectTrigger className={`h-11 rounded-xl text-sm border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none ${errors.organization_id ? "border-red-200" : ""}`}>
                                            <SelectValue placeholder="Select your ministry or office" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                            {organizations.map((org) => (
                                                <SelectItem key={org.id} value={org.id} className="py-2.5 font-medium text-sm rounded-lg focus:bg-slate-50">
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.organization_id && (
                                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 pl-1 pt-1">
                                            <AlertCircle className="h-3 w-3" /> {errors.organization_id.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employee_id" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                                        Institutional Member ID
                                    </Label>
                                    <Input
                                        id="employee_id"
                                        {...register("employee_id")}
                                        placeholder="e.g. MOF-2081-SEC-01"
                                        className={`h-11 rounded-xl text-sm border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none ${errors.employee_id ? "border-red-200" : ""}`}
                                    />
                                    {errors.employee_id && (
                                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 pl-1 pt-1">
                                            <AlertCircle className="h-3 w-3" /> {errors.employee_id.message}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-6 px-10 pb-12">
                                <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl bg-slate-900 text-white shadow-none hover:bg-slate-800 transition-all" disabled={isSubmitting}>
                                    {isSubmitting ? "Processing..." : "Submit for Verification"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest justify-center">
                                    <Clock className="h-3 w-3" />
                                    Review takes 24-48 business hours
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}

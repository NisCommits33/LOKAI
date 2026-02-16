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

    if (profile?.verification_status === VERIFICATION_STATUS.PENDING) {
        return (
            <div className="py-20 bg-gray-50/50 flex-1 flex items-center min-h-screen">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="mb-6">
                            <BackButton />
                        </div>
                        <Card className="text-center shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-sm">
                            <div className="h-2 bg-amber-400" />
                            <CardHeader className="pt-10 px-8">
                                <div className="mx-auto mb-6 bg-amber-100 text-amber-600 rounded-full h-20 w-20 flex items-center justify-center">
                                    <Clock className="w-10 h-10 animate-pulse" />
                                </div>
                                <CardTitle className="text-3xl font-black text-gray-900">Verification Pending</CardTitle>
                                <CardDescription className="text-lg pt-2 font-medium">
                                    Your request to join **{profile.organizations?.name || 'your office'}** is being reviewed.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-8 pb-4">
                                <p className="text-gray-500 leading-relaxed font-medium">
                                    Our administrators are manually verifying your ID. Once approved, you will gain access to all internal materials.
                                </p>
                            </CardContent>
                            <CardFooter className="px-8 pb-10">
                                <Button className="w-full h-12 font-bold shadow-lg shadow-primary/10" onClick={() => router.push("/dashboard")}>
                                    Return to Dashboard
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </Container>
            </div>
        )
    }

    if (profile?.verification_status === VERIFICATION_STATUS.VERIFIED) {
        return (
            <div className="py-20 bg-gray-50/50 flex-1 flex items-center min-h-screen">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="mb-6">
                            <BackButton />
                        </div>
                        <Card className="text-center shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-sm">
                            <div className="h-2 bg-green-500" />
                            <CardHeader className="pt-10 px-8">
                                <div className="mx-auto mb-6 bg-green-100 text-green-600 rounded-full h-20 w-20 flex items-center justify-center">
                                    <BadgeCheck className="w-12 h-12" />
                                </div>
                                <CardTitle className="text-3xl font-black text-green-700">Verified Member</CardTitle>
                                <CardDescription className="text-lg pt-2 font-medium text-green-600">
                                    You are officially part of **{profile.organizations?.name}**.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <p className="text-gray-500 font-medium">You now have unrestricted access to all organizational documents and quizzes.</p>
                            </CardContent>
                            <CardFooter className="px-8 pb-10">
                                <Button className="w-full h-12 font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100" onClick={() => router.push("/dashboard")}>
                                    Go to Library
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </Container>
            </div>
        )
    }

    return (
        <div className="py-12 bg-gray-50/50 flex-1 min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl mx-auto"
                >
                    <div className="mb-8">
                        <BackButton />
                    </div>

                    <Card className="shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-sm">
                        <div className="h-2 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />
                        <CardHeader className="pt-10 px-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div className="bg-primary/5 text-primary border-none font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">IDENTITY VERIFICATION</div>
                            </div>
                            <CardTitle className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Access Restricted</CardTitle>
                            <CardDescription className="text-lg pt-2 font-medium leading-relaxed">
                                Please confirm your workplace identity to unlock organizational materials.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-8 px-8 pb-8 pt-4">
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                        Select Your Office
                                    </Label>
                                    <Select onValueChange={(v: string) => setValue("organization_id", v)}>
                                        <SelectTrigger className={`h-12 text-base ${errors.organization_id ? "border-destructive ring-1 ring-destructive/20" : "border-gray-200"}`}>
                                            <SelectValue placeholder="Which ministry/office?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {organizations.map((org) => (
                                                <SelectItem key={org.id} value={org.id} className="py-3 font-medium">
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.organization_id && <p className="text-xs text-destructive font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.organization_id.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="employee_id" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-gray-400" />
                                        Official Employee ID
                                    </Label>
                                    <Input
                                        id="employee_id"
                                        {...register("employee_id")}
                                        placeholder="e.g. MOF-2081-001"
                                        className={`h-12 text-base ${errors.employee_id ? "border-destructive ring-1 ring-destructive/20" : "border-gray-200"}`}
                                    />
                                    {errors.employee_id && <p className="text-xs text-destructive font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.employee_id.message}</p>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-6 px-8 pb-10">
                                <Button type="submit" className="w-full h-14 text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={isSubmitting}>
                                    {isSubmitting ? "Processing..." : "Submit Verification"}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 p-3 rounded-lg justify-center">
                                    <Clock className="h-3 w-3" />
                                    Manual verification takes 24-48 hours
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}

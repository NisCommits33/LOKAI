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
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { Building2, ShieldCheck, Mail, Lock, ArrowRight, Info } from "lucide-react"

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
        <div className="py-12 bg-white flex-1 min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-2xl"
                >
                    <div className="mb-10">
                        <BackButton />
                    </div>

                    <Card className="shadow-none border border-slate-100 overflow-hidden bg-white">
                        <CardHeader className="pt-12 px-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div className="bg-slate-50 text-slate-400 border-none font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">Institutional Registration</div>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Apply for Institutional Access</h1>
                            <p className="text-slate-500 pt-3 text-base font-medium leading-relaxed">
                                Join LokAI to enable specialized document intelligence and study resources for your workplace.
                            </p>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-8 px-10 pb-8 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="orgName" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Organization Name</Label>
                                        <Input id="orgName" {...register("orgName")} placeholder="e.g. Ministry of Finance" className={`h-11 rounded-xl text-sm border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none ${errors.orgName ? "border-red-200" : ""}`} />
                                        {errors.orgName && <p className="text-[10px] text-red-500 font-bold pl-1 pt-1">{errors.orgName.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="orgCode" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Identification Code</Label>
                                        <Input id="orgCode" {...register("orgCode")} placeholder="e.g. MOF-NP" className={`h-11 rounded-xl text-sm border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none ${errors.orgCode ? "border-red-200" : ""}`} />
                                        {errors.orgCode && <p className="text-[10px] text-red-500 font-bold pl-1 pt-1">{errors.orgCode.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgDesc" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mission Brief (Optional)</Label>
                                    <Textarea id="orgDesc" {...register("orgDesc")} placeholder="Describe the purpose of your organization" rows={3} className="rounded-xl text-sm border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none resize-none" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Official Address</Label>
                                    <Input id="address" {...register("address")} placeholder="e.g. Singha Durbar, Kathmandu" className={`h-11 rounded-xl text-sm border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none ${errors.address ? "border-red-200" : ""}`} />
                                    {errors.address && <p className="text-[10px] text-red-500 font-bold pl-1 pt-1">{errors.address.message}</p>}
                                </div>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-50" />
                                    </div>
                                    <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-[0.2em] text-slate-300">
                                        <span className="bg-white px-4">Administrative Account</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Admin Email</Label>
                                        <Input id="email" type="email" {...register("email")} placeholder="admin@gov.np" className={`h-11 rounded-xl text-sm border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none ${errors.email ? "border-red-200" : ""}`} />
                                        {errors.email && <p className="text-[10px] text-red-500 font-bold pl-1 pt-1">{errors.email.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Security password</Label>
                                        <Input id="password" type="password" {...register("password")} className={`h-11 rounded-xl text-sm border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none ${errors.password ? "border-red-200" : ""}`} />
                                        {errors.password && <p className="text-[10px] text-red-500 font-bold pl-1 pt-1">{errors.password.message}</p>}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-6 px-10 pb-12 pt-4">
                                <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl bg-slate-900 text-white shadow-none hover:bg-slate-800 transition-all" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting Application..." : "Complete Application"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50/50 border border-transparent justify-center">
                                    <Info className="h-3 w-3 text-slate-400" />
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">
                                        Application confirms you are an authorized representative.
                                    </p>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}

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
import { motion, AnimatePresence } from "framer-motion"
import {
    Building2,
    ShieldCheck,
    Mail,
    Lock,
    ArrowRight,
    Info,
    User,
    FileUp,
    CheckCircle2,
    LayoutDashboard,
    Globe,
    Phone
} from "lucide-react"

export default function OrganizationRegisterPage() {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<OrganizationFormValues>({
        resolver: zodResolver(organizationSchema),
        mode: "onChange"
    })

    const nextStep = async () => {
        let fields: (keyof OrganizationFormValues)[] = []
        if (step === 1) fields = ["orgName", "orgCode", "address"]
        if (step === 2) fields = ["applicantName", "email", "password"]

        const isValid = await trigger(fields)
        if (isValid) setStep(s => s + 1)
    }

    const prevStep = () => setStep(s => s - 1)

    const onSubmit = async (data: OrganizationFormValues) => {
        if (!file) {
            toast.error("Please upload a verification document")
            return
        }

        setIsSubmitting(true)
        const loadingToast = toast.loading("Processing your application...")

        try {
            // 1. Create Auth Account
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.applicantName,
                        role: "org_admin",
                    },
                },
            })

            if (authError) throw authError

            // 2. Upload Document
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `verifications/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('org-documents')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 3. Create Application Record
            const { error: appError } = await supabase.from("organization_applications").insert({
                name: data.orgName,
                code: data.orgCode,
                description: data.orgDesc,
                address: data.address,
                contact_email: data.email,
                contact_phone: data.contactPhone,
                website: data.website,
                applicant_name: data.applicantName,
                applicant_email: data.email,
                documents: JSON.stringify([{
                    name: file.name,
                    path: filePath,
                    type: file.type,
                    size: file.size
                }]),
                status: "pending",
            })

            if (appError) throw appError

            toast.success("Application submitted successfully!", { id: loadingToast })
            router.push("/organization/pending")
        } catch (error: any) {
            toast.error(error.message || "Something went wrong", { id: loadingToast })
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    }

    return (
        <div className="py-12 bg-white flex-1 min-h-screen">
            <Container>
                <div className="mx-auto max-w-2xl">
                    <div className="mb-10 flex items-center justify-between">
                        <BackButton />
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= s ? "bg-slate-900" : "bg-slate-100"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <Card className="shadow-none border border-slate-100 overflow-hidden bg-white">
                        <CardHeader className="pt-12 px-10 bg-slate-50/50 border-b border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    {step === 1 && <Building2 className="h-5 w-5 text-slate-900" />}
                                    {step === 2 && <User className="h-5 w-5 text-slate-900" />}
                                    {step === 3 && <FileUp className="h-5 w-5 text-slate-900" />}
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Step {step} of 3</div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                                {step === 1 && "Institutional Profile"}
                                {step === 2 && "Representative Identity"}
                                {step === 3 && "Document Verification"}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium pt-1 text-slate-500">
                                {step === 1 && "Tell us about your organization or government body."}
                                {step === 2 && "Create your administrative account credentials."}
                                {step === 3 && "Upload proof of your institutional authority."}
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="p-10">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            variants={stepVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Org Name</Label>
                                                    <Input {...register("orgName")} placeholder="e.g. Ministry of Finance" className="h-11 rounded-xl shadow-none" />
                                                    {errors.orgName && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.orgName.message}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Org Code</Label>
                                                    <Input {...register("orgCode")} placeholder="e.g. MOF-NP" className="h-11 rounded-xl shadow-none" />
                                                    {errors.orgCode && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.orgCode.message}</p>}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Address</Label>
                                                <Input {...register("address")} placeholder="Official location" className="h-11 rounded-xl shadow-none" />
                                                {errors.address && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.address.message}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2"><Globe className="h-3 w-3" /> Website</Label>
                                                    <Input {...register("website")} placeholder="https://..." className="h-11 rounded-xl shadow-none font-medium" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2"><Phone className="h-3 w-3" /> Contact</Label>
                                                    <Input {...register("contactPhone")} placeholder="+977..." className="h-11 rounded-xl shadow-none font-medium" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mission (Optional)</Label>
                                                <Textarea {...register("orgDesc")} placeholder="Primary goals..." className="rounded-xl shadow-none min-h-[100px] resize-none" />
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            variants={stepVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="space-y-6"
                                        >
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</Label>
                                                <Input {...register("applicantName")} placeholder="Admin user name" className="h-11 rounded-xl shadow-none" />
                                                {errors.applicantName && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.applicantName.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Admin Email</Label>
                                                <Input type="email" {...register("email")} placeholder="verified@gov.np" className="h-11 rounded-xl shadow-none" />
                                                {errors.email && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.email.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Secure Password</Label>
                                                <Input type="password" {...register("password")} placeholder="••••••••" className="h-11 rounded-xl shadow-none font-mono" />
                                                {errors.password && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.password.message}</p>}
                                            </div>
                                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                                                <Info className="h-4 w-4 text-amber-500 shrink-0" />
                                                <p className="text-xs font-medium text-amber-700">These credentials will be used to manage your institutional portal once approved.</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            variants={stepVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="space-y-8"
                                        >
                                            <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center transition-all hover:bg-slate-50 relative group">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                                <div className="space-y-4">
                                                    <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto text-slate-300 group-hover:text-slate-900 transition-colors shadow-sm">
                                                        <FileUp className="h-8 w-8" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{file ? file.name : "Upload Authorization Proof"}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Checklist</h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                        Institutional ID or Appointment Letter
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                        Official Government Stamp visibly shown
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>

                            <CardFooter className="px-10 pb-12 pt-0 flex gap-4">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={isSubmitting}
                                        className="h-12 px-6 rounded-xl border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                                    >
                                        Back
                                    </Button>
                                )}

                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-1 h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-none"
                                    >
                                        Next Step
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !file}
                                        className="flex-1 h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-none"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Application"}
                                        <CheckCircle2 className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </CardFooter>
                        </form>
                    </Card>

                    <div className="mt-8 flex items-center justify-center gap-3">
                        <ShieldCheck className="h-4 w-4 text-slate-300" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Secured by LokAI Governance Protocol</p>
                    </div>
                </div>
            </Container>
        </div>
    )
}

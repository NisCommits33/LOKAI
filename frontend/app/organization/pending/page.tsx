"use client"

import { useEffect, useState } from "react"
import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Clock, LogOut, LayoutDashboard, CheckCircle2, XCircle, RefreshCw, ArrowRight } from "lucide-react"

type ApplicationStatus = "pending" | "approved" | "rejected" | null

export default function OrganizationPendingPage() {
    const { user, signOut } = useAuth()
    const [status, setStatus] = useState<ApplicationStatus>(null)
    const [orgName, setOrgName] = useState<string>("")
    const [rejectionReason, setRejectionReason] = useState<string>("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStatus() {
            if (!user?.email) return
            const { data } = await supabase
                .from("organization_applications")
                .select("status, name, rejection_reason")
                .eq("applicant_email", user.email)
                .order("created_at", { ascending: false })
                .limit(1)
                .single()

            if (data) {
                setStatus(data.status as ApplicationStatus)
                setOrgName(data.name)
                setRejectionReason(data.rejection_reason || "")
            }
            setLoading(false)
        }
        fetchStatus()
    }, [user])

    const statusConfig = {
        pending: {
            icon: <Clock className="w-8 h-8 animate-pulse" />,
            iconBg: "bg-amber-50 text-amber-500 border-amber-100",
            title: "Application Under Review",
            description: "Your organization registration is currently being reviewed by our administrative team.",
            badge: { color: "bg-amber-500", text: "Estimated Review: 24-48 Hours" },
        },
        approved: {
            icon: <CheckCircle2 className="w-8 h-8" />,
            iconBg: "bg-green-50 text-green-600 border-green-100",
            title: "Application Approved!",
            description: `Congratulations! ${orgName} has been approved. Your organization is now active on LokAI.`,
            badge: { color: "bg-green-500", text: "Access Granted" },
        },
        rejected: {
            icon: <XCircle className="w-8 h-8" />,
            iconBg: "bg-red-50 text-red-500 border-red-100",
            title: "Application Rejected",
            description: rejectionReason
                ? `Reason: ${rejectionReason}`
                : `We're sorry, but the application for ${orgName} was not approved at this time.`,
            badge: { color: "bg-red-500", text: "Application Declined" },
        },
    }

    const config = status ? statusConfig[status] : null

    return (
        <div className="py-20 flex-1 flex items-center bg-white min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-lg"
                >
                    {loading || !config ? (
                        <div className="flex justify-center">
                            <div className="h-8 w-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : (
                        <Card className="border border-slate-100 shadow-none bg-white overflow-hidden">
                            <CardHeader className="text-center pt-12 px-10">
                                <div className={`mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-xl border ${config.iconBg}`}>
                                    {config.icon}
                                </div>
                                <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                                    {config.title}
                                </CardTitle>
                                <CardDescription className="text-sm pt-3 font-medium text-slate-500 leading-relaxed">
                                    {config.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-10 pb-12">
                                <div className="space-y-6">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-3">
                                        <div className={`h-1.5 w-1.5 rounded-full ${config.badge.color}`} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {config.badge.text}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {status === "approved" && (
                                            <Link href="/organization/dashboard">
                                                <Button className="w-full h-11 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none transition-all">
                                                    <LayoutDashboard className="mr-2.5 h-4 w-4" />
                                                    Go to Portal
                                                </Button>
                                            </Link>
                                        )}

                                        {status === "rejected" && (
                                            <Link href="/register/organization">
                                                <Button className="w-full h-11 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none transition-all">
                                                    <RefreshCw className="mr-2.5 h-4 w-4" />
                                                    Re-submit Application
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}

                                        {status === "pending" && (
                                            <Link href="/">
                                                <Button className="w-full h-11 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none transition-all">
                                                    <LayoutDashboard className="mr-2.5 h-4 w-4" />
                                                    Return Home
                                                </Button>
                                            </Link>
                                        )}

                                        <Button
                                            variant="ghost"
                                            onClick={signOut}
                                            className="w-full h-11 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <LogOut className="mr-2.5 h-4 w-4" />
                                            Sign out
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </Container>
        </div>
    )
}

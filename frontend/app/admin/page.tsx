"use client"

import { useEffect, useState } from "react"
import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, CheckCircle2, XCircle, Clock, Search, Globe, Mail, MapPin, ShieldCheck, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/components/auth/AuthProvider"
import { ROLES } from "@/lib/constants"

interface Application {
    id: string
    name: string
    code: string
    description: string
    address: string
    contact_email: string
    applicant_name: string
    applicant_email: string
    documents: any[] | string
    status: string
    created_at: string
}

export default function AdminDashboard() {
    const [applications, setApplications] = useState<Application[]>([])
    const { user, profile, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchApplications() {
            if (authLoading || (user && !profile)) return
            const isSuperAdmin = profile?.role === ROLES.SUPER_ADMIN || profile?.role === 'super_admin'
            if (!isSuperAdmin) {
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from("organization_applications")
                .select("*")
                .eq("status", "pending")
                .order("created_at", { ascending: false })

            if (error) {
                toast.error("Failed to fetch applications")
            } else {
                setApplications(data || [])
            }
            setLoading(false)
        }

        fetchApplications()
    }, [authLoading, profile, user])

    const getDocumentUrl = (doc: any) => {
        if (!doc?.path) return "#"
        const { data } = supabase.storage.from('org-documents').getPublicUrl(doc.path)
        return data.publicUrl
    }

    const handleApprove = async (app: Application) => {
        const loadingToast = toast.loading("Processing approval...")

        try {
            const res = await fetch("/api/admin/approve-org", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "approve", application: app })
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || "Failed to approve organization")
            }

            toast.success(`${app.name} approved successfully!`, { id: loadingToast })
            setApplications(applications.filter(a => a.id !== app.id))
        } catch (error: any) {
            console.error("Approval error:", error?.message || error)
            toast.error(error?.message || "Failed to approve organization", { id: loadingToast })
        }
    }

    const handleReject = async (id: string) => {
        const app = applications.find(a => a.id === id)
        if (!app) return

        try {
            const res = await fetch("/api/admin/approve-org", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reject", application: app })
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || "Failed to reject application")
            }

            toast.success("Application rejected")
            setApplications(applications.filter(a => a.id !== id))
        } catch (error: any) {
            toast.error(error?.message || "Failed to reject application")
        }
    }

    if (authLoading || (user && !profile) || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="h-8 w-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    const isAuthorized = profile?.role === ROLES.SUPER_ADMIN || profile?.role === 'super_admin'

    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Restricted</h1>
                <p className="text-slate-500 max-w-sm mt-2 font-medium">This portal is only accessible to Super Admin accounts.</p>
                <div className="mt-8">
                    <BackButton />
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 bg-white flex-1 min-h-screen">
            <Container>
                <div className="max-w-6xl mx-auto space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <BackButton />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight tracking-[-0.03em]">System Administration</h1>
                                <p className="text-slate-500 text-lg font-medium mt-1">Review and manage institutional access requests.</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Monitoring</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: "Pending Apps", value: applications.length, icon: <Clock className="h-4 w-4" />, color: "text-blue-500" },
                            { label: "Active Orgs", value: "24", icon: <Building2 className="h-4 w-4" />, color: "text-slate-500" },
                            { label: "Stability", value: "Optimal", icon: <ShieldCheck className="h-4 w-4" />, color: "text-green-500" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-none transition-all hover:bg-slate-50/50">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className={`text-xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                    {stat.icon}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Application Queue</h2>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <Search className="h-3 w-3" />
                                <span>Filter Requests</span>
                            </div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {applications.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-20 text-center border-2 border-dashed border-slate-50 rounded-3xl"
                                >
                                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <p className="text-slate-400 font-bold">No pending applications at the moment.</p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {applications.map((app) => {
                                        const docs = typeof app.documents === 'string' ? JSON.parse(app.documents) : (app.documents || [])
                                        return (
                                            <motion.div
                                                key={app.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                            >
                                                <Card className="border border-slate-100 shadow-none hover:border-slate-200 transition-all overflow-hidden group h-full flex flex-col">
                                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                                                                    <Building2 className="h-6 w-6" />
                                                                </div>
                                                                <div>
                                                                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">{app.name}</CardTitle>
                                                                    <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Code: {app.code}</CardDescription>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-100 text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                                                                Pending Review
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-6 space-y-6 flex-1">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                    <Mail className="h-3 w-3" /> Contact
                                                                </p>
                                                                <p className="text-xs font-bold text-slate-600 truncate">{app.contact_email}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                    <MapPin className="h-3 w-3" /> Location
                                                                </p>
                                                                <p className="text-xs font-bold text-slate-600 truncate">{app.address}</p>
                                                            </div>
                                                        </div>

                                                        <div className="pt-4 border-t border-slate-50">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Institutional documents</p>
                                                            <div className="space-y-2">
                                                                {docs.length > 0 ? docs.map((doc: any, idx: number) => (
                                                                    <a
                                                                        key={idx}
                                                                        href={getDocumentUrl(doc)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group/doc"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Globe className="h-3.5 w-3.5 text-slate-400" />
                                                                            <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">{doc.name}</span>
                                                                        </div>
                                                                        <span className="text-[9px] font-black text-slate-400 uppercase group-hover/doc:text-slate-900">View</span>
                                                                    </a>
                                                                )) : (
                                                                    <div className="text-xs text-slate-400 italic">No documents provided</div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="pt-4 border-t border-slate-50">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Representative</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                                                                        {app.applicant_name.charAt(0)}
                                                                    </div>
                                                                    <span className="text-xs font-bold text-slate-900">{app.applicant_name}</span>
                                                                </div>
                                                                <span className="text-[10px] text-slate-400 font-medium">{app.applicant_email}</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="p-6 pt-0 flex gap-3">
                                                        <Button
                                                            onClick={() => handleApprove(app)}
                                                            className="flex-1 h-11 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-none"
                                                        >
                                                            Approve Request
                                                            <CheckCircle2 className="ml-2 h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleReject(app.id)}
                                                            className="w-12 h-11 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 rounded-xl transition-all shadow-none"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Container>
        </div>
    )
}

"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    FileText,
    ArrowRight,
    UserCheck,
    TrendingUp,
    ShieldAlert,
    Building2,
    Calendar,
    Mail,
    UserCircle,
    Briefcase
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { VERIFICATION_STATUS } from "@/lib/constants"
import { useEffect, useState } from "react"

export default function OrgDashboardPage() {
    const { user, profile } = useAuth()
    const [stats, setStats] = useState([
        { label: "Total Members", value: "0", icon: Users, sub: "Registered employees", key: 'members' },
        { label: "Documents", value: "0", icon: FileText, sub: "Shared study kits", key: 'docs' },
        { label: "Pending Verification", value: "0", icon: ShieldAlert, sub: "Needs review", highlight: true, key: 'pending' },
        { label: "Engagement", value: "0%", icon: TrendingUp, sub: "Activity index", key: 'engagement' },
    ])
    const [recentRequests, setRecentRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [distributions, setDistributions] = useState<{ departments: any[], jobLevels: any[] }>({ departments: [], jobLevels: [] })

    useEffect(() => {
        async function fetchDashboardData() {
            if (!profile?.organization_id) return

            try {
                const { data: { session } } = await supabase.auth.getSession()
                const response = await fetch("/api/organization/analytics", {
                    headers: {
                        "Authorization": `Bearer ${session?.access_token}`
                    }
                })

                if (!response.ok) throw new Error("Failed to fetch analytics")

                const data = await response.json()

                setStats(current => current.map(s => {
                    if (s.key === 'members') return { ...s, value: (data.users || 0).toString() }
                    if (s.key === 'pending') return { ...s, value: (data.pending_verifications || 0).toString().padStart(2, '0') }
                    if (s.key === 'docs') return { ...s, value: (data.departments || 0).toString(), label: "Departments", sub: "Active units" } // Reusing this slot for Depts temporarily or permanently? Let's check.
                    if (s.key === 'engagement') return { ...s, value: (data.job_levels || 0).toString(), label: "Job Levels", sub: "defined roles", icon: Briefcase }
                    return s
                }))

                // Also store distribution data for charts if needed
                setDistributions({
                    departments: data.dept_distribution || [],
                    jobLevels: data.level_distribution || []
                })

                // Fetch Recent Activity (keep existing logic or move to API? Keeping existing for now as API handles counts)
                const { data: activityData } = await supabase
                    .from("users")
                    .select("id, full_name, email, employee_id, verification_requested_at")
                    .eq("organization_id", profile.organization_id)
                    .eq("verification_status", VERIFICATION_STATUS.PENDING)
                    .order("verification_requested_at", { ascending: false })
                    .limit(3)

                setRecentRequests(activityData || [])
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [profile?.organization_id])

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    }

    // Derive pendingCount from stats state
    const pendingCount = stats.find(s => s.key === 'pending')?.value || '0'

    // Helper to format relative time
    const getTimeAgo = (dateStr: string) => {
        if (!dateStr) return 'recently'
        const diff = Date.now() - new Date(dateStr).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return 'just now'
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    return (
        <Container>
            <div className="space-y-10">
                {/* Header ... (keep existing) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Institutional Console</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Managing excellence for {profile?.organizations?.name || 'your institution'}.</p>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3 flex items-center gap-4">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Session</span>
                            <span className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                </motion.div>

                {/* KPI Grid ... (keep existing) */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className={`border shadow-none overflow-hidden group transition-all hover:border-slate-200 ${stat.highlight && parseInt(stat.value) > 0 ? 'border-primary/20 bg-primary/[0.02]' : 'border-slate-100 bg-white'}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${stat.highlight && parseInt(stat.value) > 0 ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                        {stat.highlight && parseInt(stat.value) > 0 && (
                                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                                        <p className="text-[10px] font-medium text-slate-400">{stat.sub}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Management Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Management Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Card className="border border-slate-100 shadow-none hover:border-slate-200 transition-all group cursor-pointer bg-white">
                                    <CardHeader className="p-6">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <UserCheck className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg font-bold">Verify Employees</CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-500 pt-1">Verify new staff members joining your portal.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6 pt-0">
                                        <Link href="/organization/members">
                                            <Button variant="ghost" className="p-0 text-slate-900 font-bold hover:bg-transparent hover:translate-x-1 transition-transform text-xs uppercase tracking-widest">
                                                Manage Queue <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                <Card className="border border-slate-100 shadow-none hover:border-slate-200 transition-all group cursor-pointer bg-white">
                                    <CardHeader className="p-6">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg font-bold">Departments</CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-500 pt-1">Structure your organization's units.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6 pt-0">
                                        <Link href="/organization/departments">
                                            <Button variant="ghost" className="p-0 text-slate-900 font-bold hover:bg-transparent hover:translate-x-1 transition-transform text-xs uppercase tracking-widest">
                                                View Units <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                <Card className="border border-slate-100 shadow-none hover:border-slate-200 transition-all group cursor-pointer bg-white">
                                    <CardHeader className="p-6">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <Briefcase className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg font-bold">Job Levels</CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-500 pt-1">Manage employee grades and hierarchy.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6 pt-0">
                                        <Link href="/organization/job-levels">
                                            <Button variant="ghost" className="p-0 text-slate-900 font-bold hover:bg-transparent hover:translate-x-1 transition-transform text-xs uppercase tracking-widest">
                                                View Levels <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                <Card className="border border-slate-100 shadow-none hover:border-slate-200 transition-all group cursor-pointer bg-white">
                                    <CardHeader className="p-6">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg font-bold">Documents</CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-500 pt-1">Manage institutional study materials.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6 pt-0">
                                        <Link href="/organization/documents">
                                            <Button variant="ghost" className="p-0 text-slate-900 font-bold hover:bg-transparent hover:translate-x-1 transition-transform text-xs uppercase tracking-widest">
                                                Open Library <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Distribution Charts */}
                        {distributions.departments.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border border-slate-100 shadow-none bg-white p-6 rounded-3xl">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Staff by Department</h3>
                                    <div className="space-y-3">
                                        {distributions.departments.map((dept: any, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                                    <span>{dept.name}</span>
                                                    <span>{dept.value}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min((dept.value / parseInt(stats.find(s => s.key === 'members')?.value || '1')) * 100, 100)}%` }}
                                                        className="h-full bg-slate-900 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                <Card className="border border-slate-100 shadow-none bg-white p-6 rounded-3xl">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Staff by Level</h3>
                                    <div className="space-y-3">
                                        {distributions.jobLevels.map((lvl: any, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                                    <span>{lvl.name}</span>
                                                    <span>{lvl.value}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min((lvl.value / parseInt(stats.find(s => s.key === 'members')?.value || '1')) * 100, 100)}%` }}
                                                        className="h-full bg-slate-400 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Notice board (keep existing) */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                <Building2 className="h-32 w-32" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-4">Institutional Integrity</h3>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                                    As an administrator, you ensure that only authorized members
                                    access governmental study resources.
                                </p>
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${parseInt(pendingCount) > 0 ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/5'}`}>
                                        <ShieldAlert className={`h-4 w-4 ${parseInt(pendingCount) > 0 ? 'text-primary' : 'text-slate-400'}`} />
                                        <p className="text-[10px] font-bold text-white/80">{pendingCount} verifications pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Requests (Activity Feed) Moved here to sidebar for better layout */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-8">
                            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                                Recent Activity
                            </h3>
                            <div className="space-y-6">
                                {recentRequests.length > 0 ? recentRequests.map((req, i) => (
                                    <div key={req.id} className="flex gap-4 items-start pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-900">{req.full_name || 'New applicant'} requested verification</p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                                {getTimeAgo(req.verification_requested_at)} • {req.employee_id || 'ID Pending'}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-10 text-center">
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No recent requests</p>
                                    </div>
                                )}
                            </div>
                            {recentRequests.length > 0 && (
                                <Link href="/organization/members" className="block mt-6">
                                    <Button variant="outline" className="w-full h-10 rounded-xl border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                        Full Registry
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <Card className="border border-slate-100 shadow-none bg-white p-8 rounded-3xl">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Service Health</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">DB Connection</span>
                                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">Secure</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">Auth Server</span>
                                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">Optimal</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Container>
    )
}

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
    UserCircle
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

    useEffect(() => {
        async function fetchDashboardData() {
            if (!profile?.organization_id) return

            try {
                // Fetch Total Members
                const { count: memberCount } = await supabase
                    .from("users")
                    .select("*", { count: 'exact', head: true })
                    .eq("organization_id", profile.organization_id)

                // Fetch Pending Verifications
                const { count: pendingCount } = await supabase
                    .from("users")
                    .select("*", { count: 'exact', head: true })
                    .eq("organization_id", profile.organization_id)
                    .eq("verification_status", VERIFICATION_STATUS.PENDING)

                // Fetch Documents count
                const { count: docCount } = await supabase
                    .from("documents")
                    .select("*", { count: 'exact', head: true })
                    .eq("organization_id", profile.organization_id)

                setStats(current => current.map(s => {
                    if (s.key === 'members') return { ...s, value: (memberCount || 0).toString() }
                    if (s.key === 'pending') return { ...s, value: (pendingCount || 0).toString().padStart(2, '0') }
                    if (s.key === 'docs') return { ...s, value: (docCount || 0).toString() }
                    return s
                }))

                // Fetch Recent Activity
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

    const getTimeAgo = (dateStr: string) => {
        if (!dateStr) return "Just now"
        const date = new Date(dateStr)
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
        if (seconds < 60) return "Just now"
        let interval = seconds / 3600
        if (interval > 1) return Math.floor(interval) + "h ago"
        interval = seconds / 60
        if (interval > 1) return Math.floor(interval) + "m ago"
        return "Seconds ago"
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    const pendingCount = stats.find(s => s.key === 'pending')?.value || "0"

    return (
        <Container>
            <div className="space-y-10">
                {/* Welcome Ribbon */}
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

                {/* KPI Grid */}
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
                    {/* Quick Access List */}
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
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg font-bold">Official Repository</CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-500 pt-1">Manage institutional study materials and handouts.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6 pt-0">
                                        <Link href="/organization/documents">
                                            <Button variant="ghost" className="p-0 text-slate-900 font-bold hover:bg-transparent hover:translate-x-1 transition-transform text-xs uppercase tracking-widest">
                                                View Library <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-8">
                            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                                System Activity
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase tracking-widest ml-auto">Live</span>
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
                                        View Full Registry
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Notice board */}
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

"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    UserCircle,
    Mail,
    Calendar,
    ArrowUpDown
} from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase/client"
import { VERIFICATION_STATUS } from "@/lib/constants"
import { useEffect } from "react"

export default function MemberManagementPage() {
    const { profile } = useAuth()
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [members, setMembers] = useState<any[]>([])

    const fetchMembers = async () => {
        if (!profile?.organization_id) return

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("organization_id", profile.organization_id)
                .neq("id", profile.id) // Don't show the admin themselves
                .order("verification_requested_at", { ascending: false })

            if (error) throw error
            setMembers(data || [])
        } catch (error: any) {
            toast.error("Failed to load members")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [profile?.organization_id])

    const handleVerify = async (id: string) => {
        const loadingToast = toast.loading("Confirming verification...")
        try {
            const { error } = await supabase
                .from("users")
                .update({
                    verification_status: VERIFICATION_STATUS.VERIFIED,
                    role: 'employee' // Automatically grant employee role upon verification
                })
                .eq("id", id)

            if (error) throw error

            setMembers(prev => prev.map(m => m.id === id ? { ...m, status: VERIFICATION_STATUS.VERIFIED } : m))
            toast.success("Member verified successfully", { id: loadingToast })
            fetchMembers() // Refresh to update list
        } catch (error: any) {
            toast.error("Failed to verify member", { id: loadingToast })
        }
    }

    const handleReject = async (id: string) => {
        const loadingToast = toast.loading("Rejecting request...")
        try {
            const { error } = await supabase
                .from("users")
                .update({
                    verification_status: VERIFICATION_STATUS.REJECTED,
                    organization_id: null // Remove them from the organization if rejected
                })
                .eq("id", id)

            if (error) throw error

            toast.success("Request rejected", { id: loadingToast })
            fetchMembers()
        } catch (error: any) {
            toast.error("Failed to reject request", { id: loadingToast })
        }
    }

    const filteredMembers = members.filter(m =>
        m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Syncing Registry</p>
                </div>
            </div>
        )
    }

    return (
        <Container>
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Member Registry</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage and verify institutional access for your team.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                            <Input
                                placeholder="Search email or name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 rounded-xl border-slate-100 bg-white w-[260px] text-xs font-bold shadow-none focus:border-slate-300 transition-all"
                            />
                        </div>
                        <Button variant="outline" onClick={fetchMembers} className="h-10 px-4 rounded-xl border-slate-100 bg-white shadow-none text-slate-400 hover:text-slate-900">
                            <Filter className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-none">
                    <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="col-span-4 flex items-center gap-2">
                            Member <ArrowUpDown className="h-3 w-3" />
                        </div>
                        <div className="col-span-3">ID Number</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3 text-right">Administrative Actions</div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        <AnimatePresence mode="popLayout">
                            {filteredMembers.map((member) => (
                                <motion.div
                                    key={member.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-12 gap-4 px-8 py-5 items-center group hover:bg-slate-50/30 transition-all"
                                >
                                    <div className="col-span-4 flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                                            {member.avatar_url ? (
                                                <img src={member.avatar_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <UserCircle className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-900">{member.full_name || 'Incomplete Profile'}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                                <Mail className="h-3 w-3" />
                                                {member.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                                            {member.employee_id || 'NOT PROVIDED'}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <Badge
                                            variant="secondary"
                                            className={`shadow-none text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg ${member.verification_status === VERIFICATION_STATUS.VERIFIED
                                                ? 'bg-green-50 text-green-600'
                                                : member.verification_status === VERIFICATION_STATUS.REJECTED
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'bg-blue-50 text-blue-500 animate-pulse'
                                                }`}
                                        >
                                            {member.verification_status || 'public'}
                                        </Badge>
                                    </div>

                                    <div className="col-span-3 flex justify-end items-center gap-2">
                                        {member.verification_status === VERIFICATION_STATUS.PENDING ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleVerify(member.id)}
                                                    className="h-9 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none"
                                                >
                                                    Verify
                                                    <CheckCircle2 className="ml-2 h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleReject(member.id)}
                                                    className="h-9 w-9 p-0 border-slate-100 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 shadow-none transition-all"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2 py-2 px-3 rounded-xl border border-dashed border-slate-100 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                <Calendar className="h-3 w-3" />
                                                {member.verification_status === VERIFICATION_STATUS.VERIFIED ? "Institutional Access Active" : "Access Revoked"}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredMembers.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Users className="h-6 w-6" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No members found</p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}

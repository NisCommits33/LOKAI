"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Search,
    CheckCircle2,
    XCircle,
    UserCircle,
    Mail,
    Calendar,
    ArrowUpDown,
    Clock,
    ShieldCheck,
    Building2,
    Briefcase,
    RefreshCw
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase/client"
import { VERIFICATION_STATUS } from "@/lib/constants"

type FilterTab = "all" | "pending" | "verified" | "rejected"

export default function MemberManagementPage() {
    const { profile } = useAuth()
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [members, setMembers] = useState<any[]>([])
    const [activeFilter, setActiveFilter] = useState<FilterTab>("all")

    // Approval modal
    const [approveMember, setApproveMember] = useState<any>(null)
    const [approveLoading, setApproveLoading] = useState(false)

    // Rejection modal
    const [rejectMember, setRejectMember] = useState<any>(null)
    const [rejectionReason, setRejectionReason] = useState("")
    const [rejectLoading, setRejectLoading] = useState(false)

    // Removal modal
    const [removeMember, setRemoveMember] = useState<any>(null)
    const [removeLoading, setRemoveLoading] = useState(false)

    const fetchMembers = async () => {
        if (!profile?.organization_id) return
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("users")
                .select(`
                    id, full_name, email, avatar_url, employee_id,
                    verification_status, verification_requested_at,
                    rejection_reason,
                    departments(id, name),
                    job_levels(id, name, grade)
                `)
                .eq("organization_id", profile.organization_id)
                .neq("id", profile.id)
                .order("verification_requested_at", { ascending: false })

            if (error) throw error
            setMembers(data || [])
        } catch (error: any) {
            toast.error("Failed to load members")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchMembers() }, [profile?.organization_id])

    // ── Approve ───────────────────────────────────────────────────────────────
    const confirmApprove = async () => {
        if (!approveMember) return
        setApproveLoading(true)
        const loadingToast = toast.loading("Approving member...")
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await fetch("/api/verification/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ member_id: approveMember.id }),
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || "Failed to approve")

            toast.success("Member approved!", { id: loadingToast })
            setApproveMember(null)
            fetchMembers()
        } catch (e: any) {
            toast.error(e.message || "Failed to approve", { id: loadingToast })
        } finally {
            setApproveLoading(false)
        }
    }

    // ── Reject ────────────────────────────────────────────────────────────────
    const confirmReject = async () => {
        if (!rejectMember || !rejectionReason.trim()) {
            toast.error("Please provide a rejection reason")
            return
        }
        setRejectLoading(true)
        const loadingToast = toast.loading("Rejecting request...")
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await fetch("/api/verification/reject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    member_id: rejectMember.id,
                    reason: rejectionReason.trim(),
                }),
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || "Failed to reject")

            toast.success("Request rejected", { id: loadingToast })
            setRejectMember(null)
            setRejectionReason("")
            fetchMembers()
        } catch (e: any) {
            toast.error(e.message || "Failed to reject", { id: loadingToast })
        } finally {
            setRejectLoading(false)
        }
    }

    // ── Remove ────────────────────────────────────────────────────────────────
    const confirmRemove = async () => {
        if (!removeMember) return
        setRemoveLoading(true)
        const loadingToast = toast.loading("Removing member access...")
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await fetch("/api/verification/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    member_id: removeMember.id
                }),
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || "Failed to remove member")

            toast.success("Access revoked successfully", { id: loadingToast })
            setRemoveMember(null)
            fetchMembers()
        } catch (e: any) {
            toast.error(e.message || "Failed to remove member", { id: loadingToast })
        } finally {
            setRemoveLoading(false)
        }
    }

    // ── Filter Logic ──────────────────────────────────────────────────────────
    const filteredMembers = members.filter(m => {
        const matchesSearch =
            m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase())
        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "pending" && m.verification_status === VERIFICATION_STATUS.PENDING) ||
            (activeFilter === "verified" && m.verification_status === VERIFICATION_STATUS.VERIFIED) ||
            (activeFilter === "rejected" && m.verification_status === VERIFICATION_STATUS.REJECTED)
        return matchesSearch && matchesFilter
    })

    const counts = {
        all: members.length,
        pending: members.filter(m => m.verification_status === VERIFICATION_STATUS.PENDING).length,
        verified: members.filter(m => m.verification_status === VERIFICATION_STATUS.VERIFIED).length,
        rejected: members.filter(m => m.verification_status === VERIFICATION_STATUS.REJECTED).length,
    }

    const statusConfig: Record<string, { label: string, classes: string }> = {
        verified: { label: "Verified", classes: "bg-green-50 text-green-600" },
        pending: { label: "Pending", classes: "bg-blue-50 text-blue-500 animate-pulse" },
        rejected: { label: "Rejected", classes: "bg-red-50 text-red-500" },
        public: { label: "Public", classes: "bg-slate-100 text-slate-500" },
    }

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
            <div className="max-w-6xl mx-auto space-y-8">

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
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder="Search email or name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 rounded-xl border-slate-100 bg-white w-[260px] text-xs font-bold shadow-none"
                            />
                        </div>
                        <Button variant="outline" onClick={fetchMembers} className="h-10 w-10 p-0 rounded-xl border-slate-100 bg-white shadow-none text-slate-400 hover:text-slate-900">
                            <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                    {(["all", "pending", "verified", "rejected"] as FilterTab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === tab
                                ? "bg-slate-900 text-white"
                                : "bg-slate-50 text-slate-400 hover:text-slate-900"
                                }`}
                        >
                            {tab === "pending" && <Clock className="h-3 w-3" />}
                            {tab === "verified" && <ShieldCheck className="h-3 w-3" />}
                            {tab === "rejected" && <XCircle className="h-3 w-3" />}
                            {tab === "all" && <Users className="h-3 w-3" />}
                            {tab}
                            <span className={`h-4 px-1.5 rounded text-[9px] font-black flex items-center ${activeFilter === tab ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                                }`}>
                                {counts[tab]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-none">
                    <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="col-span-4 flex items-center gap-2">Member <ArrowUpDown className="h-3 w-3" /></div>
                        <div className="col-span-2">Role / Grade</div>
                        <div className="col-span-2">Department</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        <AnimatePresence mode="popLayout">
                            {filteredMembers.map((member) => {
                                const status = member.verification_status || "public"
                                const cfg = statusConfig[status] || statusConfig.public
                                return (
                                    <motion.div
                                        key={member.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="grid grid-cols-12 gap-4 px-8 py-5 items-center group hover:bg-slate-50/30 transition-all"
                                    >
                                        {/* Member info */}
                                        <div className="col-span-4 flex items-center gap-4">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden flex-shrink-0">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <UserCircle className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold text-slate-900 truncate">{member.full_name || "Incomplete Profile"}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                                    <Mail className="h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate">{member.email}</span>
                                                </div>
                                                {member.employee_id && (
                                                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-wider mt-0.5">
                                                        ID: {member.employee_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Job level */}
                                        <div className="col-span-2">
                                            {member.job_levels?.name ? (
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                                        <Briefcase className="h-2.5 w-2.5" /> {member.job_levels.grade || "—"}
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-700 leading-tight">{member.job_levels.name}</p>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-300 font-bold">Not set</span>
                                            )}
                                        </div>

                                        {/* Department */}
                                        <div className="col-span-2">
                                            {member.departments?.name ? (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                    <Building2 className="h-3 w-3 text-slate-400" />
                                                    {member.departments.name}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-300 font-bold">Unassigned</span>
                                            )}
                                        </div>

                                        {/* Status badge */}
                                        <div className="col-span-2">
                                            <Badge variant="secondary" className={`shadow-none text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg ${cfg.classes}`}>
                                                {cfg.label}
                                            </Badge>
                                            {member.verification_status === VERIFICATION_STATUS.REJECTED && member.rejection_reason && (
                                                <p className="text-[9px] text-red-400 font-medium mt-1 leading-tight truncate max-w-[100px]" title={member.rejection_reason}>
                                                    {member.rejection_reason}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="col-span-2 flex justify-end items-center gap-2">
                                            {status === VERIFICATION_STATUS.PENDING ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setApproveMember(member)}
                                                        className="h-9 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none"
                                                    >
                                                        Verify
                                                        <CheckCircle2 className="ml-2 h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => { setRejectMember(member); setRejectionReason("") }}
                                                        className="h-9 w-9 p-0 border-slate-100 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 shadow-none transition-all"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : status === VERIFICATION_STATUS.VERIFIED ? (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setRemoveMember(member)}
                                                    className="h-9 px-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-none"
                                                >
                                                    Revoke Access
                                                    <XCircle className="ml-2 h-3.5 w-3.5" />
                                                </Button>
                                            ) : (
                                                <div className="flex items-center gap-2 py-2 px-3 rounded-xl border border-dashed border-slate-100 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3" />
                                                    {status === VERIFICATION_STATUS.REJECTED ? "Rejected" : "Public"}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>

                    {filteredMembers.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Users className="h-6 w-6" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                {activeFilter !== "all" ? `No ${activeFilter} members` : "No members found"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Approve Modal ─────────────────────────────────────────────────────── */}
            <Dialog open={!!approveMember} onOpenChange={() => setApproveMember(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl border-slate-100 shadow-2xl">
                    <DialogHeader>
                        <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 border border-green-100">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Confirm Approval</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            You are about to grant institutional access to:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{approveMember?.full_name || "Member"}</p>
                        <p className="text-xs text-slate-500 font-medium">{approveMember?.email}</p>
                        {approveMember?.employee_id && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                                ID: {approveMember.employee_id}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                        They will receive the <strong className="text-slate-700">employee</strong> role and access to all institutional materials.
                    </p>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setApproveMember(null)} className="rounded-xl border-slate-100">
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmApprove}
                            disabled={approveLoading}
                            className="rounded-xl bg-slate-900 hover:bg-black text-white shadow-none font-bold"
                        >
                            {approveLoading ? "Approving..." : "Confirm Approval"}
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Reject Modal ──────────────────────────────────────────────────────── */}
            <Dialog open={!!rejectMember} onOpenChange={() => { setRejectMember(null); setRejectionReason("") }}>
                <DialogContent className="sm:max-w-md rounded-2xl border-slate-100 shadow-2xl">
                    <DialogHeader>
                        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100">
                            <XCircle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Reject Request</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            Rejecting will remove this member from your organization.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-2">
                        <p className="text-sm font-bold text-slate-900">{rejectMember?.full_name || "Member"}</p>
                        <p className="text-xs text-slate-500 font-medium">{rejectMember?.email}</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Rejection Reason <span className="text-red-400">*</span>
                        </Label>
                        <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g. Employee ID not found in records, please verify and resubmit..."
                            className="h-24 rounded-xl border-slate-100 bg-slate-50 text-sm font-medium resize-none focus:bg-white transition-all"
                        />
                        <p className="text-[10px] text-slate-400 font-medium pl-1">This reason will be shown to the member.</p>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => { setRejectMember(null); setRejectionReason("") }} className="rounded-xl border-slate-100">
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmReject}
                            disabled={rejectLoading || !rejectionReason.trim()}
                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-none font-bold"
                        >
                            {rejectLoading ? "Rejecting..." : "Reject Request"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* ── Remove Modal ───────────────────────────────────────────────────────── */}
            <Dialog open={!!removeMember} onOpenChange={() => setRemoveMember(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl border-slate-100 shadow-2xl">
                    <DialogHeader>
                        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100">
                            <XCircle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Revoke Access</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            Are you sure you want to remove this member? They will lose access to all institutional materials.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{removeMember?.full_name || "Member"}</p>
                        <p className="text-xs text-slate-500 font-medium">{removeMember?.email}</p>
                    </div>
                    <p className="text-xs text-slate-400 font-medium italic">
                        * This action will reset their account to a public profile.
                    </p>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setRemoveMember(null)} className="rounded-xl border-slate-100">
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmRemove}
                            disabled={removeLoading}
                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-none font-bold"
                        >
                            {removeLoading ? "Removing..." : "Confirm Removal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Container>
    )
}

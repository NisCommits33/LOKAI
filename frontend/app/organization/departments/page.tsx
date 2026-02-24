"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion, AnimatePresence } from "framer-motion"
import {
    Building2,
    Plus,
    Pencil,
    Trash2,
    Search,
    RefreshCw,
    Users
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@/components/auth/AuthProvider"

export default function DepartmentsPage() {
    const { profile } = useAuth()
    const [departments, setDepartments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingDept, setEditingDept] = useState<any>(null)
    const [deletingDept, setDeletingDept] = useState<any>(null)

    // Form states
    const [name, setName] = useState("")
    const [submitLoading, setSubmitLoading] = useState(false)

    const fetchDepartments = async () => {
        if (!profile?.organization_id) return
        setLoading(true)
        try {
            const { data: { session } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getSession())
            const res = await fetch("/api/organization/departments", {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            })
            if (!res.ok) throw new Error("Failed to load departments")
            const data = await res.json()
            setDepartments(data)
        } catch (error) {
            toast.error("Failed to load departments")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchDepartments() }, [profile?.organization_id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setSubmitLoading(true)
        const loadingToast = toast.loading(editingDept ? "Updating department..." : "Creating department...")

        try {
            const { data: { session } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getSession())
            const res = await fetch("/api/organization/departments", {
                method: editingDept ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    id: editingDept?.id,
                    name: name.trim()
                })
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Operation failed")

            toast.success(editingDept ? "Department updated" : "Department created", { id: loadingToast })
            setIsAddOpen(false)
            setEditingDept(null)
            setName("")
            fetchDepartments()
        } catch (error: any) {
            toast.error(error.message, { id: loadingToast })
        } finally {
            setSubmitLoading(false)
        }
    }

    const confirmDelete = async () => {
        if (!deletingDept) return
        setSubmitLoading(true)
        const loadingToast = toast.loading("Deleting department...")

        try {
            const { data: { session } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getSession())
            const res = await fetch("/api/organization/departments", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ id: deletingDept.id })
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Failed to delete")

            toast.success("Department deleted", { id: loadingToast })
            setDeletingDept(null)
            fetchDepartments()
        } catch (error: any) {
            toast.error(error.message, { id: loadingToast })
        } finally {
            setSubmitLoading(false)
        }
    }

    const filteredDepts = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Container>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Departments</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage your organization's internal structure.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder="Search departments..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 rounded-xl border-slate-100 bg-white w-[260px] text-xs font-bold shadow-none"
                            />
                        </div>
                        <Button
                            onClick={() => { setName(""); setEditingDept(null); setIsAddOpen(true) }}
                            className="h-10 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none px-6"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2" />
                            New Department
                        </Button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Loading Units</p>
                    </div>
                ) : filteredDepts.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No departments found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredDepts.map((dept) => (
                                <motion.div
                                    key={dept.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="group border-slate-100 shadow-none hover:border-slate-200 transition-all bg-white">
                                        <CardContent className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{dept.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Active Unit</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => { setEditingDept(dept); setName(dept.name); setIsAddOpen(true) }}
                                                    className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDeletingDept(dept)}
                                                    className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Add/Edit Modal */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl border-slate-100 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">
                                {editingDept ? "Edit Department" : "New Department"}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                {editingDept ? "Update the department name." : "Create a new department unit."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
                            <Input
                                placeholder="Department Name (e.g. Engineering)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 rounded-xl border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white transition-all"
                                autoFocus
                            />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!name.trim() || submitLoading}
                                    className="rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-none"
                                >
                                    {submitLoading ? "Saving..." : editingDept ? "Update Unit" : "Create Unit"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingDept} onOpenChange={() => setDeletingDept(null)}>
                    <AlertDialogContent className="rounded-2xl border-slate-100 shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-slate-900">Delete Department?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500 font-medium">
                                Are you sure you want to delete <strong className="text-slate-900">{deletingDept?.name}</strong>?
                                <br />This action cannot be undone if functionality relies on it.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl border-slate-100 font-bold text-slate-500">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => { e.preventDefault(); confirmDelete() }}
                                disabled={submitLoading}
                                className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-none border-0"
                            >
                                {submitLoading ? "Deleting..." : "Delete Department"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Container>
    )
}

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
    Briefcase,
    Plus,
    Pencil,
    Trash2,
    Search,
    RefreshCw,
    ChevronsUp
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@/components/auth/AuthProvider"

export default function JobLevelsPage() {
    const { profile } = useAuth()
    const [levels, setLevels] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingLevel, setEditingLevel] = useState<any>(null)
    const [deletingLevel, setDeletingLevel] = useState<any>(null)

    // Form states
    const [name, setName] = useState("")
    const [grade, setGrade] = useState("")
    const [submitLoading, setSubmitLoading] = useState(false)

    const fetchLevels = async () => {
        if (!profile?.organization_id) return
        setLoading(true)
        try {
            const { data: { session } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getSession())
            const res = await fetch("/api/organization/job-levels", {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            })
            if (!res.ok) throw new Error("Failed to load job levels")
            const data = await res.json()
            setLevels(data)
        } catch (error) {
            toast.error("Failed to load job levels")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchLevels() }, [profile?.organization_id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setSubmitLoading(true)
        const loadingToast = toast.loading(editingLevel ? "Updating level..." : "Creating level...")

        try {
            const { data: { session } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getSession())
            const res = await fetch("/api/organization/job-levels", {
                method: editingLevel ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    id: editingLevel?.id,
                    name: name.trim(),
                    grade: grade ? parseInt(grade) : 0
                })
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Operation failed")

            toast.success(editingLevel ? "Level updated" : "Level created", { id: loadingToast })
            setIsAddOpen(false)
            setEditingLevel(null)
            setName("")
            setGrade("")
            fetchLevels()
        } catch (error: any) {
            toast.error(error.message, { id: loadingToast })
        } finally {
            setSubmitLoading(false)
        }
    }

    const confirmDelete = async () => {
        if (!deletingLevel) return
        setSubmitLoading(true)
        const loadingToast = toast.loading("Deleting level...")

        try {
            const { data: { session } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getSession())
            const res = await fetch("/api/organization/job-levels", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ id: deletingLevel.id })
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Failed to delete")

            toast.success("Level deleted", { id: loadingToast })
            setDeletingLevel(null)
            fetchLevels()
        } catch (error: any) {
            toast.error(error.message, { id: loadingToast })
        } finally {
            setSubmitLoading(false)
        }
    }

    const filteredLevels = levels.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Container>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Levels</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Define roles and hierarchy for your employees.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder="Search levels..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 rounded-xl border-slate-100 bg-white w-[260px] text-xs font-bold shadow-none"
                            />
                        </div>
                        <Button
                            onClick={() => { setName(""); setGrade(""); setEditingLevel(null); setIsAddOpen(true) }}
                            className="h-10 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none px-6"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2" />
                            New Level
                        </Button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Loading Levels</p>
                    </div>
                ) : filteredLevels.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No job levels found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredLevels.map((level) => (
                                <motion.div
                                    key={level.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="group border-slate-100 shadow-none hover:border-slate-200 transition-all bg-white">
                                        <CardContent className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                                    <span className="text-xs font-black">{level.grade || "—"}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{level.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                        Grade Level {level.grade}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => { setEditingLevel(level); setName(level.name); setGrade(level.grade?.toString() || ""); setIsAddOpen(true) }}
                                                    className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDeletingLevel(level)}
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
                                {editingLevel ? "Edit Job Level" : "New Job Level"}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                {editingLevel ? "Update role details." : "Define a new role hierarchy."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Role Name</label>
                                <Input
                                    placeholder="e.g. Senior Manager"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white transition-all"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Grade / Rank (Numeric)</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white transition-all"
                                />
                                <p className="text-[10px] text-slate-400 pl-1">Higher numbers usually indicate higher seniority.</p>
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!name.trim() || submitLoading}
                                    className="rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-none"
                                >
                                    {submitLoading ? "Saving..." : editingLevel ? "Update Level" : "Create Level"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingLevel} onOpenChange={() => setDeletingLevel(null)}>
                    <AlertDialogContent className="rounded-2xl border-slate-100 shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-slate-900">Delete Job Level?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500 font-medium">
                                Are you sure you want to delete <strong className="text-slate-900">{deletingLevel?.name}</strong>?
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
                                {submitLoading ? "Deleting..." : "Delete Level"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Container>
    )
}

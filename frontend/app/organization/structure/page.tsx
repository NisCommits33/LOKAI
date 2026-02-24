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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import {
    Building2,
    Plus,
    Pencil,
    Trash2,
    Search,
    Briefcase,
    Settings2
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@/components/auth/AuthProvider"

interface Department {
    id: string
    name: string
    organization_id?: string
}

interface JobLevel {
    id: string
    name: string
    grade: number
    organization_id?: string
}

export default function StructurePage() {
    const { profile } = useAuth()
    const [activeTab, setActiveTab] = useState("departments")
    const [search, setSearch] = useState("")

    // Department States
    const [departments, setDepartments] = useState<Department[]>([])
    const [deptsLoading, setDeptsLoading] = useState(true)
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false)
    const [editingDept, setEditingDept] = useState<Department | null>(null)
    const [deletingDept, setDeletingDept] = useState<Department | null>(null)
    const [deptName, setDeptName] = useState("")

    // Job Level States
    const [levels, setLevels] = useState<JobLevel[]>([])
    const [levelsLoading, setLevelsLoading] = useState(true)
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false)
    const [editingLevel, setEditingLevel] = useState<JobLevel | null>(null)
    const [deletingLevel, setDeletingLevel] = useState<JobLevel | null>(null)
    const [levelName, setLevelName] = useState("")
    const [levelGrade, setLevelGrade] = useState("")

    const [submitLoading, setSubmitLoading] = useState(false)

    const fetchDepartments = async () => {
        if (!profile?.organization_id) return
        setDeptsLoading(true)
        try {
            const { data: { session } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getSession())
            const res = await fetch("/api/organization/departments", {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            })
            if (!res.ok) throw new Error("Failed to load departments")
            const data = await res.json()
            setDepartments(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load departments")
        } finally {
            setDeptsLoading(false)
        }
    }

    const fetchLevels = async () => {
        if (!profile?.organization_id) return
        setLevelsLoading(true)
        try {
            const { data: { session } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getSession())
            const res = await fetch("/api/organization/job-levels", {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            })
            if (!res.ok) throw new Error("Failed to load job levels")
            const data = await res.json()
            setLevels(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load job levels")
        } finally {
            setLevelsLoading(false)
        }
    }

    useEffect(() => {
        if (profile?.organization_id) {
            fetchDepartments()
            fetchLevels()
        }
    }, [profile?.organization_id])

    // Department Handlers
    const handleDeptSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!deptName.trim()) return
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
                body: JSON.stringify({ id: editingDept?.id, name: deptName.trim() })
            })
            if (!res.ok) throw new Error("Operation failed")
            toast.success(editingDept ? "Department updated" : "Department created", { id: loadingToast })
            setIsDeptModalOpen(false)
            setEditingDept(null)
            setDeptName("")
            fetchDepartments()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unknown error occurred"
            toast.error(message, { id: loadingToast })
        } finally {
            setSubmitLoading(false)
        }
    }

    const confirmDeptDelete = async () => {
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
            if (!res.ok) throw new Error("Failed to delete")
            toast.success("Department deleted", { id: loadingToast })
            setDeletingDept(null)
            fetchDepartments()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unknown error occurred"
            toast.error(message, { id: loadingToast })
        } finally {
            setSubmitLoading(false)
        }
    }

    // Job Level Handlers
    const handleLevelSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!levelName.trim()) return
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
                    name: levelName.trim(),
                    grade: levelGrade ? parseInt(levelGrade) : 0
                })
            })
            if (!res.ok) throw new Error("Operation failed")
            toast.success(editingLevel ? "Level updated" : "Level created", { id: loadingToast })
            setIsLevelModalOpen(false)
            setEditingLevel(null)
            setLevelName("")
            setLevelGrade("")
            fetchLevels()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unknown error occurred"
            toast.error(message, { id: loadingToast })
        } finally {
            setSubmitLoading(false)
        }
    }

    const confirmLevelDelete = async () => {
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
            if (!res.ok) throw new Error("Failed to delete")
            toast.success("Level deleted", { id: loadingToast })
            setDeletingLevel(null)
            fetchLevels()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unknown error occurred"
            toast.error(message, { id: loadingToast })
        } finally {
            setSubmitLoading(false)
        }
    }

    const filteredDepts = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
    )

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
                                <Settings2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Structure</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage departments and job hierarchies in one place.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder={`Search ${activeTab}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 rounded-xl border-slate-100 bg-white w-[260px] text-xs font-bold shadow-none"
                            />
                        </div>
                        <Button
                            onClick={() => {
                                if (activeTab === "departments") {
                                    setDeptName(""); setEditingDept(null); setIsDeptModalOpen(true)
                                } else {
                                    setLevelName(""); setLevelGrade(""); setEditingLevel(null); setIsLevelModalOpen(true)
                                }
                            }}
                            className="h-10 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none px-6"
                        >
                            <Plus className="h-3.5 w-3.5 mr-2" />
                            New {activeTab === "departments" ? "Department" : "Job Level"}
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white border border-slate-100 p-1 rounded-2xl h-12 shadow-sm">
                        <TabsTrigger value="departments" className="rounded-xl px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                            <Building2 className="h-3.5 w-3.5 mr-2" />
                            Departments
                        </TabsTrigger>
                        <TabsTrigger value="levels" className="rounded-xl px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                            <Briefcase className="h-3.5 w-3.5 mr-2" />
                            Job Levels
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="departments" className="m-0 focus-visible:outline-none">
                        {deptsLoading ? (
                            <div className="py-20 text-center">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Loading Units</p>
                            </div>
                        ) : filteredDepts.length === 0 ? (
                            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                                <Building2 className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No departments found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredDepts.map((dept) => (
                                        <motion.div key={dept.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
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
                                                        <Button size="sm" variant="ghost" onClick={() => { setEditingDept(dept); setDeptName(dept.name); setIsDeptModalOpen(true) }} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" onClick={() => setDeletingDept(dept)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
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
                    </TabsContent>

                    <TabsContent value="levels" className="m-0 focus-visible:outline-none">
                        {levelsLoading ? (
                            <div className="py-20 text-center">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Loading Levels</p>
                            </div>
                        ) : filteredLevels.length === 0 ? (
                            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                                <Briefcase className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No job levels found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredLevels.map((level) => (
                                        <motion.div key={level.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                                            <Card className="group border-slate-100 shadow-none hover:border-slate-200 transition-all bg-white">
                                                <CardContent className="p-5 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                                            <span className="text-xs font-black">{level.grade || "—"}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{level.name}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Level {level.grade}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <Button size="sm" variant="ghost" onClick={() => { setEditingLevel(level); setLevelName(level.name); setLevelGrade(level.grade?.toString() || ""); setIsLevelModalOpen(true) }} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" onClick={() => setDeletingLevel(level)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
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
                    </TabsContent>
                </Tabs>

                {/* Department Modal */}
                <Dialog open={isDeptModalOpen} onOpenChange={setIsDeptModalOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-bold">{editingDept ? "Edit Department" : "New Department"}</DialogTitle>
                            <DialogDescription>Update the department name.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeptSubmit} className="space-y-4 py-2">
                            <Input placeholder="Department Name" value={deptName} onChange={(e) => setDeptName(e.target.value)} className="h-11 rounded-xl bg-slate-50 font-bold" autoFocus />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsDeptModalOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                                <Button type="submit" disabled={!deptName.trim() || submitLoading} className="rounded-xl bg-slate-900 text-white font-bold">{submitLoading ? "Saving..." : "Save Unit"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Job Level Modal */}
                <Dialog open={isLevelModalOpen} onOpenChange={setIsLevelModalOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-bold">{editingLevel ? "Edit Job Level" : "New Job Level"}</DialogTitle>
                            <DialogDescription>Define role seniority.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleLevelSubmit} className="space-y-4 py-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Name</label>
                                <Input placeholder="e.g. Senior Lead" value={levelName} onChange={(e) => setLevelName(e.target.value)} className="h-11 rounded-xl bg-slate-50 font-bold" autoFocus />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</label>
                                <Input type="number" placeholder="5" value={levelGrade} onChange={(e) => setLevelGrade(e.target.value)} className="h-11 rounded-xl bg-slate-50 font-bold" />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsLevelModalOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                                <Button type="submit" disabled={!levelName.trim() || submitLoading} className="rounded-xl bg-slate-900 text-white font-bold">{submitLoading ? "Saving..." : "Save Level"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialogs */}
                <AlertDialog open={!!deletingDept} onOpenChange={() => setDeletingDept(null)}>
                    <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader><AlertDialogTitle className="font-bold">Delete Department?</AlertDialogTitle><AlertDialogDescription>Delete {deletingDept?.name}? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDeptDelete() }} disabled={submitLoading} className="rounded-xl bg-red-600 text-white font-bold">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={!!deletingLevel} onOpenChange={() => setDeletingLevel(null)}>
                    <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader><AlertDialogTitle className="font-bold">Delete Job Level?</AlertDialogTitle><AlertDialogDescription>Delete {deletingLevel?.name}? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmLevelDelete() }} disabled={submitLoading} className="rounded-xl bg-red-600 text-white font-bold">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Container>
    )
}

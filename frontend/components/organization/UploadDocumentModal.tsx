"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"
import { toast } from "react-hot-toast"
import { Loader2, UploadCloud, FileText } from "lucide-react"

interface UploadDocumentModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    departments: any[]
    jobLevels: any[]
}

export function UploadDocumentModal({ isOpen, onClose, onSuccess, departments, jobLevels }: UploadDocumentModalProps) {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [departmentId, setDepartmentId] = useState<string>("")
    const [jobLevelId, setJobLevelId] = useState<string>("")

    const handleUpload = async () => {
        if (!file || !title) {
            toast.error("Please provide a title and select a file")
            return
        }

        setLoading(true)
        const loadingToast = toast.loading("Uploading document...")

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error("Not authenticated")

            // 1. Upload to storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `materials/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from("org-documents")
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Call API to save metadata
            const response = await fetch("/api/organization/documents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    file_path: filePath,
                    file_name: file.name,
                    file_size: file.size,
                    department_id: departmentId === "all" || !departmentId ? null : departmentId,
                    job_level_id: jobLevelId === "all" || !jobLevelId ? null : jobLevelId
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to save document metadata")
            }

            toast.success("Document uploaded successfully", { id: loadingToast })
            onSuccess()
            onClose()
            // Reset form
            setFile(null)
            setTitle("")
            setDescription("")
            setDepartmentId("")
            setJobLevelId("")
        } catch (error: any) {
            toast.error(error.message, { id: loadingToast })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] border-none rounded-[2rem] p-0 overflow-hidden bg-white shadow-2xl">
                <div className="bg-slate-50 px-8 py-10 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
                            <UploadCloud className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Upload Material</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Institutional repository expansion
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Document Title</Label>
                        <Input
                            placeholder="e.g. Operations Manual v2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-12 rounded-xl border-slate-100 focus:border-slate-300 transition-all font-bold text-slate-800 shadow-none px-4"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Department</Label>
                            <Select value={departmentId} onValueChange={setDepartmentId}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-100 focus:border-slate-300 font-bold text-slate-800 shadow-none px-4">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100">
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Target Job Level</Label>
                            <Select value={jobLevelId} onValueChange={setJobLevelId}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-100 focus:border-slate-300 font-bold text-slate-800 shadow-none px-4">
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100">
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {jobLevels.map((level) => (
                                        <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Description (Optional)</Label>
                        <Textarea
                            placeholder="Brief context for this resource..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] rounded-xl border-slate-100 focus:border-slate-300 font-medium text-slate-700 resize-none shadow-none p-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className={`relative h-32 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${file ? 'border-primary/20 bg-primary/[0.02]' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'}`}>
                            <input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            {file ? (
                                <div className="text-center px-6">
                                    <p className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">{file.name}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                                </div>
                            ) : (
                                <div className="text-center group">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                        <UploadCloud className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Select PDF Resource</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8 flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest text-[10px] transition-all"
                    >
                        Discard
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={loading || !file || !title}
                        className="flex-[2] h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] shadow-none transition-all"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : "Confirm Upload"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

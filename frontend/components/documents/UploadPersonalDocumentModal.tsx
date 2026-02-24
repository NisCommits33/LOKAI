"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase/client"
import { toast } from "react-hot-toast"
import { Loader2, UploadCloud, FileText, Sparkles } from "lucide-react"

interface UploadPersonalDocumentModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function UploadPersonalDocumentModal({ isOpen, onClose, onSuccess }: UploadPersonalDocumentModalProps) {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleUpload = async () => {
        if (!file || !title) {
            toast.error("Please provide a title and select a file")
            return
        }

        setLoading(true)
        const loadingToast = toast.loading("Uploading to personal lab...")

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error("Not authenticated")

            const userId = session.user.id

            // 1. Upload to storage (organized by user_id folder)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `${userId}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from("personal-documents")
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Call API to save metadata
            const response = await fetch("/api/documents/personal", {
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
                    file_size: file.size
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to save document metadata")
            }

            toast.success("Document uploaded to AI Lab", { id: loadingToast })
            onSuccess()
            onClose()

            // Reset form
            setFile(null)
            setTitle("")
            setDescription("")
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
                <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="h-32 w-32" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4 mb-2">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white shadow-sm backdrop-blur-md">
                            <UploadCloud className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                            <DialogTitle className="text-xl font-bold tracking-tight">AI Lab Upload</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-400">
                                Personal study material intelligence
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Document Title</Label>
                        <Input
                            placeholder="e.g. Constitutional Law Notes"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-12 rounded-xl border-slate-100 focus:border-slate-300 transition-all font-bold text-slate-800 shadow-none px-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Study Context (Optional)</Label>
                        <Textarea
                            placeholder="Brief description for AI context..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] rounded-xl border-slate-100 focus:border-slate-300 font-medium text-slate-700 resize-none shadow-none p-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className={`relative h-40 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${file ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'}`}>
                            <input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            {file ? (
                                <div className="text-center px-6">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                                        <FileText className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">{file.name}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF READY</p>
                                </div>
                            ) : (
                                <div className="text-center group">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                        <UploadCloud className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Select PDF Study Material</p>
                                    <p className="text-[9px] text-slate-400 mt-2">Maximum file size restricted to 10MB</p>
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
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={loading || !file || !title}
                        className="flex-[2] h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="h-3.5 w-3.5 mr-1" />
                                Process with AI
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

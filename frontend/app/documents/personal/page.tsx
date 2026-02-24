"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
    FileText,
    Plus,
    Trash2,
    Search,
    Loader2,
    Sparkles,
    BrainCircuit,
    ArrowRight,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase/client"
import { toast } from "react-hot-toast"
import { UploadPersonalDocumentModal } from "@/components/documents/UploadPersonalDocumentModal"
import { BackButton } from "@/components/ui/back-button"
import Link from "next/link"

export default function PersonalDocumentsPage() {
    const { user } = useAuth()
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [documents, setDocuments] = useState<any[]>([])
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

    const fetchDocuments = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await fetch("/api/documents/personal", {
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            })

            if (!response.ok) throw new Error("Failed to fetch documents")
            const data = await response.json()
            setDocuments(data || [])
        } catch (error: any) {
            toast.error("Failed to load documents")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchDocuments()
        }
    }, [user])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this study material?")) return

        const loadingToast = toast.loading("Deleting document...")
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await fetch(`/api/documents/personal/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to delete document")
            }

            toast.success("Document removed from lab", { id: loadingToast })
            fetchDocuments()
        } catch (error: any) {
            toast.error(error.message || "Failed to delete document", { id: loadingToast })
        }
    }

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(search.toLowerCase())
    )

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            case 'processing': return <Loader2 className="h-3 w-3 text-indigo-500 animate-spin" />
            case 'failed': return <AlertCircle className="h-3 w-3 text-red-500" />
            default: return <Clock className="h-3 w-3 text-slate-400" />
        }
    }

    return (
        <div className="py-8 bg-white flex-1 min-h-screen">
            <Container>
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <BackButton />
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                        <BrainCircuit className="h-5 w-5" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Study Lab</h1>
                                </div>
                                <p className="text-slate-500 font-medium">Upload your personal handouts and let AI generate mock tests for you.</p>
                            </div>
                        </div>

                        <Button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="h-11 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-none"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Material
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search your library..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 h-10 border-none shadow-none text-xs font-bold bg-transparent focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-900" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Analyzing Repository</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                                        <motion.div
                                            key={doc.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                        >
                                            <Card className="border border-slate-100 shadow-none hover:border-indigo-100 transition-all group bg-white overflow-hidden rounded-[1.5rem] flex flex-col h-full">
                                                <CardContent className="p-6 flex flex-col h-full">
                                                    <div className="flex items-start justify-between mb-6">
                                                        <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                            <FileText className="h-6 w-6" />
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(doc.id)}
                                                                className="h-8 w-8 p-0 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1 mb-6 flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                                                                {getStatusIcon(doc.processing_status)}
                                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{doc.processing_status}</span>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2">{doc.title}</h3>
                                                        <p className="text-[11px] text-slate-400 font-medium line-clamp-2 pt-1">{doc.description || 'No additional context provided for AI.'}</p>
                                                    </div>

                                                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {new Date(doc.created_at).toLocaleDateString()}
                                                        </span>
                                                        <Link href={`/quizzes/personal/${doc.id}`} className={doc.processing_status !== 'completed' ? 'pointer-events-none' : ''}>
                                                            <Button
                                                                size="sm"
                                                                disabled={doc.processing_status !== 'completed'}
                                                                className="h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-[10px] uppercase tracking-widest shadow-none border-none transition-all px-4"
                                                            >
                                                                Practice
                                                                <ArrowRight className="ml-2 h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-50 rounded-[2rem] bg-slate-50/30">
                                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Sparkles className="h-5 w-5 text-slate-300" />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Your AI Lab is empty</p>
                                            <p className="text-xs text-slate-400 font-medium italic">Upload your first material to begin AI-powered preparation.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            <UploadPersonalDocumentModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={fetchDocuments}
            />
        </div>
    )
}

"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
    FileText,
    Plus,
    MoreVertical,
    Eye,
    Download,
    Trash2,
    Search,
    CloudUpload,
    Building2,
    ShieldCheck
} from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase/client"
import { toast } from "react-hot-toast"

export default function OrgDocumentsPage() {
    const { profile } = useAuth()
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [documents, setDocuments] = useState<any[]>([])

    const fetchDocuments = async () => {
        if (!profile?.organization_id) return

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("documents")
                .select("*")
                .eq("organization_id", profile.organization_id)
                .order("created_at", { ascending: false })

            if (error) throw error
            setDocuments(data || [])
        } catch (error: any) {
            toast.error("Failed to load documents")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [profile?.organization_id])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return

        try {
            const { error } = await supabase
                .from("documents")
                .delete()
                .eq("id", id)

            if (error) throw error
            toast.success("Document deleted")
            fetchDocuments()
        } catch (error: any) {
            toast.error("Failed to delete document")
        }
    }

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Container>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                <FileText className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Institutional Repository</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage and distribute official study materials to your organization.</p>
                    </div>

                    <Button className="h-11 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-none">
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Material
                    </Button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Repository List */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search documents by title..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 h-10 border-none shadow-none text-xs font-bold bg-transparent"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Inventory Check</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <AnimatePresence>
                                    {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                                        <motion.div
                                            key={doc.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <Card className="border border-slate-100 shadow-none hover:border-slate-200 transition-all group bg-white overflow-hidden">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between mb-6">
                                                        <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                            <FileText className="h-6 w-6" />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(doc.id)}
                                                            className="h-8 w-8 p-0 rounded-full text-slate-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-1 mb-6">
                                                        <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{doc.title}</h3>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                            <span>PDF</span>
                                                            <span>•</span>
                                                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Button variant="outline" className="h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest border-slate-100 shadow-none">
                                                            <Eye className="mr-2 h-3.5 w-3.5" />
                                                            Preview
                                                        </Button>
                                                        <Button variant="outline" className="h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest border-slate-100 shadow-none">
                                                            <Download className="mr-2 h-3.5 w-3.5" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full py-20 text-center border border-dashed border-slate-200 rounded-3xl">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No documents found</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Stats & Actions */}
                    <div className="space-y-8">
                        <Card className="border-none bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                <FileText className="h-32 w-32" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-6">Cloud Status</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Storage Used</span>
                                            <span>42%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-[42%]" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/5">
                                        <CloudUpload className="h-4 w-4 text-primary" />
                                        <p className="text-[10px] font-bold">12 New Uploads Today</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Controls</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                                        <span className="text-xs font-bold text-slate-700">Encrypted</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Enabled</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-3.5 w-3.5 text-slate-300" />
                                        <span className="text-xs font-bold text-slate-700">Restricted</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Global</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

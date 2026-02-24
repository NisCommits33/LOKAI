"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
    FileText,
    Search,
    Loader2,
    BrainCircuit,
    ArrowRight,
    CheckCircle2,
    Clock,
    Sparkles,
    ShieldCheck,
    Filter,
    Tags
} from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/AuthProvider"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrgDocumentBrowserPage() {
    const { user, profile } = useAuth()
    const [documents, setDocuments] = useState<any[]>([])
    const [departments, setDepartments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTab, setSelectedTab] = useState("all")

    useEffect(() => {
        if (user) {
            Promise.all([fetchDocuments(), fetchDepartments()])
        }
    }, [user])

    const fetchDepartments = async () => {
        try {
            const { data } = await supabase.from("departments").select("*").order("name")
            if (data) setDepartments(data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            const token = (await supabase.auth.getSession()).data.session?.access_token
            if (!token) return

            const res = await fetch("/api/organization/documents", {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!res.ok) throw new Error("Failed to fetch documents")
            setDocuments(await res.json())
        } catch (error) {
            console.error(error)
            toast.error("Could not load library")
        } finally {
            setLoading(false)
        }
    }

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesTab = selectedTab === "all" ||
            (selectedTab === "my" && doc.department_id === profile?.department_id) ||
            (selectedTab === "general" && !doc.department_id)

        return matchesSearch && matchesTab
    })

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="py-12 bg-white min-h-screen">
            <Container>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Institutional Library</h1>
                            <div className="bg-green-50 text-green-600 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest border border-green-100 flex items-center gap-1">
                                <ShieldCheck className="h-2.5 w-2.5" />
                                Verified Access
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium">Official governmental resources and targeted study materials.</p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm font-medium shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/50">
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full sm:w-auto">
                        <TabsList className="bg-white border border-slate-100 h-10 p-1 rounded-xl shadow-sm">
                            <TabsTrigger value="all" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white">All Resources</TabsTrigger>
                            <TabsTrigger value="my" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white">My Department</TabsTrigger>
                            <TabsTrigger value="general" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white">General</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                        <Filter className="h-3 w-3" />
                        Showing {filteredDocuments.length} Results
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-100 border-t-slate-900" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Library</p>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-100">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <FileText className="h-6 w-6 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900">No resources found</h3>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search or check back later.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredDocuments.map((doc) => (
                                <motion.div key={doc.id} variants={itemVariants} layout>
                                    <Card className="group h-full border border-slate-100 shadow-none hover:border-slate-200 transition-all bg-white flex flex-col overflow-hidden rounded-[2rem]">
                                        <CardContent className="p-8 flex flex-col h-full">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div className="flex flex-col gap-1 items-end">
                                                    {doc.is_completed ? (
                                                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Completed
                                                        </div>
                                                    ) : (
                                                        <div className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 flex items-center gap-1.5">
                                                            <Clock className="h-3 w-3" />
                                                            Pending
                                                        </div>
                                                    )}
                                                    {doc.department_id && (
                                                        <Badge variant="outline" className="bg-indigo-50/50 text-indigo-500 border-indigo-100 text-[8px] font-black uppercase tracking-widest px-2 py-0 h-4 shadow-none">
                                                            {departments.find(d => d.id === doc.department_id)?.name || "Departmental"}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-6">
                                                <h3 className="text-lg font-black text-slate-900 group-hover:text-slate-900 transition-colors line-clamp-2">
                                                    {doc.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                                                    {doc.description || "Official institutional resource for verified organizational training and reference."}
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                                                <div className="flex -space-x-2">
                                                    {(doc.tags || []).slice(0, 3).map((tag: string, i: number) => (
                                                        <div key={i} className="h-6 px-2 rounded-md bg-slate-50 border border-slate-100 flex items-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                            {tag}
                                                        </div>
                                                    ))}
                                                </div>

                                                <Link href={`/quizzes/organization/${doc.id}`}>
                                                    <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-900 hover:text-white border-none transition-all">
                                                        {doc.is_completed ? "Retake" : "Start"}
                                                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </Container>
        </div>
    )
}

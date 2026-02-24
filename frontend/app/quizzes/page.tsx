"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { BrainCircuit, BookOpen, Sparkles, ArrowRight, Loader2, ShieldCheck, FileText } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { quizService } from "@/lib/services/quizService"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase/client"

export default function QuizzesPage() {
    const { profile } = useAuth()

    // 1. GK Quizzes
    const { data: quizzes, isLoading: loadingGK, error: errorGK } = useQuery({
        queryKey: ['gk-quizzes'],
        queryFn: () => quizService.getGKQuizzes()
    })

    // 2. Org Documents (Institutional Resources)
    const { data: orgDocs, isLoading: loadingOrg } = useQuery({
        queryKey: ['org-resources', profile?.organization_id],
        queryFn: async () => {
            if (!profile?.organization_id) return []
            const { data: { session } } = await supabase.auth.getSession()
            const response = await fetch("/api/organization/documents", {
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            })
            if (!response.ok) return []
            return response.json()
        },
        enabled: !!profile?.organization_id && profile?.verification_status === 'verified'
    })

    const isVerifiedEmployee = profile?.verification_status === 'verified' && profile?.role === 'user'

    return (
        <div className="py-8 bg-white flex-1 min-h-screen text-slate-900">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto space-y-16"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <BackButton />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Practice Center</h1>
                                <p className="text-slate-500 text-lg font-medium mt-2">Master the General Knowledge section with our comprehensive bank.</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Link href="/documents/personal">
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-slate-100 transition-all text-left">
                                    <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                        <BrainCircuit className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AI Lab</p>
                                        <p className="text-sm font-bold text-slate-900">Your Study Materials</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all ml-2" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* GK Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-slate-900" />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">General Knowledge Lab</h2>
                        </div>

                        {loadingGK ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                                <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Inventory Check</p>
                            </div>
                        ) : errorGK ? (
                            <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
                                <p className="text-red-600 font-bold">Failed to load quizzes.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {quizzes?.map((quiz, i) => (
                                    <motion.div
                                        key={quiz.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="group h-full border border-slate-100 shadow-none hover:border-slate-200 transition-all bg-white flex flex-col rounded-2xl overflow-hidden">
                                            <CardHeader className="p-8 pb-4">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all overflow-hidden border border-transparent group-hover:border-slate-900/10">
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>
                                                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                        {quiz.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{quiz.category}</p>
                                                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-900 transition-colors line-clamp-1">{quiz.title}</CardTitle>
                                                <CardDescription className="text-slate-500 font-medium text-sm pt-2 leading-relaxed line-clamp-2">
                                                    {quiz.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="px-8 pb-8 mt-auto pt-6">
                                                <div className="flex items-center justify-between mb-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                                    <span>{quiz.total_questions} Questions</span>
                                                    <span>{quiz.times_taken} Attempts</span>
                                                </div>
                                                <Link href={`/quizzes/gk/${quiz.id}`}>
                                                    <Button className="w-full h-10 font-bold text-xs uppercase tracking-widest rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-none border-none">
                                                        Start Session
                                                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Institutional Resources (Verified Only) */}
                    {isVerifiedEmployee && (
                        <div className="space-y-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Resources</h2>
                                <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5 ml-2">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Verified Access</span>
                                </div>
                            </div>

                            {loadingOrg ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Scanning Internal Network</p>
                                </div>
                            ) : orgDocs && orgDocs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {orgDocs.map((doc: any, i: number) => (
                                        <motion.div
                                            key={doc.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="group h-full border border-slate-100 shadow-none hover:border-emerald-100 transition-all bg-white flex flex-col rounded-2xl overflow-hidden relative">
                                                <CardHeader className="p-8 pb-4">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all mb-6">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Official Material</p>
                                                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-900 transition-colors line-clamp-1">{doc.title}</CardTitle>
                                                    <CardDescription className="text-slate-500 font-medium text-sm pt-2 leading-relaxed line-clamp-2">
                                                        {doc.description || 'Institutional handout provided for training and preparation purposes.'}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="px-8 pb-8 mt-auto pt-6">
                                                    <div className="flex items-center justify-between mb-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                                        <span>{doc.page_count || '...'} Pages</span>
                                                        <span>PDF</span>
                                                    </div>
                                                    <Link href={`/quizzes/organization/${doc.id}`}>
                                                        <Button className="w-full h-10 font-bold text-xs uppercase tracking-widest rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-none border-none">
                                                            View & Practice
                                                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[2.5rem] bg-slate-50/50">
                                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                        <FileText className="h-5 w-5 text-slate-200" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">No institutional resources matched</p>
                                    <p className="text-xs text-slate-300 font-medium italic">Contact your administrator for targeted materials.</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </Container>
        </div>
    )
}

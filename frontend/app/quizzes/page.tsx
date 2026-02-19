"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { BrainCircuit, BookOpen, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { quizService } from "@/lib/services/quizService"

export default function QuizzesPage() {
    const { data: quizzes, isLoading, error } = useQuery({
        queryKey: ['gk-quizzes'],
        queryFn: () => quizService.getGKQuizzes()
    })

    return (
        <div className="py-8 bg-white flex-1 min-h-screen text-slate-900">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto space-y-10"
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
                            <Link href="/dashboard">
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-slate-100 transition-all">
                                    <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                        <BrainCircuit className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AI Lab</p>
                                        <p className="text-sm font-bold text-slate-900">Try AI Quizzes</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all ml-2" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <p className="text-slate-500 font-medium">Loading question bank...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
                            <p className="text-red-600 font-bold">Failed to load quizzes.</p>
                            <p className="text-red-500 text-sm mt-1">Please try again later.</p>
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
                                    <Card className="group h-full border border-slate-100 shadow-none hover:border-slate-200 transition-all bg-white flex flex-col">
                                        <CardHeader className="p-8 pb-4">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all overflow-hidden border border-transparent group-hover:border-primary/10">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {quiz.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{quiz.category}</p>
                                            <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
                                            <CardDescription className="text-slate-500 font-medium text-sm pt-2 leading-relaxed line-clamp-2">
                                                {quiz.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="px-8 pb-8 mt-auto pt-6">
                                            <div className="flex items-center justify-between mb-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                                <span>{quiz.total_questions} Questions</span>
                                                <span>{quiz.times_taken} Attempts</span>
                                            </div>
                                            <Link href={`/quizzes/${quiz.id}`}>
                                                <Button className="w-full h-10 font-bold text-xs uppercase tracking-widest rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-none border-none">
                                                    Start Session
                                                    <Sparkles className="ml-2 h-3.5 w-3.5" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </Container>
        </div>
    )
}

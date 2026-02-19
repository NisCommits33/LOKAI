"use client"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { History, Trophy, Clock, ArrowRight, Loader2, Calendar } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { quizService } from "@/lib/services/quizService"
import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter } from "next/navigation"

export default function QuizHistoryPage() {
    const { user } = useAuth()
    const router = useRouter()

    const { data: history, isLoading, error } = useQuery({
        queryKey: ['quiz-history', user?.id],
        queryFn: () => user ? quizService.getUserHistory(user.id) : null,
        enabled: !!user
    })

    if (!user) {
        return (
            <Container className="py-20 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                        <History className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Sign in to track history</h1>
                    <p className="text-slate-500">Your practice results and performance analytics are only available for registered users.</p>
                    <Link href="/login">
                        <Button className="bg-slate-900 text-white rounded-xl px-10 h-12 font-bold uppercase tracking-widest text-xs">Login Now</Button>
                    </Link>
                </div>
            </Container>
        )
    }

    return (
        <div className="py-8 bg-white min-h-screen text-slate-900">
            <Container>
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <BackButton />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Practice History</h1>
                                <p className="text-slate-500 text-lg font-medium mt-1">Review your past attempts and track your knowledge growth.</p>
                            </div>
                        </div>
                        <Link href="/quizzes">
                            <Button className="bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-xs border-none transition-all">
                                New Session
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <p className="text-slate-500 font-medium">Retrieving your record...</p>
                        </div>
                    ) : history && history.length > 0 ? (
                        <div className="space-y-4">
                            {history.map((attempt, i) => (
                                <motion.div
                                    key={attempt.id}
                                    initial={{ opacity: 0, y: i < 5 ? 10 : 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group border border-slate-100 shadow-none hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all rounded-2xl overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                                                {/* Left: Score Badge */}
                                                <div className={`p-8 sm:w-48 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-50 ${attempt.score_percentage >= 80 ? 'bg-emerald-50/30' :
                                                        attempt.score_percentage >= 50 ? 'bg-amber-50/30' : 'bg-rose-50/30'
                                                    }`}>
                                                    <span className={`text-3xl font-black tracking-tighter ${attempt.score_percentage >= 80 ? 'text-emerald-600' :
                                                            attempt.score_percentage >= 50 ? 'text-amber-600' : 'text-rose-600'
                                                        }`}>
                                                        {Math.round(attempt.score_percentage)}%
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Performance</span>
                                                </div>

                                                {/* Middle: Details */}
                                                <div className="flex-1 p-8 space-y-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">
                                                            {attempt.gk_quizzes?.category || 'General'}
                                                        </span>
                                                        <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-1 ml-2">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(attempt.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                        {attempt.gk_quizzes?.title || 'Unknown Quiz'}
                                                    </h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <Trophy className="h-4 w-4 text-amber-500" />
                                                            <span className="text-sm font-bold text-slate-600">{attempt.correct_answers}/{attempt.total_questions} Correct</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-slate-400" />
                                                            <span className="text-sm font-bold text-slate-600">{Math.floor(attempt.time_spent_seconds / 60)}m {attempt.time_spent_seconds % 60}s</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Action */}
                                                <div className="p-8 border-t sm:border-t-0 sm:border-l border-slate-50 flex items-center justify-center">
                                                    <Link href={`/quizzes/${attempt.source_id}`}>
                                                        <Button variant="ghost" className="h-12 w-12 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                                                            <RotateCcwIcon className="h-5 w-5" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 border-2 border-dashed border-slate-100 rounded-[32px] text-center space-y-6">
                            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-200">
                                <History className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">No attempts yet</h3>
                                <p className="text-slate-500 mt-2 font-medium">Your progress journey starts here. Take your first quiz today!</p>
                            </div>
                            <Link href="/quizzes">
                                <Button className="bg-slate-900 text-white rounded-xl h-12 px-10 font-bold uppercase tracking-widest text-xs shadow-lg shadow-black/10">Start First Practice</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

function RotateCcwIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    )
}

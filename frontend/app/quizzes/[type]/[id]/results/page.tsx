"use client"

import { use, useEffect, useState } from "react"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Trophy, RotateCcw, LayoutDashboard, Loader2, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { quizService, QuizAttempt } from "@/lib/services/quizService"
import { toast } from "react-hot-toast"

export default function GenericQuizResultsPage({ params }: { params: Promise<{ type: string, id: string }> }) {
    const { type, id } = use(params)
    const router = useRouter()
    const { user, profile } = useAuth()

    // State
    const [results, setResults] = useState<any>(null)
    const [stats, setStats] = useState<{ score: number, percentage: number, correct: number, wrong: number } | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const stored = sessionStorage.getItem(`quiz_results_${id}`)
        if (stored) {
            const parsed = JSON.parse(stored)
            setResults(parsed)
            calculateStats(parsed)
        } else {
            router.push(`/quizzes/${type}/${id}`)
        }
    }, [id, type])

    const calculateStats = (data: any) => {
        let correctCount = 0
        data.quiz.questions.forEach((q: any, idx: number) => {
            if (data.answers[idx] === q.correct_index) {
                correctCount++
            }
        })

        const total = data.quiz.total_questions
        setStats({
            score: correctCount,
            percentage: Math.round((correctCount / total) * 100),
            correct: correctCount,
            wrong: total - correctCount
        })
    }

    const handleSaveAttempt = async () => {
        if (!user || !profile || !results || !stats || isSaving) return

        setIsSaving(true)
        try {
            await quizService.submitAttempt({
                user_id: user.id,
                source_type: results.sourceType || (type === 'org' ? 'organization' : type),
                source_id: id,
                total_questions: results.quiz.total_questions,
                correct_answers: stats.correct,
                score_percentage: stats.percentage,
                time_spent_seconds: results.timeSpent,
                questions_attempted: results.quiz.questions,
                answers: Object.values(results.answers) as number[]
            })
            toast.success("Attempt saved to your history.")
        } catch (error) {
            console.error(error)
            toast.error("Failed to save attempt.")
        } finally {
            setIsSaving(false)
        }
    }

    // Auto-save if logged in
    useEffect(() => {
        if (user && profile && stats && results) {
            handleSaveAttempt()
        }
    }, [user, profile, stats, results])

    if (!results || !stats) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="py-12 bg-slate-50/50 min-h-screen">
            <Container className="max-w-4xl space-y-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[32px] border border-slate-100 p-8 sm:p-12 shadow-xl shadow-slate-200/50 text-center space-y-8"
                >
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-2">
                        <Trophy className="h-10 w-10" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Practice Complete!</h1>
                        <p className="text-slate-500 font-medium max-w-md mx-auto">Great work in the <span className="text-primary font-bold">{results.quiz.title}</span> session. Here is how you performed.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
                        {[
                            { label: "Score", value: `${stats.percentage}%`, icon: Trophy, color: "text-primary bg-primary/5" },
                            { label: "Correct", value: stats.correct, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
                            { label: "Incorrect", value: stats.wrong, icon: XCircle, color: "text-rose-500 bg-rose-50" },
                            { label: "Time Taken", value: `${Math.floor(results.timeSpent / 60)}m ${results.timeSpent % 60}s`, icon: RotateCcw, color: "text-slate-500 bg-slate-50" }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center gap-2">
                                <item.icon className={`h-5 w-5 ${item.color.split(' ')[0]}`} />
                                <span className="text-2xl font-black text-slate-900 tracking-tighter">{item.value}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            variant="default"
                            className="w-full sm:w-auto h-14 bg-slate-900 hover:bg-black text-white px-10 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-black/10 transition-all active:scale-95"
                            onClick={() => router.push(`/quizzes/${type}/${id}`)}
                        >
                            Retake Practice
                            <RotateCcw className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto h-14 bg-white border-slate-200 text-slate-900 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                            onClick={() => router.push('/quizzes')}
                        >
                            Explore More
                            <LayoutDashboard className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Detailed Review</h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{results.quiz.total_questions} Items Analyzed</span>
                    </div>

                    <div className="space-y-4">
                        {results.quiz.questions.map((q: any, idx: number) => {
                            const userAnswer = results.answers[idx]
                            const isCorrect = userAnswer === q.correct_index

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className={`overflow-hidden border shadow-none rounded-2xl transition-all ${isCorrect ? 'border-emerald-100' : 'border-rose-100'}`}>
                                        <div className={`h-1.5 w-full ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                        <CardContent className="p-8 space-y-6">
                                            <div className="flex gap-4">
                                                <div className={`h-8 w-8 min-w-[32px] rounded-lg border-2 flex items-center justify-center font-bold text-xs ${isCorrect ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-rose-100 bg-rose-50 text-rose-600'}`}>
                                                    {idx + 1}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 leading-tight pt-1">
                                                    {q.question}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                                                {q.options.map((opt: string, oIdx: number) => {
                                                    const isSelected = userAnswer === oIdx
                                                    const isRight = q.correct_index === oIdx

                                                    let statusClasses = 'border-slate-100 bg-white text-slate-500 opacity-60'
                                                    if (isRight) statusClasses = 'border-emerald-200 bg-emerald-50 text-emerald-700 font-bold opacity-100 ring-2 ring-emerald-500/20'
                                                    if (isSelected && !isRight) statusClasses = 'border-rose-200 bg-rose-50 text-rose-700 font-bold opacity-100 ring-2 ring-rose-500/20 shadow-sm'

                                                    return (
                                                        <div key={oIdx} className={`p-4 rounded-xl border-2 text-sm transition-all flex items-center gap-3 ${statusClasses}`}>
                                                            <div className={`h-6 w-6 min-w-[24px] rounded-md border-2 flex items-center justify-center text-[10px] font-black ${isRight ? 'border-emerald-100 bg-emerald-500 text-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                                                                {String.fromCharCode(65 + oIdx)}
                                                            </div>
                                                            <span className="line-clamp-2">{opt}</span>
                                                            {isRight && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />}
                                                            {isSelected && !isRight && <XCircle className="h-4 w-4 text-rose-500 ml-auto" />}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {q.explanation && (
                                                <div className="pl-12 pt-4">
                                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-4">
                                                        <div className="h-10 w-10 min-w-[40px] rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                                            <Info className="h-5 w-5" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Learning Point</p>
                                                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                                                &ldquo;{q.explanation}&rdquo;
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </Container>
        </div>
    )
}

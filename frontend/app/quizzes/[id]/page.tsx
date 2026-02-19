"use client"

import { use } from "react"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Timer, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { quizService, GKQuiz } from "@/lib/services/quizService"
import { useRouter } from "next/navigation"

export default function QuizPlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()

    // State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [isFinished, setIsFinished] = useState(false)

    // Data Fetching
    const { data: quiz, isLoading, error } = useQuery({
        queryKey: ['quiz', id],
        queryFn: () => quizService.getQuizById(id)
    })

    // Timer Logic
    useEffect(() => {
        if (quiz && !isFinished && timeLeft === null) {
            // Allocate 1 minute per question
            setTimeLeft(quiz.total_questions * 60)
        }
    }, [quiz, isFinished, timeLeft])

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0 && !isFinished) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => (prev !== null ? prev - 1 : null))
            }, 1000)
            return () => clearInterval(timer)
        } else if (timeLeft === 0 && quiz && !isFinished) {
            handleSubmit()
        }
    }, [timeLeft, isFinished, quiz])

    const handleSelectOption = (questionId: number, optionIndex: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }))
    }

    const handleSubmit = async () => {
        if (isFinished) return
        setIsFinished(true)
        // Store answers in session storage for the results page
        sessionStorage.setItem(`quiz_results_${id}`, JSON.stringify({
            quiz,
            answers: selectedAnswers,
            timeSpent: (quiz?.total_questions || 0) * 60 - (timeLeft || 0)
        }))
        router.push(`/quizzes/${id}/results`)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Session...</p>
            </div>
        )
    }

    if (error || !quiz) {
        return (
            <Container className="py-20 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold">Quiz Not Found</h1>
                <p className="text-slate-500 mt-2">The practice session you are looking for does not exist.</p>
                <Button className="mt-8" onClick={() => router.push('/quizzes')}>Return to Library</Button>
            </Container>
        )
    }

    const currentQuestion = quiz.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / quiz.total_questions) * 100

    return (
        <div className="min-h-screen bg-slate-50/30 flex flex-col">
            {/* Player Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <Container className="py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <BackButton className="p-0 h-auto hover:bg-transparent" />
                            <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 line-clamp-1">{quiz.title}</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {quiz.total_questions}</p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${timeLeft !== null && timeLeft < 60 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                            <Timer className={`h-4 w-4 ${timeLeft !== null && timeLeft < 60 ? 'animate-pulse' : ''}`} />
                            <span className="font-mono font-bold text-sm tracking-tighter">{timeLeft !== null ? formatTime(timeLeft) : "--:--"}</span>
                        </div>
                    </div>
                    <Progress value={progress} className="h-1 mt-4" />
                </Container>
            </div>

            <Container className="flex-1 py-12 max-w-3xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {/* Question Text */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                                {currentQuestion.question}
                            </h3>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswers[currentQuestionIndex] === index
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectOption(currentQuestionIndex, index)}
                                        className={`group relative flex items-center p-6 rounded-2xl border-2 text-left transition-all ${isSelected
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                                            }`}
                                    >
                                        <div className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs mr-4 transition-all ${isSelected
                                            ? 'border-primary bg-primary text-white scale-110'
                                            : 'border-slate-100 bg-slate-50 text-slate-400 group-hover:border-slate-200 group-hover:text-slate-600'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className={`font-medium sm:text-lg ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                                            {option}
                                        </span>
                                        {isSelected && (
                                            <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Container>

            {/* Navigation Footer */}
            <div className="bg-white border-t border-slate-100 py-6">
                <Container className="max-w-3xl">
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            disabled={currentQuestionIndex === 0}
                            className="h-12 border-slate-200 text-slate-400 disabled:opacity-30 rounded-xl px-6"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Prev
                        </Button>

                        <div className="flex-1 h-1 bg-slate-50 rounded-full mx-4 hidden sm:block">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {currentQuestionIndex === quiz.total_questions - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                className="h-12 bg-slate-900 hover:bg-black text-white px-8 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-black/10"
                            >
                                Finish Practice
                                <CheckCircle2 className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="h-12 bg-slate-900 hover:bg-black text-white px-8 rounded-xl font-bold uppercase tracking-widest text-xs"
                            >
                                Next Question
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </Container>
            </div>
        </div>
    )
}

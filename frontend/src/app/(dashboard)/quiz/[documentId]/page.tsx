"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Clock,
    Trophy,
    Zap,
    AlertCircle,
    LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuizPage() {
    const { documentId } = useParams();
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answers, setAnswers] = useState<any[]>([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(600); // 10 minutes default
    const supabase = createClient();

    useEffect(() => {
        loadQuestions();
    }, [documentId]);

    useEffect(() => {
        if (quizStarted && !quizFinished && timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            finishQuiz();
        }
    }, [quizStarted, quizFinished, timer]);

    const loadQuestions = async () => {
        const { data } = await supabase
            .from("questions")
            .select("*")
            .eq("document_id", documentId)
            .limit(10);

        setQuestions(data || []);
        setLoading(false);
    };

    const handleSelect = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);

        const isCorrect = index === questions[currentIndex].correct_index;
        const newAnswers = [...answers, {
            question_id: questions[currentIndex].id,
            selected_index: index,
            is_correct: isCorrect
        }];
        setAnswers(newAnswers);

        // Auto move after 2 seconds
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelectedOption(null);
            } else {
                finishQuiz();
            }
        }, 1500);
    };

    const finishQuiz = () => {
        setQuizFinished(true);
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return <div className="p-20 text-center font-bold">Initializing Exam Sim...</div>;

    if (!quizStarted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full glass p-10 rounded-[3rem] text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <Zap className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">Exam Simulator</h1>
                    <p className="text-muted-foreground font-medium mb-8">Ready to test your knowledge on this document? 10 questions await.</p>
                    <div className="grid grid-cols-2 gap-4 mb-10 text-left">
                        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                            <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Time Limit</div>
                            <div className="font-bold">10 Minutes</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                            <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Target</div>
                            <div className="font-bold">70% Score</div>
                        </div>
                    </div>
                    <button onClick={() => setQuizStarted(true)} className="w-full py-5 bg-primary text-white rounded-[2rem] font-bold shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        Begin Entrance
                    </button>
                </motion.div>
            </div>
        );
    }

    if (quizFinished) {
        const correctCount = answers.filter(a => a.is_correct).length;
        const score = (correctCount / questions.length) * 100;

        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full glass p-12 rounded-[3.5rem] text-center">
                    <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-10 relative">
                        <Trophy className="w-12 h-12 text-accent" />
                        <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping -z-10"></div>
                    </div>
                    <h2 className="text-4xl font-black mb-2">Quiz Completed!</h2>
                    <p className="text-muted-foreground font-bold text-lg mb-12">Here's your performance breakdown.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                        <div className="p-6 rounded-[2rem] bg-muted/30 border border-border">
                            <div className="text-3xl font-black mb-1">{score}%</div>
                            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Final Score</div>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-muted/30 border border-border">
                            <div className="text-3xl font-black mb-1 text-green-500">{correctCount}</div>
                            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Correct</div>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-muted/30 border border-border">
                            <div className="text-3xl font-black mb-1 text-red-500">{questions.length - correctCount}</div>
                            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Incorrect</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => router.push("/dashboard")} className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all">
                            Back to Dashboard
                        </button>
                        <button onClick={() => window.location.reload()} className="flex-1 py-4 border border-border rounded-2xl font-bold hover:bg-muted transition-all">
                            Try Again
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            <header className="h-20 bg-background border-b border-border px-8 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <LayoutGrid className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold hidden sm:block">Exam Sim: <span className="text-primary">Q{currentIndex + 1}/10</span></span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl border border-border">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono font-bold text-sm tracking-tighter">{formatTime(timer)}</span>
                    </div>
                    <button onClick={() => finishQuiz()} className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
                        End Quiz
                    </button>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-3xl w-full">
                    <div className="mb-10 text-center">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-8">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} className="h-full bg-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-3">
                            {currentQuestion.question_text}
                        </h2>
                    </div>

                    <div className="grid gap-4">
                        <AnimatePresence mode="wait">
                            {currentQuestion.options.map((option: string, i: number) => {
                                const isSelected = selectedOption === i;
                                const isCorrect = i === currentQuestion.correct_index;
                                const showResult = selectedOption !== null;

                                return (
                                    <motion.button
                                        key={i}
                                        whileHover={!showResult ? { scale: 1.01 } : {}}
                                        whileTap={!showResult ? { scale: 0.99 } : {}}
                                        onClick={() => handleSelect(i)}
                                        disabled={showResult}
                                        className={cn(
                                            "w-full p-6 text-left rounded-3xl border-2 transition-all flex items-center justify-between group",
                                            !showResult && "border-border bg-background hover:border-primary/50 hover:shadow-md",
                                            showResult && isCorrect && "border-green-500 bg-green-50/50 shadow-md",
                                            showResult && isSelected && !isCorrect && "border-red-500 bg-red-50/50",
                                            showResult && !isSelected && !isCorrect && "opacity-50 border-border bg-background"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-bold",
                                                !showResult && "border-border text-muted-foreground group-hover:border-primary group-hover:text-primary",
                                                showResult && isCorrect && "border-green-500 text-green-500 bg-white",
                                                showResult && isSelected && !isCorrect && "border-red-500 text-red-500 bg-white"
                                            )}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            <span className="font-bold text-lg">{option}</span>
                                        </div>
                                        {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                                        {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {selectedOption !== null && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex gap-4">
                                <AlertCircle className="w-6 h-6 text-blue-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-blue-900 mb-1">Explanation</h4>
                                    <p className="text-sm text-blue-800 leading-relaxed font-medium">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

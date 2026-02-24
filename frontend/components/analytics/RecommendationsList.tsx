"use client"

import { motion } from "framer-motion"
import { BookOpen, Sparkles, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Recommendation {
    id: string
    title: string
    description: string
    priority: "high" | "medium"
    reason: string
}

interface RecommendationsListProps {
    recommendations: Recommendation[]
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
    if (recommendations.length === 0) {
        return (
            <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Zap className="h-5 w-5 text-indigo-400" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No New Recommendations</p>
                <p className="text-xs text-slate-400 font-medium italic mt-1">Explore the Practice Lab to gather more data!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {recommendations.slice(0, 4).map((rec, i) => (
                <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative bg-white border border-slate-100 p-5 rounded-2xl hover:border-indigo-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div className="flex items-start gap-4 flex-1">
                        <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${rec.priority === 'high'
                                ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white'
                                : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white'
                            }`}>
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className={`text-[9px] font-black uppercase tracking-widest ${rec.priority === 'high' ? 'text-red-500' : 'text-indigo-400'
                                    }`}>
                                    {rec.priority === 'high' ? 'Priority' : 'Recommendation'}
                                </p>
                                <span className="h-1 w-1 rounded-full bg-slate-200" />
                                <p className="text-[9px] font-bold text-slate-400 italic">
                                    {rec.reason}
                                </p>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{rec.title}</h4>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{rec.description}</p>
                        </div>
                    </div>

                    <Link href={`/quizzes/organization/${rec.id}`}>
                        <Button variant="ghost" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-slate-50 hover:bg-slate-900 hover:text-white border-none transition-all">
                            Study Now
                            <Sparkles className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}

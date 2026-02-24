"use client"

import { motion } from "framer-motion"
import { AlertCircle, ArrowUpRight, ShieldAlert, Sparkles } from "lucide-react"
import Link from "next/link"

interface WeakArea {
    source_id: string
    source_type: string
    average_score: number
    attempts: number
    title?: string // Optionally passed or fetched
}

interface WeakAreasListProps {
    areas: WeakArea[]
}

export function WeakAreasList({ areas }: WeakAreasListProps) {
    if (areas.length === 0) {
        return (
            <div className="py-10 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Critical Weak Areas</p>
                <p className="text-xs text-slate-400 font-medium italic mt-1">Keep up the great work!</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {areas.slice(0, 3).map((area, i) => (
                <motion.div
                    key={area.source_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white border border-slate-100 p-4 rounded-2xl hover:border-red-100 transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                {area.source_type} • {area.attempts} Attempts
                            </p>
                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                                {area.title || `Resource: ${area.source_id.substring(0, 8)}`}
                            </h4>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                            <AlertCircle className="h-3 w-3 text-red-400" />
                            <span className="text-sm font-black text-red-500">{Math.round(area.average_score)}%</span>
                        </div>
                        <Link href={`/quizzes/${area.source_type}/${area.source_id}`} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 mt-1 flex items-center gap-1 justify-end group/link">
                            Retake
                            <ArrowUpRight className="h-2.5 w-2.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

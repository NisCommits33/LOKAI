"use client"

import { motion } from "framer-motion"

interface ReadinessGaugeProps {
    score: number
}

export function ReadinessGauge({ score }: ReadinessGaugeProps) {
    const radius = 80
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    // Color based on score
    const getColor = (s: number) => {
        if (s >= 80) return "text-emerald-500"
        if (s >= 50) return "text-amber-500"
        return "text-indigo-500"
    }

    const getBgColor = (s: number) => {
        if (s >= 80) return "bg-emerald-50"
        if (s >= 50) return "bg-amber-50"
        return "bg-indigo-50"
    }

    return (
        <div className="relative flex items-center justify-center h-48 w-48 mx-auto">
            {/* Background Circle */}
            <svg className="h-full w-full transform -rotate-90">
                <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-50"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={getColor(score)}
                    strokeLinecap="round"
                />
            </svg>

            {/* Content Overflow */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-4xl font-black tracking-tight ${getColor(score)}`}
                >
                    {Math.round(score)}%
                </motion.span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                    Readiness
                </span>
            </div>

            {/* Decorative dots */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-3 w-3 rounded-full bg-white border-2 ${getColor(score)}`} />
            </div>
        </div>
    )
}

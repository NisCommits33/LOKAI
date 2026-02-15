"use client";

import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import {
    Activity,
    Target,
    Award,
    TrendingUp,
    ChevronRight,
    Search,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    const { profile } = useAuth();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">Learning Analytics</h1>
                    <p className="text-muted-foreground font-medium">Track your growth and exam readiness over time.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold flex items-center gap-2">
                        <Filter className="w-4 h-4" /> This Month
                    </button>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2.5rem] bg-background border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold">Accuracy Rate</h3>
                        </div>
                        <div className="text-5xl font-black mb-2">92%</div>
                        <div className="text-sm font-bold text-green-500 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +4.5% vs last week
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-background border border-border shadow-sm text-center flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                            <Award className="w-10 h-10 text-primary" />
                        </div>
                        <div className="text-2xl font-black mb-1">Elite Rank</div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Top 5% in Department</div>
                        <button className="text-sm font-black text-primary hover:underline flex items-center gap-1">
                            View Leaderboard <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
                    <h3 className="text-xl font-bold mb-8">Performance Trends</h3>
                    <div className="space-y-6">
                        {[
                            { label: "Policy Knowledge", val: 88 },
                            { label: "Technical Rules", val: 72 },
                            { label: "General Admin", val: 95 }
                        ].map((trend, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <span>{trend.label}</span>
                                    <span>{trend.val}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${trend.val}%` }} className="h-full bg-primary" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className="bg-background border border-border rounded-[3rem] p-10">
                <div className="flex items-center gap-3 mb-10">
                    <Activity className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Recent Learning Milestones</h2>
                </div>

                <div className="space-y-6">
                    {[
                        { title: "Mastered: Civil Aviation Act - Chapter 4", date: "2 hours ago", xp: "+250 XP" },
                        { title: "Perfect Score: NOC Maintenance Rules", date: "Yesterday", xp: "+500 XP" },
                        { title: "7 Day Study Streak Reached", date: "2 days ago", xp: "+1000 XP" }
                    ].map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/20 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{m.title}</h4>
                                    <p className="text-xs text-muted-foreground font-medium">{m.date}</p>
                                </div>
                            </div>
                            <div className="text-primary font-black">{m.xp}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

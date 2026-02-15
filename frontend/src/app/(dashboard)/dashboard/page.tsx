"use client";

import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import {
    BookOpen,
    FileText,
    Trophy,
    ArrowUpRight,
    TrendingUp,
    Clock,
    Zap
} from "lucide-react";

export default function DashboardPage() {
    const { profile } = useAuth();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                    Hello, <span className="text-primary">{profile?.full_name?.split(' ')[0]}!</span>
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                    You're currently in the <span className="text-foreground font-bold">{profile?.organizations?.name}</span> track.
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    icon={Trophy}
                    label="Readiness Score"
                    value="78%"
                    trend="+5%"
                    color="bg-primary"
                />
                <StatCard
                    icon={BookOpen}
                    label="Quizzes Taken"
                    value="12"
                    trend="2 today"
                    color="bg-accent"
                />
                <StatCard
                    icon={FileText}
                    label="Docs Studied"
                    value="04"
                    trend="Top in Dept"
                    color="bg-green-500"
                />
                <StatCard
                    icon={Clock}
                    label="Study Time"
                    value="15h"
                    trend="Avg 2h/day"
                    color="bg-purple-500"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Recommended for You</h2>
                            <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                                View All Documents <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {[1, 2].map(i => (
                                <div key={i} className="p-6 rounded-3xl bg-background border border-border hover:border-primary/20 hover:shadow-lg transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Civil Aviation Act, 2053</h3>
                                            <div className="flex gap-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                                <span>Chapter 4</span>
                                                <span className="w-1 h-1 bg-border rounded-full mt-1.5" />
                                                <span>120 Questions</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-3 bg-muted rounded-xl hover:bg-primary hover:text-white transition-all">
                                        <Zap className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar area */}
                <div className="space-y-8">
                    <section className="p-8 rounded-[2rem] bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold mb-4">Daily Goal</h2>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-5xl font-extrabold">85</span>
                                <span className="text-white/60 font-bold mb-2">/ 100 XP</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3 mb-6">
                                <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <button className="w-full py-3.5 bg-white text-slate-900 font-bold rounded-2xl hover:scale-[1.02] transition-all">
                                Claim Reward
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
    return (
        <div className="p-6 rounded-[2rem] bg-background border border-border shadow-sm hover:shadow-md transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", color + "/10")}>
                <Icon className={cn("w-6 h-6", color.replace('bg-', 'text-'))} />
            </div>
            <div className="text-3xl font-black mb-1 text-foreground">{value}</div>
            <div className="text-sm font-bold text-muted-foreground mb-3">{label}</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                <TrendingUp className="w-4 h-4" />
                {trend}
            </div>
        </div>
    );
}

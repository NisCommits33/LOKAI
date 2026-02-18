"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    BookOpen,
    ShieldCheck,
    Lock,
    Settings,
    BrainCircuit,
    ArrowRight,
    Trophy,
    History,
    Sparkles
} from "lucide-react"

export default function DashboardPage() {
    const { user, profile, loading } = useAuth()

    if (loading) return (
        <div className="flex-1 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Authenticating Identity</p>
            </div>
        </div>
    )

    const isVerified = profile?.verification_status === 'verified'
    const isOrgAdmin = profile?.role === 'org_admin'
    const isSuperAdmin = profile?.role === 'super_admin'

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="py-8 bg-white flex-1 min-h-screen">
            <Container>
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Namaste, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
                            </h1>
                            <div className="bg-slate-100 text-slate-500 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {profile?.role?.replace('_', ' ') || 'User'}
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium">Continue your civil service preparation journey.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/quizzes">
                            <Button className="h-10 px-6 font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none transition-all">
                                <BrainCircuit className="mr-2 h-4 w-4" />
                                Start Sessions
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats row - Minimalist */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                    {[
                        { label: "Quizzes", value: "12", icon: <Trophy className="h-4 w-4" />, sub: "Completed this week" },
                        { label: "AI Analysis", value: "05", icon: <History className="h-4 w-4" />, sub: "Docs processed" },
                        { label: "Community Rank", value: "#42", icon: <Sparkles className="h-4 w-4" />, sub: "Regional position" },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="border border-slate-100 shadow-none bg-white overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center transition-colors group-hover:bg-slate-100 group-hover:text-slate-600">
                                            {stat.icon}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                                <span className="text-[10px] font-medium text-slate-400">{stat.sub}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="space-y-10">
                    <div>
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Preparation Hub</h2>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 gap-6 md:grid-cols-3"
                        >
                            {/* GK Hub */}
                            <motion.div variants={itemVariants}>
                                <Card className="group h-full border border-slate-100 shadow-none hover:border-slate-200 transition-all bg-white flex flex-col">
                                    <CardHeader className="p-8">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">GK Practice Lab</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium pt-2 text-sm leading-relaxed">
                                            Practice geography, history, and constitutional questions with real-time feedback.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 mt-auto pt-4">
                                        <Link href="/quizzes">
                                            <Button variant="secondary" className="w-full h-10 font-bold rounded-xl bg-slate-50 hover:bg-slate-100 border-none">
                                                Go to Lab
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* AI Lab */}
                            <motion.div variants={itemVariants}>
                                <Card className="group h-full border border-slate-100 shadow-none hover:border-slate-200 transition-all bg-white flex flex-col">
                                    <CardHeader className="p-8">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                            <BrainCircuit className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">AI intelligence</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium pt-2 text-sm leading-relaxed">
                                            Upload study материалов and let machine intelligence provide summaries and quizzes.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 mt-auto pt-4">
                                        <Link href="/documents/personal">
                                            <Button variant="secondary" className="w-full h-10 font-bold rounded-xl bg-slate-50 hover:bg-slate-100 border-none">
                                                Manage Docs
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Org Resources (Verification Locked) */}
                            <motion.div variants={itemVariants}>
                                <Card className="group h-full border border-slate-100 shadow-none bg-white flex flex-col relative overflow-hidden">
                                    {!isVerified && !isOrgAdmin && !isSuperAdmin && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 backdrop-blur-[1px] p-8 text-center">
                                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                                                <Lock className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-1">Access Locked</h3>
                                            <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-widest">Verification Required</p>
                                            <Link href="/profile/verify">
                                                <Button size="sm" className="h-8 px-4 font-bold text-[10px] uppercase tracking-widest rounded-lg">Verify Identity</Button>
                                            </Link>
                                        </div>
                                    )}

                                    <CardHeader className="p-8">
                                        <div className={`h-10 w-10 rounded-xl ${isVerified ? 'bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-green-600' : 'bg-slate-50 text-slate-200'} flex items-center justify-center mb-6 transition-all`}>
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <CardTitle className={`text-xl font-bold ${isVerified ? 'text-slate-900 group-hover:text-green-600' : 'text-slate-300'} transition-colors`}>Org Resources</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium pt-2 text-sm leading-relaxed">
                                            Internal governmental handouts found only within authorized organizational channels.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 mt-auto pt-4">
                                        <Button variant="secondary" className="w-full h-10 font-bold rounded-xl bg-slate-50 border-none" disabled={!isVerified && !isOrgAdmin}>
                                            Open Library
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Admin Board (Professional, Neutral) */}
                    {(isOrgAdmin || isSuperAdmin) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-900 rounded-[2rem] p-8 sm:p-12 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <Settings className="h-48 w-48" />
                            </div>
                            <div className="relative z-10 max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/5 text-[9px] font-bold uppercase tracking-[0.2em] mb-6">
                                    <ShieldCheck className="h-3 w-3" />
                                    Administrative Console
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Organizational Management.</h2>
                                <p className="text-slate-400 font-medium mb-10 leading-relaxed text-base">
                                    You have administrative access. Oversee employee verifications,
                                    manage official study kits, and monitor institutional progress.
                                </p>
                                <Link href="/admin">
                                    <Button className="h-11 px-8 text-sm font-bold rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-all">
                                        Open Board
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </Container>
        </div>
    )
}

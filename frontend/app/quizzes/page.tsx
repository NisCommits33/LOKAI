"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, ArrowRight, BrainCircuit } from "lucide-react"
import Link from "next/link"

export default function QuizzesPage() {
    return (
        <div className="py-12 bg-gray-50/50 flex-1 min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto space-y-12"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <BackButton />
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Practice Center</h1>
                                <p className="text-gray-500 text-lg font-medium mt-2">Master the General Knowledge section with our comprehensive question bank.</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Link href="/dashboard">
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-primary/10 transition-colors">
                                    <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                        <BrainCircuit className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest">AI Lab</p>
                                        <p className="text-sm font-bold text-gray-900">Try AI Quizzes</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {["Geography", "History", "Constitution", "Economy", "International", "Science & Tech"].map((category, i) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="group border-none shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm">
                                    <div className="h-1.5 w-full bg-gray-100 group-hover:bg-primary transition-colors" />
                                    <CardHeader className="pt-8 px-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                            <div className="bg-amber-100/50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Featured</div>
                                        </div>
                                        <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{category}</CardTitle>
                                        <CardDescription className="text-gray-500 font-medium line-clamp-2 pt-2">
                                            Practice specific questions focused on {category} sub-topics and past papers.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-8 pt-4">
                                        <Button className="w-full h-11 font-bold group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                                            Start Session
                                            <Sparkles className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </Container>
        </div>
    )
}

"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { Clock, LogOut, LayoutDashboard } from "lucide-react"

export default function OrganizationPendingPage() {
    const { signOut } = useAuth()

    return (
        <div className="py-20 flex-1 flex items-center bg-white min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-lg"
                >
                    <div className="mb-8">
                        <BackButton />
                    </div>

                    <Card className="border border-slate-100 shadow-none bg-white overflow-hidden">
                        <CardHeader className="text-center pt-12 px-10">
                            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                                <Clock className="w-8 h-8 animate-pulse" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                                Application Pending
                            </CardTitle>
                            <CardDescription className="text-sm pt-3 font-medium text-slate-500">
                                Your organization registration is currently being reviewed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-12">
                            <div className="space-y-8">
                                <p className="text-slate-500 text-sm leading-relaxed font-medium text-center">
                                    Our administrative team is verifying your documentation.
                                    Institutional access will be enabled once the review is complete.
                                </p>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Estimated Review: 24-48 Hours
                                    </span>
                                </div>

                                <div className="pt-4 flex flex-col gap-3">
                                    <Link href="/">
                                        <Button className="w-full h-11 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none transition-all">
                                            <LayoutDashboard className="mr-2.5 h-4 w-4" />
                                            Return Home
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={signOut}
                                        className="w-full h-11 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <LogOut className="mr-2.5 h-4 w-4" />
                                        Sign out
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}

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
        <div className="py-20 flex-1 flex items-center bg-gray-50/50 min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto max-w-lg"
                >
                    <div className="mb-6">
                        <BackButton />
                    </div>

                    <Card className="border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-md">
                        <div className="h-2 bg-amber-400" />
                        <CardHeader className="text-center pt-10 px-8">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                <Clock className="w-10 h-10 animate-pulse" />
                            </div>
                            <CardTitle className="text-3xl font-black text-gray-900 leading-tight">
                                Application Under Review
                            </CardTitle>
                            <CardDescription className="text-lg pt-2 font-medium">
                                Thank you for registering your organization with LokAI.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 px-8 pb-10">
                            <div className="space-y-4 text-center">
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    Our superadmin team is currently reviewing your documentation and organization details.
                                    You will receive an email confirmation once your account is active.
                                </p>
                                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-bold border border-amber-100">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                                    Estimated review: 24-48 hours
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <Link href="/">
                                    <Button className="w-full h-12 font-bold shadow-lg shadow-primary/10">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Return to Dashboard
                                    </Button>
                                </Link>
                                <Button variant="ghost" onClick={signOut} className="w-full h-12 font-bold text-gray-400 hover:text-destructive hover:bg-destructive/5">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}

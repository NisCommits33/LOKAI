"use client"

import { useState } from "react"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { Mail, ArrowRight } from "lucide-react"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
            })
            if (error) throw error

            setSubmitted(true)
            toast.success("Reset link sent to your email")
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset link")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center py-8 bg-white">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-lg"
                >
                    <div className="mb-6">
                        <BackButton />
                    </div>

                    <Card className="shadow-none border border-slate-100 overflow-hidden bg-white">
                        <CardHeader className="text-center pt-8 px-10">
                            <div className="mx-auto w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl mb-4 border border-slate-100">
                                <Mail className="h-6 w-6 text-slate-900" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password?</CardTitle>
                            <CardDescription className="text-base pt-3 font-medium text-slate-500">
                                Enter your email and we'll send you a link to reset your password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-12">
                            {submitted ? (
                                <div className="text-center space-y-6">
                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <p className="text-sm font-bold text-emerald-800">Check your inbox!</p>
                                        <p className="text-xs text-emerald-600 mt-1">We've sent a recovery link to your email address.</p>
                                    </div>
                                    <Button variant="outline" className="w-full h-11 rounded-xl border-slate-100 font-bold text-sm" asChild>
                                        <Link href="/login">Return to Login</Link>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Registered Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            className="h-11 rounded-xl border-slate-100 bg-slate-50/30 focus:bg-white transition-all shadow-none"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-11 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none"
                                        disabled={loading}
                                    >
                                        {loading ? "Sending link..." : (
                                            <span className="flex items-center gap-2">
                                                Send Reset Link
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}

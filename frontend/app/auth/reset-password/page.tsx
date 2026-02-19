"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Lock, ShieldCheck, ArrowRight } from "lucide-react"

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const router = useRouter()

    useEffect(() => {
        // Ensure there is a session (should be provided by the recovery link flow)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error("Session expired or invalid. Please request a new reset link.")
                router.push("/forgot-password")
            }
        }
        checkSession()
    }, [router])

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            toast.success("Password updated successfully")
            router.push("/dashboard")
        } catch (error: any) {
            toast.error(error.message || "Failed to reset password")
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
                    <Card className="shadow-none border border-slate-100 overflow-hidden bg-white">
                        <CardHeader className="text-center pt-8 px-10">
                            <div className="mx-auto w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl mb-4 border border-slate-100">
                                <ShieldCheck className="h-6 w-6 text-slate-900" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Security Update</CardTitle>
                            <CardDescription className="text-base pt-3 font-medium text-slate-500">
                                Create a strong new password for your LokAI account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-12">
                            <form onSubmit={handleReset} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="h-11 rounded-xl border-slate-100 bg-slate-50/30 focus:bg-white transition-all shadow-none pl-10"
                                                required
                                            />
                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="h-11 rounded-xl border-slate-100 bg-slate-50/30 focus:bg-white transition-all shadow-none pl-10"
                                                required
                                            />
                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none"
                                    disabled={loading}
                                >
                                    {loading ? "Updating credentials..." : (
                                        <span className="flex items-center gap-2">
                                            Reset Password
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t border-slate-50 py-6 bg-slate-50/20 text-center px-10">
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[280px]">
                                Password updates are processed immediately.
                                Ensure you use a unique password for this service.
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}

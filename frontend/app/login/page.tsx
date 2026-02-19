"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/AuthProvider"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { ShieldCheck, Mail, Lock, UserCheck, Info } from "lucide-react"

export default function LoginPage() {
    const { signInWithGoogle, setMockRole } = useAuth()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            await signInWithGoogle()
        } catch (error) {
            console.error("Login failed", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOrgLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error

            // Fetch profile to determine role
            const { data: profileData } = await supabase
                .from("users")
                .select("role, verification_status")
                .eq("id", data.user.id)
                .single()

            toast.success("Signed in successfully")

            if (profileData?.role === "org_admin") {
                if (profileData?.verification_status === "verified") {
                    router.push("/organization/dashboard")
                } else {
                    router.push("/organization/pending")
                }
            } else {
                router.push("/dashboard")
            }
        } catch (error: any) {
            toast.error(error.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    const handleMockLogin = (role: string) => {
        setMockRole(role)
        if (role === "super_admin") {
            router.push("/admin")
        } else if (role === "org_admin") {
            router.push("/organization/pending")
        } else {
            router.push("/dashboard")
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
                            <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">LokAI</CardTitle>
                            <CardDescription className="text-base pt-3 font-medium text-slate-500">
                                Sign in to your preparation portal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-12">
                            <Tabs defaultValue="individual" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-slate-50 p-1 rounded-xl">
                                    <TabsTrigger value="individual" className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all focus-visible:ring-0">
                                        Personal
                                    </TabsTrigger>
                                    <TabsTrigger value="organization" className="rounded-lg font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all focus-visible:ring-0">
                                        Organization
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="individual" className="space-y-8 outline-none">
                                    <div className="space-y-6">
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 gap-3 text-sm font-bold border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] shadow-none"
                                            onClick={handleGoogleLogin}
                                            disabled={loading}
                                        >
                                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.5 2.73 2.18 4.99l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            Continue with Google
                                        </Button>

                                        <div className="relative py-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-slate-50" />
                                            </div>
                                            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest text-slate-300">
                                                <span className="bg-white px-4">Sandbox Mode</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {/* <Button variant="secondary" className="h-10 rounded-xl font-bold text-xs bg-slate-50 hover:bg-slate-100 border-none shadow-none" onClick={() => handleMockLogin("public")}>
                                                Public
                                            </Button>
                                            <Button variant="secondary" className="h-10 rounded-xl font-bold text-xs bg-slate-50 hover:bg-slate-100 border-none shadow-none" onClick={() => handleMockLogin("employee")}>
                                                Member
                                            </Button> */}
                                            <Button variant="secondary" className="h-10 rounded-xl font-bold text-[10px] bg-slate-900 text-white hover:bg-black border-none shadow-none" onClick={() => handleMockLogin("super_admin")}>
                                                Super Admin
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="organization" className="outline-none">
                                    <form onSubmit={handleOrgLogin} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Official Email</Label>
                                                <Input id="email" name="email" type="email" placeholder="admin@gov.np" className="h-11 rounded-xl border-slate-100 bg-slate-50/30 focus:bg-white transition-all shadow-none" required />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between pl-1">
                                                    <Label htmlFor="password" title="Organization Admin Password" className="text-xs font-bold text-slate-500 uppercase tracking-widest cursor-help">Password</Label>
                                                    <Link href="/forgot-password" title="Forgot password? Reset here" className="text-[10px] text-slate-400 font-bold hover:text-primary transition-colors">Reset</Link>
                                                </div>
                                                <Input id="password" name="password" type="password" className="h-11 rounded-xl border-slate-100 bg-slate-50/30 focus:bg-white transition-all shadow-none" required />
                                            </div>
                                            <Button type="submit" className="w-full h-11 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none mt-2" disabled={loading}>
                                                {loading ? "Verifying..." : "Enter Portal"}
                                            </Button>
                                        </div>

                                        <div className="text-center pt-2">
                                            <p className="text-[11px] text-slate-400 font-medium">
                                                New organization?{" "}
                                                <Link href="/register/organization" className="text-slate-900 font-bold hover:underline">
                                                    Apply for Access
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t border-slate-50 py-6 bg-slate-50/20 text-center px-10">
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[280px]">
                                Your data is secured with institutional grade encryption protocols.
                                Authorized for Lok Sewa preparation assistance.
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}

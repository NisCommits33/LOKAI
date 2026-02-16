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
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            toast.success("Signed in successfully")
            router.push("/dashboard")
        } catch (error: any) {
            toast.error(error.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    const handleMockLogin = (role: string) => {
        setMockRole(role)
        router.push("/dashboard")
    }

    return (
        <div className="flex min-h-[calc(100vh-16rem)] items-center py-12 bg-gray-50/50">
            <Container>
                <div className="mx-auto max-w-xl">
                    <Card className="shadow-2xl border-none">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-4xl font-black text-primary tracking-tight">LokAI</CardTitle>
                            <CardDescription className="text-base">
                                Your AI-powered companion for Lok Sewa preparation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="individual" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1">
                                    <TabsTrigger value="individual" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                                        Individual
                                    </TabsTrigger>
                                    <TabsTrigger value="organization" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                                        Organization
                                    </TabsTrigger>
                                </TabsList>

                                {/* Individual Login */}
                                <TabsContent value="individual" className="space-y-6">
                                    <div className="text-center space-y-2 mb-6">
                                        <h3 className="text-xl font-bold">Welcome Back</h3>
                                        <p className="text-sm text-gray-500">Sign in with your Google account to access your materials.</p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full h-14 gap-3 text-lg font-semibold shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                    >
                                        <svg className="h-6 w-6" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.5 2.73 2.18 4.99l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </Button>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-muted-foreground">Rapid Testing</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => handleMockLogin("public")}>Public User</Button>
                                        <Button variant="secondary" size="sm" onClick={() => handleMockLogin("employee")}>Employee</Button>
                                    </div>
                                </TabsContent>

                                {/* Organization Login */}
                                <TabsContent value="organization">
                                    <form onSubmit={handleOrgLogin} className="space-y-4">
                                        <div className="text-center space-y-2 mb-6">
                                            <h3 className="text-xl font-bold">Admin Portal</h3>
                                            <p className="text-sm text-gray-500">Manage your official resources and employee verifications.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Admin Email</Label>
                                                <Input id="email" name="email" type="email" placeholder="admin@org.gov.np" required />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password">Password</Label>
                                                    <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                                </div>
                                                <Input id="password" name="password" type="password" required />
                                            </div>
                                            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                                                {loading ? "Signing in..." : "Sign In to Admin Dashboard"}
                                            </Button>
                                        </div>

                                        <div className="pt-4 text-center text-sm">
                                            <p className="text-gray-500">
                                                Interested in LokAI for your office?{" "}
                                                <Link href="/register/organization" className="text-primary font-bold hover:underline">
                                                    Apply for registration
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t py-6 bg-gray-50 text-center rounded-b-xl px-12">
                            <p className="text-xs text-gray-400 leading-relaxed">
                                By signing in, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                                LokAI is a secure platform authorized for government preparation assistance.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </Container>
        </div>
    )
}

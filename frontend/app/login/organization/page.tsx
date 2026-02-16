"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function OrganizationLoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // Redirection logic will be handled by the AuthProvider or a separate effect
            toast.success("Signed in successfully")
            router.push("/dashboard")
        } catch (error: any) {
            toast.error(error.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="py-20 bg-gray-50 flex-1 flex items-center">
            <Container>
                <div className="mx-auto max-w-md">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-primary">Admin Portal</CardTitle>
                            <CardDescription>
                                Sign in to manage your organization and employees
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Admin Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="admin@org.gov.np" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button type="submit" className="w-full h-12" disabled={loading}>
                                    {loading ? "Signing in..." : "Sign In to Dashboard"}
                                </Button>
                                <div className="text-center text-sm">
                                    <span className="text-gray-500">Not registered? </span>
                                    <Link href="/register/organization" className="text-primary font-medium hover:underline">
                                        Apply here
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </Container>
        </div>
    )
}

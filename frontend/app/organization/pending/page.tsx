"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"

export default function OrganizationPendingPage() {
    const { signOut } = useAuth()

    return (
        <div className="py-20 flex-1 flex items-center">
            <Container>
                <div className="mx-auto max-w-lg text-center">
                    <Card className="border-warning/50 bg-warning/5 py-8">
                        <CardHeader>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/20 text-warning">
                                <span className="text-3xl">⏳</span>
                            </div>
                            <CardTitle className="text-2xl font-bold text-warning-900">Application Under Review</CardTitle>
                            <CardDescription className="text-gray-700">
                                Thank you for registering your organization with LokAI.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Our superadmin team is currently reviewing your documentation and organization details.
                                You will receive an email confirmation once your account is active.
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                                Estimated review time: 24 - 48 hours.
                            </p>

                            <div className="pt-6 flex flex-col gap-3">
                                <Link href="/">
                                    <Button variant="outline" className="w-full">
                                        Return to Home
                                    </Button>
                                </Link>
                                <Button variant="ghost" onClick={signOut} className="text-gray-500 underline">
                                    Sign out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </div>
    )
}

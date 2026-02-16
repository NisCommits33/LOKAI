"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"
import Link from "next/link"

export default function DashboardPage() {
    const { user, profile, loading } = useAuth()

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
        </div>
    )

    const isVerified = profile?.verification_status === 'verified'
    const isOrgAdmin = profile?.role === 'org_admin'
    const isSuperAdmin = profile?.role === 'super_admin'

    return (
        <div className="py-8 bg-gray-50 flex-1">
            <Container className="space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Namaste, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
                        </h1>
                        <p className="text-gray-500">Welcome to your preparation dashboard.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/quizzes">
                            <Button>Take a GK Quiz</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Public Features */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="mb-2 text-3xl">📚</div>
                            <CardTitle>GK Preparation</CardTitle>
                            <CardDescription>General Knowledge quizzes across all categories.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/quizzes">
                                <Button variant="secondary" className="w-full">Open GK Lab</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="mb-2 text-3xl">📄</div>
                            <CardTitle>AI Document Lab</CardTitle>
                            <CardDescription>Upload your own PDF/Image and generate quizzes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/documents/personal">
                                <Button variant="secondary" className="w-full">Manage Documents</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Verification-Locked Features */}
                    <Card className={`relative overflow-hidden transition-all duration-300 ${!isVerified ? 'opacity-75 grayscale' : 'hover:shadow-md'}`}>
                        {!isVerified && !isOrgAdmin && !isSuperAdmin && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] p-6 text-center">
                                <div className="mb-2 rounded-full bg-primary/10 p-2 text-primary">
                                    <span className="text-xl">🔒</span>
                                </div>
                                <p className="text-xs font-bold text-primary uppercase mb-1">Employee Only</p>
                                <p className="text-[10px] text-gray-600">Verification required for organizational documents.</p>
                            </div>
                        )}
                        <CardHeader>
                            <div className="mb-2 text-3xl">🏛️</div>
                            <CardTitle>Org Resources</CardTitle>
                            <CardDescription>Official government policies and organizational study kits.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full" disabled={!isVerified && !isOrgAdmin}>
                                Explore Resources
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Admin Section */}
                {(isOrgAdmin || isSuperAdmin) && (
                    <div className="mt-12 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Administration</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-lg">Management Console</CardTitle>
                                    <CardDescription>Manage departments, employees, and official resources.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Link href="/admin">
                                        <Button variant="default" className="w-full">Open Console</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    )
}

"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/AuthProvider"
import { VERIFICATION_STATUS } from "@/lib/constants"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Building, Mail, ArrowRight } from "lucide-react"

export default function ProfilePage() {
    const { user, profile, loading } = useAuth()

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )

    const isVerified = profile?.verification_status === VERIFICATION_STATUS.VERIFIED
    const isPending = profile?.verification_status === VERIFICATION_STATUS.PENDING

    return (
        <div className="py-12 bg-gray-50 flex-1">
            <Container>
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
                        <p className="text-gray-500">Manage your profile and organizational verification.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-none shadow-md overflow-hidden">
                                <CardHeader className="text-center pb-2">
                                    <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-lg">
                                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                                        <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                                            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="mt-4">
                                        <CardTitle className="capitalize">{user?.user_metadata?.full_name || 'User'}</CardTitle>
                                        <CardDescription>{user?.email}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Shield className="h-4 w-4 text-gray-400" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600 capitalize">{profile?.role || 'Guest'}</span>
                                            {isVerified && (
                                                <Badge variant="success" className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0 text-[10px]">VERIFIED</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Verification Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="flex items-center gap-2">
                                                <Building className="h-5 w-5 text-primary" />
                                                Organizational Status
                                            </CardTitle>
                                            <CardDescription>Verify your employee status to access exclusive govt. materials.</CardDescription>
                                        </div>
                                        {isVerified ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none py-1">Active</Badge>
                                        ) : isPending ? (
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none py-1 text-[10px]">Verification Pending</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-400 py-1">Unverified</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {isVerified ? (
                                        <div className="rounded-lg bg-green-50 p-6 flex items-start gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-green-900">Successfully Verified</h4>
                                                <p className="text-sm text-green-700 leading-relaxed">
                                                    You are currently a verified member of <strong>{profile.organizations?.name || 'your office'}</strong>.
                                                    You have full access to internal quizzes and official documents.
                                                </p>
                                            </div>
                                        </div>
                                    ) : isPending ? (
                                        <div className="rounded-lg bg-amber-50 p-6 flex items-start gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                                <ArrowRight className="h-5 w-5 animate-pulse" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-amber-900">Verification in Progress</h4>
                                                <p className="text-sm text-amber-700 leading-relaxed">
                                                    Your request with ID <strong>{profile?.employee_id}</strong> is being manually reviewed by the office administrator.
                                                    Please wait 1-2 business days for a response.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
                                                <div className="h-12 w-12 mx-auto rounded-full bg-gray-50 text-gray-400 flex items-center justify-center">
                                                    <Building className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-900">Not connected to any organization</p>
                                                    <p className="text-xs text-gray-500 px-4">Connecting your account allows you to prepare using department-specific materials and official past papers.</p>
                                                </div>
                                                <Link href="/profile/verify" className="inline-block mt-2">
                                                    <Button variant="default" className="font-bold">
                                                        Start Verification
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="bg-gray-50/50 border-t px-6 py-4">
                                    <p className="text-[11px] text-gray-400">
                                        For security reasons, once verified, your organization cannot be changed without administrator assistance.
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/AuthProvider"
import { VERIFICATION_STATUS } from "@/lib/constants"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Building, Mail, ArrowRight, ShieldCheck, Clock, AlertCircle, Settings } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"

export default function ProfilePage() {
    const { user, profile, loading } = useAuth()

    if (loading) return (
        <div className="flex-1 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Loading Identity</p>
            </div>
        </div>
    )

    const isVerified = profile?.verification_status === VERIFICATION_STATUS.VERIFIED
    const isPending = profile?.verification_status === VERIFICATION_STATUS.PENDING

    return (
        <div className="py-8 bg-white flex-1 min-h-screen">
            <Container>
                <div className="max-w-5xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <BackButton />
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Identity Hub</h1>
                            <p className="text-slate-500 text-lg font-medium mt-1">Manage your professional profile and organizational verification.</p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Profile Info Card - Minimalist */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-4"
                        >
                            <Card className="border border-slate-100 shadow-none bg-white overflow-hidden sticky top-28">
                                <div className="h-20 bg-slate-900" />
                                <CardHeader className="text-center -mt-10 pb-4">
                                    <div className="relative inline-block mx-auto">
                                        <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                                            <AvatarFallback className="text-2xl font-bold bg-slate-50 text-slate-400">
                                                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isVerified && (
                                            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                                                <ShieldCheck className="h-5 w-5 text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <CardTitle className="text-xl font-bold text-slate-900 capitalize leading-snug">
                                            {user?.user_metadata?.full_name || 'Active User'}
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 font-bold text-xs mt-1">{user?.email}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 px-8 pb-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Details</p>
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all group">
                                            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-50">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Email</p>
                                                <p className="text-sm font-bold text-slate-900 truncate max-w-[160px]">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all group">
                                            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-50">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Role</p>
                                                <p className="text-sm font-bold text-slate-900 capitalize">{profile?.role?.replace('_', ' ') || 'Guest'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-slate-50/30 p-6 border-t border-slate-100">
                                    <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-lg">
                                        Edit Profile
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>

                        {/* Status Sections - Minimalist */}
                        <div className="lg:col-span-8 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Card className="border border-slate-100 shadow-none bg-white overflow-hidden">
                                    <CardHeader className="p-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="inline-flex items-center gap-2 text-slate-900">
                                                <Building className="h-5 w-5" />
                                                <h2 className="text-lg font-bold tracking-tight">Workplace Connection</h2>
                                            </div>
                                            {isVerified ? (
                                                <Badge variant="secondary" className="bg-green-50 text-green-700 font-bold border-none text-[9px] uppercase px-3">Verified</Badge>
                                            ) : isPending ? (
                                                <Badge variant="secondary" className="bg-amber-50 text-amber-700 font-bold border-none text-[9px] uppercase px-3">Pending</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-50 text-slate-400 font-bold border-none text-[9px] uppercase px-3">Not Linked</Badge>
                                            )}
                                        </div>
                                        <CardDescription className="text-sm font-medium pt-2">Verify organizational identity to unlock  resources.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-10 pt-0">
                                        {isVerified ? (
                                            <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 flex flex-col sm:flex-row items-center gap-8">
                                                <div className="h-16 w-16 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                                    <Building className="h-8 w-8" />
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Affiliated Organization</p>
                                                    <h3 className="text-xl font-bold text-slate-900">{profile.organizations?.name || 'Verified Workplace'}</h3>
                                                    <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">Full Access</span>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase border border-slate-100">Standard Member</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : isPending ? (
                                            <div className="bg-slate-50/50 rounded-2xl p-10 border border-slate-100 text-center space-y-6">
                                                <div className="h-16 w-16 rounded-xl bg-white flex items-center justify-center text-amber-500 mx-auto border border-slate-100 shadow-sm">
                                                    <Clock className="h-8 w-8 animate-pulse" />
                                                </div>
                                                <div className="max-w-md mx-auto space-y-1">
                                                    <h3 className="text-xl font-bold text-slate-900">Application Pending</h3>
                                                    <p className="text-sm text-slate-500 font-medium">Your request (ID: {profile?.employee_id}) is under manual review.</p>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4">Estimated response: 24h</p>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-6 group hover:border-slate-300 transition-colors">
                                                <div className="h-14 w-14 mx-auto rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-colors">
                                                    <ShieldCheck className="h-7 w-7" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-bold text-slate-900">Institutional Onboarding</p>
                                                    <p className="text-sm font-medium text-slate-500">Connect to unlock past papers and ministerial handouts.</p>
                                                </div>
                                                <Link href="/profile/verify" className="inline-block pt-2">
                                                    <Button className="h-11 px-8 text-xs font-bold uppercase tracking-widest rounded-xl bg-slate-900 text-white shadow-none hover:bg-slate-800 transition-all">
                                                        Start Verification
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="bg-slate-50/30 border-t border-slate-50 px-8 py-4">
                                        <div className="flex items-center gap-2 text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                                            <Shield className="h-3 w-3" />
                                            Administrative verification is required for all ministerial materials.
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>

                            {/* Additional Actions - Minimalist */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                <Card className="border border-slate-100 shadow-none p-5 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer transition-all rounded-xl group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:text-slate-900 transition-colors">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Activity Logs</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Quiz History</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
                                </Card>
                                <Card className="border border-slate-100 shadow-none p-5 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer transition-all rounded-xl group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:text-slate-900 transition-colors">
                                            <Settings className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Preferences</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Account & Security</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

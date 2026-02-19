"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/AuthProvider"
import { VERIFICATION_STATUS, ROLES } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    Shield,
    Building,
    Mail,
    ArrowRight,
    ShieldCheck,
    Clock,
    Settings,
    FileText,
    Users as UsersIcon,
    Calendar,
    Hash
} from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export default function OrganizationProfilePage() {
    const { user, profile, loading } = useAuth()
    const [orgData, setOrgData] = useState<any>(null)
    const [stats, setStats] = useState({
        members: 0,
        documents: 0
    })

    useEffect(() => {
        const fetchData = async () => {
            if (profile?.organization_id) {
                // Fetch Org Details
                const { data: org } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('id', profile.organization_id)
                    .single()

                if (org) setOrgData(org)

                // Fetch Stats (Mock for now, will be real in later sprints)
                const { count: memberCount } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('organization_id', profile.organization_id)

                setStats({
                    members: memberCount || 0,
                    documents: 12 // Placed holder until doc system is in
                })
            }
        }

        if (!loading && profile?.role === ROLES.ORG_ADMIN) {
            fetchData()
        }
    }, [profile, loading])

    if (loading) return (
        <div className="flex-1 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Loading Identity</p>
            </div>
        </div>
    )

    const isVerified = profile?.verification_status === VERIFICATION_STATUS.VERIFIED

    return (
        <div className="py-8 bg-white flex-1 min-h-screen">
            <Container>
                <div className="max-w-6xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <BackButton />
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Institutional Profile</h1>
                                <p className="text-slate-500 text-lg font-medium mt-1">Institutional verification and administrative management.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {isVerified ? (
                                    <Badge className="bg-green-50 text-green-700 border-green-100 px-4 py-1.5 rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center gap-2">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Verified Institution
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-50 text-amber-700 border-amber-100 px-4 py-1.5 rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5" />
                                        Approval Pending
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Admin Identity Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-4"
                        >
                            <Card className="border border-slate-100 shadow-none bg-white overflow-hidden sticky top-28">
                                <div className="h-24 bg-slate-900" />
                                <CardHeader className="text-center -mt-12 pb-4">
                                    <div className="relative inline-block mx-auto">
                                        <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                                            <AvatarFallback className="text-2xl font-bold bg-slate-50 text-slate-400">
                                                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="mt-4">
                                        <CardTitle className="text-xl font-bold text-slate-900 capitalize leading-snug">
                                            {user?.user_metadata?.full_name || 'Admin'}
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 font-bold text-xs mt-1">Official Portal Administrator</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 px-8 pb-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Info</p>
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all group">
                                            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-50">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Email</p>
                                                <p className="text-sm font-bold text-slate-900 truncate max-w-[160px]">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest rounded-xl h-11 border-slate-100 hover:bg-slate-50">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Edit Identity
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Institutional Details */}
                        <div className="lg:col-span-8 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="border border-slate-100 shadow-none bg-white overflow-hidden">
                                    <CardHeader className="p-8 border-b border-slate-50">
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <Building className="h-5 w-5" />
                                            <h2 className="text-lg font-bold tracking-tight">Institutional Identity</h2>
                                        </div>
                                        <CardDescription className="text-sm font-medium pt-2 text-slate-400 uppercase tracking-widest text-[10px]">Registry metadata for {orgData?.name}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Building className="h-3 w-3" />
                                                    Organization Name
                                                </div>
                                                <p className="text-sm font-bold text-slate-900">{orgData?.name || 'Loading...'}</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Hash className="h-3 w-3" />
                                                    Industry / Org Code
                                                </div>
                                                <p className="text-sm font-bold text-slate-900">{orgData?.code || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Mail className="h-3 w-3" />
                                                    Official Email
                                                </div>
                                                <p className="text-sm font-bold text-slate-900">{orgData?.contact_email || user?.email}</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3" />
                                                    Registration Date
                                                </div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {orgData?.created_at ? new Date(orgData.created_at).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    {isVerified && (
                                        <CardFooter className="bg-slate-50/50 p-6 flex items-center justify-between border-t border-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Status</p>
                                                    <p className="text-sm font-bold text-slate-900">Institutional Access Live</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-primary font-bold text-[10px] uppercase tracking-widest hover:bg-primary/5">
                                                Update Registry
                                                <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                            </Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                <Card className="border border-slate-100 shadow-none bg-white p-6 rounded-2xl flex items-center justify-between group hover:border-slate-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:text-slate-900 transition-colors">
                                            <UsersIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900">{stats.members}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Total Members</p>
                                        </div>
                                    </div>
                                    <Link href="/organization/members">
                                        <Button size="icon" variant="ghost" className="rounded-full text-slate-300 group-hover:text-slate-900 transition-colors">
                                            <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </Card>
                                <Card className="border border-slate-100 shadow-none bg-white p-6 rounded-2xl flex items-center justify-between group hover:border-slate-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:text-slate-900 transition-colors">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900">{stats.documents}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Shared Materials</p>
                                        </div>
                                    </div>
                                    <Link href="/organization/documents">
                                        <Button size="icon" variant="ghost" className="rounded-full text-slate-300 group-hover:text-slate-900 transition-colors">
                                            <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

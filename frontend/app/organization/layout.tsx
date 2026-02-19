"use client"

import { Container } from "@/components/layout/Container"
import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    Users,
    Files,
    Settings,
    LogOut,
    Building2,
    ShieldCheck,
    User,
    CreditCard
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
    const { profile, loading, signOut, user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [orgName, setOrgName] = useState<string>("")

    useEffect(() => {
        const fetchOrgName = async () => {
            if (profile?.organization_id) {
                const { data } = await supabase
                    .from('organizations')
                    .select('name')
                    .eq('id', profile.organization_id)
                    .single()

                if (data) setOrgName(data.name)
            }
        }

        if (!loading) {
            if (!profile || profile.role !== 'org_admin') {
                router.push('/dashboard')
            } else if (profile.verification_status !== 'verified') {
                router.push('/organization/pending')
            } else {
                fetchOrgName()
            }
        }
    }, [profile, loading, router])

    if (loading || !profile || profile.role !== 'org_admin' || profile.verification_status !== 'verified') {
        return (
            <div className="flex-1 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Verifying Authority</p>
                </div>
            </div>
        )
    }

    const navigation = [
        { name: "Dashboard", href: "/organization/dashboard", icon: LayoutDashboard },
        { name: "Members", href: "/organization/members", icon: Users },
        { name: "Shared Documents", href: "/organization/documents", icon: Files },
        { name: "Settings", href: "/organization/settings", icon: Settings },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/30">
            {/* Sub-header Navigation */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <Container>
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                                <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]">
                                        {orgName || "Portal"}
                                    </span>
                                    {orgName && <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Logged Institution</span>}
                                </div>
                            </div>
                            <nav className="flex items-center gap-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${isActive
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <item.icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                                <div className="flex flex-col items-end">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Verified Admin</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Portal Access</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                            </div>

                            {/* User Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                                            <AvatarFallback className="bg-slate-100 text-slate-500 text-[10px] font-bold">
                                                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2 p-1.5 rounded-xl border-slate-100 shadow-xl" align="end">
                                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Account Management</DropdownMenuLabel>
                                    <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-lg font-medium text-sm focus:bg-slate-50" asChild>
                                        <Link href="/profile" className="flex items-center">
                                            <User className="mr-2.5 h-4 w-4 text-slate-400" />
                                            Account Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-lg font-medium text-sm focus:bg-slate-50">
                                        <CreditCard className="mr-2.5 h-4 w-4 text-slate-400" />
                                        Billing & Subscription
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                    <DropdownMenuItem
                                        className="cursor-pointer py-2 px-3 rounded-lg font-medium text-sm text-red-500 focus:bg-red-50 focus:text-red-500"
                                        onClick={signOut}
                                    >
                                        <LogOut className="mr-2.5 h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                onClick={signOut}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50/30 text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Content Area */}
            <main className="flex-1 py-8">
                {children}
            </main>
        </div>
    )
}

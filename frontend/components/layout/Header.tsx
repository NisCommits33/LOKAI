"use client"

import { Button } from "@/components/ui/button"
import { Container } from "./Container"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"
import { ROLES } from "@/lib/constants"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, LogOut, User, CreditCard, Sparkles } from "lucide-react"
import { toast } from "react-hot-toast"

import { usePathname } from "next/navigation"

export function Header() {
    const { user, profile, signOut } = useAuth()
    const pathname = usePathname()

    // Hide header in organization portal routes to avoid duplicates
    if (pathname.startsWith("/organization")) {
        return null
    }

    const handleFeatureClick = (e: React.MouseEvent, feature: string) => {
        if (feature === "Library" || feature === "Subscription") {
            e.preventDefault()
            toast.success(`${feature} module is coming soon!`, {
                style: {
                    borderRadius: '12px',
                    background: '#18181b',
                    color: '#fff',
                    fontSize: '14px',
                },
            })
        }
    }

    return (
        <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary">
                                LokAI
                            </span>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-1">
                            {user ? (
                                <>
                                    <Link
                                        href={profile?.role === ROLES.ORG_ADMIN ? "/organization/dashboard" : "/dashboard"}
                                        className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link href="/quizzes" className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">Practice</Link>
                                    {profile?.role === ROLES.SUPER_ADMIN && (
                                        <Link href="/admin" className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">System Admin</Link>
                                    )}
                                    {profile?.role !== ROLES.PUBLIC && (
                                        <Link
                                            href="/library"
                                            onClick={(e) => handleFeatureClick(e, "Library")}
                                            className="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all flex items-center gap-1.5"
                                        >
                                            Library
                                            <Sparkles className="h-3 w-3 text-amber-500" />
                                        </Link>
                                    )}
                                    <Link href="/pricing" className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">Pricing</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/#features" className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">Features</Link>
                                    <Link href="/pricing" className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">Pricing</Link>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                                            <AvatarFallback className="bg-slate-100 text-slate-500 text-xs font-bold">
                                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden sm:block text-left mr-1">
                                            <p className="text-xs font-bold text-slate-900 leading-none capitalize truncate max-w-[100px]">
                                                {user.user_metadata?.full_name || 'User'}
                                            </p>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2 p-1.5 rounded-xl border-slate-100 shadow-xl" align="end" forceMount>
                                    <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-lg font-medium text-sm focus:bg-slate-50" asChild>
                                        <Link href={profile?.role === ROLES.ORG_ADMIN ? "/organization/dashboard" : "/dashboard"} className="flex items-center">
                                            <LayoutDashboard className="mr-2.5 h-4 w-4 text-slate-400" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-lg font-medium text-sm focus:bg-slate-50" asChild>
                                        <Link href="/profile" className="flex items-center">
                                            <User className="mr-2.5 h-4 w-4 text-slate-400" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer py-2 px-3 rounded-lg font-medium text-sm focus:bg-slate-50" onClick={(e) => handleFeatureClick(e, "Subscription")}>
                                        <CreditCard className="mr-2.5 h-4 w-4 text-slate-400" />
                                        Billing
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
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" className="font-semibold text-slate-500 hover:text-slate-900 rounded-xl h-9 px-4">Sign In</Button>
                                </Link>
                                <Link href="/login">
                                    <Button className="font-semibold px-5 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-none">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    )
}

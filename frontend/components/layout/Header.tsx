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
import { LayoutDashboard, LogOut, User, CreditCard } from "lucide-react"

export function Header() {
    const { user, profile, signOut } = useAuth()

    return (
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-primary hover:opacity-80 transition-opacity">
                            LokAI<span className="text-gray-400">.</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="px-3 py-2 text-sm font-semibold text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-all">Dashboard</Link>
                                    <Link href="/quizzes" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">GK Quizzes</Link>
                                    {profile?.role !== ROLES.PUBLIC && (
                                        <Link href="/library" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Library</Link>
                                    )}
                                    <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Pricing</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/#features" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Features</Link>
                                    <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Pricing</Link>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-primary/10">
                                        <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary/20 transition-all">
                                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold leading-none capitalize">{user.user_metadata?.full_name || 'User'}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link href="/dashboard">
                                        <DropdownMenuItem className="cursor-pointer py-2">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/profile">
                                        <DropdownMenuItem className="cursor-pointer py-2">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile Settings</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/pricing">
                                        <DropdownMenuItem className="cursor-pointer py-2">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>Subscription</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50" onClick={signOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="hidden sm:block">
                                    <Button variant="ghost" className="font-bold">Sign In</Button>
                                </Link>
                                <Link href="/login">
                                    <Button className="font-bold px-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    )
}

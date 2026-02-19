"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useRouter, usePathname } from "next/navigation"
import { ROLES, VERIFICATION_STATUS } from "@/lib/constants"

interface AuthContextType {
    user: User | null
    profile: any | null
    loading: boolean
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
    setMockRole: (role: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSynchronizing, setIsSynchronizing] = useState(false)
    const initialized = useRef(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        const initializeAuth = async () => {
            try {
                // 1. Get current session
                const { data: { session } } = await supabase.auth.getSession()
                const currentUser = session?.user ?? null
                setUser(currentUser)

                if (currentUser) {
                    // Wait for profile sync during initial load
                    await synchronizeProfile(currentUser)
                }

                setLoading(false)
            } catch (err) {
                console.error("Auth initialization failed:", err)
                setLoading(false)
            }
        }

        initializeAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user ?? null
                setUser(currentUser)

                if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    if (currentUser && !profile) {
                        setLoading(true)
                        synchronizeProfile(currentUser).then(() => setLoading(false))
                    }
                } else if (event === 'SIGNED_OUT') {
                    setProfile(null)
                    setUser(null)
                }

                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const synchronizeProfile = async (user: User) => {
        if (isSynchronizing) return
        setIsSynchronizing(true)

        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single()

            if (error && error.code === 'PGRST116') {
                const metadataRole = user.user_metadata?.role
                const isOrgAdmin = metadataRole === ROLES.ORG_ADMIN || metadataRole === 'org_admin'

                const newProfile = {
                    id: user.id,
                    email: user.email!,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
                    avatar_url: user.user_metadata?.avatar_url || null,
                    role: isOrgAdmin ? ROLES.ORG_ADMIN : ROLES.PUBLIC,
                    verification_status: isOrgAdmin ? VERIFICATION_STATUS.PENDING : VERIFICATION_STATUS.PUBLIC
                }

                const { data: created } = await supabase
                    .from("users")
                    .insert(newProfile)
                    .select()
                    .single()

                if (created) setProfile(created)
            } else if (data) {
                setProfile(data)
            }
        } catch (err) {
            console.error("Profile sync failed:", err)
        } finally {
            setIsSynchronizing(false)
        }
    }

    const refreshProfile = async () => {
        if (user) {
            await synchronizeProfile(user)
        }
    }

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setProfile(null)
        setUser(null)
        router.push('/')
    }

    const setMockRole = (role: string) => {
        setProfile((prev: any) => ({
            ...prev,
            role,
            verification_status: role === ROLES.PUBLIC ? VERIFICATION_STATUS.PUBLIC : VERIFICATION_STATUS.VERIFIED
        }))
    }

    // Loader logic: only block if not on home page and still loading user
    if (loading && pathname !== '/') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signInWithGoogle,
                signOut,
                refreshProfile,
                setMockRole
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

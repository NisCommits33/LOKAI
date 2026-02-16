"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { error } = await supabase.auth.getSession()
            if (error) {
                console.error("Error during auth callback", error)
                router.push("/login?error=callback_failed")
            } else {
                router.push("/dashboard")
            }
        }

        handleAuthCallback()
    }, [router])

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
}

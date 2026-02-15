import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check if user has a profile in public.users
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('id, verification_status')
                    .eq('id', user.id)
                    .single()

                // If no profile exists, send them to onboarding
                if (!profile) {
                    return NextResponse.redirect(`${origin}/profile/setup`)
                }

                // If profile is pending, send to pending page
                if (profile.verification_status === 'pending') {
                    return NextResponse.redirect(`${origin}/pending-approval`)
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // useful for production
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                // we can be loose with redirect in dev
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

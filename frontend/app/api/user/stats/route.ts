import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

async function getAuthenticatedUser(request: NextRequest) {
    const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) return { error: "Unauthorized", status: 401 }

    const { data: { user }, error: authError } = await anonClient.auth.getUser(token)
    if (authError || !user) return { error: "Unauthorized", status: 401 }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    return { supabase, user }
}

export async function GET(request: NextRequest) {
    const result = await getAuthenticatedUser(request)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

    const { supabase, user } = result

    try {
        const { data, error } = await supabase
            .from("user_stats")
            .select("*")
            .eq("user_id", user.id)
            .single()

        if (error && error.code !== 'PGRST116') throw error // Ignore "not found" as we can return defaults

        if (!data) {
            // Return default stats if no record exists yet
            return NextResponse.json({
                user_id: user.id,
                readiness_score: 0,
                quizzes_completed: 0,
                total_correct_answers: 0,
                total_questions_attempted: 0,
                average_score_percentage: 0,
                weak_areas: [],
                recommendations: []
            })
        }

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

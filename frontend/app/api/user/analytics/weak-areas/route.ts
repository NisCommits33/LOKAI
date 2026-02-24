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
        // Fetch last 50 quiz attempts to analyze performance by category/document
        const { data: attempts, error } = await supabase
            .from("quiz_attempts")
            .select("source_id, source_type, score_percentage, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50)

        if (error) throw error

        if (!attempts || attempts.length === 0) {
            return NextResponse.json([])
        }

        // Logic to group by source and find areas where score < 70%
        const analyticsMap: Record<string, { count: number, totalScore: number, type: string }> = {}

        attempts.forEach(attempt => {
            if (!analyticsMap[attempt.source_id]) {
                analyticsMap[attempt.source_id] = { count: 0, totalScore: 0, type: attempt.source_type }
            }
            analyticsMap[attempt.source_id].count++
            analyticsMap[attempt.source_id].totalScore += Number(attempt.score_percentage)
        })

        const weakAreas = Object.entries(analyticsMap)
            .map(([sourceId, stats]) => ({
                source_id: sourceId,
                source_type: stats.type,
                average_score: stats.totalScore / stats.count,
                attempts: stats.count
            }))
            .filter(area => area.average_score < 70) // Threshold for "weak"
            .sort((a, b) => a.average_score - b.average_score)

        return NextResponse.json(weakAreas)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

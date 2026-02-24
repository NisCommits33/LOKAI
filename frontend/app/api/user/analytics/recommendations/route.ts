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
        // 1. Get weak areas from the analysis API (internal logic reuse)
        const { data: profile } = await supabase
            .from("users")
            .select("organization_id, department_id, job_level_id")
            .eq("id", user.id)
            .single()

        if (!profile) throw new Error("User profile not found")

        // 2. Fetch documents the user hasn't attempted yet or where they are weak
        // First, get all documents targeted to this user
        let docQuery = supabase
            .from("organization_documents")
            .select("id, title, description, source_type:section_tag") // source_type as a hint
            .eq("organization_id", profile.organization_id)
            .eq("processing_status", "completed")

        if (profile.department_id) {
            docQuery = docQuery.or(`department_id.is.null,department_id.eq.${profile.department_id}`)
        } else {
            docQuery = docQuery.is("department_id", null)
        }

        const { data: availableDocs, error: docError } = await docQuery.limit(20)
        if (docError) throw docError

        // 3. Get user's quiz attempts to see what they've already mastered
        const { data: attempts } = await supabase
            .from("quiz_attempts")
            .select("source_id, score_percentage")
            .eq("user_id", user.id)

        const masteredDocIds = new Set(
            (attempts || [])
                .filter(a => Number(a.score_percentage) >= 90)
                .map(a => a.source_id)
        )

        const weakDocIds = new Set(
            (attempts || [])
                .filter(a => Number(a.score_percentage) < 70)
                .map(a => a.source_id)
        )

        // 4. Generate recommendations
        const recommendations = availableDocs
            ?.map(doc => {
                if (weakDocIds.has(doc.id)) {
                    return {
                        ...doc,
                        priority: "high",
                        reason: "Needs improvement (Previous score < 70%)"
                    }
                }
                if (!masteredDocIds.has(doc.id)) {
                    return {
                        ...doc,
                        priority: "medium",
                        reason: "New material targeted for your profile"
                    }
                }
                return null
            })
            .filter(Boolean)
            .sort((a: any, b: any) => (a.priority === 'high' ? -1 : 1))
            .slice(0, 5)

        return NextResponse.json(recommendations || [])
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

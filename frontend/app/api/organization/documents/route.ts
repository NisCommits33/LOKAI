import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: { user }, error: authError } = await anonClient.auth.getUser(token)
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: profile } = await supabase
        .from("users")
        .select("organization_id, role, department_id, job_level_id")
        .eq("id", user.id)
        .single()

    if (!profile?.organization_id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    try {
        let query = supabase
            .from("organization_documents")
            .select("*")
            .eq("organization_id", profile.organization_id)

        // Filter for non-admin users
        if (profile.role !== "org_admin") {
            // Document is visible if (it's for everyone) OR (it matches user's department) OR (it matches user's job level)
            // Wait, usually it's "if targeted, must match". 
            // If department_id is set, it must match profile.department_id.
            // If job_level_id is set, it must match profile.job_level_id.

            if (profile.department_id) {
                // Documents that are either for all depts or specifically for this user's dept
                query = query.or(`department_id.is.null,department_id.eq.${profile.department_id}`)
            } else {
                // User has no dept, only show docs with no dept restriction
                query = query.is("department_id", null)
            }

            if (profile.job_level_id) {
                query = query.or(`job_level_id.is.null,job_level_id.eq.${profile.job_level_id}`)
            } else {
                query = query.is("job_level_id", null)
            }
        }

        const { data: documents, error } = await query.order("created_at", { ascending: false })
        if (error) throw error

        // 2. Fetch user's successful attempts for organization documents
        const { data: attempts } = await supabase
            .from("quiz_attempts")
            .select("source_id, score_percentage")
            .eq("user_id", user.id)
            .eq("source_type", "organization")
            .gte("score_percentage", 80) // Consider 80% as completed

        const completedIds = new Set(attempts?.map(a => a.source_id) || [])

        // 3. Map completion status
        const enrichedDocuments = documents?.map(doc => ({
            ...doc,
            is_completed: completedIds.has(doc.id)
        }))

        return NextResponse.json(enrichedDocuments)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: { user }, error: authError } = await anonClient.auth.getUser(token)
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: profile } = await supabase
        .from("users")
        .select("organization_id, role")
        .eq("id", user.id)
        .single()

    if (profile?.role !== "org_admin" || !profile?.organization_id) {
        return NextResponse.json({ error: "Forbidden: Org Admin only" }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { title, description, file_path, file_name, file_size, department_id, job_level_id } = body

        if (!title || !file_path || !file_name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const { data, error } = await supabase
            .from("organization_documents")
            .insert({
                organization_id: profile.organization_id,
                uploaded_by: user.id,
                title,
                description,
                file_path,
                file_name,
                file_size,
                department_id,
                job_level_id
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

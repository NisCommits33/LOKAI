import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Helper (reused from departments API pattern)
async function getOrgAdmin(request: NextRequest) {
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

    const { data: adminProfile } = await supabase
        .from("users")
        .select("role, organization_id")
        .eq("id", user.id)
        .single()

    if (adminProfile?.role !== "org_admin" || !adminProfile?.organization_id) {
        return { error: "Forbidden", status: 403 }
    }

    return { supabase, orgId: adminProfile.organization_id, user }
}

export async function GET(request: NextRequest) {
    const { supabase, orgId, error, status } = await getOrgAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    // Order by rank/grade if available, else name
    const { data, error: dbError } = await supabase
        .from("job_levels")
        .select("*")
        .eq("organization_id", orgId)
        .order("grade", { ascending: true }) // Assuming grade is a number or sortable string

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

    return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    const { supabase, orgId, error, status } = await getOrgAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    const body = await request.json()
    const { name, grade } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const { data, error: dbError } = await supabase
        .from("job_levels")
        .insert({
            name: name.trim(),
            grade: grade ? Number(grade) : 0, // Default rank/grade
            organization_id: orgId
        })
        .select()
        .single()

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

    return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
    const { supabase, orgId, error, status } = await getOrgAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    const body = await request.json()
    const { id, name, grade } = body

    if (!id || !name || typeof name !== 'string' || !name.trim()) {
        return NextResponse.json({ error: "ID and Name are required" }, { status: 400 })
    }

    const { data, error: dbError } = await supabase
        .from("job_levels")
        .update({
            name: name.trim(),
            grade: grade !== undefined ? Number(grade) : undefined
        })
        .eq("id", id)
        .eq("organization_id", orgId)
        .select()
        .single()

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

    return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
    const { supabase, orgId, error, status } = await getOrgAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    const body = await request.json()
    const { id } = body

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // Check if job level has users
    const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("job_level_id", id)
        .eq("organization_id", orgId)

    if (count && count > 0) {
        return NextResponse.json({ error: "Cannot delete job level with assigned members" }, { status: 400 })
    }

    const { error: dbError } = await supabase
        .from("job_levels")
        .delete()
        .eq("id", id)
        .eq("organization_id", orgId)

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

    return NextResponse.json({ success: true })
}

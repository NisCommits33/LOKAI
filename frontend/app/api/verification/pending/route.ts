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

    // Verify org_admin role
    const { data: adminProfile, error: adminError } = await supabase
        .from("users")
        .select("role, organization_id")
        .eq("id", user.id)
        .single()

    if (adminError || adminProfile?.role !== "org_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase
        .from("users")
        .select(`
            id,
            full_name,
            email,
            avatar_url,
            employee_id,
            verification_status,
            verification_requested_at,
            rejection_reason,
            departments(id, name),
            job_levels(id, name, grade)
        `)
        .eq("organization_id", adminProfile.organization_id)
        .neq("id", user.id)
        .order("verification_requested_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ members: data })
}

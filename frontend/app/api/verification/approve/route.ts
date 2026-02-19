import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

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

    const { data: adminProfile } = await supabase
        .from("users")
        .select("role, organization_id")
        .eq("id", user.id)
        .single()

    if (adminProfile?.role !== "org_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { member_id } = await request.json()
    if (!member_id) {
        return NextResponse.json({ error: "member_id is required" }, { status: 400 })
    }

    const { error } = await supabase
        .from("users")
        .update({
            verification_status: "verified",
            role: "employee",
            verified_at: new Date().toISOString(),
            verified_by: user.id,
            rejection_reason: null,
        })
        .eq("id", member_id)
        .eq("organization_id", adminProfile.organization_id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Member approved successfully" })
}

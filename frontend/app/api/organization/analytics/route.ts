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

    // Get admin's organization
    const { data: adminProfile } = await supabase
        .from("users")
        .select("role, organization_id")
        .eq("id", user.id)
        .single()

    if (adminProfile?.role !== "org_admin" || !adminProfile?.organization_id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const orgId = adminProfile.organization_id

    try {
        // Run queries in parallel for performance
        const [
            { count: userCount },
            { count: deptCount },
            { count: levelCount },
            { count: pendingCount },
            { data: deptDistribution },
            { data: levelDistribution }
        ] = await Promise.all([
            supabase.from("users").select("*", { count: "exact", head: true }).eq("organization_id", orgId),
            supabase.from("departments").select("*", { count: "exact", head: true }).eq("organization_id", orgId),
            supabase.from("job_levels").select("*", { count: "exact", head: true }).eq("organization_id", orgId),
            supabase.from("users").select("*", { count: "exact", head: true })
                .eq("organization_id", orgId)
                .eq("verification_status", "pending"),
            // Distribution queries
            supabase.from("departments").select("name, users(count)").eq("organization_id", orgId),
            supabase.from("job_levels").select("name, users(count)").eq("organization_id", orgId)
        ])

        // Transform distribution data
        const deptStats = deptDistribution?.map((d: any) => ({
            name: d.name,
            value: d.users?.[0]?.count || 0
        })) || []

        const levelStats = levelDistribution?.map((l: any) => ({
            name: l.name,
            value: l.users?.[0]?.count || 0
        })) || []

        return NextResponse.json({
            users: userCount || 0,
            departments: deptCount || 0,
            job_levels: levelCount || 0,
            pending_verifications: pendingCount || 0,
            dept_distribution: deptStats,
            level_distribution: levelStats
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

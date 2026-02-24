import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    // Create client inside the handler so env vars are always fresh
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log("[approve-org] URL:", supabaseUrl ? "✓ set" : "✗ MISSING")
    console.log("[approve-org] Service key:", serviceRoleKey ? `✓ set (${serviceRoleKey.slice(0, 12)}...)` : "✗ MISSING")

    if (!supabaseUrl || !serviceRoleKey) {
        return NextResponse.json({ error: "Server misconfiguration: missing Supabase credentials" }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    try {
        const { action, application, reason } = await request.json()

        if (action === "approve") {
            const { error } = await supabaseAdmin
                .from("organization_applications")
                .update({
                    status: "approved",
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: (await supabaseAdmin.auth.getUser()).data.user?.id
                })
                .eq("id", application.id)

            if (error) {
                console.error("[approve-org] Approval error:", error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ success: true, message: "Organization approved. Trigger will handle record creation." })
        }

        if (action === "reject") {
            const { error } = await supabaseAdmin
                .from("organization_applications")
                .update({
                    status: "rejected",
                    rejection_reason: reason || "No reason provided",
                    reviewed_at: new Date().toISOString()
                })
                .eq("id", application.id)

            if (error) {
                console.error("[approve-org] Reject error:", error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (err: any) {
        console.error("[approve-org] Unexpected error:", err)
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
    }
}

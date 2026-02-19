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
        const { action, application } = await request.json()

        if (action === "approve") {
            // 1. Create the organization
            const { data: orgData, error: orgError } = await supabaseAdmin
                .from("organizations")
                .insert({
                    name: application.name,
                    code: application.code,
                    description: application.description,
                    address: application.address,
                    contact_email: application.contact_email,
                    is_active: true
                })
                .select()
                .single()

            if (orgError) {
                console.error("[approve-org] Org insert error:", orgError)
                return NextResponse.json({ error: orgError.message }, { status: 500 })
            }

            // 2. Update application status to approved
            const { error: appError } = await supabaseAdmin
                .from("organization_applications")
                .update({ status: "approved", reviewed_at: new Date().toISOString() })
                .eq("id", application.id)

            if (appError) {
                console.error("[approve-org] App update error:", appError)
                return NextResponse.json({ error: appError.message }, { status: 500 })
            }

            // 3. Update the applicant user profile
            const { error: userError } = await supabaseAdmin
                .from("users")
                .update({
                    organization_id: orgData.id,
                    role: "org_admin",
                    verification_status: "verified"
                })
                .eq("email", application.applicant_email)

            if (userError) {
                console.error("[approve-org] User link error (non-fatal):", userError.message)
            }

            return NextResponse.json({ success: true, organization: orgData })
        }

        if (action === "reject") {
            const { error } = await supabaseAdmin
                .from("organization_applications")
                .update({ status: "rejected", reviewed_at: new Date().toISOString() })
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

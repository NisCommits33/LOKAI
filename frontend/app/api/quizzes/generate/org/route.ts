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

export async function POST(request: NextRequest) {
    const result = await getAuthenticatedUser(request)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

    const { supabase, user } = result

    try {
        const { document_id } = await request.json()
        if (!document_id) return NextResponse.json({ error: "Document ID required" }, { status: 400 })

        // 1. Verify access
        const { data: profile } = await supabase
            .from("users")
            .select("organization_id, role, verification_status")
            .eq("id", user.id)
            .single()

        if (!profile || profile.verification_status !== 'verified') {
            return NextResponse.json({ error: "Verified access required" }, { status: 403 })
        }

        const { data: doc, error: docError } = await supabase
            .from("organization_documents")
            .select("*")
            .eq("id", document_id)
            .single()

        if (docError || !doc || doc.organization_id !== profile.organization_id) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 })
        }

        // 2. Check if already has questions
        const { count } = await supabase
            .from("questions")
            .select("*", { count: 'exact', head: true })
            .eq("document_id", document_id)

        if (count && count > 0) {
            return NextResponse.json({ message: "Quiz already prepared", questions_ready: true })
        }

        // 3. Trigger generation (Simulated for now)
        const { error: updateError } = await supabase
            .from("organization_documents")
            .update({ processing_status: 'processing' })
            .eq("id", document_id)

        if (updateError) throw updateError

        return NextResponse.json({
            message: "Quiz generation initialized",
            processing_status: 'processing'
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

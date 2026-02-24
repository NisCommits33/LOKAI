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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await getAuthenticatedUser(request)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

    const { supabase, user } = result

    try {
        const { id } = await params

        // 1. Verify user can access this document (targeted check)
        const { data: profile } = await supabase
            .from("users")
            .select("organization_id, verification_status")
            .eq("id", user.id)
            .single()

        if (!profile || profile.verification_status !== 'verified') {
            return NextResponse.json({ error: "Verified employee access required" }, { status: 403 })
        }

        const { data: doc, error: docError } = await supabase
            .from("organization_documents")
            .select("id, organization_id")
            .eq("id", id)
            .single()

        if (docError || !doc || doc.organization_id !== profile.organization_id) {
            return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 })
        }

        // 2. Fetch questions
        const { data: questions, error } = await supabase
            .from("questions")
            .select("*")
            .eq("document_id", id)
            .eq("is_active", true)

        if (error) throw error

        return NextResponse.json(questions)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

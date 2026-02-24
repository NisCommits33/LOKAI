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
        const { data, error: dbError } = await supabase
            .from("personal_documents")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single()

        if (dbError) throw dbError
        if (!data) return NextResponse.json({ error: "Document not found" }, { status: 404 })

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const result = await getAuthenticatedUser(request)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

    const { supabase, user } = result

    try {
        const { id } = await params

        // 1. Get document to get file path
        const { data: doc, error: fetchError } = await supabase
            .from("personal_documents")
            .select("file_path")
            .eq("id", id)
            .eq("user_id", user.id)
            .single()

        if (fetchError || !doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 })
        }

        // 2. Delete from storage
        const { error: storageError } = await supabase.storage
            .from("personal-documents")
            .remove([doc.file_path])

        if (storageError) {
            console.error("Storage deletion error:", storageError)
            // Continue even if storage deletion fails to keep DB clean
        }

        // 3. Delete from database
        const { error: dbError } = await supabase
            .from("personal_documents")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id)

        if (dbError) throw dbError

        return NextResponse.json({ message: "Document deleted successfully" })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// GET single document metadata
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const authHeader = request.headers.get("Authorization")
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const token = authHeader.replace("Bearer ", "")
        const { data: { user }, error: authError } = await (createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)).auth.getUser(token)

        if (authError || !user) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

        // Get user profile to check organization
        const { data: profile } = await supabase
            .from("users")
            .select("organization_id")
            .eq("id", user.id)
            .single()

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 403 })

        const { data: document, error } = await supabase
            .from("organization_documents")
            .select("*, departments(name)")
            .eq("id", id)
            .single()

        if (error || !document) return NextResponse.json({ error: "Document not found" }, { status: 404 })

        if (document.organization_id !== profile.organization_id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        return NextResponse.json(document)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE document
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const authHeader = request.headers.get("Authorization")
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const token = authHeader.replace("Bearer ", "")
        const { data: { user }, error: authError } = await (createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)).auth.getUser(token)

        if (authError || !user) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

        // Check if user is org_admin
        const { data: profile } = await supabase
            .from("users")
            .select("organization_id, role")
            .eq("id", user.id)
            .single()

        if (!profile || profile.role !== "org_admin") {
            return NextResponse.json({ error: "Only admins can delete documents" }, { status: 403 })
        }

        // Get document to verify ownership and get file_path
        const { data: document } = await supabase
            .from("organization_documents")
            .select("organization_id, file_path")
            .eq("id", id)
            .single()

        if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 })

        if (document.organization_id !== profile.organization_id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // 1. Delete from storage
        const { error: storageError } = await supabase.storage
            .from("org-documents")
            .remove([document.file_path])

        if (storageError) console.error("Storage deletion error:", storageError)

        // 2. Delete from database
        const { error: dbError } = await supabase
            .from("organization_documents")
            .delete()
            .eq("id", id)

        if (dbError) throw dbError

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

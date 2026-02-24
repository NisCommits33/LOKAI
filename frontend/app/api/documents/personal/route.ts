import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Helper to get authenticated user and supabase client
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

export async function GET(request: NextRequest) {
    const result = await getAuthenticatedUser(request)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

    const { supabase, user } = result

    try {
        const { data, error: dbError } = await supabase
            .from("personal_documents")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

        if (dbError) throw dbError

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const result = await getAuthenticatedUser(request)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

    const { supabase, user } = result

    try {
        const body = await request.json()
        const { title, description, file_path, file_name, file_size } = body

        if (!title || !file_path || !file_name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const { data, error: dbError } = await supabase
            .from("personal_documents")
            .insert({
                user_id: user.id,
                title,
                description,
                file_path,
                file_name,
                file_size,
                processing_status: 'pending'
            })
            .select()
            .single()

        if (dbError) throw dbError

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

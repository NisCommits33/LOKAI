import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get("organization_id")

    if (!organizationId) {
        return NextResponse.json({ error: "organization_id is required" }, { status: 400 })
    }

    const { data, error } = await supabase
        .from("departments")
        .select("id, name, code")
        .eq("organization_id", organizationId)
        .order("name")

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ departments: data })
}

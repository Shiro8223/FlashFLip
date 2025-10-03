import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // You can also fetch profile name here if you store it in "profiles"
  // const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user?.id).single()

  return NextResponse.json({
    user: user ? {
      id: user.id,
      email: user.email,
      name: (user.user_metadata?.full_name as string)
         || (user.user_metadata?.name as string)
         || user.email
    } : null
  })
}

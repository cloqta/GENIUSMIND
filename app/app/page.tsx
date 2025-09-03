import { redirect } from "next/navigation"
import { getServerClient } from "@/lib/supabase/server-client"
import CalendarClient from "@/components/calendar/calendar-client"

export default async function AppPage() {
  const supabase = getServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return <CalendarClient userId={user.id} />
}

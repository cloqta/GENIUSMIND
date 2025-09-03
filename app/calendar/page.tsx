import { redirect } from "next/navigation"
import { getServerSupabase } from "@/lib/supabase/server-client"
import CalendarView from "@/components/calendar/calendar-view"
import { SiteHeader } from "@/components/site-header"

export default async function CalendarPage() {
  const supabase = getServerSupabase()
  const { data } = await supabase.auth.getSession()
  if (!data.session) redirect("/auth/login")

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-6">
        <CalendarView />
      </section>
    </main>
  )
}

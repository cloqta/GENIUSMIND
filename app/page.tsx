import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerClient } from "@/lib/supabase/server-client"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const supabase = getServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/app")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-balance">Marcal — Marketing Calendar</h1>
        <p className="text-muted-foreground text-pretty">
          Plan, collaborate, and execute your marketing campaigns across month, week, day, and year views. Realtime
          updates, drag-and-drop, and rich fields tailored for marketing teams.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/register">Create account</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

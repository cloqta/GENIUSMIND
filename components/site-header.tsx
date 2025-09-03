"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getBrowserSupabase } from "@/lib/supabase/browser-client"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const supabase = getBrowserSupabase()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/calendar" className="font-semibold text-xl text-blue-600">
          Marcal
        </Link>
        <nav className="flex items-center gap-3">
          <Link className="text-sm hover:underline" href="/calendar">
            Calendar
          </Link>
          {email ? (
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          ) : (
            <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

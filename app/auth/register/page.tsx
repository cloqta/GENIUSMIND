"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase/browser-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function RegisterPage() {
  const supabase = getBrowserClient()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const redirect =
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
      (typeof window !== "undefined" ? `${window.location.origin}/app` : undefined)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirect,
        data: { full_name: name },
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      // Optional: you can show a confirmation message; for simplicity redirect to app
      router.replace("/app")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 p-6 rounded-lg border bg-card/50 backdrop-blur">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Create your account</h2>
          <p className="text-sm text-muted-foreground">Start planning your campaigns with Marcal.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create account"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="underline" href="/auth/login">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}

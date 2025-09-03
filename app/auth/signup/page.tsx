"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getBrowserSupabase } from "@/lib/supabase/browser-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignupPage() {
  const supabase = getBrowserSupabase()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/calendar`,
      },
    })
    setLoading(false)
    if (error) setError(error.message)
    else router.push("/calendar")
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-balance">Create your Marcal account</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? "Creating..." : "Sign up"}
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { formatISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEvents } from "@/hooks/use-events"
import { cn } from "@/lib/utils"

export function AddEventDialog({
  open,
  onOpenChange,
  dateDefault,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dateDefault?: Date
}) {
  const { createEvent } = useEvents()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startAt, setStartAt] = useState("")
  const [endAt, setEndAt] = useState("")
  const [channel, setChannel] = useState("Email")
  const [color, setColor] = useState("bg-blue-600")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && dateDefault) {
      const iso = formatISO(dateDefault).slice(0, 16)
      setStartAt(iso)
      setEndAt(iso)
    }
  }, [open, dateDefault])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createEvent({
        title,
        description,
        start_at: new Date(startAt).toISOString(),
        end_at: endAt ? new Date(endAt).toISOString() : null,
        channel,
        color,
      })
      onOpenChange(false)
      setTitle("")
      setDescription("")
    } catch (err: any) {
      setError(err?.message ?? "Failed to create event")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New event</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Starts</label>
              <Input type="datetime-local" required value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Ends</label>
              <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Channel</label>
            <select
              className="w-full rounded-md border bg-background p-2 text-sm"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option>Email</option>
              <option>Social</option>
              <option>Content</option>
              <option>Ads</option>
              <option>Events</option>
              <option>Analytics</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Color</label>
            <div className="flex items-center gap-2">
              {["bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-gray-700"].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => setColor(c)}
                  className={cn("h-6 w-6 rounded", c, color === c && "ring-2 ring-offset-2")}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { formatISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateEvent } from "@/hooks/use-events" // ✅ Use the correct hook
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
  const createMutation = useCreateEvent() // ✅ Use the correct hook
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("") // ✅ Fixed field name
  const [endTime, setEndTime] = useState("") // ✅ Fixed field name
  const [campaignType, setCampaignType] = useState("email") // ✅ Fixed field name
  const [status, setStatus] = useState("planned") // ✅ Added required field
  const [priority, setPriority] = useState("medium") // ✅ Added required field
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && dateDefault) {
      const iso = formatISO(dateDefault).slice(0, 16)
      setStartTime(iso)
      // Set end time to 1 hour later
      const endDate = new Date(dateDefault.getTime() + 60 * 60 * 1000)
      setEndTime(formatISO(endDate).slice(0, 16))
    }
  }, [open, dateDefault])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    try {
      console.log("🚀 Creating event with data:", {
        title,
        description,
        start_time: startTime,
        end_time: endTime,
        campaign_type: campaignType,
        status,
        priority,
      })

      await createMutation.mutateAsync({
        title,
        description,
        start_time: new Date(startTime).toISOString(), // ✅ Correct field name
        end_time: new Date(endTime).toISOString(), // ✅ Correct field name
        campaign_type: campaignType as "email" | "social" | "content" | "ads" | "events" | "analytics", // ✅ Correct field name
        status: status as "planned" | "in_progress" | "completed" | "cancelled", // ✅ Required field
        priority: priority as "low" | "medium" | "high" | "urgent", // ✅ Required field
        is_all_day: false, // ✅ Required field
        budget: null, // ✅ Optional field
      })
      
      console.log("✅ Event created successfully!")
      onOpenChange(false)
      
      // Reset form
      setTitle("")
      setDescription("")
      setStartTime("")
      setEndTime("")
      setCampaignType("email")
      setStatus("planned")
      setPriority("medium")
      
    } catch (err: any) {
      console.error("❌ Event creation error:", err)
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
              <Input 
                type="datetime-local" 
                required 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Ends</label>
              <Input 
                type="datetime-local" 
                required 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Campaign Type</label>
            <select
              className="w-full rounded-md border bg-background p-2 text-sm"
              value={campaignType}
              onChange={(e) => setCampaignType(e.target.value)}
            >
              <option value="email">Email Marketing</option>
              <option value="social">Social Media</option>
              <option value="content">Content Creation</option>
              <option value="ads">Advertising</option>
              <option value="events">Events</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                className="w-full rounded-md border bg-background p-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Priority</label>
              <select
                className="w-full rounded-md border bg-background p-2 text-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700" 
              disabled={saving || createMutation.isPending}
            >
              {saving || createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

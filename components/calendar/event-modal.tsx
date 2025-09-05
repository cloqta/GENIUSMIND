"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useCreateEvent, useDeleteEvent, useEventById, useUpdateEvent } from "@/hooks/use-events"
import { formatISO } from "date-fns"
import { CATEGORY_LABELS } from "@/lib/categories"
import { Checkbox } from "@/components/ui/checkbox"
import { useSupabase } from "@/providers/supabase-provider" // Adjust this import path as needed

export default function EventModal({
  open,
  onOpenChange,
  editingEventId,
  currentDate,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editingEventId: string | null
  currentDate: Date
  onSaved: () => void
}) {
  const isEditing = !!editingEventId
  const { data: existing } = useEventById(editingEventId)
  const createMutation = useCreateEvent()
  const updateMutation = useUpdateEvent()
  const deleteMutation = useDeleteEvent()

  // Get current user from Supabase
  const { user } = useSupabase() // Adjust this based on your auth setup

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState(formatISO(currentDate).slice(0, 16))
  const [end, setEnd] = useState(formatISO(new Date(currentDate.getTime() + 60 * 60 * 1000)).slice(0, 16))
  const [campaignType, setCampaignType] = useState("email")
  const [status, setStatus] = useState("planned")
  const [priority, setPriority] = useState("medium")
  const [budget, setBudget] = useState<number | undefined>(undefined)
  const [isAllDay, setIsAllDay] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [recurrence, setRecurrence] = useState("none")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (existing) {
      setTitle(existing.title || "")
      setDescription(existing.description || "")
      setStart(existing.start_time?.slice(0, 16) || "")
      setEnd(existing.end_time?.slice(0, 16) || "")
      setCampaignType(existing.campaign_type || "email")
      setStatus(existing.status || "planned")
      setPriority(existing.priority || "medium")
      setBudget(existing.budget ?? undefined)
      setIsAllDay(!!existing.is_all_day)
      setIsShared(!!existing.is_shared)
      setRecurrence(existing.recurrence || "none")
    }
  }, [existing])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      console.error('No authenticated user found')
      alert('You must be logged in to create events')
      return
    }

    setIsSubmitting(true)
    
    try {
      const payload = {
        title,
        description,
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        campaign_type: campaignType,
        status,
        priority,
        budget: budget ?? null,
        is_all_day: isAllDay,
        is_shared: isShared,
        recurrence,
        user_id: user.id, // ✅ Added user_id
      }

      console.log('Payload being sent to Supabase:', payload)

      if (isEditing && editingEventId) {
        await updateMutation.mutateAsync({ id: editingEventId, ...payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      
      onSaved()
      onOpenChange(false)
      
      // Reset form
      setTitle("")
      setDescription("")
      setStart(formatISO(currentDate).slice(0, 16))
      setEnd(formatISO(new Date(currentDate.getTime() + 60 * 60 * 1000)).slice(0, 16))
      setCampaignType("email")
      setStatus("planned")
      setPriority("medium")
      setBudget(undefined)
      setIsAllDay(false)
      setIsShared(false)
      setRecurrence("none")
      
    } catch (error) {
      console.error('Error submitting event:', error)
      alert('Failed to save event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    if (isEditing && editingEventId) {
      setIsSubmitting(true)
      try {
        await deleteMutation.mutateAsync({ id: editingEventId })
        onSaved()
        onOpenChange(false)
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit event" : "New event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea 
              id="desc" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input 
                type="datetime-local" 
                value={start} 
                onChange={(e) => setStart(e.target.value)} 
                required 
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>End</Label>
              <Input 
                type="datetime-local" 
                value={end} 
                onChange={(e) => setEnd(e.target.value)} 
                required 
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Campaign type</Label>
              <Select value={campaignType} onValueChange={setCampaignType} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                    <SelectItem key={k} value={k}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Budget</Label>
              <Input
                type="number"
                placeholder="0"
                value={budget ?? ""}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : undefined)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Recurrence</Label>
              <Select value={recurrence} onValueChange={setRecurrence} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Recurrence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox 
                checked={isAllDay} 
                onCheckedChange={(v) => setIsAllDay(!!v)} 
                disabled={isSubmitting}
              />
              All day
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox 
                checked={isShared} 
                onCheckedChange={(v) => setIsShared(!!v)} 
                disabled={isSubmitting}
              />
              Shared
            </label>
          </div>
          <DialogFooter className="gap-2">
            {isEditing && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={onDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditing ? "Saving..." : "Creating...") 
                : (isEditing ? "Save changes" : "Create event")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

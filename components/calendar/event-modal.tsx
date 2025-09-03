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

  useEffect(() => {
    if (existing) {
      setTitle(existing.title || "")
      setDescription(existing.description || "")
      setStart(existing.start_time?.slice(0, 16))
      setEnd(existing.end_time?.slice(0, 16))
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
    }
    if (isEditing && editingEventId) {
      await updateMutation.mutateAsync({ id: editingEventId, ...payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    onSaved()
  }

  const onDelete = async () => {
    if (isEditing && editingEventId) {
      await deleteMutation.mutateAsync({ id: editingEventId })
      onSaved()
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
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>End</Label>
              <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Campaign type</Label>
              <Select value={campaignType} onValueChange={setCampaignType}>
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
              <Select value={status} onValueChange={setStatus}>
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
              <Select value={priority} onValueChange={setPriority}>
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
              />
            </div>
            <div className="space-y-2">
              <Label>Recurrence</Label>
              <Select value={recurrence} onValueChange={setRecurrence}>
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
              <Checkbox checked={isAllDay} onCheckedChange={(v) => setIsAllDay(!!v)} />
              All day
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={isShared} onCheckedChange={(v) => setIsShared(!!v)} />
              Shared
            </label>
          </div>
          <DialogFooter className="gap-2">
            {isEditing && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            <Button type="submit">{isEditing ? "Save changes" : "Create event"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

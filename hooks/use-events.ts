"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getBrowserClient } from "@/lib/supabase/browser-client"
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns"
import { useEffect } from "react"

// Database type (what Supabase returns)
export type DbEvent = {
  id: string
  title: string
  description?: string
  start_time: string  // This is a string from database
  end_time: string    // This is a string from database
  campaign_type: "email" | "social" | "content" | "ads" | "events" | "analytics"
  status: "planned" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  budget?: number
  is_all_day: boolean
  is_shared?: boolean
  recurrence?: "none" | "daily" | "weekly" | "monthly"
}

// Frontend type (what calendar components expect)
export type CalendarEvent = Omit<DbEvent, 'start_time' | 'end_time'> & {
  start_time: Date  // Converted to Date object
  end_time: Date    // Converted to Date object
}

function computeRange(cursor: Date, view: "month" | "week" | "day" | "year") {
  if (view === "month") return [startOfMonth(cursor), endOfMonth(cursor)]
  if (view === "week") return [startOfWeek(cursor, { weekStartsOn: 1 }), endOfWeek(cursor, { weekStartsOn: 1 })]
  if (view === "day") return [startOfDay(cursor), endOfDay(cursor)]
  return [new Date(cursor.getFullYear(), 0, 1), new Date(cursor.getFullYear(), 11, 31, 23, 59, 59)]
}

// Helper function to convert database events to calendar events
function convertDbEventToCalendarEvent(dbEvent: DbEvent): CalendarEvent {
  return {
    ...dbEvent,
    start_time: new Date(dbEvent.start_time),
    end_time: new Date(dbEvent.end_time)
  }
}

export function useEvents(cursor: Date, view: "month" | "week" | "day" | "year") {
  const supabase = getBrowserClient()
  const [start, end] = computeRange(cursor, view)
  const qc = useQueryClient()

  const q = useQuery({
    queryKey: ["events", view, start.toISOString(), end.toISOString()],
    queryFn: async (): Promise<CalendarEvent[]> => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("start_time", start.toISOString())
          .lte("start_time", end.toISOString())
          .order("start_time", { ascending: true })
        
        if (error) throw error
        
        // 🔥 KEY FIX: Convert string dates to Date objects
        const eventsWithDates = (data || []).map(convertDbEventToCalendarEvent)
        return eventsWithDates
      } catch (err: any) {
        // If table doesn't exist yet or RLS blocks, return empty instead of crashing UI
        console.log("[v0] useEvents error:", err?.message || err)
        return []
      }
    },
  })

  useEffect(() => {
    // subscribe to all changes on events and invalidate cache
    const channel = supabase
      .channel("events-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
        qc.invalidateQueries({ queryKey: ["events"] })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, qc])

  return { events: q.data || [], isLoading: q.isLoading, refetch: q.refetch }
}

export function useEventById(id: string | null) {
  const supabase = getBrowserClient()
  return useQuery({
    queryKey: ["event", id],
    enabled: !!id,
    queryFn: async (): Promise<CalendarEvent | null> => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).single()
      if (error) throw error
      return convertDbEventToCalendarEvent(data as DbEvent)
    },
  })
}

export function useCreateEvent() {
  const supabase = getBrowserClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<DbEvent>) => {
      const { data, error } = await supabase.from("events").insert(payload).select("*").single()
      if (error) throw error
      return convertDbEventToCalendarEvent(data as DbEvent)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  })
}

export function useUpdateEvent() {
  const supabase = getBrowserClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<DbEvent> & { id: string }) => {
      const { data, error } = await supabase.from("events").update(payload).eq("id", id).select("*").single()
      if (error) throw error
      return convertDbEventToCalendarEvent(data as DbEvent)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  })
}

export function useDeleteEvent() {
  const supabase = getBrowserClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from("events").delete().eq("id", id)
      if (error) throw error
      return true
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  })
}

export function useMoveEvent() {
  const supabase = getBrowserClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, targetDate }: { id: string; targetDate: Date }) => {
      const { data: ev, error: e1 } = await supabase.from("events").select("start_time,end_time").eq("id", id).single()
      if (e1) throw e1
      const st = new Date(ev.start_time)
      const en = new Date(ev.end_time)
      const duration = en.getTime() - st.getTime()
      const newStart = new Date(targetDate)
      newStart.setHours(st.getHours(), st.getMinutes(), 0, 0)
      const newEnd = new Date(newStart.getTime() + duration)
      const { error } = await supabase
        .from("events")
        .update({
          start_time: newStart.toISOString(),
          end_time: newEnd.toISOString(),
        })
        .eq("id", id)
      if (error) throw error
      return true
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  })
}

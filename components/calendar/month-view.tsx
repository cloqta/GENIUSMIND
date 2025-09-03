"use client"

import type React from "react"

import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, format } from "date-fns"
import EventCard from "./event-card"
import { DndContext, type DragEndEvent, useDroppable, useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useMoveEvent } from "@/hooks/use-events"

type EventItem = {
  id: string
  title: string
  start_time: string
  end_time: string
  campaign_type: any
  is_all_day: boolean
}

function DroppableDay({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      id={id}
      className={`min-h-32 border rounded-md p-2 ${isOver ? "ring-2 ring-primary/30" : ""}`}
    >
      {children}
    </div>
  )
}

function DraggableEvent({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none" as const,
  }
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}

export default function MonthView({
  date,
  events,
  onEdit,
}: {
  date: Date
  events: EventItem[]
  onEdit: (id: string) => void
}) {
  const calendarStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const moveMutation = useMoveEvent()

  const eventsByDay = new Map<string, EventItem[]>()
  for (const day of days) {
    const key = day.toDateString()
    eventsByDay.set(key, [])
  }
  for (const e of events) {
    const day = new Date(e.start_time)
    const key = day.toDateString()
    if (eventsByDay.has(key)) {
      eventsByDay.get(key)!.push(e)
    }
  }

  const onDragEnd = async (ev: DragEndEvent) => {
    const eventId = ev.active?.id as string
    const dayString = (ev.over?.id as string) || ""
    if (!eventId || !dayString) return
    const targetDate = new Date(dayString)
    await moveMutation.mutateAsync({ id: eventId, targetDate })
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = d.toDateString()
          const isToday = isSameDay(d, new Date())
          const dayEvents = eventsByDay.get(key) || []
          return (
            <DroppableDay key={key} id={key}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className={isToday ? "font-semibold" : ""}>{format(d, "d")}</span>
                <span className="text-muted-foreground">{format(d, "EEE")}</span>
              </div>
              <div className="space-y-1">
                {dayEvents.map((e) => (
                  <DraggableEvent key={e.id} id={e.id}>
                    <EventCard title={e.title} campaign_type={e.campaign_type} onClick={() => onEdit(e.id)} />
                  </DraggableEvent>
                ))}
              </div>
            </DroppableDay>
          )
        })}
      </div>
    </DndContext>
  )
}

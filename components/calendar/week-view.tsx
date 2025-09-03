"use client"

import { startOfWeek, addHours, setHours, setMinutes, format, isSameDay, isWithinInterval } from "date-fns"
import EventCard from "./event-card"
import { useMoveEvent } from "@/hooks/use-events" // import move mutation

export default function WeekView({
  date,
  events,
  onEdit,
}: {
  date: Date
  events: any[]
  onEdit: (id: string) => void
}) {
  const move = useMoveEvent() // init mutation
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addHours(weekStart, i * 24))
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="grid grid-cols-8">
      <div />
      {days.map((d, i) => (
        <div key={i} className="text-center py-2 font-medium">
          {format(d, "EEE d")}
        </div>
      ))}
      {hours.map((h) => (
        <>
          <div key={`h-${h}`} className="text-xs text-right pr-2 py-4 border-t">
            {h}:00
          </div>
          {days.map((d, i) => {
            const slotStart = setMinutes(setHours(d, h), 0)
            const slotEnd = setMinutes(setHours(d, h + 1), 0)
            const slotEvents = events.filter((e) => {
              const st = new Date(e.start_time)
              return isSameDay(st, d) && isWithinInterval(st, { start: slotStart, end: slotEnd })
            })
            return (
              <div
                key={`cell-${h}-${i}`}
                className="border-t border-l p-1 min-h-12"
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={(ev) => {
                  ev.preventDefault()
                  const id = ev.dataTransfer.getData("text/plain")
                  if (id) move.mutate({ id, targetDate: slotStart })
                }}
                role="button"
                aria-label={`Drop to ${format(slotStart, "EEE HH:mm")}`}
              >
                <div className="space-y-1">
                  {slotEvents.map((e: any) => (
                    <div
                      key={e.id}
                      draggable
                      onDragStart={(ev) => {
                        ev.dataTransfer.setData("text/plain", e.id)
                        ev.dataTransfer.effectAllowed = "move"
                      }}
                      aria-grabbed="true"
                      className="cursor-grab active:cursor-grabbing"
                      onDoubleClick={() => onEdit(e.id)}
                    >
                      <EventCard title={e.title} campaign_type={e.campaign_type} onClick={() => onEdit(e.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </>
      ))}
    </div>
  )
}

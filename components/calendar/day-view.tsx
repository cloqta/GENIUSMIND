"use client"

import { setHours, setMinutes, format, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import EventCard from "./event-card"
import { useMoveEvent } from "@/hooks/use-events" // import move mutation

export default function DayView({
  date,
  events,
  onEdit,
}: {
  date: Date
  events: any[]
  onEdit: (id: string) => void
}) {
  const move = useMoveEvent() // init mutation
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const dayStart = startOfDay(date)
  const dayEnd = endOfDay(date)

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2" />
      <div className="col-span-10">
        {hours.map((h) => {
          const slotStart = setMinutes(setHours(date, h), 0)
          const slotEnd = setMinutes(setHours(date, h + 1), 0)
          const slotEvents = events.filter((e) => {
            const st = new Date(e.start_time)
            return isWithinInterval(st, { start: dayStart, end: dayEnd }) && st >= slotStart && st < slotEnd
          })
          return (
            <div
              key={h}
              className="border-t py-4"
              onDragOver={(ev) => ev.preventDefault()}
              onDrop={(ev) => {
                ev.preventDefault()
                const id = ev.dataTransfer.getData("text/plain")
                if (id) move.mutate({ id, targetDate: slotStart })
              }}
              role="button"
              aria-label={`Drop to ${format(slotStart, "HH:mm")}`}
            >
              <div className="text-xs text-muted-foreground">{format(slotStart, "HH:mm")}</div>
              <div className="mt-2 space-y-1">
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
      </div>
    </div>
  )
}

"use client"

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { useMemo } from "react"
import { useEvents } from "@/hooks/use-events"
import { cn } from "@/lib/utils"

export function CalendarMonth({
  currentMonth,
  onDayClick,
}: {
  currentMonth: Date
  onDayClick?: (date: Date) => void
}) {
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
  const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end])
  const { events } = useEvents(currentMonth)

  function dayEvents(d: Date) {
    return events.filter((e) => {
      const s = new Date(e.start_at)
      const eend = new Date(e.end_at ?? e.start_at)
      return isSameDay(s, d) || isSameDay(eend, d) || (s <= d && d <= eend)
    })
  }

  return (
    <div className="grid grid-cols-7 gap-[1px] rounded-md border bg-border text-xs md:text-sm">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
        <div key={d} className="bg-background p-2 text-center font-medium text-muted-foreground">
          {d}
        </div>
      ))}
      {days.map((d) => {
        const isWeekend = getDay(d) === 0 || getDay(d) === 6
        const notCurrent = !isSameMonth(d, currentMonth)
        const items = dayEvents(d)
        return (
          <button
            key={d.toISOString()}
            className={cn(
              "min-h-[92px] bg-background p-2 text-left align-top transition-colors hover:bg-accent/50",
              isWeekend && "bg-muted/20",
              notCurrent && "bg-muted/30 text-muted-foreground",
            )}
            onClick={() => onDayClick?.(d)}
            aria-label={`Create event on ${format(d, "PP")}`}
          >
            <div className="mb-1 text-[11px] font-medium md:text-xs">{format(d, "d")}</div>
            <div className="flex flex-col gap-1">
              {items.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className={cn(
                    "truncate rounded px-2 py-1 text-[11px] text-white md:text-xs",
                    ev.color ?? "bg-blue-600",
                  )}
                  title={`${ev.title} • ${format(new Date(ev.start_at), "p")}`}
                >
                  {ev.title}
                </div>
              ))}
              {items.length > 3 && (
                <div className="text-[11px] text-amber-600 md:text-xs">{`+${items.length - 3} more`}</div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

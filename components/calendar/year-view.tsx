"use client"

import { eachMonthOfInterval, startOfYear, endOfYear, format } from "date-fns"

export default function YearView({
  date,
  events,
  onEdit,
}: {
  date: Date
  events: any[]
  onEdit: (id: string) => void
}) {
  const months = eachMonthOfInterval({ start: startOfYear(date), end: endOfYear(date) })
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {months.map((m) => (
        <div key={m.toISOString()} className="border rounded-md p-3">
          <div className="text-sm font-semibold mb-2">{format(m, "MMMM yyyy")}</div>
          <div className="text-xs text-muted-foreground">
            Events: {events.filter((e) => new Date(e.start_time).getMonth() === m.getMonth()).length}
          </div>
        </div>
      ))}
    </div>
  )
}

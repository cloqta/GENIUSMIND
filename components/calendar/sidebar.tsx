"use client"

import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/categories"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

export function Sidebar({
  view,
  cursor,
  onDateSelect,
  onViewChange,
}: {
  view: "month" | "week" | "day" | "year"
  cursor: Date
  onDateSelect: (d: Date) => void
  onViewChange: (v: "month" | "week" | "day" | "year") => void
}) {
  const days = eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) })
  const [query, setQuery] = useState("")

  return (
    <aside className="hidden lg:block w-80 border-r p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Mini calendar</h3>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const active = isSameDay(d, cursor)
            return (
              <Button
                key={d.toISOString()}
                variant={active ? "default" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => onDateSelect(d)}
              >
                {format(d, "d")}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Views</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant={view === "month" ? "default" : "outline"} onClick={() => onViewChange("month")}>
            Month
          </Button>
          <Button variant={view === "week" ? "default" : "outline"} onClick={() => onViewChange("week")}>
            Week
          </Button>
          <Button variant={view === "day" ? "default" : "outline"} onClick={() => onViewChange("day")}>
            Day
          </Button>
          <Button variant={view === "year" ? "default" : "outline"} onClick={() => onViewChange("year")}>
            Year
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="font-semibold">Search</h3>
        <Input placeholder="Search events..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <p className="text-xs text-muted-foreground">Type to filter list and views (coming soon).</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Badge
              key={key}
              style={{ backgroundColor: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS], color: "white" }}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </aside>
  )
}

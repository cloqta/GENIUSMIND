"use client"

import { useState } from "react"
import { addMonths, format, startOfMonth } from "date-fns"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarMonth } from "./month-grid"
import { AddEventDialog } from "./event-dialog"

type View = "month" | "week" | "day" | "year"

export default function CalendarView() {
  const [view, setView] = useState<View>("month")
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [createDate, setCreateDate] = useState<Date | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-pretty">{format(currentMonth, "MMMM yyyy")}</h2>
          <p className="text-sm text-muted-foreground">Plan your marketing campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
            Prev
          </Button>
          <Button variant="outline" onClick={() => setCurrentMonth(startOfMonth(new Date()))}>
            Today
          </Button>
          <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            Next
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setCreateDate(new Date())}>
            New Event
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as View)}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-4">
          <CalendarMonth currentMonth={currentMonth} onDayClick={(d) => setCreateDate(d)} />
        </TabsContent>
        <TabsContent value="week" className="mt-4">
          <div className="rounded-md border p-6 text-sm text-muted-foreground">Week view coming soon</div>
        </TabsContent>
        <TabsContent value="day" className="mt-4">
          <div className="rounded-md border p-6 text-sm text-muted-foreground">Day view coming soon</div>
        </TabsContent>
        <TabsContent value="year" className="mt-4">
          <div className="rounded-md border p-6 text-sm text-muted-foreground">Year view coming soon</div>
        </TabsContent>
      </Tabs>

      <AddEventDialog
        open={!!createDate}
        dateDefault={createDate ?? undefined}
        onOpenChange={(o) => !o && setCreateDate(null)}
      />
    </div>
  )
}

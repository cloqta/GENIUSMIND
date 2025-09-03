"use client"

import { useState, useMemo, useEffect } from "react"
import { addMonths, addWeeks, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, CalendarIcon, Plus, LogOut } from "lucide-react"
import { Sidebar } from "./sidebar"
import MonthView from "./month-view"
import WeekView from "./week-view"
import DayView from "./day-view"
import YearView from "./year-view"
import EventModal from "./event-modal"
import { useEvents } from "@/hooks/use-events"
import { getBrowserClient } from "@/lib/supabase/browser-client"
import { FiltersBar, type CampaignType, type StatusType } from "./filters-bar"

type View = "month" | "week" | "day" | "year"

export default function CalendarClient({ userId }: { userId: string }) {
  const [view, setView] = useState<View>("month")
  const [cursor, setCursor] = useState<Date>(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  // Filters state
  const [q, setQ] = useState("")
  const [qDebounced, setQDebounced] = useState(q)
  const [campaignTypes, setCampaignTypes] = useState<CampaignType[]>([])
  const [statuses, setStatuses] = useState<StatusType[]>([])

  const { events, isLoading, refetch } = useEvents(userId)

  useEffect(() => {
    const supabase = getBrowserClient()
    const channel = supabase
      .channel("public:events-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
        refetch()
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 200)
    return () => clearTimeout(t)
  }, [q])

  const next = () => {
    if (view === "month") setCursor((d) => addMonths(d, 1))
    else if (view === "week") setCursor((d) => addWeeks(d, 1))
    else if (view === "day") setCursor((d) => addDays(d, 1))
    else setCursor((d) => addMonths(d, 12))
  }
  const prev = () => {
    if (view === "month") setCursor((d) => addMonths(d, -1))
    else if (view === "week") setCursor((d) => addWeeks(d, -1))
    else if (view === "day") setCursor((d) => addDays(d, -1))
    else setCursor((d) => addMonths(d, -12))
  }

  // Keyboard shortcuts: "/" focus search, "n" new, arrows navigate, "t" today
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      const typing = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable

      if (!typing && e.key === "/") {
        e.preventDefault()
        const el = document.getElementById("events-search") as HTMLInputElement | null
        el?.focus()
        return
      }
      if (!typing && (e.key === "n" || e.key === "N")) {
        e.preventDefault()
        onCreate()
        return
      }
      if (!typing && e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
        return
      }
      if (!typing && e.key === "ArrowRight") {
        e.preventDefault()
        next()
        return
      }
      if (!typing && (e.key === "t" || e.key === "T")) {
        e.preventDefault()
        setCursor(new Date())
        return
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [userId]) // Removed prev and next from dependencies

  const title = useMemo(() => {
    return cursor.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: view === "day" ? "numeric" : undefined,
    })
  }, [cursor, view])

  // Filtered events
  const filteredEvents = useMemo(() => {
    const term = qDebounced.trim().toLowerCase()
    return events.filter((e: any) => {
      const matchesQ = !term || e.title?.toLowerCase().includes(term) || e.description?.toLowerCase().includes(term)
      const matchesCampaign = campaignTypes.length === 0 || campaignTypes.includes(e.campaign_type)
      const matchesStatus = statuses.length === 0 || statuses.includes(e.status)
      return matchesQ && matchesCampaign && matchesStatus
    })
  }, [events, qDebounced, campaignTypes, statuses])

  const onCreate = () => {
    setEditingEventId(null)
    setModalOpen(true)
  }
  const onEdit = (id: string) => {
    setEditingEventId(id)
    setModalOpen(true)
  }

  const supabase = getBrowserClient()
  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const visibleCount = filteredEvents.length

  return (
    <div className="flex min-h-[100svh]">
      <Sidebar view={view} cursor={cursor} onDateSelect={setCursor} onViewChange={setView} />
      <main className="flex-1 p-4 md:p-6" aria-busy={isLoading}>
        <header
          className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col gap-4 pb-4 border-b"
          role="navigation"
          aria-label="Calendar controls"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Button size="icon" variant="outline" onClick={prev} aria-label="Previous period">
                <ChevronLeft className="size-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={next} aria-label="Next period">
                <ChevronRight className="size-4" />
              </Button>
              <Button variant="outline" onClick={() => setCursor(new Date())} aria-label="Go to today">
                Today
              </Button>
              <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <CalendarIcon className="size-4" />
                    {view[0].toUpperCase() + view.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setView("month")}>Month</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setView("week")}>Week</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setView("day")}>Day</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setView("year")}>Year</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={onCreate} className="gap-2">
                <Plus className="size-4" /> New event
              </Button>
              <Button variant="ghost" onClick={signOut} className="gap-2">
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <FiltersBar
              q={q}
              onQ={setQ}
              campaignTypes={campaignTypes}
              onCampaignTypes={setCampaignTypes}
              statuses={statuses}
              onStatuses={setStatuses}
              onReset={() => {
                setQ("")
                setCampaignTypes([])
                setStatuses([])
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span aria-live="polite" className="text-xs text-muted-foreground">
              {isLoading ? "Loading events…" : `${visibleCount} event${visibleCount === 1 ? "" : "s"} shown`}
            </span>
            <span className="text-xs text-muted-foreground hidden md:inline">
              Shortcuts: / focus search · N new event · ←/→ navigate · T today
            </span>
          </div>
        </header>

        <section className="pt-4">
          {view === "month" && <MonthView date={cursor} events={filteredEvents as any[]} onEdit={onEdit} />}
          {view === "week" && <WeekView date={cursor} events={filteredEvents as any[]} onEdit={onEdit} />}
          {view === "day" && <DayView date={cursor} events={filteredEvents as any[]} onEdit={onEdit} />}
          {view === "year" && <YearView date={cursor} events={filteredEvents as any[]} onEdit={onEdit} />}
        </section>
      </main>

      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingEventId={editingEventId}
        currentDate={cursor}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}

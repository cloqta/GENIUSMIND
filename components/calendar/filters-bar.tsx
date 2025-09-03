"use client"

import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

export type CampaignType = "email" | "social" | "content" | "ads" | "events" | "analytics"
export type StatusType = "planned" | "in_progress" | "completed" | "cancelled"

export function FiltersBar({
  q,
  onQ,
  campaignTypes,
  onCampaignTypes,
  statuses,
  onStatuses,
  onReset,
}: {
  q: string
  onQ: (v: string) => void
  campaignTypes: CampaignType[]
  onCampaignTypes: (v: CampaignType[]) => void
  statuses: StatusType[]
  onStatuses: (v: StatusType[]) => void
  onReset?: () => void
}) {
  const allCampaigns: CampaignType[] = useMemo(() => ["email", "social", "content", "ads", "events", "analytics"], [])
  const allStatuses: StatusType[] = useMemo(() => ["planned", "in_progress", "completed", "cancelled"], [])

  const toggleCampaign = (c: CampaignType) => {
    if (campaignTypes.includes(c)) onCampaignTypes(campaignTypes.filter((x) => x !== c))
    else onCampaignTypes([...campaignTypes, c])
  }
  const toggleStatus = (s: StatusType) => {
    if (statuses.includes(s)) onStatuses(statuses.filter((x) => x !== s))
    else onStatuses([...statuses, s])
  }

  const hasFilters = (q?.trim()?.length ?? 0) > 0 || campaignTypes.length > 0 || statuses.length > 0
  const handleReset = () => {
    onQ("")
    onCampaignTypes([])
    onStatuses([])
    onReset?.()
  }

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <Input
          id="events-search"
          type="search"
          value={q}
          onChange={(e) => onQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault()
              handleReset()
              const el = document.getElementById("events-search") as HTMLInputElement | null
              el?.blur()
            }
          }}
          placeholder="Search events (press / to focus, Esc to clear)"
          aria-label="Search events"
          autoComplete="off"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="size-4" />
              Campaigns
              {campaignTypes.length > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  {campaignTypes.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allCampaigns.map((c) => (
              <DropdownMenuCheckboxItem
                key={c}
                checked={campaignTypes.includes(c)}
                onCheckedChange={() => toggleCampaign(c)}
              >
                {c[0].toUpperCase() + c.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Status
              {statuses.length > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  {statuses.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allStatuses.map((s) => (
              <DropdownMenuCheckboxItem key={s} checked={statuses.includes(s)} onCheckedChange={() => toggleStatus(s)}>
                {s.replace("_", " ")}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" onClick={handleReset} disabled={!hasFilters} aria-disabled={!hasFilters}>
          Reset
        </Button>
      </div>
    </div>
  )
}

"use client"

import { CATEGORY_COLORS } from "@/lib/categories"
import { cn } from "@/lib/utils"

export default function EventCard({
  title,
  campaign_type,
  onClick,
}: {
  title: string
  campaign_type: keyof typeof CATEGORY_COLORS
  onClick?: () => void
}) {
  const bg = CATEGORY_COLORS[campaign_type]
  return (
    <div
      onClick={onClick}
      className={cn("rounded-md px-2 py-1 text-xs text-white cursor-pointer select-none")}
      style={{ backgroundColor: bg }}
    >
      {title}
    </div>
  )
}

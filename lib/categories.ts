export type CampaignType = "email" | "social" | "content" | "ads" | "events" | "analytics"

export const CATEGORY_COLORS: Record<CampaignType, string> = {
  email: "#EF4444", // Red
  social: "#3B82F6", // Blue
  content: "#10B981", // Green
  ads: "#F59E0B", // Amber
  events: "#8B5CF6", // Purple (explicitly requested)
  analytics: "#6B7280", // Gray
}

export const CATEGORY_LABELS: Record<CampaignType, string> = {
  email: "Email Marketing",
  social: "Social Media",
  content: "Content Creation",
  ads: "Advertising",
  events: "Events",
  analytics: "Analytics",
}

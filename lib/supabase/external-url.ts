# Smart Marketing Calendar - v0 Prompt

\
Create a modern, responsive marketing calendar web app
with the following
specifications:

\
## Core Features:
\
- **Multiple calendar views**: Month, Week, Day, and Year views
with smooth transitions
\
- **Drag-and-drop event scheduling**: Users can create, move, and resize events
- **Real-time sync**: Events update across all views instantly
\
- **Marketing-focused**: Color-coded categories
for different campaign types
\
- **Team collaboration**: Support
for shared events and team
views

\
## UI/UX Requirements:
\
- **Modern design**: Clean, professional
interface
with subtle shadows
and
rounded
corners
\
- **Dark/Light mode toggle**: Support both themes
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Interactive animations**: Smooth hover effects, transitions, and micro-interactions
- **Color-coded events**: Each marketing category has distinct colors
- **Quick actions**: Right-click context menus, keyboard shortcuts

## Event Management:
\
- **Event creation modal**: Rich form
with title, description, date/time, category, campaign type
\
- **Event editing**: Click events to edit in-place or modal
- **Marketing fields**: Campaign
type(Email, Social, Content, Ads), priority, budget, status
\
- **Categories**: Email Marketing, Social Media, Content Creation, Advertising, Events, Analytics
\
- **Recurring events**: Support
for daily, weekly, monthly patterns

\
#
#
Calendar
Views:
\
1. **Month View**: Traditional grid layout
with event previews
\
2. **Week View**: 7-day detailed view
with hourly slots
\
3. **Day View**: Single day
with detailed hourly
timeline
\
4. **Year View**: Compact annual overview
with event dots

\
## Backend Integration (Supabase):
\`\`\`javascript
// Supabase Configuration
const supabaseUrl = "https://tpmvvzfywlmsqbvpqdyr.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwbXZ2emZ5d2xtc3FidnBxZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTg3NDksImV4cCI6MjA3MjQ3NDc0OX0.AzewoMMHeTwEIGs2jhQRFiydXXDVIXKvtudvQgftQwg"
\`\`\`

## Required Functionality:
\
- **Authentication**: Login/signup
with Supabase Auth
\
- **CRUD Operations**: Create, Read, Update, Delete events
- **Real-time subscriptions**: Live updates when events change
- **Categories**: Fetch and manage marketing categories
- **Event filtering**: Filter by category, date range, status
- **Search**: Quick search through event titles and descriptions

## Data Structure (Events):
\`\`\`typescript
interface Event {
  id: string
  user_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  category_id: string
  campaign_type: "email" | "social" | "content" | "ads" | "events" | "analytics"
  status: "planned" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  budget?: number
  is_all_day: boolean
}
\`\`\`

## Technical Requirements:
\
- **React
with TypeScript**
: Use functional components and hooks
- **Supabase Client**: Install and configure
@supabase
;/-aabejpsssu
\
- **Date handling**: Use date-fns
for date manipulation
\
- **Drag & Drop**
: Implement
with @dnd-kit or
react - dnd
\
- **State Management**: React Query
for server state, React hooks for local state
\
- **Styling**
: Tailwind CSS
with custom color
schemes
for marketing categories
\
- **Icons**
: Lucide React
for consistent iconography

\
#
#
Key
Components
to
Build:
\
1. **CalendarLayout**: Main container
with view switcher
2. **MonthView**
: Grid-based month calendar
3. **WeekView**: 7-day detailed view
4. **DayView**: Single day timeline
5. **EventModal**: Create/edit event form
6. **EventCard**: Reusable event display component
7. **Sidebar**: Categories, filters, and mini calendar
8. **AuthWrapper**: Authentication handling

## Color Scheme (Marketing Categories):
- Email Marketing: #EF4444 (Red)
- Social Media: #3B82F6 (Blue)  
- Content Creation: #10B981 (Green)
- Advertising: #F59E0B (Amber)
- Events: #8B5CF6 (Purple)
- Analytics: #6B7280 (Gray)

## Event Handlers:
- **onCreate**: Add new event to database and update local state
- **onUpdate**: Update existing event (drag, resize, edit)
\
- **onDelete**: Remove event
with confirmation
- **onViewChange**
: Switch between calendar views
- **onDateChange**: Navigate to different dates/months

## Real-time Features:
- Subscribe to event changes
using Supabase
subscriptions - Auto - refresh
when
events
are
added / updated / deleted - Show
live
indicators
for concurrent users

Make it
feel
like
a
premium
marketing
tool
with smooth animations, intuitive
interactions, and
a
professional
aesthetic.Focus
on
usability
for marketing teams managing campaigns
and
events.

# College Management System - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Productivity-Focused)

Drawing inspiration from modern productivity applications like Linear, Notion, and Vercel Dashboard, this design prioritizes clarity, efficiency, and professional aesthetics. The system emphasizes information hierarchy, scannable layouts, and intuitive navigation for an educational management context.

**Core Principles:**
- Clean, professional interface optimized for data-heavy workflows
- Consistent component patterns across all role-based views
- Efficient information density without visual clutter
- Clear visual hierarchy for complex administrative tasks

---

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - UI text, forms, tables
- Monospace: JetBrains Mono - IDs, codes, technical data

**Hierarchy:**
- Page Titles: text-3xl font-semibold
- Section Headers: text-xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Labels: text-sm font-medium
- Captions/Meta: text-xs font-normal

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4
- Form field spacing: space-y-4

**Container Strategy:**
- Main content area: max-w-7xl mx-auto px-6
- Form containers: max-w-2xl
- Full-width tables: w-full with horizontal scroll on mobile
- Sidebar: Fixed width 16rem (w-64) on desktop, collapsible on mobile

---

## Component Library

### Navigation & Layout

**Sidebar Navigation:**
- Fixed left sidebar (w-64) with collapse toggle
- Logo/institution name at top (h-16 flex items-center)
- Navigation items: px-3 py-2 rounded-md with icon + text
- Active state: subtle background treatment
- Role indicator badge below navigation
- Logout button at bottom with user profile pill

**Top Bar:**
- Height: h-16
- Contains: Page title (left), breadcrumbs (center), user menu (right)
- Search bar for applicable pages (w-96 max-w-full)

### Forms & Inputs

**Input Fields:**
- Standard height: h-10
- Rounded corners: rounded-md
- Label above input: text-sm font-medium mb-1.5
- Error messages: text-xs mt-1
- Helper text: text-xs

**Form Layouts:**
- Single column for simple forms
- Two-column grid (grid-cols-2 gap-4) for wider forms on desktop
- Always single column on mobile
- Submit buttons: right-aligned with Cancel (text button) + Primary button pair

### Data Display

**Tables:**
- Striped rows for readability
- Column headers: font-medium text-sm sticky top-0
- Row height: py-3
- Hover state on rows
- Action column (right-aligned) with icon buttons
- Pagination controls below table (items per page + page numbers)

**Cards:**
- Padding: p-6
- Border treatment with rounded-lg
- Shadow: subtle elevation
- Header section with title + actions
- Content area with appropriate spacing
- Footer for metadata/actions when needed

**Stats/Metrics Cards:**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
- Icon + Label + Large Number + Trend indicator
- Padding: p-4

### Interactive Elements

**Buttons:**
- Primary: px-4 py-2 rounded-md font-medium
- Secondary: Similar sizing with different treatment
- Icon buttons: w-10 h-10 rounded-md (for actions)
- Button groups: flex gap-2

**Modals/Dialogs:**
- Centered overlay with backdrop
- Max width: max-w-2xl for forms, max-w-4xl for data views
- Header: p-6 with title + close button
- Content: p-6 with max-h-[70vh] overflow-y-auto
- Footer: p-6 with action buttons

**Filters & Search:**
- Horizontal filter bar above tables
- Combine: Search input + Dropdown filters (Department, Role, Status)
- Apply/Clear buttons
- Active filter chips below bar showing selected filters

---

## Page-Specific Layouts

### Login Page
- Centered card: max-w-md mx-auto on neutral background
- Institution logo/name at top
- Login form with Replit Auth options
- Role selection if needed post-authentication

### Dashboard (All Roles)
- Grid of stat cards at top (4 columns on desktop)
- Quick actions section with prominent cards
- Recent activity feed or relevant data tables
- Role-specific widgets (announcements for students, pending approvals for admins)

### Academic Management (Admin)
- Two-panel layout: Program list (left, w-80) + Details/Form (right, flex-1)
- Program creation: Modal with tabbed interface (Basic Info, Disciplines, Syllabus)
- Syllabus upload: Drag-drop area with file list preview
- Course descriptions: Rich text editor area

### Identity Management (Admin)
- Search + Filters bar at top
- User table with: Photo, Name, ID, Role, Department, Status, Actions
- Row click opens detailed side panel (w-96 sliding from right)
- Add user: Full-page form or modal with multi-step wizard
- Bulk actions toolbar when rows selected

### Reporting System (Admin/Staff)
- Tab navigation: Attendance | Academic Results
- Each tab: Filter controls + Data table + Export button
- Inline editing for quick updates
- Batch upload option via modal

### Student Reports View
- Personal info card at top
- Tabbed view: Attendance | Grades | Schedule
- Read-only formatted tables
- Download/print options

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px - Stack all columns, hamburger sidebar
- Tablet: 768px - 1024px - 2-column grids, collapsed sidebar
- Desktop: > 1024px - Full multi-column layouts, expanded sidebar

**Mobile Adaptations:**
- Sidebar becomes drawer/overlay
- Tables scroll horizontally or convert to card views
- Multi-column forms become single column
- Filter dropdowns replace inline filter bars
- Reduced padding (p-4 instead of p-6)

---

## Accessibility Standards

- Focus indicators on all interactive elements (ring-2 offset-2)
- Proper label associations for all form inputs
- ARIA labels for icon-only buttons
- Keyboard navigation support throughout
- Skip navigation link for main content
- Consistent tab order
- Error states with clear messaging
- Sufficient contrast ratios maintained across interface
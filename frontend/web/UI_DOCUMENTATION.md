# Dental Practice Management System - Frontend UI Documentation

## Overview

Sophisticated UI system built with Next.js 15, shadcn/ui, and Tailwind CSS for the Dental Practice Management System.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── ui/               # Core shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── separator.tsx
│   │   │   └── tabs.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── main-layout.tsx
│   │   │   └── footer.tsx
│   │   └── [specialized]/    # Specialized components
│   │       ├── patient-card.tsx
│   │       ├── appointment-card.tsx
│   │       ├── stats-card.tsx
│   │       ├── odontogram.tsx
│   │       └── data-table.tsx
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page
│   ├── lib/
│   │   ├── utils.ts          # Utility functions (cn helper)
│   │   └── api.ts            # API client
│   ├── hooks/
│   │   └── use-toast.ts      # Toast hook
│   ├── globals.css           # Global styles + CSS variables
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (redirects to dashboard)
└── components.json           # shadcn/ui configuration

```

## Core Components

### UI Components (`/app/components/ui/`)

All components follow shadcn/ui patterns with full TypeScript support:

- **Button**: Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Card**: Container with header, content, footer sections
- **Input**: Form input with proper styling
- **Label**: Accessible form labels
- **Badge**: Status indicators with color variants
- **Table**: Data table with header, body, footer
- **Dialog**: Modal dialogs
- **Dropdown Menu**: Contextual menus
- **Toast**: Notification system
- **Skeleton**: Loading placeholders
- **Separator**: Visual dividers
- **Tabs**: Tabbed interfaces

### Layout Components (`/app/components/layout/`)

#### Sidebar
- Collapsible navigation sidebar
- Active route highlighting
- Icon-based menu items
- Responsive design

#### Header
- Search functionality
- Notification dropdown (with badge counter)
- User menu dropdown
- Sticky positioning

#### MainLayout
- Combines Sidebar + Header
- Responsive flex layout
- Overflow handling

#### Footer
- Copyright information
- Quick links

### Specialized Components

#### PatientCard
- Patient information display
- Status badge (active/inactive)
- Contact details with icons
- Next appointment info
- Action buttons (View Details, Schedule)

#### AppointmentCard
- Appointment details
- Status badges (scheduled, confirmed, completed, cancelled)
- Date/time display with icons
- Conditional action buttons

#### StatsCard
- Animated card with Framer Motion
- Icon display
- Trend indicators (positive/negative)
- Optional description

#### Odontogram
- Interactive tooth chart
- Click to toggle tooth status
- Color-coded status (healthy, cavity, filled, missing, treatment)
- Upper and lower arcades

#### DataTable
- Generic reusable data table
- Search functionality
- Pagination
- Custom column rendering
- TypeScript generics for type safety

## API Client (`/app/lib/api.ts`)

Centralized API client with:
- JWT token handling
- Error handling
- Type-safe endpoints
- Methods for all resources (patients, appointments, treatments, payments, finance)

Example usage:
```typescript
import apiClient from '@/app/lib/api'

// Fetch dashboard data
const data = await apiClient.getDashboard(token)

// Create patient
const patient = await apiClient.createPatient({
  name: "John Doe",
  email: "john@example.com"
}, token)
```

## Dashboard Page

The main dashboard includes:

1. **Header Section**
   - Title and description
   - Quick action buttons (New Patient, New Appointment)

2. **Stats Cards** (4 animated cards)
   - Today's Appointments
   - Patients Attended
   - Today's Income
   - Active Treatments
   - Each with trend indicators

3. **Revenue Chart**
   - Bar chart showing monthly income vs expenses
   - Powered by Recharts
   - Responsive design

4. **Recent Appointments**
   - List of upcoming appointments
   - Uses AppointmentCard component

5. **Weekly Appointments Chart**
   - Line chart showing appointment distribution
   - Visual trend analysis

6. **Quick Stats Panel**
   - Total patients
   - Pending debts (highlighted in red)
   - Upcoming appointments
   - Monthly balance

## Styling System

### Color Palette (Medical/Clinical Theme)

Primary colors based on calming blues and whites:
- **Primary**: Sky blue (#0ea5e9) - for CTAs and accents
- **Secondary**: Soft gray - for supporting elements
- **Destructive**: Red - for warnings and errors
- **Success**: Green - for positive indicators
- **Muted**: Light gray - for backgrounds

### CSS Variables

All colors use CSS custom properties with HSL values:
```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 199 89% 48%;
...
```

### Dark Mode Support

Full dark mode support with `.dark` class variants.

## Design Principles

1. **Clean & Minimal**: Generous whitespace, clear hierarchy
2. **Clinical Aesthetic**: Professional, trustworthy design
3. **Accessibility**: Proper ARIA labels, keyboard navigation
4. **Responsive**: Mobile-first approach
5. **Performance**: Code splitting, lazy loading
6. **Type Safety**: Full TypeScript coverage

## Development

### Running the Dev Server

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

### Building for Production

```bash
npm run build
npm start
```

### Adding New Components

shadcn/ui components can be added with:
```bash
npx shadcn@latest add [component-name]
```

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Future Enhancements

Potential improvements:
- [ ] Authentication flow (login/register pages)
- [ ] Patient management pages
- [ ] Appointment calendar view
- [ ] Treatment plan builder
- [ ] Financial reports with advanced charts
- [ ] Print-friendly views
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Advanced odontogram with procedures tracking
- [ ] Real-time notifications (WebSocket)

## Component Usage Examples

### Using StatsCard
```tsx
<StatsCard
  title="Total Patients"
  value={156}
  icon={Users}
  trend={{ value: 12, isPositive: true }}
  description="Active patients this month"
/>
```

### Using DataTable
```tsx
<DataTable
  data={patients}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => <Badge>{value}</Badge>
    }
  ]}
  searchable={true}
  pageSize={10}
/>
```

### Using Toast
```tsx
import { useToast } from '@/app/hooks/use-toast'

const { toast } = useToast()

toast({
  title: "Success!",
  description: "Patient created successfully",
})
```

## Accessibility

All components include:
- Proper semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

## Performance Optimizations

- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Font optimization
- CSS purging (Tailwind)
- Server components where possible
- Minimal JavaScript bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Part of the Dental Practice Management System project.

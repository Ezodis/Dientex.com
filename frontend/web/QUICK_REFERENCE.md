# UI System Quick Reference

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

## Component Imports

```typescript
// UI Components
import { Button } from "@/app/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Badge } from "@/app/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"

// Layout
import { MainLayout } from "@/app/components/layout/main-layout"

// Specialized
import { StatsCard } from "@/app/components/stats-card"
import { PatientCard } from "@/app/components/patient-card"
import { DataTable } from "@/app/components/data-table"

// Hooks
import { useToast } from "@/app/hooks/use-toast"

// Utils
import { cn } from "@/app/lib/utils"

// API
import apiClient from "@/app/lib/api"
```

## Common Patterns

### Page Layout
```tsx
export default function MyPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Page Title</h1>
        {/* Your content */}
      </div>
    </MainLayout>
  )
}
```

### Loading State
```tsx
if (loading) {
  return (
    <MainLayout>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </MainLayout>
  )
}
```

### Error Handling
```tsx
if (error) {
  return (
    <MainLayout>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
```

### Form with Validation
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

const form = useForm({
  resolver: zodResolver(formSchema),
})

const onSubmit = async (data) => {
  const result = await apiClient.createPatient(data)
  toast({ title: "Success!" })
}
```

## Utility Classes

### Spacing
```
p-4    padding: 1rem
m-6    margin: 1.5rem
space-y-4    vertical spacing between children
gap-4    grid gap
```

### Colors
```
bg-primary    primary background
text-primary    primary text
bg-destructive    error/danger background
text-muted-foreground    muted text
```

### Layout
```
flex items-center justify-between
grid grid-cols-3 gap-4
container mx-auto
max-w-7xl
```

### Borders & Shadows
```
border rounded-lg
shadow-md
ring-2 ring-primary
```

## Icons (Lucide React)

```tsx
import { 
  Users, Calendar, DollarSign, Settings,
  Plus, Edit, Trash, Check, X,
  Search, Bell, Mail, Phone
} from "lucide-react"

<Users className="h-4 w-4" />
```

## API Client Methods

```typescript
// Dashboard
await apiClient.getDashboard(token)

// Patients
await apiClient.getPatients(token)
await apiClient.getPatient(id, token)
await apiClient.createPatient(data, token)
await apiClient.updatePatient(id, data, token)
await apiClient.deletePatient(id, token)

// Appointments
await apiClient.getAppointments(token)
await apiClient.createAppointment(data, token)
await apiClient.updateAppointment(id, data, token)

// Treatments
await apiClient.getTreatments(token)
await apiClient.createTreatment(data, token)

// Payments
await apiClient.getPayments(token)
await apiClient.createPayment(data, token)

// Finance
await apiClient.getFinancialSummary(token)
```

## Responsive Design

```tsx
// Mobile first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stacks on mobile, 2 cols on tablet, 4 on desktop */}
</div>

// Hide on mobile
<div className="hidden md:block">Desktop only</div>

// Show only on mobile
<div className="block md:hidden">Mobile only</div>
```

## Animation with Framer Motion

```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## Toast Notifications

```tsx
const { toast } = useToast()

// Success
toast({
  title: "Success!",
  description: "Operation completed",
})

// Error
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong",
})
```

## Environment Variables

In your component:
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## Tailwind Config Shortcuts

Available via tailwind.config.ts:
- `bg-background` - Main background
- `text-foreground` - Main text
- `bg-card` - Card background
- `bg-primary` - Primary color
- `bg-destructive` - Error color
- `rounded-lg` - Border radius (uses --radius)

## Common Component Combos

### Card with Icon Header
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Title</CardTitle>
      <Users className="h-5 w-5 text-muted-foreground" />
    </div>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Search Input
```tsx
<div className="relative">
  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input placeholder="Search..." className="pl-8" />
</div>
```

### Action Buttons Group
```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</div>
```

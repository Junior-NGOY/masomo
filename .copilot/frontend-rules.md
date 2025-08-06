# Frontend Context - Masomo Pro Web
## GitHub Copilot Rules for Next.js Frontend

### Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand stores
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Fetch API with custom wrappers

### Project Structure
```
app/
├── (auth)/           # Authentication pages
├── (front)/          # Public pages
├── (back)/           # Admin dashboard
├── (school)/         # School-specific pages
└── api/              # API routes (minimal, prefer backend API)

components/
├── ui/               # shadcn/ui base components
├── dashboard/        # Dashboard-specific components
├── forms/            # Form components
└── frontend/         # Public-facing components
```

### Coding Rules

#### 1. Component Patterns
- Use functional components with TypeScript
- Prefer server components when possible
- Use client components only when needed ('use client')
- Follow shadcn/ui patterns for consistency

#### 2. Form Handling
- Always use React Hook Form + Zod
- Create reusable form components
- Include proper validation and error handling
- Use TypeScript interfaces for form data

#### 3. API Integration
- Use actions/ folder for server actions
- Implement proper error handling
- Show loading states during API calls
- Use consistent response handling

#### 4. State Management
- Use Zustand for global state
- Keep state minimal and focused
- Separate auth state from business logic

#### 5. Styling Guidelines
- Use Tailwind CSS classes
- Follow shadcn/ui design patterns
- Implement responsive design (mobile-first)
- Use CSS variables for theming

### Component Examples

#### Form Component Pattern
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email")
})

type FormData = z.infer<typeof FormSchema>

export function EntityForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema)
  })
  
  // Rest of component logic
}
```

#### Server Action Pattern
```typescript
'use server'
export async function createEntity(data: EntityCreateProps) {
  try {
    const response = await fetch(`${API_BASE_URL}/entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) throw new Error('Failed to create entity')
    return await response.json()
  } catch (error) {
    throw new Error('Creation failed')
  }
}
```

#### Dashboard Page Pattern
```typescript
import { DataTable } from '@/components/DataTableComponents'
import { EntityForm } from '@/components/forms'

export default function EntitiesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Entities</h1>
        <EntityForm />
      </div>
      <DataTable />
    </div>
  )
}
```

### API Communication
- Base URL stored in environment variables
- Consistent error handling across all API calls
- Use TypeScript interfaces that match backend types
- Implement proper loading and error states

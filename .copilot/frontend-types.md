# Frontend Types Context
## GitHub Copilot Type Definitions for Next.js App

### Form Validation Schemas (Zod)
```typescript
import * as z from 'zod'

// Student Form Schema
const StudentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  parentId: z.string().min(1, "Parent is required"),
  classId: z.string().min(1, "Class is required"),
  streamId: z.string().min(1, "Stream is required"),
  gender: z.enum(["MALE", "FEMALE"]),
  dob: z.string().min(1, "Date of birth is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  address: z.string().min(1, "Address is required"),
  schoolId: z.string().min(1, "School is required")
})

// Teacher Form Schema
const TeacherFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  departmentId: z.string().min(1, "Department is required"),
  qualification: z.string().min(1, "Qualification is required"),
  schoolId: z.string().min(1, "School is required")
})
```

### Component Props Types
```typescript
// Table Component Props
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  searchPlaceholder?: string
  onAdd?: () => void
  addButtonText?: string
}

// Form Component Props
interface FormComponentProps {
  mode: 'create' | 'edit'
  initialData?: any
  onSuccess?: () => void
  onCancel?: () => void
}

// Dashboard Layout Props
interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
}
```

### State Management Types (Zustand)
```typescript
// Auth Store
interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

// School Store
interface SchoolState {
  currentSchool: School | null
  schools: School[]
  setCurrentSchool: (school: School) => void
  fetchSchools: () => Promise<void>
}
```

### API Response Types
```typescript
// Standard API Response
interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Paginated Response
interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error: string | null
}
```

### Core Entity Types (synced with backend)
```typescript
// User Types
interface User {
  id: string
  email: string
  role: UserRole
  profile: UserProfile
  schoolId: string
  createdAt: string
  updatedAt: string
}

interface UserProfile {
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  gender: Gender
  dateOfBirth?: string
}

// School Management Types
interface School {
  id: string
  name: string
  address: string
  phone: string
  email: string
  website?: string
  logo?: string
  isActive: boolean
}

interface Student {
  id: string
  firstName: string
  lastName: string
  email?: string
  classId: string
  streamId: string
  parentId: string
  schoolId: string
  gender: Gender
  dateOfBirth: string
  admissionDate: string
  address: string
  studentNumber: string
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  departmentId: string
  schoolId: string
  gender: Gender
  dateOfBirth: string
  dateOfJoining: string
  qualification: string
  title: string
}

interface Class {
  id: string
  name: string
  level: string
  section: string
  schoolId: string
  academicYearId: string
}

interface Subject {
  id: string
  name: string
  code: string
  departmentId: string
  schoolId: string
}
```

### Navigation & Menu Types
```typescript
interface MenuItem {
  title: string
  href: string
  icon?: React.ComponentType
  children?: MenuItem[]
  roles?: UserRole[]
}

interface BreadcrumbItem {
  title: string
  href?: string
}
```

### Financial Management Types
```typescript
interface Fee {
  id: string
  name: string
  amount: number
  type: FeeType
  academicYearId: string
  schoolId: string
}

interface Payment {
  id: string
  studentId: string
  feeId: string
  amount: number
  paymentDate: string
  method: PaymentMethod
  status: PaymentStatus
  receiptNumber: string
}

enum FeeType {
  REGISTRATION = "REGISTRATION",
  TUITION = "TUITION",
  BOOKS = "BOOKS",
  TRANSPORT = "TRANSPORT",
  UNIFORM = "UNIFORM"
}

enum PaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  MOBILE_MONEY = "MOBILE_MONEY"
}

enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}
```

### Page Props Patterns
```typescript
// Page component props pattern
interface PageProps {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Dashboard page props
interface DashboardPageProps extends PageProps {
  params: {
    schoolId: string
  }
}

// Dynamic route props
interface StudentPageProps extends PageProps {
  params: {
    schoolId: string
    studentId: string
  }
}
```

### Common UI Patterns
- **Forms**: Always use React Hook Form + Zod validation
- **Tables**: Use shadcn/ui DataTable with sorting/filtering  
- **Modals**: Use shadcn/ui Dialog component
- **Notifications**: Use toast notifications for feedback
- **Loading**: Show skeleton loaders during data fetching
- **Error**: Display user-friendly error messages
- **File Upload**: Use drag-and-drop with progress indication
- **Date Picker**: Use shadcn/ui Calendar component
- **Search**: Implement debounced search with filters

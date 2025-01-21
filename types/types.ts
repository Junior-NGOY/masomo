export type Contact = {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  country: string;
  schoolPage: string;
  students: number;
  role: string;
  media: string;
  message: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};
// Class.ts
/* export type Class = {
  id: string;
  title: string;
  slug: string;
  streams: Stream[];
  streams: Student[];
  createdAt: string;
  updatedAt: string;
  //classProps: Record<string, unknown>;
}; */
export type Department = {
  id: string;
  name: string;
  slug: string;
  hodId?: string;
  hodName?: string;
  hodStartDate?: string;
  budget?: number;
  budgetYear?: string;
  teachers: StreamWithCount[];
  subjects: StreamWithCount[];
  createdAt: string;
  updatedAt: string;
};
export type DepartmentBrief = {
  id: string;
  name: string;
};
export type ClassBrief = {
  id: string;
  title: string;
};
export type SubjectBrief = {
  id: string;
  name: string;
};
export type Class = {
  id: string;
  title: string;
  slug: string;
  streams: StreamWithCount[];
  _count: { students: number };
  createdAt: string;
  updatedAt: string;
  //classProps: Record<string, unknown>;
};

// Stream.ts
export type Stream = {
  id: string;
  title: string;
  slug: string;
  classId: string;
  class: Class;
  createdAt: string;
  updatedAt: string;
};
export type StreamWithCount = {
  id: string;
  title: string;
  slug: string;
  classId: string;
  _count: { students: number };
  createdAt: string;
  updatedAt: string;
};

export type ClassCreateProps = {
  title: string;
  //slug: string;
};
export type DepartmentCreateProps = {
  name: string;
};

export type SubjectCreateProps = {
  name: string;
  code: string;
  shortName: string;
  category: string;
  type: string;
  departmentId: string;
  departmentName: string;
};
export type StreamCreateProps = {
  title: string;
  // slug: string;
  classId: string;
};

export type Parent = {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  relationship: string;
  email: string;
  NIN: string;
  gender: string;
  dob: string;
  phone: string;
  nationality: string;
  whatsappNo: string;
  imageUrl: string;
  contactMethod: string;
  occupation: string;
  address: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type Student = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  parentId: string;
  classId: string;
  streamId: string;
  parentName?: string;
  classTitle?: string;
  streamTitle?: string;
  password: string;
  imageUrl: string;
  phone: string;
  state: string;
  BCN: string; // Birth Certificate Number
  nationality: string;
  religion: string;
  gender: string;
  dob: string;
  rollNo: string;
  regNo: string;
  admissionDate: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type Subject = {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Basic information
  name: string; // e.g Mathematics, Science, English
  slug: string; // unique
  code: string; // e.g MTH101, PHY101, ENG101
  shortName?: string; // e.g MTH, PHY, ENG

  // Academic details
  category: SubjectCategory; // e.g Core, Elective, Compulsory
  type: SubjectType; // e.g Theory, Practical
  passingMarks?: number; // e.g 40, 50, 60
  totalMarks?: number; // e.g 100, 200, 300

  departmentId: string; // foreign key to department
  departmentName: string;

  // Additional settings
  isActive: boolean;
  isOptional: boolean;
  hasTheory: boolean;
  hasPractical: boolean;

  // If practical
  labRequired: boolean;
};
enum SubjectCategory {
  CORE = "CORE",
  ELECTIVE = "ELECTIVE",
  ADDITIONAL = "ADDITIONAL",
  VOCATIONAL = "VOCATIONAL",
  LANGUAGE = "LANGUAGE",
  EXTRA_CURRICULAR = "EXTRA_CURRICULAR"
}
enum SubjectType {
  THEORY = "THEORY",
  PRACTICAL = "PRACTICAL",
  BOTH = "BOTH"
}
export enum Gender {
  Male = "MALE",
  Female = "FEMALE"
  // Other = "Other"
}

export type TeacherCreateProps = {
  title: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNo: string;
  nationality: string;
  NIN: string;
  gender: Gender;
  dateOfBirth: string;
  contactMethod: string;
  password: string;
  dateOfJoining: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  mainSubject: string;
  mainSubjectId: string;
  subjects: string[];
  classIds: string[];
  classes: string[];
  imageUrl: string;
  experience: number;
  address: string;
};
export type Teacher = {
  id: string;
  title: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNo: string;
  nationality: string;
  NIN: string;
  gender: Gender;
  dateOfBirth: string;
  contactMethod: string;
  password: string;
  dateOfJoining: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  mainSubject: string;
  mainSubjectId: string;
  subjects: string[];
  classIds: string[];
  classes: string[];
  imageUrl: string;
  experience: number;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export interface User {
  createdAt: string;
  email: string;
  id: string;
  image?: string | null;
  name: string;
  phone?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  schoolId?: string | null;
  schoolName?: string | null;
  updatedAt: string;
}

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

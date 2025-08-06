"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  BookOpen,
  Calendar,
  ClipboardList,
  Beaker,
  CheckCircle,
  XCircle,
  Plus,
  Book
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import SubjectForm from "./forms/academics/subject-form";
import { Subject, SubjectCategory, SubjectType } from "@/types/types";

/* interface Subject {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  code: string;
  shortName?: string;
  category: SubjectCategory;
  type: SubjectType;
  passingMarks?: number;
  totalMarks?: number;
  departmentId: string;
  departmentName: string;
  isActive: boolean;
  isOptional: boolean;
  hasTheory: boolean;
  hasPractical: boolean;
  labRequired: boolean;
} */

export type DepartmentOption = {
  value: string;
  label: string;
};
export default function SubjectListing({
  departments,
  subjects
}: {
  departments: DepartmentOption[];
  subjects: Subject[];
}) {
  // Mock data - replace with actual data fetching
  /*  const [subjects] = useState<Subject[]>([
    {
      id: "1",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-12-01"),
      name: "Mathematics",
      slug: "mathematics",
      code: "MTH101",
      shortName: "MTH",
      category: SubjectCategory.CORE,
      type: SubjectType.THEORY,
      passingMarks: 40,
      totalMarks: 100,
      departmentId: "dept1",
      departmentName: "Science Department",
      isActive: true,
      isOptional: false,
      hasTheory: true,
      hasPractical: false,
      labRequired: false
    }
    // Add more subjects as needed
  ]); */

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
    subjects[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Subjects</h2>
          </div>
          <SubjectForm departments={departments} />
        </div>
        {subjects.length > 0 ? (
          <>
            <ScrollArea className="h-[calc(100vh-65px)]">
              <div className="p-3 space-y-2">
                {subjects.map((subject, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg flex items-center justify-between hover:bg-accent cursor-pointer group ${
                      selectedSubject?.id === subject?.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{subject?.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.code}
                      </span>
                    </div>
                    <div className="space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="p-4">
            <h2>No subjects</h2>
          </div>
        )}
      </div>

      {/* Main Content */}
      {subjects.length > 0 && selectedSubject ? (
        <div className="flex-1 overflow-auto">
          {selectedSubject ? (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">
                    {selectedSubject?.name}
                  </h1>
                  <p className="text-muted-foreground">
                    {selectedSubject.code}
                  </p>
                </div>
                <Button>Edit Subject</Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subject Created
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {format(selectedSubject.createdAt, "MMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Department
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedSubject.departmentName}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Marks</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedSubject.totalMarks}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Passing: {selectedSubject.passingMarks}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Category:</span>
                      <Badge>{selectedSubject.category}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Type:</span>
                      <Badge variant="secondary">{selectedSubject.type}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Optional:</span>
                      {selectedSubject.isOptional ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Active:</span>
                      {selectedSubject.isActive ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subject Components</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Theory:</span>
                      {selectedSubject.hasTheory ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Practical:</span>
                      {selectedSubject.hasPractical ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Lab Required:</span>
                      {selectedSubject.labRequired ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Select a subject to view details
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          No subjects found
        </div>
      )}
    </div>
  );
}

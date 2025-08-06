"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Plus,
  UserCircle,
  GraduationCap,
  School
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import DepartmentForm from "./forms/academics/department-form";
import { Department } from "@/types/types";

/* interface Department {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  hodId: string | null;
  hodStartDate: Date | null;
  budget: number | null;
  budgetYear: string | null;
  teachers: Array<{ id: string; name: string }>;
  subjects: Array<{ id: string; name: string }>;
  hodName?: string;
} */

export default function DepartmentListing({
  departments
}: {
  departments: Department[];
}) {
  // Mock data - replace with actual data fetching
  /* const [departments] = useState<Department[]>([
    {
      id: "1",
      name: "Computer Science",
      slug: "computer-science",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-12-01"),
      hodId: "hod1",
      hodStartDate: new Date("2023-01-01"),
      budget: 50000,
      budgetYear: "2023-2024",
      teachers: [
        { id: "t1", name: "John Doe" },
        { id: "t2", name: "Jane Smith" }
      ],
      subjects: [
        { id: "s1", name: "Programming" },
        { id: "s2", name: "Database Systems" }
      ],
      hodName: "Dr. Robert Wilson"
    }
    // Add more departments as needed
  ]); */

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(departments[0]);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className=" hidden md:flex w-80 flex-col border-r bg-muted/30">
        <div className="border-b pb-1">
          <div className="flex items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-2">
              <School className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Departments</h2>
            </div>
            <DepartmentForm />
          </div>
        </div>
        {departments.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-65px)]">
            <div className="p-3 space-y-2">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className={`p-3 rounded-lg flex items-center justify-between hover:bg-accent cursor-pointer group ${
                    selectedDepartment?.id === dept.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <span className="font-medium">{dept.name}</span>
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
        ) : (
          <div className="p-4">No departments</div>
        )}
      </div>

      {/* Main Content */}
      {selectedDepartment && (
        <>
          <div className="flex-1 overflow-auto">
            {selectedDepartment ? (
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">
                    {selectedDepartment.name} Department
                  </h1>
                  <Button>Edit Department</Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Department Created
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {format(selectedDepartment.createdAt, "MMM d, yyyy")}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Annual Budget
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${selectedDepartment.budget?.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Fiscal Year: {selectedDepartment.budgetYear}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        HOD Start Date
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedDepartment.hodStartDate
                          ? format(
                              selectedDepartment.hodStartDate,
                              "MMM d, yyyy"
                            )
                          : "Not assigned"}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Head of Department
                      </CardTitle>
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedDepartment.hodName || "Not assigned"}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle>Teachers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        {[
                          { id: "t1", name: "John Doe" },
                          { id: "t2", name: "Jane Smith" }
                        ].map((teacher, index) => (
                          <div key={teacher.id}>
                            <div className="flex items-center justify-between py-2">
                              <span>{teacher?.name}</span>
                              <Button variant="ghost" size="sm">
                                View Profile
                              </Button>
                            </div>
                            {index < selectedDepartment.teachers.length - 1 && (
                              <Separator />
                            )}
                          </div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle>Subjects</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        {[
                          { id: "s1", name: "Programming" },
                          { id: "s2", name: "Database Systems" }
                        ].map((subject, index) => (
                          <div key={subject.id}>
                            <div className="flex items-center justify-between py-2">
                              <span>{subject.name}</span>
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </div>
                            {index < selectedDepartment.subjects.length - 1 && (
                              <Separator />
                            )}
                          </div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  Select a department to view details
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

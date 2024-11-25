"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ClassForm from "./forms/academics/class-form";
import StreamForm from "./forms/academics/stream-form";

interface ClassItem {
  id: number;
  name: string;
  students: number;
  sections: number;
}

interface SectionItem {
  name: string;
  teacher: string;
  students: number;
}

type SectionsType = {
  [key: number]: SectionItem[];
};

// Sample data
const classes: ClassItem[] = [
  { id: 5, name: "Class 5", students: 120, sections: 3 },
  { id: 6, name: "Class 6", students: 80, sections: 2 },
  { id: 7, name: "Class 7", students: 100, sections: 4 },
  { id: 8, name: "Class 8", students: 95, sections: 3 },
  { id: 9, name: "Class 9", students: 75, sections: 2 }
];

const sections: SectionsType = {
  5: [
    { name: "5A", teacher: "Ms. Sarah", students: 40 },
    { name: "5B", teacher: "Mr. John", students: 38 },
    { name: "5C", teacher: "Ms. Emily", students: 42 }
  ],
  6: [
    { name: "6A", teacher: "Mr. James", students: 40 },
    { name: "6B", teacher: "Ms. Lisa", students: 40 }
  ]
  // Add more sections for other classes as needed
};

export function ClassListing() {
  const [selectedClass, setSelectedClass] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Classes</h2>
            {/* <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
              </Button> */}
            <span className="sr-only">Add Class</span>
            <ClassForm />
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)] flex-1">
          <div className="px-2 space-y-2">
            {filteredClasses.map((classItem) => (
              <div
                key={classItem.id}
                className={cn(
                  "w-full p-4 text-left hover:bg-gray-50 flex flex-col gap-1 border-b cursor-pointer",
                  selectedClass === classItem.id && "bg-gray-100"
                )}
                onClick={() => setSelectedClass(classItem.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{classItem.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {classItem.sections} sections
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit {classItem.name}</span>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {classItem.name}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {classItem.students} students
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Classes</span>
                </Button>
                <span>Classes</span>
                <span>/</span>
                <span>Class {selectedClass}</span>
              </div>
              <h1 className="text-2xl font-semibold">Class {selectedClass}</h1>
            </div>
           <StreamForm/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections[selectedClass]?.map((section) => (
            <div
              key={section.name}
              className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold">{section.name}</h3>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {section.name}</span>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {section.name}</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Class Teacher: {section.teacher}</p>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {section.students} students
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

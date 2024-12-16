"use client";

import { useState } from "react";
import { Search, Users, Pencil, Trash2, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ClassForm from "./forms/academics/class-form";
import StreamForm from "./forms/academics/stream-form";
import { Class } from "@/types/types";
import Image from "next/image";

/* interface ClassItem {
  id: number;
  name: string;
  students: number;
  sections: number;
}

interface SectionItem {
  name: string;
  teacher: string;
  students: number;
} */

/* type SectionsType = {
  [key: number]: SectionItem[];
}; */

export function ClassListing({ classes }: { classes: Class[] }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredClasses = classes.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const streams = classes.find((c) => c.id === selectedClass)?.streams || [];
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
                  <div className="flex w-full items-center gap-2">
                    <span className="font-medium">{classItem.title}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {classItem.streams.length} sections
                    </span>
                  </div>
                  <div className="flex   items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {classItem._count.students}
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit {classItem.id}</span>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {classItem.id}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {classItem._count.students} students
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      {selectedClass ? (
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Classes</span>
                  </Button>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {classes.find((c) => c.id === selectedClass)?.title}
                    </h2>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>Classes</span>
                      <span>/</span>
                      <span>
                        {classes.find((c) => c.id === selectedClass)?.title}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <h1 className="text-2xl font-semibold">Class {selectedClass}</h1> */}
              </div>
              <StreamForm classId={selectedClass} />
            </div>
          </div>

          {streams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes
                .find((c) => c.id === selectedClass)
                ?.streams.map((section) => (
                  <div
                    key={section.title}
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{section.title}</h3>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit {section.title}</span>
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">
                            Delete {section.title}
                          </span>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        Class Teacher: {/* {section.teacher} */} Junior NGOY
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        {/* //{section.students._count} students */}
                        {section?._count?.students} students
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center min-h-96 justify-center">
              <div className="flex flex-col items-center justify-center ">
                <Image
                  src={"/boite-vide.png"}
                  alt="pas de section"
                  height={512}
                  width={512}
                  className="w-36"
                />
                <p>Pas de sections pour cette classe...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 p-6">
          <p>Choisissez une classe pour voir les détails ...</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Student } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { StudentInfoModal } from "@/components/dashboard/modals/student-info-modal";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "student",
    header: "Name",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-1">
          <Avatar>
            <AvatarImage src={student.imageUrl || ""} alt={student.firstName} />
            <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="">
            <h2 className="font-medium capitalize">
              {student.firstName.toLowerCase()} {student.lastName.toLowerCase()}
            </h2>
            <p className="text-xm text-muted-foreground">{student.email}</p>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "class-stream",
    header: "Classe",
    cell: ({ row }) => {
      const class_section = row.original;
      return (
        <div className="">
          <h2 className="font-medium">{class_section.classTitle ?? ""}</h2>
          <p className="text-xm text-muted-foreground">
            {class_section.streamTitle ?? ""}
          </p>
        </div>
      );
    }
  },
  /* {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  }, */
  /* {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  }, */

  {
    accessorKey: "rollNumber",
    header: "Matricule",
    cell: ({ row }) => {
      const rollNo = row.original;
      return (
        <div className="">
          <h2 className="font-medium">{rollNo.regNo ?? ""}</h2>
          <p className="text-xm text-muted-foreground">{rollNo.rollNo ?? ""}</p>
        </div>
      );
    }
  },
  {
    id: "action",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("View", student.classId)}
        >
          View
        </Button>
      );
    }
  },
  {
    accessorKey: "view",
    header: "View",
    cell: ({ row }) => (
      <StudentInfoModal
        // onEdit={() => ""}
        // onDelete={() => ""}
        student={row.original}
      />
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <ActionColumn
          row={row}
          model="student"
          editEndpoint={`#`}
          id={student.id}
        />
      );
    }
  }
];

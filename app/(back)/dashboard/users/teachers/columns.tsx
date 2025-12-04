"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Parent, Teacher } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ParentInfoModal } from "@/components/dashboard/modals/parent-info-modal";
import Image from "next/image";
import { TeacherInfoModal } from "@/components/dashboard/modals/teacher-info-modal";

export const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "image",
    header: "View",
    cell: ({ row }) => {
      const teacher = row.original;
      return (
        <div className="flex items-center gap-1">
          <Image
            src={teacher.imageUrl || "/placeholder-avatar.png"}
            alt={teacher.firstName}
            width={512}
            height={512}
            className="w-10 h-10 rounded-full"
          />
          <div className="">
            <h2 className="font-medium capitalize">
              {teacher.firstName.toLowerCase()} {teacher.lastName.toLowerCase()}
            </h2>
            <p className="text-xm text-muted-foreground">
              {teacher.employeeId}
            </p>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "parents",
    header: "Contacts",
    cell: ({ row }) => {
      const teacher = row.original;
      return (
        <div className="">
          <h2 className="font-medium">{teacher.email.toLowerCase()}</h2>
          <p className="text-xm text-muted-foreground">{teacher.phone}</p>
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
    accessorKey: "nationality",
    header: "Country"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const teacher = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("View", teacher.createdAt)}
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
      <TeacherInfoModal
        onEdit={() => ""}
        onDelete={() => ""}
        teacher={row.original}
      />
    )
  }
];

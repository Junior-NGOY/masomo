"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Parent } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContactInfoModal } from "@/components/DataTableComponents/ContactCard";
import { ParentInfoModal } from "@/components/dashboard/modals/parent-info-modal";
import Image from "next/image";

export const columns: ColumnDef<Parent>[] = [
  {
    accessorKey: "image",
    header: "View",
    cell: ({ row }) => {
      const parent = row.original;
      return (
        <div className="flex items-center gap-1">
          <Image
            src={parent.imageUrl || "/placeholder-avatar.png"}
            alt={parent.firstname}
            width={512}
            height={512}
            className="w-10 h-10 rounded-full"
          />
          <div className="">
            <h2 className="font-medium capitalize">
              {parent.firstname.toLowerCase()} {parent.lastname.toLowerCase()}
            </h2>
            <p className="text-xm text-muted-foreground">
              {parent.relationship}
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
      const parent = row.original;
      return (
        <div className="">
          <h2 className="font-medium">{parent.email.toLowerCase()}</h2>
          <p className="text-xm text-muted-foreground">{parent.phone}</p>
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
      const parent = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("View", parent.createdAt)}
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
      <ParentInfoModal
        onEdit={() => ""}
        onDelete={() => ""}
        parent={row.original}
      />
    )
  }
];

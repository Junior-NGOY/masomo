"use client";

import Image from "next/image";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import DateColumn from "@/components/DataTableColumns/DateColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact } from "@/types/types";
import { ContactInfoModal } from "@/components/DataTableComponents/ContactCard";
//import { Category } from "@prisma/client";
export const columns: ColumnDef<Contact>[] = [
  {
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
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={"/images/student.png" /* || "/placeholder.svg" */}
            alt={`Avatar of ${row.original.fullName}`}
          />
          <AvatarFallback>{row.original.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => <SortableColumn column={column} title="Name" />
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "phone",
    header: "Phone"
  },
  {
    accessorKey: "school",
    header: "School"
  },
  {
    accessorKey: "view",
    header: "View",
    cell: ({ row }) => <ContactInfoModal contact={row.original} />
  },
  /*  {
    id: "actions",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("View", contact.id)}
        >
          View
        </Button>
      );
    }
  }, */
  {
    accessorKey: "country",
    header: "Country"
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <ActionColumn
          row={row}
          model="contact"
          editEndpoint={`#`}
          id={contact.id}
        />
      );
    }
  }
];

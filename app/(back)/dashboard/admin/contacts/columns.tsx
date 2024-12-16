"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Contact } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContactInfoModal } from "@/components/DataTableComponents/ContactCard";

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "user",
    header: "Names",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="">
          <h2 className="font-medium capitalize">
            {contact.fullName.toLowerCase()}
          </h2>
          <p className="text-xm text-muted-foreground">{contact.school}</p>
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
    accessorKey: "contacts",
    header: "Contacts",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="">
          <h2 className="font-medium">{contact.email.toLowerCase()}</h2>
          <p className="text-xm text-muted-foreground">{contact.phone}</p>
        </div>
      );
    }
  },

  {
    accessorKey: "school",
    header: "School"
  },
  {
    accessorKey: "country",
    header: "Country"
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
    accessorKey: "view",
    header: "View",
    cell: ({ row }) => <ContactInfoModal contact={row.original} />
  }
];

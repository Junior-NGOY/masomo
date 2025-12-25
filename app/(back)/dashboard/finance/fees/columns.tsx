"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/utils/format";

// Define the shape of our data for the table
export type FeeDisplay = {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  amount: number;
  classNames: string;
  classLevel: string;
  isRecurring: boolean;
  recurringLabel: string;
  // validClass: string; // If we want to filter by valid class logic
};

export const getColumns = (
  onDelete: (id: string) => void,
  onEdit: (fee: any) => void // Placeholder for future edit
): ColumnDef<FeeDisplay>[] => [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "typeLabel",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("typeLabel")}</Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => <div>{formatCurrency(row.getValue("amount"))}</div>,
  },
  {
    accessorKey: "classNames",
    header: "Classes / Niveau",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.getValue("classNames")}>
        {row.getValue("classNames")}
      </div>
    ),
  },
  {
    accessorKey: "recurringLabel",
    header: "Récurrence",
    cell: ({ row }) => {
      const isRecurring = row.original.isRecurring;
      return isRecurring ? (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          {row.getValue("recurringLabel")}
        </Badge>
      ) : (
        <span className="text-sm text-gray-500">Unique</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const fee = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onEdit(fee)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera le frais "{fee.name}".
                Impossible de supprimer si des paiements ont déjà été effectués.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => onDelete(fee.id)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

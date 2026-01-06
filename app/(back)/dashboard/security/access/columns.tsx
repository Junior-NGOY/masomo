"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type UserWithRole = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  isActive: boolean;
};

export const getColumns = (
  onManageAccess: (user: UserWithRole) => void,
  onViewDetails: (user: UserWithRole) => void,
  onToggleStatus: (user: UserWithRole) => void
): ColumnDef<UserWithRole>[] => [
  {
    accessorKey: "name",
    header: "Utilisateur",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{user.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rôle Actuel",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant="outline" className="flex w-fit items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          {user.role || "Aucun rôle"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Statut",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant={user.isActive ? "default" : "secondary"}>
          {user.isActive ? "Actif" : "Inactif"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copier ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onManageAccess(user)}>
              Gérer les accès
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewDetails(user)}>
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onToggleStatus(user)}
              className={user.isActive ? "text-red-600" : "text-green-600"}
            >
              {user.isActive ? "Désactiver" : "Activer"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

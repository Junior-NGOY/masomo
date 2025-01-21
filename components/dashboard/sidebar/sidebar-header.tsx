"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Plus,
  Sparkles,
  Sun
} from "lucide-react";
import React from "react";
import UserMenu from "./user-menu";
const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg"
};
export default function SidebarHeader() {
  return (
    <div>
      <div className="flex h-16 items-center gap-4 border-b px-4">
        <SidebarTrigger />
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            //value={searchQuery}
            //onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {/* <Button variant="outline" size="icon">
          <span className="sr-only">Toggle theme</span>
          <Sun className="h-5 w-5" />
        </Button> */}
        <Button variant="outline" size="icon">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add new</span>
        </Button>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserMenu />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        {/*   <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}
      </div>
    </div>
  );
}

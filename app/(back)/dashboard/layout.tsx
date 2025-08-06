import { getServerUser } from "@/actions/auth";
import AppSidebar from "@/components/dashboard/sidebar/app-sidebar";
import SidebarHeader from "@/components/dashboard/sidebar/sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Désactivé pour le mode démo - pas de vérification d'authentification
  /* const user = await getServerUser();
  if (!user) {
    redirect("/login");
  } */
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

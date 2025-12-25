import { getAllSchools } from "@/actions/schools";
import AppSidebar from "@/components/dashboard/sidebar/app-sidebar";
import SidebarHeader from "@/components/dashboard/sidebar/sidebar-header";
import SchoolInitializer from "@/components/school-initializer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* const user = await getServerUser();
  if (!user) {
    redirect("/login");
  } */
  const schools = await getAllSchools();
  const school = schools[0];
  return (
    <div>
      <SchoolInitializer school={school} />
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

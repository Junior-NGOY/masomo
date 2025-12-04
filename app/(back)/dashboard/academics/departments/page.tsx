"use client";

import DepartmentListing from "@/components/dashboard/department-listing";
import { useDepartments } from "@/hooks/useDepartments";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function DepartmentsPage() {
  const { departments, loading, error } = useDepartments();

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden md:flex w-80 flex-col border-r bg-muted/30 p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center text-red-500">
        Erreur lors du chargement des départements.
      </div>
    );
  }

  return (
    <div>
      <DepartmentListing departments={departments} />
    </div>
  );
}

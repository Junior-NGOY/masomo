"use client";

import { ClassListing } from "@/components/dashboard/class-listing";
import React from "react";
import { useClasses } from "@/hooks/useClasses";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassesPage() {
  const { classes, loading, error } = useClasses();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center text-red-500">
        Erreur lors du chargement des classes.
      </div>
    );
  }

  return <ClassListing classes={classes} />;
}

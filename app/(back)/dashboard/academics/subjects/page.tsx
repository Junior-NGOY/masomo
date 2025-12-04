"use client";

import SubjectListing from "@/components/dashboard/subject-listing";
import { useSubjects } from "@/hooks/useSubjects";
import { useBriefDepartments } from "@/hooks/useDepartments";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function SubjectsPage() {
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects();
  const { departments, loading: departmentsLoading, error: departmentsError } = useBriefDepartments();

  const loading = subjectsLoading || departmentsLoading;
  const error = subjectsError || departmentsError;

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-80 border-r bg-muted/30 p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-48" />
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
        Erreur lors du chargement des données.
      </div>
    );
  }

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  return (
    <SubjectListing
      subjects={subjects}
      departments={departmentOptions}
    />
  );
}

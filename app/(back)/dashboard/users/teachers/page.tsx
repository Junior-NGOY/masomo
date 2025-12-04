"use client";

import React from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { columns } from "./columns";
import { useTeachers } from "@/hooks/useTeachers";

export default function TeachersPage() {
  const { teachers, loading } = useTeachers();

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <TableHeader
        title="Enseignants"
        linkTitle="Ajouter un enseignant"
        href="/dashboard/users/teachers/new"
        data={teachers}
        model="teacher"
      />
      <div className="py-8">
        <DataTable data={teachers} columns={columns} />
      </div>
    </div>
  );
}

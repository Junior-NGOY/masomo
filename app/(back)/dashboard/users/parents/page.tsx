"use client";

import React from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { columns } from "./columns";
import { useParents } from "@/hooks/useParents";

export default function ParentsPage() {
  const { parents, loading } = useParents();

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <TableHeader
        title="Parents"
        linkTitle="Ajouter un parent"
        href="/dashboard/users/parents/new"
        data={parents}
        model="parent"
      />
      <div className="py-8">
        <DataTable data={parents} columns={columns} />
      </div>
    </div>
  );
}

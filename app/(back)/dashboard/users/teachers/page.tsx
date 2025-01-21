import React from "react";

//import { Contact } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { Teacher } from "@/types/types";

import { columns } from "./columns";
import { getAllTeachers } from "@/actions/teacher";

export default async function page() {
  const teachers: Teacher[] = (await getAllTeachers()) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Teachers"
        linkTitle="Add teacher"
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

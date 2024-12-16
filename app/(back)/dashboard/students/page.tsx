import React from "react";

//import { Contact } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { Student } from "@/types/types";

import { columns } from "./columns";
import { getAllStudents } from "@/actions/students";

export default async function page() {
  const students: Student[] = (await getAllStudents()) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Students"
        linkTitle="Add student"
        href="/dashboard/students/new"
        data={students}
        model="student"
      />
      <div className="py-8">
        <DataTable data={students} columns={columns} />
      </div>
    </div>
  );
}

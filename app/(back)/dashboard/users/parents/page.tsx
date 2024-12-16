import React from "react";

//import { Contact } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { Parent } from "@/types/types";
import { getAllParents } from "@/actions/parents";
import { columns } from "./columns";

export default async function page() {
  const parents: Parent[] = (await getAllParents()) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Parents"
        linkTitle="Add parent"
        href="/dashboard/users/parents/new"
        data={parents}
        model="contact"
      />
      <div className="py-8">
        <DataTable data={parents} columns={columns} />
      </div>
    </div>
  );
}

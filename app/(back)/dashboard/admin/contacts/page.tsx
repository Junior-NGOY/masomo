import React from "react";
import { columns } from "./columns";
//import { Contact } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import { getAllContacts } from "@/actions/admin";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { Contact } from "@/types/types";

export default async function page() {
  const contacts: Contact[] = (await getAllContacts()) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Contacts"
        linkTitle="Add Contact"
        href="/contact-us"
        data={contacts}
        model="contact"
      />
      <div className="py-8">
        <DataTable data={contacts} columns={columns} />
      </div>
    </div>
  );
}

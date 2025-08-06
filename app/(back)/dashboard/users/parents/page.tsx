import React from "react";

//import { Contact } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { Parent } from "@/types/types";
// import { getAllParents } from "@/actions/parents";
import { columns } from "./columns";

export default function page() {
  // TODO: Remplacer par l'appel API réel une fois le backend complété
  // const parents: Parent[] = (await getAllParents()) || [];
  const parents: Parent[] = [
    {
      id: "1",
      title: "Monsieur",
      firstname: "Jean",
      lastname: "Mukamba",
      NIN: "1-801-23-45678",
      email: "jean.mukamba@gmail.com",
      phone: "+243 991 234 567",
      occupation: "Ingénieur",
      address: "Avenue Bokassa, Commune de Lemba",
      gender: "MALE",
      whatsappNo: "+243 998 765 432",
      relationship: "FATHER",
      nationality: "Congolaise",
      dob: "1980-01-15",
      imageUrl: "",
      contactMethod: "phone",
      password: "password123",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Madame",
      firstname: "Marie",
      lastname: "Nsimba",
      NIN: "1-802-34-56789",
      email: "marie.nsimba@yahoo.fr",
      phone: "+243 992 345 678",
      occupation: "Infirmière",
      address: "Boulevard du 30 Juin, Gombe",
      gender: "FEMALE",
      whatsappNo: "+243 997 654 321",
      relationship: "MOTHER",
      nationality: "Congolaise",
      dob: "1985-03-22",
      imageUrl: "",
      contactMethod: "whatsapp",
      password: "password123",
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
    },
    {
      id: "3",
      title: "Monsieur",
      firstname: "Paul",
      lastname: "Kabamba",
      NIN: "1-803-45-67890",
      email: "paul.kabamba@hotmail.com",
      phone: "+243 993 456 789",
      occupation: "Professeur",
      address: "Quartier Righini, Lemba",
      gender: "MALE",
      whatsappNo: "+243 996 543 210",
      relationship: "FATHER",
      nationality: "Congolaise",
      dob: "1978-07-10",
      imageUrl: "",
      contactMethod: "email",
      password: "password123",
      createdAt: "2024-01-17",
      updatedAt: "2024-01-17",
    },
    {
      id: "4",
      title: "Madame",
      firstname: "Chantal",
      lastname: "Mbuyi",
      NIN: "1-804-56-78901",
      email: "chantal.mbuyi@gmail.com",
      phone: "+243 994 567 890",
      occupation: "Commerçante",
      address: "Marché Central, Kinshasa",
      gender: "FEMALE",
      whatsappNo: "+243 995 432 109",
      relationship: "MOTHER",
      nationality: "Congolaise",
      dob: "1982-11-05",
      imageUrl: "",
      contactMethod: "phone",
      password: "password123",
      createdAt: "2024-01-18",
      updatedAt: "2024-01-18",
    },
    {
      id: "5",
      title: "Docteur",
      firstname: "Daniel",
      lastname: "Tshisekedi",
      NIN: "1-805-67-89012",
      email: "daniel.tshisekedi@outlook.com",
      phone: "+243 995 678 901",
      occupation: "Médecin",
      address: "Avenue des Cliniques, Lingwala",
      gender: "MALE",
      whatsappNo: "+243 994 321 098",
      relationship: "FATHER",
      nationality: "Congolaise",
      dob: "1975-05-20",
      imageUrl: "",
      contactMethod: "email",
      password: "password123",
      createdAt: "2024-01-19",
      updatedAt: "2024-01-19",
    },
  ];
  return (
    <div className="p-8">
      <TableHeader
        title="Parents"
        linkTitle="Add parent"
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

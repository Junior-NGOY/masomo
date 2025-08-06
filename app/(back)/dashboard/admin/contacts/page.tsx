import React from "react";
import { columns } from "./columns";
//import { Contact } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
// import { getAllContacts } from "@/actions/admin";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { Contact } from "@/types/types";

export default function page() {
  // TODO: Remplacer par l'appel API réel une fois le backend complété
  // const contacts: Contact[] = (await getAllContacts()) || [];
  const contacts: Contact[] = [
    {
      id: "1",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      fullName: "Jean Mukamba",
      email: "jean.mukamba@gmail.com",
      phone: "+243 991 234 567",
      school: "École Primaire Masomo",
      country: "République Démocratique du Congo",
      schoolPage: "/schools/masomo-primary",
      students: 250,
      role: "Parent",
      media: "Email",
      message: "Bonjour, je souhaite obtenir plus d'informations sur vos programmes scolaires pour mon enfant.",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "2",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      fullName: "Marie Nsimba",
      email: "marie.nsimba@yahoo.fr",
      phone: "+243 992 345 678",
      school: "École Secondaire Saint-Joseph",
      country: "République Démocratique du Congo",
      schoolPage: "/schools/saint-joseph",
      students: 180,
      role: "Directrice",
      media: "Téléphone",
      message: "Je voudrais inscrire ma fille en CP1 pour la prochaine année scolaire. Quels sont les documents nécessaires?",
      createdAt: "2024-01-16T00:00:00Z",
      updatedAt: "2024-01-16T00:00:00Z",
    },
    {
      id: "3",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      fullName: "Paul Kabamba",
      email: "paul.kabamba@hotmail.com",
      phone: "+243 993 456 789",
      school: "Collège Excellence",
      country: "République Démocratique du Congo",
      schoolPage: "/schools/excellence",
      students: 320,
      role: "Enseignant",
      media: "WhatsApp",
      message: "Excellente école! Mon fils y est très épanoui. Merci pour votre professionnalisme.",
      createdAt: "2024-01-17T00:00:00Z",
      updatedAt: "2024-01-17T00:00:00Z",
    },
    {
      id: "4",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      fullName: "Chantal Mbuyi",
      email: "chantal.mbuyi@gmail.com",
      phone: "+243 994 567 890",
      school: "Institut Technique Moderne",
      country: "République Démocratique du Congo",
      schoolPage: "/schools/itm",
      students: 450,
      role: "Administratrice",
      media: "Email",
      message: "Puis-je avoir le calendrier des activités parascolaires pour ce trimestre?",
      createdAt: "2024-01-18T00:00:00Z",
      updatedAt: "2024-01-18T00:00:00Z",
    },
  ];
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

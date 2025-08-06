import React from "react";

//import { Contact } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { Teacher, Gender } from "@/types/types";

import { columns } from "./columns";
// import { getAllTeachers } from "@/actions/teacher";

export default function page() {
  // TODO: Remplacer par l'appel API réel une fois le backend complété
  // const teachers: Teacher[] = (await getAllTeachers()) || [];
  const teachers: Teacher[] = [
    {
      id: "1",
      title: "Professeur",
      employeeId: "EMP001",
      firstName: "Professeur",
      lastName: "Ngozi",
      email: "ngozi.teacher@masomo.cd",
      phone: "+243 991 111 222",
      whatsappNo: "+243 991 111 222",
      nationality: "Congolaise",
      NIN: "1-901-11-22233",
      gender: Gender.FEMALE,
      dateOfBirth: "1980-05-15",
      contactMethod: "email",
      password: "hashedpassword",
      dateOfJoining: "2024-01-10",
      designation: "Enseignante Primaire",
      departmentId: "1",
      departmentName: "Primaire",
      qualification: "Licence en Pédagogie",
      mainSubject: "Français",
      mainSubjectId: "1",
      subjects: ["Français", "Littérature"],
      classIds: ["1", "2"],
      classes: ["CP1", "CP2"],
      imageUrl: "",
      experience: 10,
      address: "Avenue Kasa-Vubu, Kalamu",
      createdAt: "2024-01-10T00:00:00.000Z",
      updatedAt: "2024-01-10T00:00:00.000Z",
    },
    {
      id: "2",
      title: "Professeur",
      employeeId: "EMP002",
      firstName: "Professeur",
      lastName: "Mbuyi",
      email: "mbuyi.teacher@masomo.cd",
      phone: "+243 992 222 333",
      whatsappNo: "+243 992 222 333",
      nationality: "Congolaise",
      NIN: "1-902-22-33344",
      gender: Gender.MALE,
      dateOfBirth: "1975-08-22",
      contactMethod: "email",
      password: "hashedpassword",
      dateOfJoining: "2024-01-11",
      designation: "Enseignant Primaire",
      departmentId: "1",
      departmentName: "Primaire",
      qualification: "Diplôme en Mathématiques",
      mainSubject: "Mathématiques",
      mainSubjectId: "2",
      subjects: ["Mathématiques", "Sciences"],
      classIds: ["3", "4"],
      classes: ["CE1", "CE2"],
      imageUrl: "",
      experience: 15,
      address: "Boulevard du 30 Juin, Gombe",
      createdAt: "2024-01-11T00:00:00.000Z",
      updatedAt: "2024-01-11T00:00:00.000Z",
    },
    {
      id: "3",
      title: "Professeur",
      employeeId: "EMP003",
      firstName: "Professeur",
      lastName: "Kasongo",
      email: "kasongo.teacher@masomo.cd",
      phone: "+243 993 333 444",
      whatsappNo: "+243 993 333 444",
      nationality: "Congolaise",
      NIN: "1-903-33-44455",
      gender: Gender.MALE,
      dateOfBirth: "1985-12-10",
      contactMethod: "email",
      password: "hashedpassword",
      dateOfJoining: "2024-01-12",
      designation: "Enseignant Primaire",
      departmentId: "1",
      departmentName: "Primaire",
      qualification: "Licence en Histoire",
      mainSubject: "Histoire",
      mainSubjectId: "4",
      subjects: ["Histoire", "Géographie"],
      classIds: ["5", "6"],
      classes: ["CM1", "CM2"],
      imageUrl: "",
      experience: 8,
      address: "Quartier Matonge, Kalamu",
      createdAt: "2024-01-12T00:00:00.000Z",
      updatedAt: "2024-01-12T00:00:00.000Z",
    },
    {
      id: "4",
      title: "Professeur",
      employeeId: "EMP004",
      firstName: "Professeur",
      lastName: "Mwamba",
      email: "mwamba.teacher@masomo.cd",
      phone: "+243 994 444 555",
      whatsappNo: "+243 994 444 555",
      nationality: "Congolaise",
      NIN: "1-904-44-55566",
      gender: Gender.FEMALE,
      dateOfBirth: "1978-03-25",
      contactMethod: "email",
      password: "hashedpassword",
      dateOfJoining: "2024-01-13",
      designation: "Enseignante Secondaire",
      departmentId: "2",
      departmentName: "Secondaire",
      qualification: "Licence en Anglais",
      mainSubject: "Anglais",
      mainSubjectId: "5",
      subjects: ["Anglais", "Communication"],
      classIds: ["7", "8"],
      classes: ["6ème", "5ème"],
      imageUrl: "",
      experience: 12,
      address: "Avenue Tombalbaye, Ngaliema",
      createdAt: "2024-01-13T00:00:00.000Z",
      updatedAt: "2024-01-13T00:00:00.000Z",
    },
  ];
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

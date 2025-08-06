// import { getAllDepartments } from "@/actions/departments";
import DepartmentListing from "@/components/dashboard/department-listing";
import React from "react";

export default function page() {
  // TODO: Remplacer par l'appel API réel une fois le backend complété
  // const departments = (await getAllDepartments()) || [];
  const departments = [
    {
      id: "1",
      name: "Primaire",
      slug: "primaire",
      hodId: "1",
      hodName: "Professeur Mukamba",
      budget: 50000,
      budgetYear: "2024",
      teachers: [
        {
          id: "1",
          title: "Enseignants CP",
          slug: "enseignants-cp",
          classId: "1",
          _count: { students: 5 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
        {
          id: "2", 
          title: "Enseignants CE",
          slug: "enseignants-ce",
          classId: "2",
          _count: { students: 4 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
      ],
      subjects: [
        {
          id: "1",
          title: "Français Primaire",
          slug: "francais-primaire",
          classId: "1",
          _count: { students: 150 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
        {
          id: "2",
          title: "Mathématiques Primaire",
          slug: "mathematiques-primaire", 
          classId: "1",
          _count: { students: 150 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
    {
      id: "2",
      name: "Secondaire",
      slug: "secondaire",
      hodId: "2",
      hodName: "Professeur Nsimba",
      budget: 75000,
      budgetYear: "2024",
      teachers: [
        {
          id: "3",
          title: "Enseignants 6ème",
          slug: "enseignants-6eme",
          classId: "7",
          _count: { students: 3 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
        {
          id: "4",
          title: "Enseignants 5ème",
          slug: "enseignants-5eme",
          classId: "8",
          _count: { students: 2 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
      ],
      subjects: [
        {
          id: "3",
          title: "Sciences Secondaire",
          slug: "sciences-secondaire",
          classId: "7",
          _count: { students: 80 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
        {
          id: "4",
          title: "Histoire-Géographie",
          slug: "histoire-geographie",
          classId: "7",
          _count: { students: 80 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Administration",
      slug: "administration",
      hodId: "3",
      hodName: "Monsieur Kabamba",
      budget: 30000,
      budgetYear: "2024",
      teachers: [],
      subjects: [],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
    {
      id: "4",
      name: "Sports",
      slug: "sports",
      hodId: "4",
      hodName: "Coach Mbuyi",
      budget: 20000,
      budgetYear: "2024",
      teachers: [
        {
          id: "5",
          title: "Professeurs d'EPS",
          slug: "professeurs-eps",
          classId: "9",
          _count: { students: 2 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
      ],
      subjects: [
        {
          id: "6",
          title: "Education Physique",
          slug: "education-physique",
          classId: "9",
          _count: { students: 200 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
    {
      id: "5",
      name: "Arts",
      slug: "arts",
      hodId: "5",
      hodName: "Madame Tshisekedi",
      budget: 15000,
      budgetYear: "2024",
      teachers: [
        {
          id: "6",
          title: "Professeurs d'Arts",
          slug: "professeurs-arts",
          classId: "10",
          _count: { students: 1 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
      ],
      subjects: [
        {
          id: "7",
          title: "Arts Plastiques",
          slug: "arts-plastiques",
          classId: "10",
          _count: { students: 120 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
        {
          id: "8",
          title: "Musique",
          slug: "musique",
          classId: "10",
          _count: { students: 100 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-10",
        },
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
  ];
  return (
    <div>
      <DepartmentListing departments={departments} />
    </div>
  );
}

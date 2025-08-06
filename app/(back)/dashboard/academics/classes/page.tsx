// import { getAllClasses } from "@/actions/classes";
import { ClassListing } from "@/components/dashboard/class-listing";
import React from "react";

export default function page() {
  // TODO: Remplacer par l'appel API réel une fois le backend complété
  // const classes = (await getAllClasses()) || [];
  const classes = [
    {
      id: "1",
      title: "CP1",
      slug: "cp1",
      streams: [
        {
          id: "1",
          title: "CP1 - A",
          slug: "cp1-a",
          classId: "1",
          _count: { students: 25 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        },
        {
          id: "2",
          title: "CP1 - B",
          slug: "cp1-b",
          classId: "1",
          _count: { students: 22 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        }
      ],
      _count: { students: 47 },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "2",
      title: "CP2", 
      slug: "cp2",
      streams: [
        {
          id: "3",
          title: "CP2 - A",
          slug: "cp2-a",
          classId: "2",
          _count: { students: 28 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        }
      ],
      _count: { students: 28 },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "3",
      title: "CE1",
      slug: "ce1",
      streams: [
        {
          id: "4",
          title: "CE1 - A",
          slug: "ce1-a",
          classId: "3",
          _count: { students: 30 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        }
      ],
      _count: { students: 30 },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "4",
      title: "CE2",
      slug: "ce2",
      streams: [
        {
          id: "5",
          title: "CE2 - A",
          slug: "ce2-a",
          classId: "4",
          _count: { students: 26 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        }
      ],
      _count: { students: 26 },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "5",
      title: "CM1",
      slug: "cm1",
      streams: [
        {
          id: "6",
          title: "CM1 - A",
          slug: "cm1-a",
          classId: "5",
          _count: { students: 24 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        }
      ],
      _count: { students: 24 },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "6",
      title: "CM2",
      slug: "cm2",
      streams: [
        {
          id: "7",
          title: "CM2 - A",
          slug: "cm2-a",
          classId: "6",
          _count: { students: 29 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        }
      ],
      _count: { students: 29 },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "7",
      title: "6ème",
      slug: "6eme",
      streams: [
        {
          id: "8",
          title: "6ème - A",
          slug: "6eme-a",
          classId: "7",
          _count: { students: 32 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        }
      ],
      _count: { students: 32 },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "8",
      title: "5ème",
      slug: "5eme",
      streams: [
        {
          id: "9",
          title: "5ème - A",
          slug: "5eme-a",
          classId: "8",
          _count: { students: 27 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        }
      ],
      _count: { students: 27 },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
  ];
  return <ClassListing classes={classes} />;
}

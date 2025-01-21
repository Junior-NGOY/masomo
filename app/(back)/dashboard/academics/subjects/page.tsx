import { getBriefDepartments } from "@/actions/departments";
import { getAllSubjects } from "@/actions/subjects";
import SubjectListing from "@/components/dashboard/subject-listing";
import React from "react";

export default async function page() {
  const departments = (await getBriefDepartments()) || [];
  const subjects = (await getAllSubjects()) || [];
  return (
    <SubjectListing
      subjects={subjects}
      departments={departments.map((item) => {
        return { value: item.id, label: item.name };
      })}
    />
  );
}

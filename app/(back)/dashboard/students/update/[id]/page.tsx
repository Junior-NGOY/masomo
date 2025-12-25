"use client";

import SingleStudentForm from "@/components/dashboard/forms/students/student-form";
import { useClasses } from "@/hooks/useClasses";
import { useParents } from "@/hooks/useParents";
import { getStudentById } from "@/actions/students";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UpdateStudentPage() {
  const { classes, loading: classesLoading } = useClasses();
  const { parents, loading: parentsLoading } = useParents();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    async function fetchStudent() {
      if (id) {
        try {
          const data = await getStudentById(id);
          setStudent(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchStudent();
  }, [id]);

  if (classesLoading || parentsLoading || loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
         <SingleStudentForm
           nextSeq={100} // Not needed for update but required by props
           classes={classes}
           parents={parents}
           editingId={id}
           initialData={student}
         />
      </div>
    </div>
  );
}

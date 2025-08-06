import React from "react";
import StudentGradesPage from "@/components/StudentGradesPage";

export default function StudentGradesRoute() {
  return (
    <div className="min-h-screen">
      <StudentGradesPage 
        studentId="student-1"
        studentName="Jean Mukendi"
        className="6ème Scientifique"
      />
    </div>
  );
}

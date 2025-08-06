import React from "react";
import StudentSchedulePage from "@/components/StudentSchedulePage";

export default function StudentScheduleRoute() {
  return (
    <div className="min-h-screen">
      <StudentSchedulePage 
        studentId="student-1"
        studentName="Jean Mukendi"
        className="6ème Scientifique"
      />
    </div>
  );
}

import React from "react";
import StudentGradesPage from "@/components/StudentGradesPage";
import StudentSchedulePage from "@/components/StudentSchedulePage";
import AcademicNavigation from "@/components/AcademicNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Page d'exemple montrant l'intégration complète du système académique
export default function AcademicDashboardExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs defaultValue="navigation" className="w-full">
        <div className="bg-white border-b">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="grades">Notes</TabsTrigger>
            <TabsTrigger value="schedule">Horaire</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="navigation" className="mt-0">
          <AcademicNavigation 
            userType="student"
            studentName="Jean Mukendi"
            className="6ème Scientifique"
            notifications={3}
          />
        </TabsContent>

        <TabsContent value="grades" className="mt-0">
          <StudentGradesPage 
            studentId="student-1"
            studentName="Jean Mukendi"
            className="6ème Scientifique"
          />
        </TabsContent>

        <TabsContent value="schedule" className="mt-0">
          <StudentSchedulePage 
            studentId="student-1"
            studentName="Jean Mukendi"
            className="6ème Scientifique"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

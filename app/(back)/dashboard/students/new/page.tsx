"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
import SingleStudentForm from "@/components/dashboard/forms/students/student-form";
import BulkStudentForm from "@/components/dashboard/forms/students/bulk-student-form";
import { InfoBanner } from "@/components/ui/info-banner";
import { useClasses } from "@/hooks/useClasses";
import { useParents } from "@/hooks/useParents";

export default function AdmissionTabs() {
  const { classes, loading: classesLoading } = useClasses();
  const { parents, loading: parentsLoading } = useParents();
  
  if (classesLoading || parentsLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Generate next sequence number (simplified - would ideally come from API)
  const nextSequence = 1001;

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Student Admission
          </CardTitle>
          <CardDescription className="text-center">
            Choose between single or bulk student admission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="single"
                className="flex items-center justify-center py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Single Student Admission
              </TabsTrigger>
              <TabsTrigger
                value="bulk"
                className="flex items-center justify-center py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="mr-2 h-4 w-4" />
                Bulk Student Admission
              </TabsTrigger>
            </TabsList>
            <Card className="border-t-4 border-blue-600 shadow">
              <CardContent className="">
                <TabsContent value="single">
                  <InfoBanner
                    message="Veuillez vous assurer que vous avez déjà créé le parent, la classe et le flux pour cet élève."
                    type="warning"
                  />
                  <SingleStudentForm
                    nextSeq={nextSequence}
                    classes={classes}
                    parents={parents}
                  />
                </TabsContent>
                <TabsContent value="bulk">
                  <BulkStudentForm />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

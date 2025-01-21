import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
import TeacherForm from "@/components/dashboard/forms/users/teacher-form";
import { getBriefClasses } from "@/actions/classes";
import { getBriefSubject } from "@/actions/subjects";
import { getBriefDepartments } from "@/actions/departments";

export default async function AdmissionTabs() {
  //Classes
  const classesData = (await getBriefClasses()) || [];
  const classes = classesData.map((item) => {
    return { label: item.title, value: item.id };
  });
  //Subjects
  const subjectsData = (await getBriefSubject()) || [];
  const subjects = subjectsData.map((item) => {
    return { label: item.name, value: item.id };
  });
  //Departments
  const departmentsData = (await getBriefDepartments()) || [];
  const departments = departmentsData.map((item) => {
    return { label: item.name, value: item.id };
  });
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <Card className="border-t-4 border-blue-600 shadow">
        <CardContent className="p-6">
          <TeacherForm
            classes={classes}
            departments={departments}
            subjects={subjects}
          />
        </CardContent>
      </Card>
    </div>
  );
}

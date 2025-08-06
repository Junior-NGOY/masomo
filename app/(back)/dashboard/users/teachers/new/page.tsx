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
// import { getBriefClasses } from "@/actions/classes";
// import { getBriefSubject } from "@/actions/subjects";
// import { getBriefDepartments } from "@/actions/departments";

export default function AdmissionTabs() {
  // TODO: Remplacer par les appels API réels une fois le backend complété
  //Classes
  // const classesData = (await getBriefClasses()) || [];
  const classesData = [
    { id: "1", title: "CP1" },
    { id: "2", title: "CP2" },
    { id: "3", title: "CE1" },
    { id: "4", title: "CE2" },
    { id: "5", title: "CM1" },
    { id: "6", title: "CM2" },
    { id: "7", title: "6ème" },
    { id: "8", title: "5ème" },
    { id: "9", title: "4ème" },
    { id: "10", title: "3ème" },
  ];
  const classes = classesData.map((item) => {
    return { label: item.title, value: item.id };
  });
  
  //Subjects
  // const subjectsData = (await getBriefSubject()) || [];
  const subjectsData = [
    { id: "1", name: "Français" },
    { id: "2", name: "Mathématiques" },
    { id: "3", name: "Sciences" },
    { id: "4", name: "Histoire-Géographie" },
    { id: "5", name: "Anglais" },
    { id: "6", name: "Education Physique" },
    { id: "7", name: "Arts Plastiques" },
    { id: "8", name: "Musique" },
  ];
  const subjects = subjectsData.map((item) => {
    return { label: item.name, value: item.id };
  });
  
  //Departments
  // const departmentsData = (await getBriefDepartments()) || [];
  const departmentsData = [
    { id: "1", name: "Primaire" },
    { id: "2", name: "Secondaire" },
    { id: "3", name: "Administration" },
    { id: "4", name: "Sports" },
    { id: "5", name: "Arts" },
  ];
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

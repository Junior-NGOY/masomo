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
// import { getAllClasses } from "@/actions/classes";
// import { getAllParents } from "@/actions/parents";
// import { getStudentNextSequence } from "@/actions/students";

export default function AdmissionTabs() {
  // TODO: Remplacer par les appels API réels une fois le backend complété
  // const classes = (await getAllClasses()) || [];
  const classes = [
    {
      id: "1",
      title: "CP1",
      slug: "cp1",
      stream: "Primaire",
      description: "Cours Préparatoire 1ère année",
      streams: [
        {
          id: "1",
          title: "CP1-A",
          slug: "cp1-a",
          classId: "1",
          _count: { students: 25 },
          createdAt: "2024-01-10T00:00:00.000Z",
          updatedAt: "2024-01-10T00:00:00.000Z",
        }
      ],
      _count: { students: 25 },
      createdAt: "2024-01-10T00:00:00.000Z",
      updatedAt: "2024-01-10T00:00:00.000Z",
    },
    {
      id: "2", 
      title: "CP2",
      slug: "cp2",
      stream: "Primaire",
      description: "Cours Préparatoire 2ème année",
      streams: [
        {
          id: "2",
          title: "CP2-A",
          slug: "cp2-a",
          classId: "2",
          _count: { students: 28 },
          createdAt: "2024-01-10T00:00:00.000Z",
          updatedAt: "2024-01-10T00:00:00.000Z",
        }
      ],
      _count: { students: 28 },
      createdAt: "2024-01-10T00:00:00.000Z",
      updatedAt: "2024-01-10T00:00:00.000Z",
    },
    {
      id: "3",
      title: "CE1", 
      slug: "ce1",
      stream: "Primaire",
      description: "Cours Élémentaire 1ère année",
      streams: [
        {
          id: "3",
          title: "CE1-A",
          slug: "ce1-a",
          classId: "3",
          _count: { students: 30 },
          createdAt: "2024-01-10T00:00:00.000Z",
          updatedAt: "2024-01-10T00:00:00.000Z",
        }
      ],
      _count: { students: 30 },
      createdAt: "2024-01-10T00:00:00.000Z",
      updatedAt: "2024-01-10T00:00:00.000Z",
    },
    {
      id: "4",
      title: "CE2",
      slug: "ce2", 
      stream: "Primaire",
      description: "Cours Élémentaire 2ème année",
      streams: [
        {
          id: "4",
          title: "CE2-A",
          slug: "ce2-a",
          classId: "4",
          _count: { students: 27 },
          createdAt: "2024-01-10T00:00:00.000Z",
          updatedAt: "2024-01-10T00:00:00.000Z",
        }
      ],
      _count: { students: 27 },
      createdAt: "2024-01-10T00:00:00.000Z",
      updatedAt: "2024-01-10T00:00:00.000Z",
    },
    {
      id: "5",
      title: "CM1",
      slug: "cm1",
      stream: "Primaire", 
      description: "Cours Moyen 1ère année",
      streams: [
        {
          id: "5",
          title: "CM1-A",
          slug: "cm1-a",
          classId: "5",
          _count: { students: 32 },
          createdAt: "2024-01-10T00:00:00.000Z",
          updatedAt: "2024-01-10T00:00:00.000Z",
        }
      ],
      _count: { students: 32 },
      createdAt: "2024-01-10T00:00:00.000Z",
      updatedAt: "2024-01-10T00:00:00.000Z",
    },
  ];
  
  // const parents = (await getAllParents()) || [];
  const parents = [
    {
      id: "1",
      title: "Monsieur",
      firstname: "Jean",
      lastname: "Mukamba",
      relationship: "FATHER",
      email: "jean.mukamba@gmail.com",
      NIN: "1-801-23-45678",
      gender: "MALE",
      dob: "1980-05-15",
      phone: "+243 991 234 567",
      nationality: "Congolaise",
      whatsappNo: "+243 991 234 567",
      imageUrl: "",
      contactMethod: "phone",
      occupation: "Ingénieur",
      address: "Avenue Bokassa, Commune de Lemba",
      password: "password123",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Madame",
      firstname: "Marie",
      lastname: "Nsimba",
      relationship: "MOTHER",
      email: "marie.nsimba@yahoo.fr",
      NIN: "1-802-34-56789",
      gender: "FEMALE",
      dob: "1985-08-22",
      phone: "+243 992 345 678",
      nationality: "Congolaise",
      whatsappNo: "+243 992 345 678",
      imageUrl: "",
      contactMethod: "whatsapp",
      occupation: "Infirmière",
      address: "Boulevard du 30 Juin, Gombe",
      password: "password123",
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
    },
    {
      id: "3",
      title: "Monsieur",
      firstname: "Paul",
      lastname: "Kabamba",
      relationship: "FATHER",
      email: "paul.kabamba@hotmail.com",
      NIN: "1-803-45-67890",
      gender: "MALE",
      dob: "1978-03-25",
      phone: "+243 993 456 789",
      nationality: "Congolaise",
      whatsappNo: "+243 993 456 789",
      imageUrl: "",
      contactMethod: "email",
      occupation: "Professeur",
      address: "Quartier Righini, Lemba",
      password: "password123",
      createdAt: "2024-01-17",
      updatedAt: "2024-01-17",
    },
  ];
  
  // const nextSequence = (await getStudentNextSequence()) || 0;
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

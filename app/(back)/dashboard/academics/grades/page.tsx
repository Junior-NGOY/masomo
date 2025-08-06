"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calculator,
  Trophy,
  TrendingUp,
  Users,
  FileText,
  Download,
  Filter,
  Search,
  Plus,
  GraduationCap
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import GradeEntryModal from "@/components/GradeEntryModal";
import StatsCard from "@/components/dashboard/StatsCard";

// Mock data - remplacer par des appels API réels
const mockGrades = [
  {
    id: "grade_001",
    studentName: "Mukendi Jean",
    subject: "Mathématiques",
    examName: "Contrôle Q1",
    marks: 85,
    totalMarks: 100,
    grade: "A",
    percentage: 85,
    date: "2025-01-20",
    className: "6ème Primaire A"
  },
  {
    id: "grade_002",
    studentName: "Kasongo Marie", 
    subject: "Mathématiques",
    examName: "Contrôle Q1",
    marks: 92,
    totalMarks: 100,
    grade: "A+",
    percentage: 92,
    date: "2025-01-20",
    className: "6ème Primaire A"
  },
  {
    id: "grade_003",
    studentName: "Mbuyi Pierre",
    subject: "Français",
    examName: "Interrogation",
    marks: 38,
    totalMarks: 50,
    grade: "B",
    percentage: 76,
    date: "2025-01-22",
    className: "6ème Primaire A"
  },
  {
    id: "grade_004",
    studentName: "Tshiala Grace",
    subject: "Sciences",
    examName: "Test pratique",
    marks: 45,
    totalMarks: 50,
    grade: "A",
    percentage: 90,
    date: "2025-01-18",
    className: "6ème Primaire A"
  }
];

const mockSubjects = [
  { id: "subj_001", name: "Mathématiques", code: "MATH", teacher: "M. Kabongo" },
  { id: "subj_002", name: "Français", code: "FR", teacher: "Mme. Mwanza" },
  { id: "subj_003", name: "Sciences", code: "SCI", teacher: "M. Tshimanga" },
  { id: "subj_004", name: "Histoire", code: "HIST", teacher: "Mme. Kasongo" }
];

const mockExams = [
  {
    id: "exam_001",
    name: "Contrôle Mathématiques Q1",
    subject: "Mathématiques",
    date: "2025-01-20",
    status: "COMPLETED",
    totalStudents: 25,
    gradedStudents: 25
  },
  {
    id: "exam_002",
    name: "Interrogation Français",
    subject: "Français", 
    date: "2025-01-22",
    status: "COMPLETED",
    totalStudents: 25,
    gradedStudents: 20
  },
  {
    id: "exam_003",
    name: "Examen Sciences Q1",
    subject: "Sciences",
    date: "2025-01-25",
    status: "SCHEDULED",
    totalStudents: 25,
    gradedStudents: 0
  }
];

export default function AcademicGradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("grades");

  // Filtrer les notes
  const filteredGrades = mockGrades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grade.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grade.examName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || grade.subject === subjectFilter;
    const matchesClass = classFilter === "all" || grade.className === classFilter;
    
    return matchesSearch && matchesSubject && matchesClass;
  });

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-800 border-green-200";
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "C":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "D":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "F":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "ONGOING":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "COMPLETED":
        return "Terminé";
      case "SCHEDULED":
        return "Programmé";
      case "ONGOING":
        return "En cours";
      default:
        return status;
    }
  };

  // Calculer les statistiques
  const totalGrades = mockGrades.length;
  const averagePercentage = mockGrades.reduce((sum, grade) => sum + grade.percentage, 0) / totalGrades;
  const excellentGrades = mockGrades.filter(grade => grade.percentage >= 90).length;
  const completedExams = mockExams.filter(exam => exam.status === "COMPLETED").length;

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            Gestion Académique
          </h1>
          <p className="text-gray-600 mt-1">Notes, évaluations et suivi académique des élèves</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Notes
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Bulletin de Notes
          </Button>
          <GradeEntryModal />
        </div>
      </div>

      {/* Statistiques académiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Notes Saisies"
          value={totalGrades.toString()}
          description="Total des évaluations"
          icon={Calculator}
          className="border-purple-200"
        />
        <StatsCard
          title="Moyenne Générale"
          value={`${averagePercentage.toFixed(1)}%`}
          description="Toutes matières confondues"
          icon={TrendingUp}
          trend={{ value: 2.3, isPositive: true }}
          className="border-blue-200"
        />
        <StatsCard
          title="Notes Excellentes"
          value={excellentGrades.toString()}
          description="≥ 90% (A+/A)"
          icon={Trophy}
          className="border-green-200"
        />
        <StatsCard
          title="Examens Terminés"
          value={completedExams.toString()}
          description="Ce trimestre"
          icon={BookOpen}
          className="border-orange-200"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="grades">Notes des Élèves</TabsTrigger>
          <TabsTrigger value="exams">Examens</TabsTrigger>
          <TabsTrigger value="subjects">Matières</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-4">
          {/* Notes des élèves */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Toutes les Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filtres et recherche */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par élève, matière ou examen..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les matières</SelectItem>
                    {mockSubjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les classes</SelectItem>
                    <SelectItem value="6ème Primaire A">6ème Primaire A</SelectItem>
                    <SelectItem value="6ème Primaire B">6ème Primaire B</SelectItem>
                    <SelectItem value="5ème Primaire A">5ème Primaire A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tableau des notes */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Matière</TableHead>
                      <TableHead>Examen</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Pourcentage</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">
                          {grade.studentName}
                        </TableCell>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>{grade.examName}</TableCell>
                        <TableCell className="font-semibold">
                          {grade.marks}
                        </TableCell>
                        <TableCell>{grade.totalMarks}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            grade.percentage >= 90 ? "bg-green-100 text-green-800" :
                            grade.percentage >= 80 ? "bg-blue-100 text-blue-800" :
                            grade.percentage >= 70 ? "bg-yellow-100 text-yellow-800" :
                            grade.percentage >= 60 ? "bg-orange-100 text-orange-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {grade.percentage}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getGradeColor(grade.grade)}>
                            {grade.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(grade.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredGrades.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune note trouvée pour les critères sélectionnés.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          {/* Gestion des examens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Examens et Évaluations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{exam.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exam.subject} • {new Date(exam.date).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge className={getStatusColor(exam.status)}>
                          {getStatusText(exam.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {exam.gradedStudents}/{exam.totalStudents} notes saisies
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {exam.status === "COMPLETED" && exam.gradedStudents < exam.totalStudents && (
                        <Button size="sm" variant="outline">
                          Compléter les notes
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Voir les résultats
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          {/* Gestion des matières */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Matières et Enseignants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockSubjects.map((subject) => (
                  <Card key={subject.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{subject.name}</h4>
                        <p className="text-sm text-gray-600">Code: {subject.code}</p>
                        <p className="text-sm text-gray-600">Prof: {subject.teacher}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          Voir les notes
                        </Button>
                        <Button size="sm" variant="outline">
                          Créer examen
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentGrades } from "@/hooks/useStudentGrades";
import { 
  Award, 
  TrendingUp, 
  Users,
  BookOpen,
  Search,
  Download,
  Eye
} from "lucide-react";
import Link from "next/link";

export default function StudentGradesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [examFilter, setExamFilter] = useState("ALL");

  const { grades, loading, error } = useStudentGrades();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !grades) {
    return (
      <div className="p-6 flex items-center justify-center text-red-500">
        Erreur lors du chargement des données.
      </div>
    );
  }

  // Filtrage des données
  const filteredGrades = grades.filter(grade => {
    const matchesSearch = (grade.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (grade.subjectName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === "ALL" || grade.grade === gradeFilter;
    const matchesSubject = subjectFilter === "ALL" || grade.subjectName === subjectFilter;
    const matchesExam = examFilter === "ALL" || grade.examName === examFilter;
    
    return matchesSearch && matchesGrade && matchesSubject && matchesExam;
  });

  // Calcul des statistiques
  const totalGrades = grades.length;
  const averagePercentage = grades.length > 0 
    ? Math.round((grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length) * 100) / 100
    : 0;
  const passedCount = grades.filter(g => g.percentage >= 40).length;
  const excellentCount = grades.filter(g => g.percentage >= 80).length;

  // Listes uniques pour les filtres
  const uniqueSubjects = Array.from(new Set(grades.map(g => g.subjectName).filter(Boolean))).sort();
  const uniqueExams = Array.from(new Set(grades.map(g => g.examName).filter(Boolean))).sort();
  const uniqueGrades = Array.from(new Set(grades.map(g => g.grade).filter(Boolean))).sort();

  const getGradeBadgeColor = (grade: string) => {
    if (!grade) return "bg-gray-100 text-gray-800";
    if (grade.startsWith('A')) return "bg-green-100 text-green-800";
    if (grade.startsWith('B')) return "bg-blue-100 text-blue-800";
    if (grade.startsWith('C')) return "bg-yellow-100 text-yellow-800";
    if (grade.startsWith('D')) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const StatsCard = ({ title, value, description, icon: Icon, color = "blue" }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes des Élèves</h1>
          <p className="text-gray-600 mt-1">Gestion et suivi des résultats académiques</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total des notes"
          value={totalGrades}
          description="Toutes matières"
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Moyenne générale"
          value={`${averagePercentage}%`}
          description="Toutes classes"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Taux de réussite"
          value={`${totalGrades > 0 ? Math.round((passedCount / totalGrades) * 100) : 0}%`}
          description={`${passedCount} élèves`}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Excellence"
          value={excellentCount}
          description="≥ 80%"
          icon={Award}
          color="yellow"
        />
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Rechercher</label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nom de l'élève ou matière..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Note</label>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-32 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Toutes</SelectItem>
                    {uniqueGrades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Matière</label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-48 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Toutes les matières</SelectItem>
                    {uniqueSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Examen</label>
                <Select value={examFilter} onValueChange={setExamFilter}>
                  <SelectTrigger className="w-48 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous les examens</SelectItem>
                    {uniqueExams.map(exam => (
                      <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Affichage de {filteredGrades.length} sur {totalGrades} notes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des notes */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats ({filteredGrades.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Élève</th>
                  <th className="text-left py-3">Classe</th>
                  <th className="text-left py-3">Matière</th>
                  <th className="text-left py-3">Examen</th>
                  <th className="text-right py-3">Note</th>
                  <th className="text-right py-3">Pourcentage</th>
                  <th className="text-left py-3">Mention</th>
                  <th className="text-right py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade, index) => (
                  <tr key={`${grade.id}-${index}`} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{grade.studentName}</td>
                    <td className="py-3 text-gray-600">{grade.className}</td>
                    <td className="py-3">{grade.subjectName}</td>
                    <td className="py-3 text-gray-600">{grade.examName}</td>
                    <td className="py-3 text-right font-medium">
                      {grade.marks}/{grade.totalMarks}
                    </td>
                    <td className="py-3 text-right font-medium">
                      {grade.percentage.toFixed(2)}%
                    </td>
                    <td className="py-3">
                      <Badge className={getGradeBadgeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link href={`/dashboard/students/fees/${grade.studentId}`}>
                        <Button variant="ghost" size="sm" title="Voir détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

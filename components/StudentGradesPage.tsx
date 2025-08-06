"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradesService, Grade, SubjectGradeSummary, StudentGradeReport } from "@/services/gradesService";
import { ExportService } from "@/lib/exportUtils";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  Download,
  Eye,
  Target,
  BarChart3,
  GraduationCap,
  Clock,
  Star,
  Trophy,
  FileText,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Image from "next/image";

interface StudentGradesPageProps {
  studentId: string;
  studentName: string;
  className: string;
}

export default function StudentGradesPage({ 
  studentId = "student-1", 
  studentName = "Jean Mukendi", 
  className = "6ème Scientifique" 
}: StudentGradesPageProps) {
  const router = useRouter();
  const [selectedTerm, setSelectedTerm] = useState<string>('TRIMESTRE_1');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedEvaluationType, setSelectedEvaluationType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeReport, setGradeReport] = useState<StudentGradeReport | null>(null);
  const [subjectSummaries, setSubjectSummaries] = useState<SubjectGradeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const academicYear = '2024-2025';

  useEffect(() => {
    const loadGrades = async () => {
      setIsLoading(true);
      try {
        // Charger le rapport complet
        const report = GradesService.generateStudentGradeReport(studentId, selectedTerm, academicYear);
        setGradeReport(report);

        // Charger les résumés par matière
        const summaries = GradesService.getStudentGradesBySubject(studentId, selectedTerm);
        setSubjectSummaries(summaries);
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGrades();
  }, [studentId, selectedTerm, academicYear]);

  const handleExportGrades = async () => {
    setIsExporting(true);
    try {
      const exportData = GradesService.exportGradesData(studentId, selectedTerm, academicYear);
      
      ExportService.exportToExcel({
        filename: `notes_${studentName.replace(/\s+/g, '_')}_${selectedTerm}_${academicYear}`,
        sheetName: 'Notes Élève',
        title: `RELEVÉ DE NOTES - ${studentName.toUpperCase()}`,
        subtitle: `Classe: ${className} | Période: ${getTermLabel(selectedTerm)} | Année: ${academicYear}`,
        columns: [
          { key: 'Matière', label: 'Matière', width: 20 },
          { key: 'Professeur', label: 'Professeur', width: 18 },
          { key: 'Type d\'évaluation', label: 'Type', width: 15 },
          { key: 'Titre', label: 'Titre', width: 25 },
          { key: 'Date', label: 'Date', width: 12 },
          { key: 'Points obtenus', label: 'Points', width: 10 },
          { key: 'Points maximum', label: 'Max', width: 10 },
          { key: 'Pourcentage', label: '%', width: 10 },
          { key: 'Note', label: 'Note', width: 8 },
          { key: 'Commentaires', label: 'Commentaires', width: 30 }
        ],
        data: exportData,
        includeTimestamp: true
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getTermLabel = (term: string) => {
    const labels = {
      'TRIMESTRE_1': '1er Trimestre',
      'TRIMESTRE_2': '2ème Trimestre',
      'TRIMESTRE_3': '3ème Trimestre',
      'SEMESTRE_1': '1er Semestre',
      'SEMESTRE_2': '2ème Semestre'
    };
    return labels[term as keyof typeof labels] || term;
  };

  const getEvaluationTypeLabel = (type: Grade['evaluationType']) => {
    const labels = {
      'DEVOIR': 'Devoir',
      'INTERROGATION': 'Interrogation',
      'EXAMEN': 'Examen',
      'TRAVAIL_PRATIQUE': 'Travail Pratique',
      'PARTICIPATION': 'Participation',
      'PROJET': 'Projet'
    };
    return labels[type] || type;
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getEvaluationTypeColor = (type: Grade['evaluationType']) => {
    const colors = {
      'EXAMEN': 'bg-red-100 text-red-800 border-red-200',
      'DEVOIR': 'bg-blue-100 text-blue-800 border-blue-200',
      'INTERROGATION': 'bg-orange-100 text-orange-800 border-orange-200',
      'TRAVAIL_PRATIQUE': 'bg-green-100 text-green-800 border-green-200',
      'PARTICIPATION': 'bg-purple-100 text-purple-800 border-purple-200',
      'PROJET': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredGrades = subjectSummaries.flatMap(subject => 
    subject.grades.filter(grade => {
      const matchesSubject = selectedSubject === 'all' || subject.subjectId === selectedSubject;
      const matchesType = selectedEvaluationType === 'all' || grade.evaluationType === selectedEvaluationType;
      const matchesSearch = grade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grade.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grade.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSubject && matchesType && matchesSearch;
    })
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chargement des notes...</h1>
            <p className="text-gray-600">Élève: {studentName}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Mes Notes
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span>Élève: {studentName}</span>
              <span>•</span>
              <span>Classe: {className}</span>
              <span>•</span>
              <span>{getTermLabel(selectedTerm)} {academicYear}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportGrades}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Export..." : "Exporter"}
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      {gradeReport && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Moyenne Générale</p>
                  <p className="text-xl font-bold text-blue-600">
                    {gradeReport.overallAverage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Note Générale</p>
                  <Badge className={`text-lg font-bold ${getGradeColor(gradeReport.overallGrade)}`}>
                    {gradeReport.overallGrade}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Matières</p>
                  <p className="text-xl font-bold">{gradeReport.subjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Évaluations</p>
                  <p className="text-xl font-bold">{gradeReport.totalEvaluations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Période</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRIMESTRE_1">1er Trimestre</SelectItem>
                  <SelectItem value="TRIMESTRE_2">2ème Trimestre</SelectItem>
                  <SelectItem value="TRIMESTRE_3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Matière</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les matières</SelectItem>
                  {subjectSummaries.map(subject => (
                    <SelectItem key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type d'évaluation</label>
              <Select value={selectedEvaluationType} onValueChange={setSelectedEvaluationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="EXAMEN">Examens</SelectItem>
                  <SelectItem value="DEVOIR">Devoirs</SelectItem>
                  <SelectItem value="INTERROGATION">Interrogations</SelectItem>
                  <SelectItem value="TRAVAIL_PRATIQUE">Travaux Pratiques</SelectItem>
                  <SelectItem value="PARTICIPATION">Participation</SelectItem>
                  <SelectItem value="PROJET">Projets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="subjects">Par matière</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Résumé par matière */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Moyennes par Matière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subjectSummaries.map(subject => (
                    <div key={subject.subjectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{subject.subjectName}</h4>
                        <p className="text-sm text-gray-600">{subject.teacherName}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getGradeColor(subject.averageGrade)}>
                          {subject.averageGrade}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          {subject.averagePercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Évaluations récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Évaluations Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredGrades.slice(0, 5).map(grade => (
                    <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{grade.title}</h4>
                        <p className="text-sm text-gray-600">{grade.subjectName}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getGradeColor(grade.grade)}>
                          {grade.grade}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          {grade.obtainedPoints}/{grade.maxPoints}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Par matière */}
        <TabsContent value="subjects" className="space-y-4">
          <div className="grid gap-4">
            {subjectSummaries.map(subject => (
              <Card key={subject.subjectId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {subject.subjectName}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Professeur: {subject.teacherName} • {subject.totalEvaluations} évaluations
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-lg ${getGradeColor(subject.averageGrade)}`}>
                        {subject.averageGrade}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Moyenne: {subject.averagePercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subject.grades.map(grade => (
                      <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{grade.title}</h4>
                            <Badge className={`text-xs ${getEvaluationTypeColor(grade.evaluationType)}`}>
                              {getEvaluationTypeLabel(grade.evaluationType)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(grade.date).toLocaleDateString('fr-FR')}
                          </p>
                          {grade.comments && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              {grade.comments}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className={getGradeColor(grade.grade)}>
                            {grade.grade}
                          </Badge>
                          <p className="text-sm text-gray-600">
                            {grade.obtainedPoints}/{grade.maxPoints} ({grade.percentage.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Détails */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Toutes les Évaluations ({filteredGrades.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredGrades.map(grade => (
                  <div key={grade.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{grade.title}</h3>
                          <Badge className={`text-xs ${getEvaluationTypeColor(grade.evaluationType)}`}>
                            {getEvaluationTypeLabel(grade.evaluationType)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div>
                            <span className="font-medium">Matière:</span> {grade.subjectName}
                          </div>
                          <div>
                            <span className="font-medium">Professeur:</span> {grade.teacherName}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(grade.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div>
                            <span className="font-medium">Points:</span> {grade.obtainedPoints}/{grade.maxPoints}
                          </div>
                        </div>

                        {grade.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Description:</span> {grade.description}
                          </p>
                        )}

                        {grade.comments && (
                          <p className="text-sm text-gray-500 italic">
                            <span className="font-medium">Commentaires:</span> {grade.comments}
                          </p>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <Badge className={`text-lg mb-2 ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </Badge>
                        <p className="text-lg font-bold text-gray-900">
                          {grade.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredGrades.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune évaluation trouvée
                    </h3>
                    <p className="text-gray-600">
                      Aucune évaluation ne correspond aux critères de filtrage sélectionnés.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

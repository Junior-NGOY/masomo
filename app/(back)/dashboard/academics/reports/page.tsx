"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  Users,
  BookOpen,
  Award,
  Calendar,
  Filter,
  Search,
  PieChart,
  LineChart,
  Printer,
  Clock
} from "lucide-react";
import { MockDataService } from "@/services/mockServices";
import StatsCard from "@/components/dashboard/StatsCard";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { ReportMockService } from "@/services/reportMockService";

interface ClassType {
  id: string;
  name: string;
  level: string;
  section: string;
  capacity: number;
  currentStudents: number;
}

interface SubjectType {
  id: string;
  name: string;
  code: string;
  category: string;
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("all");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [periodFilter, setPeriodFilter] = React.useState("current");
  const [reportType, setReportType] = React.useState("overview");
  const [activeTab, setActiveTab] = React.useState("overview");

  // Récupération des données
  const reportStats = ReportMockService.getReportStats();
  const classPerformance = ReportMockService.getClassPerformance();
  const subjectAnalysis = ReportMockService.getSubjectAnalysis();
  const attendanceReport = ReportMockService.getAttendanceReport();
  const classes: ClassType[] = MockDataService.classes.getAll();
  const subjects: SubjectType[] = MockDataService.subjects.getAll();

  const handleGenerateReport = (type: string) => {
    // Simulation de génération de rapport
    alert(`Génération du rapport ${type} en cours...`);
  };

  const handleDownloadReport = (reportId: string) => {
    // Simulation de téléchargement
    alert(`Téléchargement du rapport ${reportId}...`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const getPerformanceColor = (performance: number): string => {
    if (performance >= 80) return "text-green-600";
    if (performance >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (performance: number): string => {
    if (performance >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (performance >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getGradeText = (average: number): string => {
    if (average >= 16) return "Excellent";
    if (average >= 14) return "Très Bien";
    if (average >= 12) return "Bien";
    if (average >= 10) return "Assez Bien";
    return "Insuffisant";
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports Académiques</h1>
          <p className="text-gray-600 mt-1">Analyses de performance et rapports détaillés</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Nouveau Rapport
          </Button>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Moyenne Générale"
          value={`${reportStats.overallAverage}/20`}
          description="Toutes classes confondues"
          icon={Award}
          trend={{ value: 2.3, isPositive: true }}
          className="border-blue-200"
        />
        <StatsCard
          title="Taux de Réussite"
          value={`${reportStats.successRate}%`}
          description="Élèves > 10/20"
          icon={TrendingUp}
          trend={{ value: 5.1, isPositive: true }}
          className="border-green-200"
        />
        <StatsCard
          title="Présence Moyenne"
          value={`${reportStats.attendanceRate}%`}
          description="Ce trimestre"
          icon={Users}
          className="border-purple-200"
        />
        <StatsCard
          title="Matières Enseignées"
          value={reportStats.totalSubjects.toString()}
          description="Actives cette année"
          icon={BookOpen}
          className="border-orange-200"
        />
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="classes">Par Classes</TabsTrigger>
          <TabsTrigger value="subjects">Par Matières</TabsTrigger>
          <TabsTrigger value="attendance">Présence</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtres et Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Période</label>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Trimestre Actuel</SelectItem>
                      <SelectItem value="previous">Trimestre Précédent</SelectItem>
                      <SelectItem value="year">Année Scolaire</SelectItem>
                      <SelectItem value="custom">Période Personnalisée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de Rapport</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Vue d'ensemble</SelectItem>
                      <SelectItem value="detailed">Rapport détaillé</SelectItem>
                      <SelectItem value="comparative">Analyse comparative</SelectItem>
                      <SelectItem value="individual">Bulletins individuels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Classes</label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les classes</SelectItem>
                      {classes.map((classe: ClassType) => (
                        <SelectItem key={classe.id} value={classe.id}>
                          {classe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleGenerateReport(reportType)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Générer le Rapport
                </Button>
              </CardContent>
            </Card>

            {/* Graphiques de performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tendances de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Simulation d'un graphique */}
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Graphique des tendances</p>
                      <p className="text-sm">Évolution des moyennes trimestrielles</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-blue-600">13.2</div>
                      <div className="text-xs text-gray-600">Trimestre 1</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">14.1</div>
                      <div className="text-xs text-gray-600">Trimestre 2</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-purple-600">14.8</div>
                      <div className="text-xs text-gray-600">Trimestre 3</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top/Bottom performers */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Meilleures Performances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ReportMockService.getTopPerformers().map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.className}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{student.average}/20</div>
                        <div className="text-xs text-gray-500">{getGradeText(student.average)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Améliorations Remarquables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ReportMockService.getMostImproved().map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.className}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">+{student.improvement}</div>
                        <div className="text-xs text-gray-500">points d'amélioration</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performances par classes */}
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Performance par Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Classe</TableHead>
                      <TableHead>Effectif</TableHead>
                      <TableHead>Moyenne Générale</TableHead>
                      <TableHead>Taux de Réussite</TableHead>
                      <TableHead>Présence</TableHead>
                      <TableHead>Mention</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classPerformance.map((classe) => (
                      <TableRow key={classe.id}>
                        <TableCell className="font-medium">{classe.name}</TableCell>
                        <TableCell>{classe.totalStudents}</TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getPerformanceColor(classe.average * 5)}`}>
                            {classe.average}/20
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getPerformanceColor(classe.successRate)}>
                            {classe.successRate}%
                          </span>
                        </TableCell>
                        <TableCell>{classe.attendanceRate}%</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPerformanceBadge(classe.average * 5)}>
                            {getGradeText(classe.average)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadReport(classe.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyses par matières */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Analyse par Matières
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectAnalysis.map((subject, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{subject.name}</h4>
                        <p className="text-sm text-gray-600">{subject.totalClasses} classes • {subject.totalStudents} élèves</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{subject.average}/20</div>
                        <div className="text-sm text-gray-600">{getGradeText(subject.average)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Taux de réussite</div>
                        <div className={`font-semibold ${getPerformanceColor(subject.successRate)}`}>
                          {subject.successRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Note la plus haute</div>
                        <div className="font-semibold text-green-600">{subject.highestScore}/20</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Note la plus basse</div>
                        <div className="font-semibold text-red-600">{subject.lowestScore}/20</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Écart-type</div>
                        <div className="font-semibold text-gray-800">{subject.standardDeviation}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Répartition des notes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="flex h-3 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-500" 
                            style={{ width: `${subject.distribution.poor}%` }}
                            title={`Insuffisant: ${subject.distribution.poor}%`}
                          ></div>
                          <div 
                            className="bg-orange-500" 
                            style={{ width: `${subject.distribution.average}%` }}
                            title={`Moyen: ${subject.distribution.average}%`}
                          ></div>
                          <div 
                            className="bg-blue-500" 
                            style={{ width: `${subject.distribution.good}%` }}
                            title={`Bien: ${subject.distribution.good}%`}
                          ></div>
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${subject.distribution.excellent}%` }}
                            title={`Excellent: ${subject.distribution.excellent}%`}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0-10</span>
                        <span>10-12</span>
                        <span>12-16</span>
                        <span>16-20</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rapport de présence */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              title="Présence Globale"
              value={`${attendanceReport.overallRate}%`}
              description="Toutes classes"
              icon={Users}
              className="border-green-200"
            />
            <StatsCard
              title="Absences Justifiées"
              value={`${attendanceReport.excusedRate}%`}
              description="Du total des absences"
              icon={FileText}
              className="border-blue-200"
            />
            <StatsCard
              title="Retards"
              value={attendanceReport.lateCount.toString()}
              description="Ce mois"
              icon={Clock}
              className="border-orange-200"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Présence par Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Classe</TableHead>
                      <TableHead>Taux de Présence</TableHead>
                      <TableHead>Présents Aujourd'hui</TableHead>
                      <TableHead>Absences du Mois</TableHead>
                      <TableHead>Retards</TableHead>
                      <TableHead>Tendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceReport.byClass.map((classe) => (
                      <TableRow key={classe.classId}>
                        <TableCell className="font-medium">{classe.className}</TableCell>
                        <TableCell>
                          <span className={getPerformanceColor(classe.attendanceRate)}>
                            {classe.attendanceRate}%
                          </span>
                        </TableCell>
                        <TableCell>{classe.presentToday}/{classe.totalStudents}</TableCell>
                        <TableCell>{classe.absencesThisMonth}</TableCell>
                        <TableCell>{classe.lateCount}</TableCell>
                        <TableCell>
                          <span className={classe.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                            {classe.trend > 0 ? '+' : ''}{classe.trend}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

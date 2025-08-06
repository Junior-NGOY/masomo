"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Search,
  Plus,
  Download,
  BarChart3
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

export default function ExaminationsPage() {
  // TODO: Remplacer par les vrais appels API une fois le backend terminé
  const examinations = MockDataService.examinations.getExaminations();
  const examStats = MockDataService.examinations.getExamStats();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [subjectFilter, setSubjectFilter] = React.useState("all");

  // Filtrer les examens
  const filteredExams = examinations.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
    const matchesSubject = subjectFilter === "all" || exam.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Obtenir les matières uniques pour le filtre
  const uniqueSubjects = Array.from(new Set(examinations.map(exam => exam.subject)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "border-blue-200 text-blue-700";
      case "ONGOING":
        return "border-green-200 text-green-700";
      case "COMPLETED":
        return "border-gray-200 text-gray-700";
      case "CANCELLED":
        return "border-red-200 text-red-700";
      default:
        return "border-gray-200 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Programmé";
      case "ONGOING":
        return "En cours";
      case "COMPLETED":
        return "Terminé";
      case "CANCELLED":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portail d'Examens</h1>
          <p className="text-gray-600 mt-1">Gestion complète des examens et évaluations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Examen
          </Button>
        </div>
      </div>

      {/* Statistiques des examens */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Examens Programmés"
          value={examStats.scheduledExams}
          description="À venir ce mois"
          icon={Calendar}
          className="border-blue-200"
        />
        <StatsCard
          title="Examens en Cours"
          value={examStats.ongoingExams}
          description="Actuellement en session"
          icon={Clock}
          className="border-green-200"
        />
        <StatsCard
          title="Examens Terminés"
          value={examStats.completedExams}
          description="Ce trimestre"
          icon={FileText}
        />
        <StatsCard
          title="Score Moyen"
          value={`${examStats.averageScore}%`}
          description="Performance globale"
          icon={GraduationCap}
          trend={{ value: 3.2, isPositive: true }}
          className="border-purple-200"
        />
      </div>

      {/* Calendrier des examens à venir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Examens à Venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {examinations
              .filter(exam => exam.status === "SCHEDULED")
              .slice(0, 3)
              .map((exam) => (
              <Card key={exam.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">{exam.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {MockDataService.formatDate(exam.date)} à {exam.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {exam.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      {exam.duration} minutes
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {exam.className}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste complète des examens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tous les Examens
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, matière ou classe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="SCHEDULED">Programmé</SelectItem>
                <SelectItem value="ONGOING">En cours</SelectItem>
                <SelectItem value="COMPLETED">Terminé</SelectItem>
                <SelectItem value="CANCELLED">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {uniqueSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des examens */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Examen</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Note Max</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={exam.name}>
                        {exam.name}
                      </div>
                    </TableCell>
                    <TableCell>{exam.subject}</TableCell>
                    <TableCell>{exam.className}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{MockDataService.formatDate(exam.date)}</div>
                        <div className="text-gray-500">{exam.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>{exam.totalMarks} pts</TableCell>
                    <TableCell>{exam.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(exam.status)}>
                        {getStatusText(exam.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun examen trouvé pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

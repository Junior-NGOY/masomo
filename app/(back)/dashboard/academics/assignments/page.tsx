"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen,
  Calendar,
  Clock,
  Users,
  Plus,
  Download,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
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
import { AssignmentMockService, Assignment } from "@/services/assignmentMockService";
import AssignmentCreationModal from "@/components/AssignmentCreationModal";
import AssignmentViewModal from "@/components/AssignmentViewModal";

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

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("all");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("list");
  const [selectedAssignment, setSelectedAssignment] = React.useState<string | null>(null);
  const [showCreationModal, setShowCreationModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [editingAssignment, setEditingAssignment] = React.useState<Assignment | null>(null);

  // Récupération des données
  const assignments = AssignmentMockService.getAllAssignments();
  const assignmentStats = AssignmentMockService.getAssignmentStats();
  const classes: ClassType[] = MockDataService.classes.getAll();
  const subjects: SubjectType[] = MockDataService.subjects.getAll();

  // Fonctions de gestion des modaux
  const handleCreateAssignment = () => {
    setEditingAssignment(null);
    setShowCreationModal(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowCreationModal(true);
  };

  const handleViewAssignment = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setShowViewModal(true);
  };

  const handleSaveAssignment = (assignment: Assignment) => {
    // Les modifications sont déjà gérées dans le service mock
    setShowCreationModal(false);
    setEditingAssignment(null);
  };

  const getAssignmentById = (id: string | null): Assignment | null => {
    if (!id) return null;
    return AssignmentMockService.getAssignmentById(id) || null;
  };

  // Filtrage des devoirs
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || assignment.classId === classFilter;
    const matchesSubject = subjectFilter === "all" || assignment.subjectId === subjectFilter;
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    
    return matchesSearch && matchesClass && matchesSubject && matchesStatus;
  });

  const handleDeleteAssignment = (assignmentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce devoir ?")) {
      AssignmentMockService.deleteAssignment(assignmentId);
      // Actualiser la page ou l'état selon les besoins
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "OVERDUE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Actif";
      case "DRAFT":
        return "Brouillon";
      case "COMPLETED":
        return "Terminé";
      case "OVERDUE":
        return "En retard";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "OVERDUE":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "DRAFT":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysRemaining = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Devoirs</h1>
          <p className="text-gray-600 mt-1">Création, suivi et évaluation des devoirs et projets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Envoyer Rappels
          </Button>
          <Button onClick={handleCreateAssignment} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Devoir
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Devoirs Actifs"
          value={assignmentStats.totalActive.toString()}
          description="En cours"
          icon={BookOpen}
          className="border-blue-200"
        />
        <StatsCard
          title="À Corriger"
          value={assignmentStats.pendingReview.toString()}
          description="Devoirs soumis"
          icon={Edit}
          className="border-orange-200"
        />
        <StatsCard
          title="Taux de Soumission"
          value={`${assignmentStats.submissionRate}%`}
          description="Moyenne des classes"
          icon={CheckCircle}
          className="border-green-200"
        />
        <StatsCard
          title="En Retard"
          value={assignmentStats.overdue.toString()}
          description="Devoirs expirés"
          icon={XCircle}
          className="border-red-200"
        />
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Liste des Devoirs</TabsTrigger>
          <TabsTrigger value="calendar">Vue Calendrier</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        {/* Liste des devoirs */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tous les Devoirs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filtres et recherche */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par titre, matière ou classe..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Classe" />
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
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les matières</SelectItem>
                    {subjects.map((subject: SubjectType) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="COMPLETED">Terminé</SelectItem>
                    <SelectItem value="OVERDUE">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tableau des devoirs */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Matière</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Date d'Échéance</TableHead>
                      <TableHead>Soumissions</TableHead>
                      <TableHead>Note Max</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((assignment) => {
                      const daysRemaining = getDaysRemaining(assignment.dueDate);
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{assignment.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {assignment.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{assignment.subject}</TableCell>
                          <TableCell>{assignment.className}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>{MockDataService.formatDate(assignment.dueDate)}</div>
                              <div className={`text-xs ${
                                daysRemaining < 0 ? 'text-red-600' : 
                                daysRemaining <= 3 ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                {daysRemaining < 0 ? 
                                  `${Math.abs(daysRemaining)} jour(s) en retard` :
                                  daysRemaining === 0 ? 'Aujourd\'hui' :
                                  `${daysRemaining} jour(s) restant(s)`
                                }
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {assignment.submissionCount}/{assignment.totalStudents}
                              </span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ 
                                    width: `${(assignment.submissionCount / assignment.totalStudents) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {assignment.maxPoints} pts
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(assignment.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(assignment.status)}
                                {getStatusText(assignment.status)}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewAssignment(assignment.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditAssignment(assignment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredAssignments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun devoir trouvé pour les critères sélectionnés.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue calendrier */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendrier des Devoirs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Vue calendrier des devoirs en développement...</p>
                <p className="text-sm">Cette fonctionnalité sera disponible prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyses */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Analyse par matière */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance par Matière</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {AssignmentMockService.getSubjectAnalytics().map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject.name}</span>
                        <span className="text-sm text-gray-600">{subject.averageScore}/20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(subject.averageScore / 20) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{subject.totalAssignments} devoirs</span>
                        <span>{subject.submissionRate}% soumission</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analyse par classe */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance par Classe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {AssignmentMockService.getClassAnalytics().map((classe, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{classe.name}</span>
                        <span className="text-sm text-gray-600">{classe.averageScore}/20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(classe.averageScore / 20) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{classe.totalStudents} élèves</span>
                        <span>{classe.submissionRate}% soumission</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Devoirs urgents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Devoirs Urgents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments
                  .filter(assignment => {
                    const daysRemaining = getDaysRemaining(assignment.dueDate);
                    return daysRemaining <= 3 && assignment.status === 'ACTIVE';
                  })
                  .map((assignment) => {
                    const daysRemaining = getDaysRemaining(assignment.dueDate);
                    return (
                      <div key={assignment.id} className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{assignment.title}</h4>
                            <p className="text-sm text-gray-600">{assignment.subject} - {assignment.className}</p>
                            <p className="text-xs text-orange-600">
                              Échéance: {MockDataService.formatDate(assignment.dueDate)}
                              {daysRemaining < 0 ? 
                                ` (${Math.abs(daysRemaining)} jour(s) en retard)` :
                                daysRemaining === 0 ? ' (Aujourd\'hui)' :
                                ` (${daysRemaining} jour(s) restant(s))`
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {assignment.submissionCount}/{assignment.totalStudents}
                            </p>
                            <p className="text-xs text-gray-500">Soumissions</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                {assignments.filter(assignment => {
                  const daysRemaining = getDaysRemaining(assignment.dueDate);
                  return daysRemaining <= 3 && assignment.status === 'ACTIVE';
                }).length === 0 && (
                  <div className="text-center py-8 text-green-600">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    Aucun devoir urgent à signaler !
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <AssignmentCreationModal
        isOpen={showCreationModal}
        onClose={() => {
          setShowCreationModal(false);
          setEditingAssignment(null);
        }}
        assignment={editingAssignment}
        onSave={handleSaveAssignment}
      />

      <AssignmentViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAssignment(null);
        }}
        assignment={getAssignmentById(selectedAssignment)}
        onEdit={handleEditAssignment}
      />
    </div>
  );
}

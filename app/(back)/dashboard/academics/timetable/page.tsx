"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  Clock,
  Users,
  BookOpen,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Copy,
  Settings
} from "lucide-react";
import { useTimetable, useTimetableConflicts } from "@/hooks/useTimetable";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
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
import TimetableCreationModal from "@/components/TimetableCreationModal";
import TimetableViewModal from "@/components/TimetableViewModal";
import TimetableGrid from "@/components/TimetableGrid";

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

export default function TimetablePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("all");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("grid");
  const [selectedTimetable, setSelectedTimetable] = React.useState<string | null>(null);
  const [showCreationModal, setShowCreationModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);

  // Récupération des données
  const { timetables, stats: timetableStats, loading: timetableLoading, deleteTimetable, duplicateTimetable } = useTimetable();
  const { conflicts } = useTimetableConflicts();
  const { classes, loading: classesLoading } = useClasses();
  const { subjects, loading: subjectsLoading } = useSubjects();

  // Filtrage des emplois du temps
  const filteredTimetables = React.useMemo(() => {
    return timetables.filter(timetable => {
      const matchesSearch = timetable.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           timetable.academicYear.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = classFilter === "all" || timetable.classId === classFilter;
      const matchesSubject = subjectFilter === "all" || 
                            timetable.schedule.some(slot => slot.subjectId === subjectFilter);
      
      return matchesSearch && matchesClass && matchesSubject;
    });
  }, [timetables, searchQuery, classFilter, subjectFilter]);

  if (timetableLoading || classesLoading || subjectsLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!timetableStats) return null;

  const handleViewTimetable = (timetableId: string) => {
    setSelectedTimetable(timetableId);
    setShowViewModal(true);
  };

  const handleEditTimetable = (timetableId: string) => {
    setSelectedTimetable(timetableId);
    setShowCreationModal(true);
  };

  const handleDeleteTimetable = async (timetableId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet emploi du temps ?")) {
      await deleteTimetable(timetableId);
    }
  };

  const handleDuplicateTimetable = async (timetableId: string) => {
    await duplicateTimetable(timetableId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      case "ARCHIVED":
        return "Archivé";
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emplois du Temps</h1>
          <p className="text-gray-600 mt-1">Gestion des emplois du temps et planification des cours</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
          <Button onClick={() => setShowCreationModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Emploi du Temps
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Emplois du Temps Actifs"
          value={timetableStats.totalActive.toString()}
          description="En cours d'utilisation"
          icon={Calendar}
          className="border-green-200"
        />
        <StatsCard
          title="Classes Couvertes"
          value={timetableStats.classesCovered.toString()}
          description={`Sur ${timetableStats.totalClasses} classes`}
          icon={Users}
          className="border-blue-200"
        />
        <StatsCard
          title="Heures Planifiées"
          value={`${timetableStats.totalHours}h`}
          description="Cette semaine"
          icon={Clock}
          className="border-purple-200"
        />
        <StatsCard
          title="Conflits Détectés"
          value={conflicts.length.toString()}
          description="À résoudre"
          icon={BookOpen}
          className="border-red-200"
        />
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grid">Vue Grille</TabsTrigger>
          <TabsTrigger value="list">Liste des Emplois</TabsTrigger>
          <TabsTrigger value="conflicts">Gestion des Conflits</TabsTrigger>
        </TabsList>

        {/* Vue grille - Emploi du temps interactif */}
        <TabsContent value="grid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Emploi du Temps Interactif
              </CardTitle>
              <div className="flex items-center gap-4">
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les classes</SelectItem>
                    {classes.map((classe: any, index: number) => (
                      <SelectItem key={`${classe.id}-${index}`} value={classe.id}>
                        {classe.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <TimetableGrid 
                selectedClass={classFilter === "all" ? null : classFilter}
                timetables={filteredTimetables}
                onSlotClick={(slot: any) => console.log("Slot clicked:", slot)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue liste */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tous les Emplois du Temps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filtres et recherche */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par classe ou année académique..."
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
                    {classes.map((classe: any, index: number) => (
                      <SelectItem key={`${classe.id}-${index}`} value={classe.id}>
                        {classe.title || classe.name}
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
                    {subjects.map((subject: any, index: number) => (
                      <SelectItem key={`${subject.id}-${index}`} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tableau des emplois du temps */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Classe</TableHead>
                      <TableHead>Année Académique</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Total Heures</TableHead>
                      <TableHead>Dernière Modification</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimetables.map((timetable, index) => (
                      <TableRow key={`${timetable.id}-${index}`}>
                        <TableCell className="font-medium">
                          {timetable.className}
                        </TableCell>
                        <TableCell>{timetable.academicYear}</TableCell>
                        <TableCell>{timetable.term}</TableCell>
                        <TableCell>{timetable.totalHours}h</TableCell>
                        <TableCell>
                          {new Date(timetable.lastModified).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(timetable.status)}>
                            {getStatusText(timetable.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewTimetable(timetable.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditTimetable(timetable.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDuplicateTimetable(timetable.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteTimetable(timetable.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredTimetables.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun emploi du temps trouvé pour les critères sélectionnés.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des conflits */}
        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-red-500" />
                Conflits d'Emploi du Temps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflicts.map((conflict, index) => (
                  <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-red-800">{conflict.type}</h4>
                        <p className="text-sm text-red-600 mt-1">{conflict.description}</p>
                        <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-600">
                              {conflict.details}
                            </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Résoudre
                        </Button>
                        <Button size="sm" variant="outline">
                          Ignorer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {conflicts.length === 0 && (
                  <div className="text-center py-8 text-green-600">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    Aucun conflit détecté dans les emplois du temps !
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <TimetableCreationModal
        isOpen={showCreationModal}
        onClose={() => {
          setShowCreationModal(false);
          setSelectedTimetable(null);
        }}
        timetableId={selectedTimetable}
      />

      <TimetableViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTimetable(null);
        }}
        timetableId={selectedTimetable}
      />
    </div>
  );
}

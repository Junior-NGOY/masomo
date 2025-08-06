"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleService, ClassScheduleItem, WeeklySchedule } from "@/services/scheduleService";
import { GradesService, EvaluationSchedule } from "@/services/gradesService";
import { ExportService } from "@/lib/exportUtils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Monitor,
  Beaker,
  PenTool,
  Award,
  ChevronRight,
  Bell,
  CalendarDays,
  Timer,
  Building,
  GraduationCap
} from "lucide-react";

interface StudentSchedulePageProps {
  studentId?: string;
  studentName?: string;
  className?: string;
}

export default function StudentSchedulePage({ 
  studentId = "student-1", 
  studentName = "Jean Mukendi", 
  className = "6ème Scientifique" 
}: StudentSchedulePageProps) {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState<string>(getCurrentWeekStart());
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<ClassScheduleItem[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassScheduleItem[]>([]);
  const [upcomingEvaluations, setUpcomingEvaluations] = useState<EvaluationSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());

  useEffect(() => {
    const loadScheduleData = async () => {
      setIsLoading(true);
      try {
        // Charger l'horaire hebdomadaire
        const weekly = ScheduleService.getClassWeeklySchedule(className, selectedWeek);
        setWeeklySchedule(weekly);

        // Charger l'horaire d'aujourd'hui
        const today = ScheduleService.getTodaySchedule(className);
        setTodaySchedule(today);

        // Charger les prochains cours
        const upcoming = ScheduleService.getUpcomingClasses(className, 5);
        setUpcomingClasses(upcoming);

        // Charger les évaluations à venir
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const evaluations = GradesService.getStudentEvaluationSchedule(className, startDate, endDate);
        setUpcomingEvaluations(evaluations);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'horaire:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadScheduleData();
  }, [className, selectedWeek]);

  // Mettre à jour l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000); // Mettre à jour chaque minute

    return () => clearInterval(timer);
  }, []);

  function getCurrentWeekStart(): string {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Dimanche = 0, Lundi = 1
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    return monday.toISOString().split('T')[0];
  }

  function getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  const handleExportSchedule = async () => {
    setIsExporting(true);
    try {
      const exportData = ScheduleService.exportScheduleData(className, selectedWeek);
      
      ExportService.exportToExcel({
        filename: `horaire_${className.replace(/\s+/g, '_')}_semaine_${selectedWeek}`,
        sheetName: 'Horaire Hebdomadaire',
        title: `HORAIRE HEBDOMADAIRE - ${className.toUpperCase()}`,
        subtitle: `Semaine du ${new Date(selectedWeek).toLocaleDateString('fr-FR')}`,
        columns: [
          { key: 'Jour', label: 'Jour', width: 15 },
          { key: 'Heure', label: 'Heure', width: 15 },
          { key: 'Matière', label: 'Matière', width: 20 },
          { key: 'Professeur', label: 'Professeur', width: 20 },
          { key: 'Salle', label: 'Salle', width: 15 },
          { key: 'Type', label: 'Type', width: 15 },
          { key: 'Notes', label: 'Notes', width: 25 }
        ],
        data: exportData,
        includeTimestamp: true
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getCourseTypeIcon = (type: ClassScheduleItem['courseType']) => {
    const icons = {
      'COURS_MAGISTRAL': BookOpen,
      'TRAVAUX_PRATIQUES': Beaker,
      'EXERCICES': PenTool,
      'EVALUATION': Award
    };
    const Icon = icons[type] || BookOpen;
    return <Icon className="h-4 w-4" />;
  };

  const getCourseTypeColor = (type: ClassScheduleItem['courseType']) => {
    const colors = {
      'COURS_MAGISTRAL': 'bg-blue-100 text-blue-800 border-blue-200',
      'TRAVAUX_PRATIQUES': 'bg-green-100 text-green-800 border-green-200',
      'EXERCICES': 'bg-orange-100 text-orange-800 border-orange-200',
      'EVALUATION': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCourseTypeLabel = (type: ClassScheduleItem['courseType']) => {
    const labels = {
      'COURS_MAGISTRAL': 'Cours',
      'TRAVAUX_PRATIQUES': 'TP',
      'EXERCICES': 'TD',
      'EVALUATION': 'Éval'
    };
    return labels[type] || type;
  };

  const getEvaluationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'EXAMEN': 'bg-red-100 text-red-800 border-red-200',
      'DEVOIR': 'bg-blue-100 text-blue-800 border-blue-200',
      'INTERROGATION': 'bg-orange-100 text-orange-800 border-orange-200',
      'TRAVAIL_PRATIQUE': 'bg-green-100 text-green-800 border-green-200',
      'PARTICIPATION': 'bg-purple-100 text-purple-800 border-purple-200',
      'PROJET': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isCurrentClass = (classItem: ClassScheduleItem) => {
    const now = getCurrentTime();
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayUpper = today.toUpperCase().replace('É', 'E');
    
    return classItem.dayOfWeek === todayUpper &&
           now >= classItem.timeSlot.startTime &&
           now <= classItem.timeSlot.endTime;
  };

  const isUpcomingClass = (classItem: ClassScheduleItem) => {
    const now = getCurrentTime();
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayUpper = today.toUpperCase().replace('É', 'E');
    
    return classItem.dayOfWeek === todayUpper && now < classItem.timeSlot.startTime;
  };

  const getDayLabel = (day: string) => {
    const labels = {
      'LUNDI': 'Lundi',
      'MARDI': 'Mardi',
      'MERCREDI': 'Mercredi',
      'JEUDI': 'Jeudi',
      'VENDREDI': 'Vendredi',
      'SAMEDI': 'Samedi'
    };
    return labels[day as keyof typeof labels] || day;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chargement de l'horaire...</h1>
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
              <Calendar className="h-6 w-6 text-blue-600" />
              Mon Horaire
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span>Élève: {studentName}</span>
              <span>•</span>
              <span>Classe: {className}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {currentTime}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportSchedule}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Export..." : "Exporter"}
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      {weeklySchedule && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Heures/Semaine</p>
                  <p className="text-xl font-bold">{weeklySchedule.totalHoursPerWeek}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Matières</p>
                  <p className="text-xl font-bold">{weeklySchedule.subjectsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <CalendarDays className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cours Aujourd'hui</p>
                  <p className="text-xl font-bold">{todaySchedule.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <Bell className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Évaluations</p>
                  <p className="text-xl font-bold">{upcomingEvaluations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sélecteur de semaine */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Semaine du:</label>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={getCurrentWeekStart()}>
                  Cette semaine ({new Date(getCurrentWeekStart()).toLocaleDateString('fr-FR')})
                </SelectItem>
                <SelectItem value={getNextWeekStart()}>
                  Semaine prochaine ({new Date(getNextWeekStart()).toLocaleDateString('fr-FR')})
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="week">Semaine</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>

        {/* Horaire d'aujourd'hui */}
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Cours d'Aujourd'hui ({new Date().toLocaleDateString('fr-FR')})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaySchedule.length > 0 ? (
                <div className="space-y-3">
                  {todaySchedule.map(classItem => (
                    <div 
                      key={classItem.id} 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCurrentClass(classItem) 
                          ? 'border-green-400 bg-green-50' 
                          : isUpcomingClass(classItem)
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{classItem.subjectName}</h3>
                            <Badge className={getCourseTypeColor(classItem.courseType)}>
                              {getCourseTypeIcon(classItem.courseType)}
                              <span className="ml-1">{getCourseTypeLabel(classItem.courseType)}</span>
                            </Badge>
                            {isCurrentClass(classItem) && (
                              <Badge className="bg-green-100 text-green-800">
                                <div className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></div>
                                En cours
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {classItem.teacherName}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {classItem.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {classItem.timeSlot.startTime} - {classItem.timeSlot.endTime}
                            </div>
                          </div>

                          {classItem.notes && (
                            <p className="text-sm text-gray-500 mt-2 italic">
                              {classItem.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun cours aujourd'hui
                  </h3>
                  <p className="text-gray-600">
                    Profitez de cette journée libre pour réviser ou vous reposer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Horaire hebdomadaire */}
        <TabsContent value="week" className="space-y-4">
          {weeklySchedule && (
            <div className="grid gap-4">
              {Object.entries(weeklySchedule.schedule).map(([day, daySchedule]) => (
                <Card key={day}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {getDayLabel(day)}
                      <Badge variant="outline">
                        {daySchedule.length} cours
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {daySchedule.length > 0 ? (
                      <div className="space-y-3">
                        {daySchedule.map(classItem => (
                          <div key={classItem.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-mono min-w-[100px]">
                              {classItem.timeSlot.startTime} - {classItem.timeSlot.endTime}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{classItem.subjectName}</h4>
                                <Badge className={`text-xs ${getCourseTypeColor(classItem.courseType)}`}>
                                  {getCourseTypeLabel(classItem.courseType)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{classItem.teacherName}</span>
                                <span>•</span>
                                <span>{classItem.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucun cours ce jour</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Prochains cours */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Prochains Cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingClasses.length > 0 ? (
                <div className="space-y-3">
                  {upcomingClasses.map(classItem => (
                    <div key={classItem.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="text-sm font-mono min-w-[120px]">
                        <div className="font-medium">{getDayLabel(classItem.dayOfWeek)}</div>
                        <div className="text-gray-600">
                          {classItem.timeSlot.startTime} - {classItem.timeSlot.endTime}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{classItem.subjectName}</h4>
                          <Badge className={`text-xs ${getCourseTypeColor(classItem.courseType)}`}>
                            {getCourseTypeLabel(classItem.courseType)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{classItem.teacherName}</span>
                          <span>•</span>
                          <span>{classItem.location}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun cours à venir
                  </h3>
                  <p className="text-gray-600">
                    Vous êtes à jour avec votre emploi du temps.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Évaluations à venir */}
        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Évaluations Programmées (2 prochaines semaines)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvaluations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvaluations.map(evaluation => (
                    <div key={evaluation.id} className="p-4 border-l-4 border-red-400 bg-red-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{evaluation.title}</h3>
                            <Badge className={getEvaluationTypeColor(evaluation.evaluationType)}>
                              {evaluation.evaluationType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700 mb-2">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {evaluation.subjectName}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {evaluation.teacherName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(evaluation.scheduledDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {evaluation.duration} minutes
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {evaluation.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {evaluation.maxPoints} points
                            </div>
                          </div>

                          {evaluation.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Description:</span> {evaluation.description}
                            </p>
                          )}

                          {evaluation.instructions && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Instructions:</span> {evaluation.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune évaluation programmée
                  </h3>
                  <p className="text-gray-600">
                    Aucune évaluation n'est prévue dans les 2 prochaines semaines.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getNextWeekStart(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // Prochain lundi
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + mondayOffset);
  return nextMonday.toISOString().split('T')[0];
}

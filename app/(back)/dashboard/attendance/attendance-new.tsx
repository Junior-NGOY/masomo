"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceMockDataService, ClassSchedule } from "@/services/attendanceMockDataService";
import { 
  Calendar,
  Clock,
  Users,
  Play,
  CheckCircle,
  Search,
  BarChart3,
  FileText,
  Timer,
  BookOpen
} from "lucide-react";

export default function AttendanceDashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");

  // Charger les données
  const schedules = AttendanceMockDataService.getClassSchedules();
  const activeSessions = AttendanceMockDataService.getActiveAttendanceSessions();
  const allSessions = AttendanceMockDataService.getAttendanceSessions();

  // Filtrer les emplois du temps par date
  const todaySchedules = schedules.filter(schedule => schedule.date === selectedDate);

  // Obtenir les classes uniques
  const uniqueClasses = [...new Set(schedules.map(s => s.className))];

  // Filtrer selon les critères
  const filteredSchedules = todaySchedules.filter(schedule => {
    const matchesSearch = schedule.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "ALL" || schedule.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const getSessionStatus = (schedule: ClassSchedule, sessionType: 'ENTRY' | 'EXIT') => {
    const sessions = allSessions.filter(s => 
      s.classScheduleId === schedule.id && s.sessionType === sessionType
    );
    return sessions[0]?.status || 'PENDING';
  };

  const getSessionBadge = (status: string) => {
    const variants = {
      PENDING: { color: "bg-gray-100 text-gray-800", text: "En attente" },
      IN_PROGRESS: { color: "bg-blue-100 text-blue-800", text: "En cours" },
      COMPLETED: { color: "bg-green-100 text-green-800", text: "Terminée" },
      CANCELLED: { color: "bg-red-100 text-red-800", text: "Annulée" }
    };
    const variant = variants[status as keyof typeof variants] || variants.PENDING;
    return (
      <Badge className={variant.color}>
        {variant.text}
      </Badge>
    );
  };

  const startAttendanceSession = (schedule: ClassSchedule, sessionType: 'ENTRY' | 'EXIT') => {
    router.push(`/dashboard/attendance/${encodeURIComponent(schedule.className)}/${schedule.date}/${sessionType}`);
  };

  const getCurrentTime = () => {
    return new Date().toTimeString().split(' ')[0].substring(0, 5);
  };

  const isTimeForSession = (schedule: ClassSchedule, sessionType: 'ENTRY' | 'EXIT') => {
    const currentTime = getCurrentTime();
    const targetTime = sessionType === 'ENTRY' ? schedule.firstCourseStartTime : schedule.lastCourseEndTime;
    
    // Permettre de commencer 15 minutes avant et jusqu'à 30 minutes après
    const targetDate = new Date(`2000-01-01T${targetTime}:00`);
    const currentDate = new Date(`2000-01-01T${currentTime}:00`);
    const startWindow = new Date(targetDate.getTime() - 15 * 60000); // -15 min
    const endWindow = new Date(targetDate.getTime() + 30 * 60000); // +30 min
    
    return currentDate >= startWindow && currentDate <= endWindow;
  };

  const StatsCard = ({ title, value, description, icon: Icon, color = "blue" }: any) => {
    const getColorClasses = (color: string) => {
      const colorClasses: Record<string, { bg: string; text: string }> = {
        blue: { bg: "bg-blue-100", text: "text-blue-600" },
        green: { bg: "bg-green-100", text: "text-green-600" },
        red: { bg: "bg-red-100", text: "text-red-600" },
        orange: { bg: "bg-orange-100", text: "text-orange-600" }
      };
      return colorClasses[color] || colorClasses.blue;
    };

    const colorClasses = getColorClasses(color);

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
              <Icon className={`h-6 w-6 ${colorClasses.text}`} />
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
  };

  // Calculer les statistiques du jour
  const todayStats = {
    totalClasses: todaySchedules.length,
    activeSessions: activeSessions.length,
    completedSessions: allSessions.filter(s => 
      s.date === selectedDate && s.status === 'COMPLETED'
    ).length,
    pendingSessions: allSessions.filter(s => 
      s.date === selectedDate && s.status === 'PENDING'
    ).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Présences</h1>
          <p className="text-gray-600 mt-1">
            Suivi des présences par classe avec sessions d'entrée et de sortie
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/attendance/reports">
              <BarChart3 className="h-4 w-4 mr-2" />
              Rapports
            </Link>
          </Button>
        </div>
      </div>

      {/* Contrôles */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Rechercher</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nom de classe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Classe</label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Toutes les classes</SelectItem>
                  {uniqueClasses.map(className => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Classes du jour"
          value={todayStats.totalClasses}
          description="Total planifié"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Sessions en cours"
          value={todayStats.activeSessions}
          description="Présences en cours"
          icon={Timer}
          color="orange"
        />
        <StatsCard
          title="Sessions terminées"
          value={todayStats.completedSessions}
          description="Présences complètes"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Sessions en attente"
          value={todayStats.pendingSessions}
          description="À commencer"
          icon={Clock}
          color="red"
        />
      </div>

      {/* Sessions actives */}
      {activeSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Timer className="h-5 w-5" />
              Sessions en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {session.className} - {session.sessionType === 'ENTRY' ? 'Entrée' : 'Sortie'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Débutée à {session.actualStartTime} • {session.presentStudents}/{session.totalStudents} élèves
                      </p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/dashboard/attendance/${encodeURIComponent(session.className)}/${session.date}/${session.sessionType}`}>
                      Continuer
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des classes */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {filteredSchedules.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune classe programmée
                </h3>
                <p className="text-gray-600">
                  Il n'y a pas de cours programmés pour la date sélectionnée.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSchedules.map((schedule) => {
                const entryStatus = getSessionStatus(schedule, 'ENTRY');
                const exitStatus = getSessionStatus(schedule, 'EXIT');
                const entryTimeOk = isTimeForSession(schedule, 'ENTRY');
                const exitTimeOk = isTimeForSession(schedule, 'EXIT');

                return (
                  <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{schedule.className}</CardTitle>
                        <Badge variant="outline">
                          {schedule.subjects.length} cours
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Informations générales */}
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{schedule.firstCourseStartTime} - {schedule.lastCourseEndTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{AttendanceMockDataService.getStudentsInClass(schedule.className).length} élèves</span>
                        </div>
                      </div>

                      {/* Session d'entrée */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Session d'entrée</span>
                          {getSessionBadge(entryStatus)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Prévue: {schedule.firstCourseStartTime}
                          </span>
                          {entryStatus === 'PENDING' && (
                            <Button
                              size="sm"
                              onClick={() => startAttendanceSession(schedule, 'ENTRY')}
                              disabled={!entryTimeOk}
                              className="ml-auto"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Commencer
                            </Button>
                          )}
                          {entryStatus === 'IN_PROGRESS' && (
                            <Button size="sm" variant="outline" asChild className="ml-auto">
                              <Link href={`/dashboard/attendance/${encodeURIComponent(schedule.className)}/${schedule.date}/ENTRY`}>
                                Continuer
                              </Link>
                            </Button>
                          )}
                          {entryStatus === 'COMPLETED' && (
                            <Button size="sm" variant="ghost" asChild className="ml-auto">
                              <Link href={`/dashboard/attendance/summary/${encodeURIComponent(schedule.className)}/${schedule.date}`}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Voir
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Session de sortie */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Session de sortie</span>
                          {getSessionBadge(exitStatus)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Prévue: {schedule.lastCourseEndTime}
                          </span>
                          {exitStatus === 'PENDING' && (
                            <Button
                              size="sm"
                              onClick={() => startAttendanceSession(schedule, 'EXIT')}
                              disabled={!exitTimeOk}
                              className="ml-auto"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Commencer
                            </Button>
                          )}
                          {exitStatus === 'IN_PROGRESS' && (
                            <Button size="sm" variant="outline" asChild className="ml-auto">
                              <Link href={`/dashboard/attendance/${encodeURIComponent(schedule.className)}/${schedule.date}/EXIT`}>
                                Continuer
                              </Link>
                            </Button>
                          )}
                          {exitStatus === 'COMPLETED' && (
                            <Button size="sm" variant="ghost" asChild className="ml-auto">
                              <Link href={`/dashboard/attendance/summary/${encodeURIComponent(schedule.className)}/${schedule.date}`}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Voir
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Cours de la journée */}
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Cours du jour</span>
                        <div className="space-y-1">
                          {schedule.subjects.slice(0, 3).map((subject) => (
                            <div key={subject.id} className="text-xs text-gray-600 flex justify-between">
                              <span>{subject.subjectName}</span>
                              <span>{subject.startTime}-{subject.endTime}</span>
                            </div>
                          ))}
                          {schedule.subjects.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{schedule.subjects.length - 3} autres cours
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Historique des présences
              </h3>
              <p className="text-gray-600 mb-4">
                Consultez l'historique complet des sessions de présence.
              </p>
              <Button asChild>
                <Link href="/dashboard/attendance/reports">
                  Voir les rapports détaillés
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

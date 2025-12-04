"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStudentAttendance } from "@/hooks/useStudentAttendance";
import { useStudentStats, useStudents } from "@/hooks/useStudents";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function StudentAttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { attendance, loading: attendanceLoading } = useStudentAttendance();
  const { students, loading: studentsLoading } = useStudents();
  const { stats, loading: statsLoading } = useStudentStats();

  // Use students as profiles for now, as they contain basic info
  const profiles = students.map(s => ({
    ...s,
    className: s.classTitle || 'N/A'
  }));

  const isLoading = attendanceLoading || studentsLoading || statsLoading;

  if (isLoading) {
    return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!stats) return null;

  // Filtrage des données
  const filteredAttendance = attendance.filter(att => {
    const matchesSearch = att.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || att.status === statusFilter;
    const matchesClass = classFilter === "ALL" || att.className === classFilter;
    const matchesDate = !selectedDate || att.date === format(selectedDate, 'yyyy-MM-dd');

    return matchesSearch && matchesStatus && matchesClass && matchesDate;
  });

  // Obtenir les classes uniques
  const uniqueClasses = [...new Set(attendance.map(att => att.className))];

  // Statistiques de présence pour la date sélectionnée
  const todayAttendance = attendance.filter(att =>
    att.date === format(selectedDate || new Date(), 'yyyy-MM-dd')
  );

  const todayStats = {
    present: todayAttendance.filter(att => att.status === 'PRESENT').length,
    absent: todayAttendance.filter(att => att.status === 'ABSENT').length,
    late: todayAttendance.filter(att => att.status === 'LATE').length,
    excused: todayAttendance.filter(att => att.status === 'EXCUSED').length,
    total: todayAttendance.length
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string; icon: any }> = {
      PRESENT: { color: "bg-green-100 text-green-800", text: "Présent", icon: CheckCircle },
      ABSENT: { color: "bg-red-100 text-red-800", text: "Absent", icon: UserX },
      LATE: { color: "bg-orange-100 text-orange-800", text: "En retard", icon: Clock },
      EXCUSED: { color: "bg-blue-100 text-blue-800", text: "Excusé", icon: UserCheck }
    };
    const variant = variants[status] || variants.ABSENT;
    const Icon = variant.icon;
    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {variant.text}
      </Badge>
    );
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

  // Calculer le taux de présence par élève
  const getStudentAttendanceRate = (studentId: string) => {
    const studentAttendance = attendance.filter(att => att.studentId === studentId);
    const presentCount = studentAttendance.filter(att => att.status === 'PRESENT').length;
    return studentAttendance.length > 0 ? (presentCount / studentAttendance.length) * 100 : 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Présences</h1>
          <p className="text-gray-600 mt-1">Suivi de la présence et de l'assiduité des élèves</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Marquer présence
          </Button>
        </div>
      </div>

      {/* Sélecteur de date */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date sélectionnée</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-64 mt-1 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="text-sm text-gray-600">
              <p>Données pour {selectedDate ? format(selectedDate, "PP", { locale: fr }) : "aujourd'hui"}</p>
              <p>{todayStats.total} enregistrements trouvés</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques du jour */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Présents"
          value={todayStats.present}
          description={`${todayStats.total > 0 ? Math.round((todayStats.present / todayStats.total) * 100) : 0}% des élèves`}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Absents"
          value={todayStats.absent}
          description={`${todayStats.total > 0 ? Math.round((todayStats.absent / todayStats.total) * 100) : 0}% des élèves`}
          icon={UserX}
          color="red"
        />
        <StatsCard
          title="En retard"
          value={todayStats.late}
          description="Élèves arrivés en retard"
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Excusés"
          value={todayStats.excused}
          description="Absences justifiées"
          icon={UserCheck}
          color="blue"
        />
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Présence quotidienne</TabsTrigger>
          <TabsTrigger value="students">Par élève</TabsTrigger>
          <TabsTrigger value="classes">Par classe</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Rechercher</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nom de l'élève..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les statuts</SelectItem>
                      <SelectItem value="PRESENT">Présents</SelectItem>
                      <SelectItem value="ABSENT">Absents</SelectItem>
                      <SelectItem value="LATE">En retard</SelectItem>
                      <SelectItem value="EXCUSED">Excusés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Classe</label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-48 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Toutes les classes</SelectItem>
                      {uniqueClasses.map(className => (
                        <SelectItem key={className} value={className}>{className}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des présences */}
          <Card>
            <CardHeader>
              <CardTitle>
                Présences du {selectedDate ? format(selectedDate, "PP", { locale: fr }) : "jour"}
                ({filteredAttendance.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Élève</th>
                      <th className="text-left py-3">Classe</th>
                      <th className="text-left py-3">Matière</th>
                      <th className="text-left py-3">Statut</th>
                      <th className="text-left py-3">Heure d'arrivée</th>
                      <th className="text-left py-3">Heure de départ</th>
                      <th className="text-left py-3">Notes</th>
                      <th className="text-right py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((att) => (
                      <tr key={att.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{att.studentName}</td>
                        <td className="py-3 text-gray-600">{att.className}</td>
                        <td className="py-3">{att.subject}</td>
                        <td className="py-3">{getStatusBadge(att.status)}</td>
                        <td className="py-3">{att.timeIn || '-'}</td>
                        <td className="py-3">{att.timeOut || '-'}</td>
                        <td className="py-3 text-gray-600 max-w-xs truncate">
                          {att.notes || '-'}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {/* Vue par élève */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((student) => {
              const attendanceRate = getStudentAttendanceRate(student.id);
              const studentAttendanceRecords = attendance.filter(att => att.studentId === student.id);
              const recentAbsences = studentAttendanceRecords
                .filter(att => att.status === 'ABSENT')
                .slice(0, 3);

              return (
                <Card key={student.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={student.imageUrl} alt={student.name} className="object-cover" />
                        <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <p className="text-sm text-gray-600">{student.className}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taux de présence:</span>
                        <span className={`font-medium ${attendanceRate >= 90 ? 'text-green-600' : attendanceRate >= 80 ? 'text-orange-600' : 'text-red-600'}`}>
                          {attendanceRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${attendanceRate >= 90 ? 'bg-green-500' :
                            attendanceRate >= 80 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>

                      {recentAbsences.length > 0 && (
                        <div className="pt-2">
                          <p className="text-xs text-gray-600 mb-1">Absences récentes:</p>
                          <div className="space-y-1">
                            {recentAbsences.map((absence, index) => (
                              <div key={index} className="text-xs text-red-600">
                                {format(new Date(absence.date), "dd/MM")} - {absence.subject}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir historique
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          {/* Vue par classe */}
          <div className="grid gap-4">
            {uniqueClasses.map((className) => {
              const classAttendance = attendance.filter(att => att.className === className);
              const classStats = {
                present: classAttendance.filter(att => att.status === 'PRESENT').length,
                absent: classAttendance.filter(att => att.status === 'ABSENT').length,
                late: classAttendance.filter(att => att.status === 'LATE').length,
                total: classAttendance.length
              };
              const attendanceRate = classStats.total > 0 ? (classStats.present / classStats.total) * 100 : 0;

              return (
                <Card key={className}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{className}</CardTitle>
                      <Badge variant="outline">
                        {attendanceRate.toFixed(1)}% de présence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{classStats.present}</p>
                        <p className="text-sm text-gray-600">Présents</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{classStats.absent}</p>
                        <p className="text-sm text-gray-600">Absents</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{classStats.late}</p>
                        <p className="text-sm text-gray-600">En retard</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{classStats.total}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analyses et tendances */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Taux de présence global</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">{stats.attendanceRate}%</p>
                    <p className="text-gray-600">Taux moyen de présence</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${stats.attendanceRate}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes de présence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profiles
                  .filter(student => getStudentAttendanceRate(student.id) < 80)
                  .map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={student.imageUrl} alt={student.name} className="object-cover" />
                          <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-red-800">{student.name}</p>
                          <p className="text-sm text-red-600">{student.className}</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800">
                        {getStudentAttendanceRate(student.id).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                {profiles.filter(student => getStudentAttendanceRate(student.id) < 80).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>Aucune alerte de présence</p>
                    <p className="text-sm">Tous les élèves ont un taux de présence satisfaisant</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

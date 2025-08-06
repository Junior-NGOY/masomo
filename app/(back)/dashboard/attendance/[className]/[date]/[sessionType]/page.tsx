"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttendanceMockDataService, ClassAttendanceSession, StudentAttendanceRecord } from "@/services/attendanceMockDataService";
import { 
  ArrowLeft,
  Clock,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  CheckCircle,
  AlertTriangle,
  Search,
  Save,
  Calendar,
  MapPin,
  User,
  Timer,
  Bell
} from "lucide-react";

export default function ClassAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const className = decodeURIComponent(params.className as string);
  const date = params.date as string;
  const sessionType = params.sessionType as 'ENTRY' | 'EXIT';

  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [currentSession, setCurrentSession] = useState<ClassAttendanceSession | null>(null);
  const [studentsInClass, setStudentsInClass] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendanceRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Charger les données
    const loadData = () => {
      // Obtenir l'emploi du temps de la classe
      const schedule = AttendanceMockDataService.getScheduleByClassAndDate(className, date);
      if (!schedule) {
        console.error("Emploi du temps non trouvé");
        return;
      }

      // Vérifier s'il y a déjà une session en cours
      const existingSessions = AttendanceMockDataService.getTodaySessionsForClass(className, date);
      const existingSession = existingSessions.find(s => s.sessionType === sessionType);

      if (existingSession) {
        setCurrentSession(existingSession);
        setNotes(existingSession.notes || "");
      } else {
        // Créer une nouvelle session
        const newSession = AttendanceMockDataService.createAttendanceSession(
          schedule.id,
          sessionType,
          "current_user_id", // À remplacer par l'ID de l'utilisateur connecté
          "Nom Utilisateur" // À remplacer par le nom de l'utilisateur connecté
        );
        setCurrentSession(newSession);
      }

      // Charger les élèves de la classe
      const students = AttendanceMockDataService.getStudentsInClass(className);
      setStudentsInClass(students);

      // Charger les enregistrements existants
      if (existingSession) {
        const records = AttendanceMockDataService.getStudentAttendanceRecords()
          .filter(record => record.sessionId === existingSession.id);
        setAttendanceRecords(records);
      }
    };

    loadData();
  }, [className, date, sessionType]);

  const handleAttendanceChange = (
    studentId: string,
    studentName: string,
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_EXIT' | 'EXCUSED'
  ) => {
    if (!currentSession) return;

    const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    const newRecord = AttendanceMockDataService.recordStudentAttendance(
      currentSession.id,
      studentId,
      studentName,
      status,
      "current_user_id",
      "Nom Utilisateur",
      {
        arrivalTime: sessionType === 'ENTRY' ? currentTime : undefined,
        exitTime: sessionType === 'EXIT' ? currentTime : undefined
      }
    );

    // Mettre à jour les enregistrements localement
    setAttendanceRecords(prev => {
      const filtered = prev.filter(record => record.studentId !== studentId);
      return [...filtered, newRecord];
    });

    // Mettre à jour les statistiques de la session
    updateSessionStats();
  };

  const updateSessionStats = () => {
    if (!currentSession) return;

    const presentCount = attendanceRecords.filter(r => 
      ['PRESENT', 'LATE', 'EARLY_EXIT'].includes(r.status)
    ).length;
    
    const absentCount = attendanceRecords.filter(r => r.status === 'ABSENT').length;
    const lateCount = attendanceRecords.filter(r => r.status === 'LATE').length;
    const earlyExitCount = attendanceRecords.filter(r => r.status === 'EARLY_EXIT').length;

    setCurrentSession(prev => prev ? {
      ...prev,
      presentStudents: presentCount,
      absentStudents: absentCount,
      lateStudents: sessionType === 'ENTRY' ? lateCount : prev.lateStudents,
      earlyExitStudents: sessionType === 'EXIT' ? earlyExitCount : prev.earlyExitStudents,
      updatedAt: new Date().toISOString()
    } : null);
  };

  const getStudentRecord = (studentId: string) => {
    return attendanceRecords.find(record => record.studentId === studentId);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PRESENT: "bg-green-100 text-green-800",
      ABSENT: "bg-red-100 text-red-800",
      LATE: "bg-orange-100 text-orange-800",
      EARLY_EXIT: "bg-blue-100 text-blue-800",
      EXCUSED: "bg-purple-100 text-purple-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      PRESENT: "Présent",
      ABSENT: "Absent",
      LATE: "En retard",
      EARLY_EXIT: "Sortie anticipée",
      EXCUSED: "Excusé"
    };
    return texts[status as keyof typeof texts] || "Non défini";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      PRESENT: UserCheck,
      ABSENT: UserX,
      LATE: Clock,
      EARLY_EXIT: UserMinus,
      EXCUSED: CheckCircle
    };
    return icons[status as keyof typeof icons] || User;
  };

  const handleCompleteSession = async () => {
    if (!currentSession) return;

    setIsSubmitting(true);
    try {
      // Marquer tous les élèves non enregistrés comme absents
      const unrecordedStudents = studentsInClass.filter(student => 
        !attendanceRecords.some(record => record.studentId === student.id)
      );

      const newAbsentRecords = unrecordedStudents.map(student =>
        AttendanceMockDataService.recordStudentAttendance(
          currentSession.id,
          student.id,
          student.name,
          'ABSENT',
          "current_user_id",
          "Nom Utilisateur"
        )
      );

      setAttendanceRecords(prev => [...prev, ...newAbsentRecords]);

      // Mettre à jour la session comme terminée
      const updatedSession = {
        ...currentSession,
        status: 'COMPLETED' as const,
        actualEndTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
        notes: notes,
        updatedAt: new Date().toISOString()
      };

      setCurrentSession(updatedSession);

      // Dans une vraie app, ici on sauvegarderait en base de données
      console.log("Session terminée:", updatedSession);
      console.log("Enregistrements:", attendanceRecords);

      // Rediriger vers la page de résumé
      router.push(`/dashboard/attendance/summary/${className}/${date}`);
    } catch (error) {
      console.error("Erreur lors de la finalisation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = studentsInClass.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completionPercentage = studentsInClass.length > 0 
    ? Math.round((attendanceRecords.length / studentsInClass.length) * 100)
    : 0;

  if (!currentSession) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Session non trouvée</h1>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Présence - {className}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(date).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {sessionType === 'ENTRY' ? 'Entrée' : 'Sortie'} - {currentSession.expectedTime}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {studentsInClass.length} élèves
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {completionPercentage}% complété
          </Badge>
          <Button 
            onClick={handleCompleteSession}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              "Finalisation..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Terminer la session
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Statistiques temps réel */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Présents</p>
                <p className="text-xl font-bold text-gray-900">
                  {attendanceRecords.filter(r => ['PRESENT', 'LATE', 'EARLY_EXIT'].includes(r.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Absents</p>
                <p className="text-xl font-bold text-gray-900">
                  {attendanceRecords.filter(r => r.status === 'ABSENT').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {sessionType === 'ENTRY' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">En retard</p>
                  <p className="text-xl font-bold text-gray-900">
                    {attendanceRecords.filter(r => r.status === 'LATE').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {sessionType === 'EXIT' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100">
                  <UserMinus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Sortie anticipée</p>
                  <p className="text-xl font-bold text-gray-900">
                    {attendanceRecords.filter(r => r.status === 'EARLY_EXIT').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-100">
                <Timer className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Restants</p>
                <p className="text-xl font-bold text-gray-900">
                  {studentsInClass.length - attendanceRecords.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des élèves */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des élèves
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredStudents.map((student) => {
              const record = getStudentRecord(student.id);
              const StatusIcon = record ? getStatusIcon(record.status) : User;
              
              return (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    record ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      record ? 'bg-white' : 'bg-gray-100'
                    }`}>
                      <StatusIcon className={`h-5 w-5 ${
                        record 
                          ? record.status === 'PRESENT' ? 'text-green-600' :
                            record.status === 'ABSENT' ? 'text-red-600' :
                            record.status === 'LATE' ? 'text-orange-600' :
                            record.status === 'EARLY_EXIT' ? 'text-blue-600' :
                            'text-purple-600'
                          : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      {record && record.arrivalTime && (
                        <p className="text-sm text-gray-500">
                          Arrivée: {record.arrivalTime}
                        </p>
                      )}
                      {record && record.exitTime && (
                        <p className="text-sm text-gray-500">
                          Sortie: {record.exitTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {record && (
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusText(record.status)}
                      </Badge>
                    )}
                    
                    {!record && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, student.name, 'PRESENT')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Présent
                        </Button>
                        
                        {sessionType === 'ENTRY' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAttendanceChange(student.id, student.name, 'LATE')}
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Retard
                          </Button>
                        )}
                        
                        {sessionType === 'EXIT' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAttendanceChange(student.id, student.name, 'EARLY_EXIT')}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <UserMinus className="h-4 w-4 mr-1" />
                            Sortie anticipée
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAttendanceChange(student.id, student.name, 'ABSENT')}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes de la session</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ajouter des notes sur cette session de présence..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}

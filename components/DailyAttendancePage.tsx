"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DailyAttendanceService, ClassStudent, DailyAttendanceRecord, ClassDailyAttendance } from "@/services/dailyAttendanceService";
import { ExportService } from "@/lib/exportUtils";
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Save,
  Calendar,
  Download,
  Eye,
  RotateCcw,
  Fingerprint,
  Scan,
  Shield
} from "lucide-react";
import Image from "next/image";
import { BiometricService } from "@/services/biometricService";

interface DailyAttendancePageProps {
  className: string;
  date?: string;
}

export default function DailyAttendancePage({ className, date }: DailyAttendancePageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [classNotes, setClassNotes] = useState("");
  const [currentAttendance, setCurrentAttendance] = useState<ClassDailyAttendance | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendanceRecord[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [biometricMode, setBiometricMode] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  const targetDate = date || new Date().toISOString().split('T')[0];
  const isToday = targetDate === new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadData = () => {
      // Charger les élèves de la classe
      const classStudents = DailyAttendanceService.getStudentsInClass(className);
      setStudents(classStudents);

      // Vérifier s'il y a déjà une session de présence
      const existingAttendance = DailyAttendanceService.getClassAttendance(className, targetDate);
      
      if (existingAttendance) {
        setCurrentAttendance(existingAttendance);
        setClassNotes(existingAttendance.notes || "");
        
        // Charger les enregistrements existants
        const records = DailyAttendanceService.getStudentAttendanceRecords(className, targetDate);
        setAttendanceRecords(records);
      } else if (isToday) {
        // Créer une nouvelle session uniquement pour aujourd'hui
        const newAttendance = DailyAttendanceService.startDailyAttendance(
          className,
          "current_teacher_id", // À remplacer par l'ID du professeur connecté
          "Prof. Mukendi" // À remplacer par le nom du professeur connecté
        );
        setCurrentAttendance(newAttendance);
      }
    };

    loadData();
  }, [className, targetDate, isToday]);

  const handleAttendanceChange = (
    student: ClassStudent,
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED',
    notes?: string,
    arrivalTime?: string
  ) => {
    if (!currentAttendance || currentAttendance.isCompleted) return;

    const record = DailyAttendanceService.recordStudentAttendance(
      currentAttendance.id,
      student.id,
      student.name,
      className,
      status,
      "current_teacher_id",
      "Prof. Mukendi",
      notes,
      arrivalTime,
      targetDate
    );

    // Mettre à jour les enregistrements localement
    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => r.studentId !== student.id);
      return [...filtered, record];
    });

    // Recharger l'attendance pour mettre à jour les statistiques
    const updatedAttendance = DailyAttendanceService.getClassAttendance(className, targetDate);
    if (updatedAttendance) {
      setCurrentAttendance(updatedAttendance);
    }
  };

  const handleBiometricScan = async (student: ClassStudent) => {
    if (!currentAttendance || currentAttendance.isCompleted) return;

    setIsBiometricScanning(true);
    try {
      // Tenter l'authentification biométrique WebAuthn
      const result = await BiometricService.authenticateWebAuthnBiometric(student.id);
      
      if (result.success) {
        // Marquer automatiquement comme présent avec note biométrique
        const record = DailyAttendanceService.recordStudentAttendance(
          currentAttendance.id,
          student.id,
          student.name,
          className,
          'PRESENT',
          "current_teacher_id",
          "Prof. Mukendi",
          `Présence confirmée par biométrie (confiance: ${result.confidence}%)`,
          getCurrentTime(),
          targetDate
        );

        // Mettre à jour les enregistrements localement
        setAttendanceRecords(prev => {
          const filtered = prev.filter(r => r.studentId !== student.id);
          return [...filtered, record];
        });

        // Recharger l'attendance pour mettre à jour les statistiques
        const updatedAttendance = DailyAttendanceService.getClassAttendance(className, targetDate);
        if (updatedAttendance) {
          setCurrentAttendance(updatedAttendance);
        }

        alert(`✅ Authentification biométrique réussie pour ${student.name} (${result.confidence}%)`);
      } else {
        alert(`❌ Échec de l'authentification biométrique: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Erreur biométrique: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsBiometricScanning(false);
    }
  };

  const getCurrentTime = () => {
    return new Date().toTimeString().split(' ')[0].substring(0, 5);
  };

  const handleCompleteAttendance = async () => {
    if (!currentAttendance) return;

    setIsCompleting(true);
    try {
      const completed = DailyAttendanceService.completeAttendance(
        currentAttendance.id,
        true, // Marquer les non-marqués comme absents
        classNotes
      );

      setCurrentAttendance(completed);
      
      // Recharger les enregistrements
      const updatedRecords = DailyAttendanceService.getStudentAttendanceRecords(className, targetDate);
      setAttendanceRecords(updatedRecords);
      
      alert("Présence finalisée avec succès !");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleExportAttendance = async () => {
    setIsExporting(true);
    try {
      const exportData = DailyAttendanceService.exportAttendanceData(className, targetDate, targetDate);
      
      ExportService.exportToExcel({
        filename: `presence_${className.replace(/\s+/g, '_')}_${targetDate}`,
        sheetName: 'Présence Quotidienne',
        title: `PRÉSENCE QUOTIDIENNE - ${className.toUpperCase()}`,
        subtitle: `Date: ${new Date(targetDate).toLocaleDateString('fr-FR')} - ${exportData.length} élèves`,
        columns: [
          { key: 'Élève', label: 'Nom de l\'élève', width: 25 },
          { key: 'Statut', label: 'Statut', width: 15 },
          { key: 'Heure d\'arrivée', label: 'Heure d\'arrivée', width: 15 },
          { key: 'Notes', label: 'Notes', width: 30 },
          { key: 'Pris par', label: 'Pris par', width: 20 },
          { key: 'Heure de saisie', label: 'Heure de saisie', width: 20 }
        ],
        data: exportData,
        includeTimestamp: true
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getStudentRecord = (studentId: string) => {
    return attendanceRecords.find(record => record.studentId === studentId);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    const colors = {
      PRESENT: "bg-green-100 text-green-800 border-green-200",
      ABSENT: "bg-red-100 text-red-800 border-red-200",
      LATE: "bg-orange-100 text-orange-800 border-orange-200",
      EXCUSED: "bg-blue-100 text-blue-800 border-blue-200"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      PRESENT: UserCheck,
      ABSENT: UserX,
      LATE: Clock,
      EXCUSED: CheckCircle
    };
    const Icon = icons[status as keyof typeof icons] || UserCheck;
    return <Icon className="h-4 w-4" />;
  };

  if (!isToday && !currentAttendance) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Présence - {className}</h1>
            <p className="text-gray-600">{new Date(targetDate).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune présence enregistrée</h3>
            <p className="text-gray-600 mb-4">
              La présence n'a pas été prise pour cette classe à cette date.
            </p>
            <Button variant="outline" onClick={() => router.back()}>
              Retour
            </Button>
          </CardContent>
        </Card>
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
            <h1 className="text-2xl font-bold">Présence Quotidienne - {className}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(targetDate).toLocaleDateString('fr-FR')}
              </div>
              {currentAttendance?.isCompleted && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Finalisée
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {currentAttendance && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportAttendance}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Export..." : "Exporter"}
            </Button>
          )}
          
          {currentAttendance && !currentAttendance?.isCompleted && isToday && (
            <Button 
              onClick={handleCompleteAttendance}
              disabled={isCompleting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isCompleting ? "Finalisation..." : "Finaliser"}
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      {currentAttendance && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold">{currentAttendance?.totalStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Présents</p>
                  <p className="text-xl font-bold text-green-600">
                    {(currentAttendance?.presentStudents || 0) + (currentAttendance?.lateStudents || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <UserX className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Absents</p>
                  <p className="text-xl font-bold text-red-600">{currentAttendance?.absentStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux</p>
                  <p className="text-xl font-bold">{currentAttendance?.attendancePercentage || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un élève par nom ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredStudents.length} élève(s) affiché(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des élèves */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des élèves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const record = getStudentRecord(student.id);
              const canEdit = currentAttendance && !currentAttendance.isCompleted && isToday;
              
              return (
                <div 
                  key={student.id} 
                  className={`border rounded-lg p-4 transition-all ${
                    record ? `${getStatusColor(record.status)} border-2` : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {student.photoUrl && (
                        <Image
                          src={student.photoUrl}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">N° {student.rollNumber}</p>
                      </div>
                      
                      {record && (
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className="text-sm font-medium">
                            {record.status === 'PRESENT' ? 'Présent' :
                             record.status === 'ABSENT' ? 'Absent' :
                             record.status === 'LATE' ? 'En retard' : 'Excusé'}
                          </span>
                          {record.arrivalTime && (
                            <span className="text-xs text-gray-500">({record.arrivalTime})</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {canEdit && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={record?.status === 'PRESENT' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceChange(student, 'PRESENT')}
                          className="text-xs"
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          Présent
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={record?.status === 'LATE' ? 'default' : 'outline'}
                          onClick={() => {
                            const time = getCurrentTime();
                            handleAttendanceChange(student, 'LATE', `Arrivé en retard à ${time}`, time);
                          }}
                          className="text-xs"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Retard
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={record?.status === 'ABSENT' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceChange(student, 'ABSENT')}
                          className="text-xs"
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Absent
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={record?.status === 'EXCUSED' ? 'default' : 'outline'}
                          onClick={() => handleAttendanceChange(student, 'EXCUSED')}
                          className="text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Excusé
                        </Button>
                      </div>
                    )}
                    
                    {!canEdit && record && (
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">
                          {record.status === 'PRESENT' ? 'Présent' :
                           record.status === 'ABSENT' ? 'Absent' :
                           record.status === 'LATE' ? 'En retard' : 'Excusé'}
                        </span>
                      </Badge>
                    )}
                  </div>
                  
                  {record?.notes && (
                    <div className="mt-2 text-sm text-gray-600 italic">
                      Note: {record.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notes de classe */}
      {currentAttendance && (
        <Card>
          <CardHeader>
            <CardTitle>Notes de classe</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ajouter des notes pour cette session de présence..."
              value={classNotes}
              onChange={(e) => setClassNotes(e.target.value)}
              rows={3}
              disabled={currentAttendance?.isCompleted || false}
            />
            {currentAttendance?.isCompleted && classNotes && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{classNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

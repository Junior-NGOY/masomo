"use client";

import React, { useState, useEffect, useCallback, use } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, AlertCircle, CheckCircle, XCircle, UserCheck, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';
import { DailyAttendanceService, type DailyAttendanceRecord, type AttendanceStatus } from '@/services/dailyAttendanceService';
import { useBiometric } from '@/hooks/useBiometric';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  photo?: string;
}

interface DailyAttendancePageProps {
  params: Promise<{ classId: string }>;
}

export default function DailyAttendancePage({ params }: DailyAttendancePageProps) {
  const { classId } = use(params);
  
  return <DailyAttendanceContent classId={classId} />;
}

function DailyAttendanceContent({ classId }: { classId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceStatus>>(new Map());
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [biometricMode, setBiometricMode] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  // Hook biométrique
  const { verify, isVerifying, isSupported } = useBiometric();

  const loadClassData = useCallback(async () => {
    try {
      // Simuler le chargement des données de la classe
      const mockClassData = {
        id: classId,
        name: `Classe ${classId}`,
        level: '6ème',
        students: [
          {
            id: '1',
            firstName: 'Jean',
            lastName: 'Mukamba',
            registrationNumber: 'REG001',
            photo: undefined
          },
          {
            id: '2', 
            firstName: 'Marie',
            lastName: 'Kabongo',
            registrationNumber: 'REG002',
            photo: undefined
          },
          {
            id: '3',
            firstName: 'Paul',
            lastName: 'Mbuyi',
            registrationNumber: 'REG003',
            photo: undefined
          },
          {
            id: '4',
            firstName: 'Grace',
            lastName: 'Tshimanga',
            registrationNumber: 'REG004',
            photo: undefined
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Kasongo',
            registrationNumber: 'REG005',
            photo: undefined
          }
        ]
      };

      setClassInfo(mockClassData);
      setStudents(mockClassData.students);
    } catch (error) {
      console.error('Erreur lors du chargement de la classe:', error);
      toast.error('Erreur lors du chargement des données de la classe');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  const loadTodayAttendance = useCallback(async () => {
    try {
      const existingAttendance = DailyAttendanceService.getStudentAttendanceRecords(classId, currentDate);
      const attendanceMap = new Map<string, AttendanceStatus>();
      
      existingAttendance.forEach((record: DailyAttendanceRecord) => {
        attendanceMap.set(record.studentId, record.status);
      });
      
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Erreur lors du chargement de la présence:', error);
    }
  }, [classId, currentDate]);

  useEffect(() => {
    const loadData = async () => {
      await loadClassData();
      await loadTodayAttendance();
    };
    loadData();
  }, [loadClassData, loadTodayAttendance]);

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => new Map(prev.set(studentId, status)));
  };

  const handleBiometricScan = async (studentId: string) => {
    if (!biometricMode || !isSupported) {
      toast.error('Mode biométrique non disponible');
      return;
    }
    
    try {
      const result = await verify(studentId);
      
      if (result.success) {
        handleAttendanceChange(studentId, 'PRESENT');
        toast.success(`Présence confirmée par biométrie pour ${getStudentName(studentId)} (${result.confidence}%)`);
      } else {
        toast.error('Authentification biométrique échouée');
      }
    } catch (error) {
      console.error('Erreur biométrique:', error);
      toast.error('Erreur lors de la vérification biométrique');
    }
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      // Démarrer une session d'attendance si elle n'existe pas
      let attendanceSession = DailyAttendanceService.getClassAttendance(classId, currentDate);
      if (!attendanceSession) {
        attendanceSession = DailyAttendanceService.startDailyAttendance(
          classId,
          'current-user-id',
          'Enseignant', // À remplacer par le nom de l'utilisateur connecté
          currentDate
        );
      }

      // Enregistrer chaque présence d'élève
      Array.from(attendance.entries()).forEach(([studentId, status]) => {
        const student = students.find(s => s.id === studentId);
        const studentName = student ? `${student.firstName} ${student.lastName}` : 'Inconnu';
        
        DailyAttendanceService.recordStudentAttendance(
          attendanceSession!.id,
          studentId,
          studentName,
          classId,
          status,
          'current-user-id',
          'Enseignant', // À remplacer par le nom de l'utilisateur connecté
          '',
          undefined,
          currentDate
        );
      });

      toast.success('Présence enregistrée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement de la présence');
    } finally {
      setSaving(false);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : '';
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800 border-green-200';
      case 'ABSENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'LATE': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EXCUSED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle className="w-4 h-4" />;
      case 'ABSENT': return <XCircle className="w-4 h-4" />;
      case 'LATE': return <Clock className="w-4 h-4" />;
      case 'EXCUSED': return <AlertCircle className="w-4 h-4" />;
      default: return <UserCheck className="w-4 h-4" />;
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Array.from(attendance.values()).filter(status => status === 'PRESENT').length;
    const absent = Array.from(attendance.values()).filter(status => status === 'ABSENT').length;
    const late = Array.from(attendance.values()).filter(status => status === 'LATE').length;
    const excused = Array.from(attendance.values()).filter(status => status === 'EXCUSED').length;
    const unmarked = total - present - absent - late - excused;

    return { total, present, absent, late, excused, unmarked };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Prise de présence - {classInfo?.name}
          </h1>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            {new Date(currentDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={biometricMode ? "default" : "outline"}
            onClick={() => setBiometricMode(!biometricMode)}
            disabled={!isSupported}
            className="flex items-center gap-2"
          >
            <Fingerprint className="w-4 h-4" />
            Mode Biométrique
          </Button>
          
          <Button 
            onClick={saveAttendance}
            disabled={saving || stats.unmarked === stats.total}
            className="flex items-center gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                <p className="text-sm text-gray-600">Présents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                <p className="text-sm text-gray-600">Absents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
                <p className="text-sm text-gray-600">Retards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
                <p className="text-sm text-gray-600">Excusés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-600">{stats.unmarked}</p>
                <p className="text-sm text-gray-600">Non marqués</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mode biométrique activé */}
      {biometricMode && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Mode Biométrique Activé</h3>
                <p className="text-sm text-blue-700">
                  Cliquez sur l'icône biométrique à côté du nom de l'élève pour scanner son empreinte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des élèves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Liste des élèves ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {students.map((student) => {
              const currentStatus = attendance.get(student.id);
              
              return (
                <div key={student.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Photo de profil */}
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {student.photo ? (
                          <Image 
                            src={student.photo} 
                            alt={`${student.firstName} ${student.lastName}`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-medium">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {student.registrationNumber}
                        </p>
                      </div>

                      {/* Bouton biométrique */}
                      {biometricMode && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBiometricScan(student.id)}
                          disabled={isVerifying}
                          className="ml-4"
                        >
                          <Fingerprint className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Badge de statut actuel */}
                      {currentStatus && (
                        <Badge className={`${getStatusColor(currentStatus)} flex items-center gap-1`}>
                          {getStatusIcon(currentStatus)}
                          {currentStatus === 'PRESENT' && 'Présent'}
                          {currentStatus === 'ABSENT' && 'Absent'}
                          {currentStatus === 'LATE' && 'Retard'}
                          {currentStatus === 'EXCUSED' && 'Excusé'}
                        </Badge>
                      )}

                      {/* Boutons de statut */}
                      <div className="flex gap-2">
                        <Button
                          variant={currentStatus === 'PRESENT' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, 'PRESENT')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>

                        <Button
                          variant={currentStatus === 'ABSENT' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, 'ABSENT')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>

                        <Button
                          variant={currentStatus === 'LATE' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, 'LATE')}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Clock className="w-4 h-4" />
                        </Button>

                        <Button
                          variant={currentStatus === 'EXCUSED' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, 'EXCUSED')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions en bas */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-gray-600">
          {stats.unmarked > 0 ? (
            <span className="text-orange-600">
              {stats.unmarked} élève{stats.unmarked > 1 ? 's' : ''} non marqué{stats.unmarked > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-green-600">
              Tous les élèves sont marqués
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setAttendance(new Map())}
            disabled={attendance.size === 0}
          >
            Réinitialiser
          </Button>
          
          <Button 
            onClick={saveAttendance}
            disabled={saving || stats.unmarked === stats.total}
            className="flex items-center gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Enregistrer la présence
          </Button>
        </div>
      </div>
    </div>
  );
}

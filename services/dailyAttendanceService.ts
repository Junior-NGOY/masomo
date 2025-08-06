// Service pour la gestion simplifiée de la présence quotidienne
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface ClassStudent {
  id: string;
  name: string;
  rollNumber: string;
  email?: string;
  photoUrl?: string;
}

export interface DailyAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  takenBy: string;
  takenAt: string;
  notes?: string;
  arrivalTime?: string; // HH:MM pour les retards
  parentNotified?: boolean;
}

export interface ClassDailyAttendance {
  id: string;
  className: string;
  date: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
  excusedStudents: number;
  attendancePercentage: number;
  takenBy: string;
  takenAt: string;
  isCompleted: boolean;
  notes?: string;
}

export class DailyAttendanceService {
  // Mock data - en production, ceci viendrait de l'API
  private static mockStudents: ClassStudent[] = [
    {
      id: "1",
      name: "Marie Kabila",
      rollNumber: "001",
      email: "marie.kabila@student.masomopro.com",
      photoUrl: "/images/students/marie.jpg"
    },
    {
      id: "2", 
      name: "Jean Mukendi",
      rollNumber: "002",
      email: "jean.mukendi@student.masomopro.com",
      photoUrl: "/images/students/jean.jpg"
    },
    // ... plus d'élèves
  ];

  private static mockAttendanceRecords: DailyAttendanceRecord[] = [];
  private static mockClassAttendances: ClassDailyAttendance[] = [];

  // Obtenir les élèves d'une classe
  static getStudentsInClass(className: string): ClassStudent[] {
    // En production, filtrer par className depuis l'API
    return this.mockStudents.filter(student => 
      // Simulation: associer des élèves aux classes
      className.includes("6ème") ? ["1", "2", "3", "4", "5"].includes(student.id) :
      className.includes("5ème") ? ["6", "7", "8", "9", "10"].includes(student.id) :
      ["1", "2", "3"].includes(student.id)
    );
  }

  // Vérifier si la présence a déjà été prise pour une classe aujourd'hui
  static isAttendanceTakenToday(className: string, date?: string): boolean {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.mockClassAttendances.some(attendance => 
      attendance.className === className && 
      attendance.date === targetDate && 
      attendance.isCompleted
    );
  }

  // Obtenir la présence existante pour une classe et une date
  static getClassAttendance(className: string, date?: string): ClassDailyAttendance | null {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.mockClassAttendances.find(attendance => 
      attendance.className === className && attendance.date === targetDate
    ) || null;
  }

  // Obtenir les enregistrements individuels de présence
  static getStudentAttendanceRecords(className: string, date?: string): DailyAttendanceRecord[] {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.mockAttendanceRecords.filter(record => 
      record.className === className && record.date === targetDate
    );
  }

  // Commencer une session de prise de présence
  static startDailyAttendance(className: string, teacherId: string, teacherName: string, date?: string): ClassDailyAttendance {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const students = this.getStudentsInClass(className);
    
    const newAttendance: ClassDailyAttendance = {
      id: `attendance_${className}_${targetDate}_${Date.now()}`,
      className,
      date: targetDate,
      totalStudents: students.length,
      presentStudents: 0,
      absentStudents: 0,
      lateStudents: 0,
      excusedStudents: 0,
      attendancePercentage: 0,
      takenBy: teacherName,
      takenAt: new Date().toISOString(),
      isCompleted: false
    };

    this.mockClassAttendances.push(newAttendance);
    return newAttendance;
  }

  // Enregistrer la présence d'un élève
  static recordStudentAttendance(
    attendanceId: string,
    studentId: string,
    studentName: string,
    className: string,
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED',
    teacherId: string,
    teacherName: string,
    notes?: string,
    arrivalTime?: string,
    date?: string
  ): DailyAttendanceRecord {
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Supprimer l'ancien enregistrement s'il existe
    this.mockAttendanceRecords = this.mockAttendanceRecords.filter(record => 
      !(record.studentId === studentId && record.className === className && record.date === targetDate)
    );

    const newRecord: DailyAttendanceRecord = {
      id: `record_${studentId}_${targetDate}_${Date.now()}`,
      studentId,
      studentName,
      className,
      date: targetDate,
      status,
      takenBy: teacherName,
      takenAt: new Date().toISOString(),
      notes,
      arrivalTime: status === 'LATE' ? arrivalTime : undefined,
      parentNotified: status === 'ABSENT' // Auto-notification pour les absences
    };

    this.mockAttendanceRecords.push(newRecord);
    
    // Mettre à jour les statistiques de la classe
    this.updateClassAttendanceStats(attendanceId);
    
    return newRecord;
  }

  // Mettre à jour les statistiques de présence de la classe
  private static updateClassAttendanceStats(attendanceId: string): void {
    const attendance = this.mockClassAttendances.find(a => a.id === attendanceId);
    if (!attendance) return;

    const records = this.getStudentAttendanceRecords(attendance.className, attendance.date);
    
    attendance.presentStudents = records.filter(r => r.status === 'PRESENT').length;
    attendance.absentStudents = records.filter(r => r.status === 'ABSENT').length;
    attendance.lateStudents = records.filter(r => r.status === 'LATE').length;
    attendance.excusedStudents = records.filter(r => r.status === 'EXCUSED').length;
    
    const totalMarked = records.length;
    attendance.attendancePercentage = totalMarked > 0 ? 
      Math.round(((attendance.presentStudents + attendance.lateStudents) / totalMarked) * 100) : 0;
  }

  // Finaliser la prise de présence
  static completeAttendance(
    attendanceId: string,
    markUnmarkedAsAbsent: boolean = true,
    classNotes?: string
  ): ClassDailyAttendance {
    const attendance = this.mockClassAttendances.find(a => a.id === attendanceId);
    if (!attendance) throw new Error("Session de présence non trouvée");

    const students = this.getStudentsInClass(attendance.className);
    const records = this.getStudentAttendanceRecords(attendance.className, attendance.date);

    if (markUnmarkedAsAbsent) {
      // Marquer tous les élèves non marqués comme absents
      const unmarkedStudents = students.filter(student => 
        !records.some(record => record.studentId === student.id)
      );

      unmarkedStudents.forEach(student => {
        this.recordStudentAttendance(
          attendanceId,
          student.id,
          student.name,
          attendance.className,
          'ABSENT',
          "system",
          attendance.takenBy,
          "Marqué automatiquement comme absent",
          undefined,
          attendance.date
        );
      });
    }

    // Marquer comme terminé
    attendance.isCompleted = true;
    attendance.notes = classNotes;
    
    // Recalculer les statistiques finales
    this.updateClassAttendanceStats(attendanceId);
    
    return attendance;
  }

  // Obtenir les statistiques de présence pour un mois
  static getMonthlyAttendanceStats(className?: string, month?: string) {
    const targetMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const monthlyAttendances = this.mockClassAttendances.filter(attendance => 
      attendance.date.startsWith(targetMonth) && 
      attendance.isCompleted &&
      (!className || attendance.className === className)
    );

    const totalDays = monthlyAttendances.length;
    const totalStudentDays = monthlyAttendances.reduce((sum, a) => sum + a.totalStudents, 0);
    const totalPresentDays = monthlyAttendances.reduce((sum, a) => sum + a.presentStudents + a.lateStudents, 0);
    
    return {
      totalDays,
      averageAttendance: totalStudentDays > 0 ? Math.round((totalPresentDays / totalStudentDays) * 100) : 0,
      classesWithLowAttendance: monthlyAttendances.filter(a => a.attendancePercentage < 80).length,
      perfectAttendanceDays: monthlyAttendances.filter(a => a.attendancePercentage === 100).length
    };
  }

  // Obtenir l'historique de présence d'un élève
  static getStudentAttendanceHistory(studentId: string, startDate?: string, endDate?: string) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    
    return this.mockAttendanceRecords.filter(record => 
      record.studentId === studentId && 
      record.date >= start && 
      record.date <= end
    ).sort((a, b) => b.date.localeCompare(a.date));
  }

  // Exporter les données de présence
  static exportAttendanceData(className?: string, startDate?: string, endDate?: string) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    
    const records = this.mockAttendanceRecords.filter(record => 
      record.date >= start && 
      record.date <= end &&
      (!className || record.className === className)
    );

    return records.map(record => ({
      Date: record.date,
      Classe: record.className,
      Élève: record.studentName,
      Statut: record.status === 'PRESENT' ? 'Présent' :
              record.status === 'ABSENT' ? 'Absent' :
              record.status === 'LATE' ? 'En retard' : 'Excusé',
      'Heure d\'arrivée': record.arrivalTime || '',
      Notes: record.notes || '',
      'Pris par': record.takenBy,
      'Heure de saisie': new Date(record.takenAt).toLocaleString('fr-FR')
    }));
  }
}

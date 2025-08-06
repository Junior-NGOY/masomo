export interface ClassSchedule {
  id: string;
  className: string;
  date: string; // Format: YYYY-MM-DD
  firstCourseStartTime: string; // Format: HH:MM
  lastCourseEndTime: string; // Format: HH:MM
  subjects: CourseSlot[];
  academicYear: string;
  isActive: boolean;
}

export interface CourseSlot {
  id: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  room?: string;
}

export interface ClassAttendanceSession {
  id: string;
  classScheduleId: string;
  className: string;
  date: string;
  sessionType: 'ENTRY' | 'EXIT'; // Entrée ou sortie
  expectedTime: string; // Heure prévue (début premier cours ou fin dernier cours)
  actualStartTime?: string; // Heure réelle de début de prise de présence
  actualEndTime?: string; // Heure réelle de fin de prise de présence
  takenById: string; // ID du professeur ou administrateur
  takenByName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number; // Pour l'entrée seulement
  earlyExitStudents: number; // Pour la sortie seulement
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  sessionType: 'ENTRY' | 'EXIT';
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_EXIT' | 'EXCUSED';
  arrivalTime?: string; // Pour l'entrée
  exitTime?: string; // Pour la sortie
  recordedAt: string; // Moment où la présence a été enregistrée
  recordedById: string;
  recordedByName: string;
  notes?: string;
  parentNotified?: boolean; // Si les parents ont été notifiés en cas d'absence
  excuseReason?: string; // Raison de l'excuse si status = 'EXCUSED'
}

export interface AttendanceStats {
  className: string;
  date: string;
  totalStudents: number;
  
  // Stats entrée
  entrySession?: {
    presentCount: number;
    absentCount: number;
    lateCount: number;
    attendanceRate: number;
  };
  
  // Stats sortie
  exitSession?: {
    presentCount: number;
    absentCount: number;
    earlyExitCount: number;
    attendanceRate: number;
  };
  
  // Stats globales de la journée
  dayStats: {
    fullyPresentCount: number; // Présent entrée ET sortie
    partiallyPresentCount: number; // Présent soit entrée soit sortie
    totalAbsentCount: number; // Absent entrée ET sortie
    attendanceRate: number;
  };
}

export class AttendanceMockDataService {
  
  // === GESTION DES EMPLOIS DU TEMPS ===
  
  static getClassSchedules(): ClassSchedule[] {
    return [
      {
        id: "cs_6eme_2024_01_15",
        className: "6ème A",
        date: "2024-01-15",
        firstCourseStartTime: "08:00",
        lastCourseEndTime: "15:30",
        academicYear: "2024-2025",
        isActive: true,
        subjects: [
          {
            id: "slot_1",
            subjectName: "Mathématiques",
            teacherId: "t001",
            teacherName: "Prof. Mukendi",
            startTime: "08:00",
            endTime: "09:00",
            room: "Salle 101"
          },
          {
            id: "slot_2",
            subjectName: "Français",
            teacherId: "t002", 
            teacherName: "Prof. Kalala",
            startTime: "09:15",
            endTime: "10:15",
            room: "Salle 102"
          },
          {
            id: "slot_3",
            subjectName: "Sciences",
            teacherId: "t003",
            teacherName: "Prof. Nsimba",
            startTime: "10:30",
            endTime: "11:30",
            room: "Labo 1"
          },
          {
            id: "slot_4",
            subjectName: "Histoire",
            teacherId: "t004",
            teacherName: "Prof. Tshimanga",
            startTime: "14:00",
            endTime: "15:00",
            room: "Salle 103"
          },
          {
            id: "slot_5",
            subjectName: "Géographie",
            teacherId: "t005",
            teacherName: "Prof. Kabongo",
            startTime: "15:00",
            endTime: "15:30",
            room: "Salle 104"
          }
        ]
      },
      {
        id: "cs_5eme_2024_01_15",
        className: "5ème B",
        date: "2024-01-15",
        firstCourseStartTime: "08:00",
        lastCourseEndTime: "16:00",
        academicYear: "2024-2025",
        isActive: true,
        subjects: [
          {
            id: "slot_6",
            subjectName: "Anglais",
            teacherId: "t006",
            teacherName: "Prof. Mbuyi",
            startTime: "08:00",
            endTime: "09:00",
            room: "Salle 201"
          },
          {
            id: "slot_7",
            subjectName: "Mathématiques",
            teacherId: "t001",
            teacherName: "Prof. Mukendi",
            startTime: "09:15",
            endTime: "10:15",
            room: "Salle 202"
          },
          {
            id: "slot_8",
            subjectName: "Éducation Physique",
            teacherId: "t007",
            teacherName: "Prof. Kapend",
            startTime: "15:00",
            endTime: "16:00",
            room: "Terrain de sport"
          }
        ]
      }
    ];
  }

  static getScheduleByClassAndDate(className: string, date: string): ClassSchedule | null {
    return this.getClassSchedules().find(
      schedule => schedule.className === className && schedule.date === date
    ) || null;
  }

  // === GESTION DES SESSIONS DE PRÉSENCE ===
  
  static getAttendanceSessions(): ClassAttendanceSession[] {
    return [
      {
        id: "session_6eme_entry_2024_01_15",
        classScheduleId: "cs_6eme_2024_01_15",
        className: "6ème A",
        date: "2024-01-15",
        sessionType: "ENTRY",
        expectedTime: "08:00",
        actualStartTime: "07:55",
        actualEndTime: "08:10",
        takenById: "t001",
        takenByName: "Prof. Mukendi",
        status: "COMPLETED",
        totalStudents: 25,
        presentStudents: 22,
        absentStudents: 2,
        lateStudents: 1,
        earlyExitStudents: 0,
        notes: "3 élèves absents, 1 en retard (justifié par rendez-vous médical)",
        createdAt: "2024-01-15T07:55:00Z",
        updatedAt: "2024-01-15T08:10:00Z"
      },
      {
        id: "session_6eme_exit_2024_01_15",
        classScheduleId: "cs_6eme_2024_01_15",
        className: "6ème A",
        date: "2024-01-15",
        sessionType: "EXIT",
        expectedTime: "15:30",
        actualStartTime: "15:25",
        actualEndTime: "15:35",
        takenById: "t005",
        takenByName: "Prof. Kabongo",
        status: "COMPLETED",
        totalStudents: 25,
        presentStudents: 23,
        absentStudents: 1,
        lateStudents: 0,
        earlyExitStudents: 1,
        notes: "1 élève parti plus tôt (autorisé par l'administration)",
        createdAt: "2024-01-15T15:25:00Z",
        updatedAt: "2024-01-15T15:35:00Z"
      },
      {
        id: "session_5eme_entry_2024_01_15",
        classScheduleId: "cs_5eme_2024_01_15",
        className: "5ème B",
        date: "2024-01-15",
        sessionType: "ENTRY",
        expectedTime: "08:00",
        actualStartTime: "08:00",
        status: "IN_PROGRESS",
        takenById: "t006",
        takenByName: "Prof. Mbuyi",
        totalStudents: 28,
        presentStudents: 26,
        absentStudents: 0,
        lateStudents: 2,
        earlyExitStudents: 0,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:05:00Z"
      }
    ];
  }

  // === GESTION DES ENREGISTREMENTS INDIVIDUELS ===
  
  static getStudentAttendanceRecords(): StudentAttendanceRecord[] {
    return [
      // Entrée 6ème A
      {
        id: "record_1",
        sessionId: "session_6eme_entry_2024_01_15",
        studentId: "s001",
        studentName: "Jean Mukendi",
        className: "6ème A",
        date: "2024-01-15",
        sessionType: "ENTRY",
        status: "PRESENT",
        arrivalTime: "07:58",
        recordedAt: "2024-01-15T07:58:00Z",
        recordedById: "t001",
        recordedByName: "Prof. Mukendi"
      },
      {
        id: "record_2",
        sessionId: "session_6eme_entry_2024_01_15",
        studentId: "s002",
        studentName: "Marie Kalala",
        className: "6ème A",
        date: "2024-01-15",
        sessionType: "ENTRY",
        status: "LATE",
        arrivalTime: "08:15",
        recordedAt: "2024-01-15T08:15:00Z",
        recordedById: "t001",
        recordedByName: "Prof. Mukendi",
        notes: "Rendez-vous médical justifié",
        excuseReason: "Rendez-vous médical"
      },
      {
        id: "record_3",
        sessionId: "session_6eme_entry_2024_01_15",
        studentId: "s003",
        studentName: "Paul Nsimba",
        className: "6ème A",
        date: "2024-01-15",
        sessionType: "ENTRY",
        status: "ABSENT",
        recordedAt: "2024-01-15T08:10:00Z",
        recordedById: "t001",
        recordedByName: "Prof. Mukendi",
        parentNotified: true
      },
      // Sortie 6ème A
      {
        id: "record_4",
        sessionId: "session_6eme_exit_2024_01_15",
        studentId: "s001",
        studentName: "Jean Mukendi",
        className: "6ème A",
        date: "2024-01-15",
        sessionType: "EXIT",
        status: "PRESENT",
        exitTime: "15:30",
        recordedAt: "2024-01-15T15:30:00Z",
        recordedById: "t005",
        recordedByName: "Prof. Kabongo"
      },
      {
        id: "record_5",
        sessionId: "session_6eme_exit_2024_01_15",
        studentId: "s002",
        studentName: "Marie Kalala",
        className: "6ème A",
        date: "2024-01-15",
        sessionType: "EXIT",
        status: "EARLY_EXIT",
        exitTime: "15:00",
        recordedAt: "2024-01-15T15:00:00Z",
        recordedById: "admin001",
        recordedByName: "Administration",
        notes: "Sortie anticipée autorisée",
        excuseReason: "Autorisation parentale"
      }
    ];
  }

  // === MÉTHODES DE CRÉATION ===
  
  // Créer une nouvelle session de présence
  static createAttendanceSession(
    classScheduleId: string,
    sessionType: 'ENTRY' | 'EXIT',
    takenById: string,
    takenByName: string
  ): ClassAttendanceSession {
    const schedule = this.getClassSchedules().find(s => s.id === classScheduleId);
    if (!schedule) {
      throw new Error("Emploi du temps non trouvé");
    }

    const expectedTime = sessionType === 'ENTRY' 
      ? schedule.firstCourseStartTime 
      : schedule.lastCourseEndTime;

    const studentsInClass = this.getStudentsInClass(schedule.className);
    
    return {
      id: `session_${schedule.className.replace(' ', '_').toLowerCase()}_${sessionType.toLowerCase()}_${schedule.date}`,
      classScheduleId,
      className: schedule.className,
      date: schedule.date,
      sessionType,
      expectedTime,
      takenById,
      takenByName,
      status: 'IN_PROGRESS',
      totalStudents: studentsInClass.length,
      presentStudents: 0,
      absentStudents: 0,
      lateStudents: 0,
      earlyExitStudents: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Enregistrer la présence d'un élève
  static recordStudentAttendance(
    sessionId: string,
    studentId: string,
    studentName: string,
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_EXIT' | 'EXCUSED',
    recordedById: string,
    recordedByName: string,
    options?: {
      arrivalTime?: string;
      exitTime?: string;
      notes?: string;
      excuseReason?: string;
    }
  ): StudentAttendanceRecord {
    const session = this.getAttendanceSessions().find(s => s.id === sessionId);
    if (!session) {
      throw new Error("Session de présence non trouvée");
    }

    return {
      id: `record_${sessionId}_${studentId}_${Date.now()}`,
      sessionId,
      studentId,
      studentName,
      className: session.className,
      date: session.date,
      sessionType: session.sessionType,
      status,
      arrivalTime: options?.arrivalTime,
      exitTime: options?.exitTime,
      recordedAt: new Date().toISOString(),
      recordedById,
      recordedByName,
      notes: options?.notes,
      excuseReason: options?.excuseReason,
      parentNotified: status === 'ABSENT' ? true : undefined
    };
  }

  // === MÉTHODES DE REQUÊTE ===
  
  // Obtenir les sessions du jour pour une classe
  static getTodaySessionsForClass(className: string, date: string): ClassAttendanceSession[] {
    return this.getAttendanceSessions().filter(
      session => session.className === className && session.date === date
    );
  }

  // Obtenir les enregistrements d'un élève pour une date
  static getStudentAttendanceForDate(studentId: string, date: string): StudentAttendanceRecord[] {
    return this.getStudentAttendanceRecords().filter(
      record => record.studentId === studentId && record.date === date
    );
  }

  // Obtenir tous les élèves d'une classe (simulation)
  static getStudentsInClass(className: string) {
    // Cette méthode devrait être liée au service des élèves
    const mockStudents = [
      { id: "s001", name: "Jean Mukendi", className: "6ème A" },
      { id: "s002", name: "Marie Kalala", className: "6ème A" },
      { id: "s003", name: "Paul Nsimba", className: "6ème A" },
      { id: "s004", name: "Grace Tshimanga", className: "6ème A" },
      { id: "s005", name: "David Kabongo", className: "6ème A" },
      { id: "s006", name: "Sophie Mbuyi", className: "5ème B" },
      { id: "s007", name: "Pierre Kapend", className: "5ème B" },
      { id: "s008", name: "Christine Lumbala", className: "5ème B" }
    ];
    
    return mockStudents.filter(student => student.className === className);
  }

  // === STATISTIQUES ===
  
  static generateAttendanceStats(className: string, date: string): AttendanceStats {
    const sessions = this.getTodaySessionsForClass(className, date);
    const records = this.getStudentAttendanceRecords().filter(
      record => record.className === className && record.date === date
    );

    const entrySession = sessions.find(s => s.sessionType === 'ENTRY');
    const exitSession = sessions.find(s => s.sessionType === 'EXIT');
    
    const entryRecords = records.filter(r => r.sessionType === 'ENTRY');
    const exitRecords = records.filter(r => r.sessionType === 'EXIT');

    const totalStudents = this.getStudentsInClass(className).length;

    // Calculer les stats du jour
    const studentIds = [...new Set(records.map(r => r.studentId))];
    let fullyPresentCount = 0;
    let partiallyPresentCount = 0;
    let totalAbsentCount = 0;

    studentIds.forEach(studentId => {
      const entryRecord = entryRecords.find(r => r.studentId === studentId);
      const exitRecord = exitRecords.find(r => r.studentId === studentId);
      
      const entryPresent = entryRecord && ['PRESENT', 'LATE'].includes(entryRecord.status);
      const exitPresent = exitRecord && ['PRESENT', 'EARLY_EXIT'].includes(exitRecord.status);
      
      if (entryPresent && exitPresent) {
        fullyPresentCount++;
      } else if (entryPresent || exitPresent) {
        partiallyPresentCount++;
      } else {
        totalAbsentCount++;
      }
    });

    return {
      className,
      date,
      totalStudents,
      entrySession: entrySession ? {
        presentCount: entryRecords.filter(r => r.status === 'PRESENT').length,
        absentCount: entryRecords.filter(r => r.status === 'ABSENT').length,
        lateCount: entryRecords.filter(r => r.status === 'LATE').length,
        attendanceRate: (entryRecords.filter(r => ['PRESENT', 'LATE'].includes(r.status)).length / totalStudents) * 100
      } : undefined,
      exitSession: exitSession ? {
        presentCount: exitRecords.filter(r => r.status === 'PRESENT').length,
        absentCount: exitRecords.filter(r => r.status === 'ABSENT').length,
        earlyExitCount: exitRecords.filter(r => r.status === 'EARLY_EXIT').length,
        attendanceRate: (exitRecords.filter(r => ['PRESENT', 'EARLY_EXIT'].includes(r.status)).length / totalStudents) * 100
      } : undefined,
      dayStats: {
        fullyPresentCount,
        partiallyPresentCount,
        totalAbsentCount,
        attendanceRate: ((fullyPresentCount + partiallyPresentCount) / totalStudents) * 100
      }
    };
  }

  // Obtenir le statut d'une session
  static getSessionStatus(sessionId: string): 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' {
    const session = this.getAttendanceSessions().find(s => s.id === sessionId);
    return session?.status || 'PENDING';
  }

  // Vérifier si toutes les présences ont été prises
  static isSessionComplete(sessionId: string): boolean {
    const session = this.getAttendanceSessions().find(s => s.id === sessionId);
    if (!session) return false;

    const records = this.getStudentAttendanceRecords().filter(r => r.sessionId === sessionId);
    const studentsInClass = this.getStudentsInClass(session.className);
    
    return records.length === studentsInClass.length;
  }

  // Formater l'heure
  static formatTime(time: string): string {
    return new Date(`2000-01-01T${time}:00`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtenir les classes avec des sessions en cours
  static getActiveAttendanceSessions(): ClassAttendanceSession[] {
    return this.getAttendanceSessions().filter(session => 
      session.status === 'IN_PROGRESS'
    );
  }
}

import { DailyAttendanceService, ClassStudent, DailyAttendanceRecord } from '@/services/dailyAttendanceService';

// Actions pour la gestion de la présence quotidienne

export async function getClassesForAttendance() {
  // Mock data - À remplacer par des données réelles depuis l'API
  return [
    { id: "6eme-a", name: "6ème A", teacher: "Prof. Mukendi", studentCount: 28 },
    { id: "6eme-b", name: "6ème B", teacher: "Prof. Kasongo", studentCount: 30 },
    { id: "5eme-a", name: "5ème A", teacher: "Prof. Mbayo", studentCount: 26 },
    { id: "5eme-b", name: "5ème B", teacher: "Prof. Tshiombe", studentCount: 29 },
    { id: "4eme-a", name: "4ème A", teacher: "Prof. Kalume", studentCount: 24 },
    { id: "4eme-b", name: "4ème B", teacher: "Prof. Ngoy", studentCount: 27 }
  ];
}

export async function getStudentsInClass(className: string) {
  // Mock data - À remplacer par une requête API réelle
  const students: ClassStudent[] = [
    {
      id: "std001",
      name: "Jean Mukendi",
      rollNumber: "2024001",
      photoUrl: "/images/default-avatar.png"
    },
    {
      id: "std002", 
      name: "Marie Kasongo",
      rollNumber: "2024002",
      photoUrl: "/images/default-avatar.png"
    },
    {
      id: "std003",
      name: "David Mbayo",
      rollNumber: "2024003", 
      photoUrl: "/images/default-avatar.png"
    },
    {
      id: "std004",
      name: "Grace Tshiombe",
      rollNumber: "2024004",
      photoUrl: "/images/default-avatar.png"
    },
    {
      id: "std005",
      name: "Paul Kalume",
      rollNumber: "2024005",
      photoUrl: "/images/default-avatar.png"
    }
  ];

  return students;
}

export async function startAttendanceSession(
  className: string,
  teacherId: string,
  teacherName: string
) {
  try {
    const session = DailyAttendanceService.startDailyAttendance(
      className,
      teacherId,
      teacherName
    );
    
    return {
      success: true,
      data: session,
      message: "Session de présence démarrée avec succès"
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Erreur lors du démarrage de la session"
    };
  }
}

export async function recordStudentAttendance(
  sessionId: string,
  studentId: string,
  studentName: string,
  className: string,
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED',
  teacherId: string,
  teacherName: string,
  notes?: string,
  arrivalTime?: string,
  date?: string
) {
  try {
    const record = DailyAttendanceService.recordStudentAttendance(
      sessionId,
      studentId,
      studentName,
      className,
      status,
      teacherId,
      teacherName,
      notes,
      arrivalTime,
      date
    );
    
    return {
      success: true,
      data: record,
      message: `Présence de ${studentName} enregistrée: ${status}`
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Erreur lors de l'enregistrement de la présence"
    };
  }
}

export async function completeAttendanceSession(
  sessionId: string,
  markUnmarkedAsAbsent: boolean = true,
  notes?: string
) {
  try {
    const completedSession = DailyAttendanceService.completeAttendance(
      sessionId,
      markUnmarkedAsAbsent,
      notes
    );
    
    return {
      success: true,
      data: completedSession,
      message: "Session de présence finalisée avec succès"
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Erreur lors de la finalisation de la session"
    };
  }
}

export async function getAttendanceSession(className: string, date?: string) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const session = DailyAttendanceService.getClassAttendance(className, targetDate);
    
    return {
      success: true,
      data: session,
      message: session ? "Session trouvée" : "Aucune session trouvée"
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Erreur lors de la récupération de la session"
    };
  }
}

export async function getStudentAttendanceRecords(
  className: string,
  date?: string
) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const records = DailyAttendanceService.getStudentAttendanceRecords(className, targetDate);
    
    return {
      success: true,
      data: records,
      message: `${records.length} enregistrement(s) trouvé(s)`
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Erreur lors de la récupération des enregistrements"
    };
  }
}

export async function getMonthlyAttendanceStats(
  className: string,
  year: number,
  month: number
) {
  try {
    const monthString = `${year}-${month.toString().padStart(2, '0')}`;
    const stats = DailyAttendanceService.getMonthlyAttendanceStats(className, monthString);
    
    return {
      success: true,
      data: stats,
      message: "Statistiques mensuelles récupérées"
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Erreur lors de la récupération des statistiques"
    };
  }
}

export async function exportAttendanceData(
  className: string,
  startDate: string,
  endDate: string
) {
  try {
    const exportData = DailyAttendanceService.exportAttendanceData(
      className,
      startDate,
      endDate
    );
    
    return {
      success: true,
      data: exportData,
      message: `Export généré pour ${exportData.length} enregistrement(s)`
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Erreur lors de l'export des données"
    };
  }
}

// Fonction utilitaire pour obtenir le statut de la présence aujourd'hui
export async function getTodayAttendanceOverview() {
  try {
    const classes = await getClassesForAttendance();
    const today = new Date().toISOString().split('T')[0];
    
    const overview = classes.map(cls => {
      const session = DailyAttendanceService.getClassAttendance(cls.name, today);
      const records = session ? 
        DailyAttendanceService.getStudentAttendanceRecords(cls.name, today) : [];
      
      return {
        ...cls,
        hasAttendanceToday: !!session,
        isCompleted: session?.isCompleted || false,
        attendanceStats: session ? {
          present: session.presentStudents,
          absent: session.absentStudents,
          late: session.lateStudents,
          excused: session.excusedStudents,
          percentage: session.attendancePercentage
        } : undefined
      };
    });
    
    return {
      success: true,
      data: overview,
      message: `Vue d'ensemble pour ${classes.length} classe(s)`
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Erreur lors de la récupération de la vue d'ensemble"
    };
  }
}

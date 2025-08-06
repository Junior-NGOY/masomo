import { MockDataService } from './mockServices';

export interface ReportStats {
  overallAverage: number;
  successRate: number;
  attendanceRate: number;
  totalSubjects: number;
  totalClasses: number;
  totalStudents: number;
  improvementRate: number;
}

export interface ClassPerformance {
  id: string;
  name: string;
  level: string;
  totalStudents: number;
  average: number;
  successRate: number;
  attendanceRate: number;
  trend: number;
  teacherId: string;
  teacherName: string;
}

export interface SubjectAnalysis {
  id: string;
  name: string;
  code: string;
  totalClasses: number;
  totalStudents: number;
  average: number;
  successRate: number;
  highestScore: number;
  lowestScore: number;
  standardDeviation: number;
  distribution: {
    excellent: number; // 16-20
    good: number;      // 12-16
    average: number;   // 10-12
    poor: number;      // 0-10
  };
  trend: number;
}

export interface AttendanceReport {
  overallRate: number;
  excusedRate: number;
  lateCount: number;
  byClass: ClassAttendance[];
  dailyTrend: DailyAttendance[];
}

export interface ClassAttendance {
  classId: string;
  className: string;
  totalStudents: number;
  presentToday: number;
  attendanceRate: number;
  absencesThisMonth: number;
  lateCount: number;
  trend: number;
}

export interface DailyAttendance {
  date: string;
  attendanceRate: number;
  totalPresent: number;
  totalStudents: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  className: string;
  average: number;
  improvement: number;
}

export interface AcademicReport {
  id: string;
  title: string;
  type: 'overview' | 'detailed' | 'comparative' | 'individual';
  period: string;
  createdDate: string;
  status: 'draft' | 'completed' | 'archived';
  description: string;
  filePath?: string;
}

export class ReportMockService {
  private static reports: AcademicReport[] = [
    {
      id: 'rep-001',
      title: 'Rapport Trimestriel - T1 2024',
      type: 'overview',
      period: 'T1 2024',
      createdDate: '2024-03-15',
      status: 'completed',
      description: 'Rapport complet du premier trimestre avec analyses détaillées'
    },
    {
      id: 'rep-002',
      title: 'Analyse Comparative Classes',
      type: 'comparative',
      period: 'Année 2024',
      createdDate: '2024-03-20',
      status: 'completed',
      description: 'Comparaison des performances entre les différentes classes'
    },
    {
      id: 'rep-003',
      title: 'Bulletins Individuels',
      type: 'individual',
      period: 'T1 2024',
      createdDate: '2024-03-25',
      status: 'draft',
      description: 'Génération des bulletins pour tous les élèves'
    }
  ];

  // Statistiques générales des rapports
  static getReportStats(): ReportStats {
    const classes = MockDataService.classes.getAll();
    const subjects = MockDataService.subjects.getAll();
    
    return {
      overallAverage: 14.2,
      successRate: 78,
      attendanceRate: 89,
      totalSubjects: subjects.length,
      totalClasses: classes.length,
      totalStudents: classes.reduce((sum, c) => sum + c.currentStudents, 0),
      improvementRate: 12.5
    };
  }

  // Performance par classes
  static getClassPerformance(): ClassPerformance[] {
    const classes = MockDataService.classes.getAll();
    const teachers = MockDataService.teachers.getAll();
    
    return classes.map((classe, index) => {
      const teacher = teachers[index % teachers.length];
      const baseAverage = 10 + Math.random() * 8; // 10-18
      
      return {
        id: classe.id,
        name: classe.name,
        level: classe.level,
        totalStudents: classe.currentStudents,
        average: Math.round(baseAverage * 10) / 10,
        successRate: Math.round((60 + Math.random() * 35)), // 60-95%
        attendanceRate: Math.round((80 + Math.random() * 15)), // 80-95%
        trend: Math.round((Math.random() - 0.5) * 10 * 10) / 10, // -5 à +5
        teacherId: teacher.id,
        teacherName: teacher.name
      };
    });
  }

  // Analyse par matières
  static getSubjectAnalysis(): SubjectAnalysis[] {
    const subjects = MockDataService.subjects.getAll();
    const classes = MockDataService.classes.getAll();
    
    return subjects.map(subject => {
      const baseAverage = 10 + Math.random() * 8;
      const successRate = 60 + Math.random() * 35;
      const totalStudents = Math.floor(Math.random() * 200) + 100;
      
      // Distribution des notes
      const excellent = Math.round(Math.random() * 25);
      const good = Math.round(Math.random() * 35);
      const average = Math.round(Math.random() * 25);
      const poor = 100 - excellent - good - average;
      
      return {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        totalClasses: Math.floor(Math.random() * 8) + 3, // 3-10 classes
        totalStudents,
        average: Math.round(baseAverage * 10) / 10,
        successRate: Math.round(successRate),
        highestScore: Math.round((16 + Math.random() * 4) * 10) / 10, // 16-20
        lowestScore: Math.round((2 + Math.random() * 6) * 10) / 10, // 2-8
        standardDeviation: Math.round((2 + Math.random() * 3) * 10) / 10, // 2-5
        distribution: {
          excellent: Math.max(0, excellent),
          good: Math.max(0, good),
          average: Math.max(0, average),
          poor: Math.max(0, poor)
        },
        trend: Math.round((Math.random() - 0.5) * 6 * 10) / 10 // -3 à +3
      };
    });
  }

  // Rapport de présence
  static getAttendanceReport(): AttendanceReport {
    const classes = MockDataService.classes.getAll();
    
    const classAttendance: ClassAttendance[] = classes.map(classe => {
      const attendanceRate = 80 + Math.random() * 15; // 80-95%
      const presentToday = Math.floor((attendanceRate / 100) * classe.currentStudents);
      
      return {
        classId: classe.id,
        className: classe.name,
        totalStudents: classe.currentStudents,
        presentToday,
        attendanceRate: Math.round(attendanceRate),
        absencesThisMonth: Math.floor(Math.random() * 20) + 5,
        lateCount: Math.floor(Math.random() * 15) + 2,
        trend: Math.round((Math.random() - 0.5) * 10 * 10) / 10
      };
    });

    // Tendance quotidienne (derniers 7 jours)
    const dailyTrend: DailyAttendance[] = [];
    const totalStudents = classes.reduce((sum, c) => sum + c.currentStudents, 0);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const attendanceRate = 85 + Math.random() * 10; // 85-95%
      
      dailyTrend.push({
        date: date.toISOString().split('T')[0],
        attendanceRate: Math.round(attendanceRate),
        totalPresent: Math.floor((attendanceRate / 100) * totalStudents),
        totalStudents
      });
    }

    return {
      overallRate: Math.round(classAttendance.reduce((sum, c) => sum + c.attendanceRate, 0) / classAttendance.length),
      excusedRate: 75, // 75% des absences sont justifiées
      lateCount: classAttendance.reduce((sum, c) => sum + c.lateCount, 0),
      byClass: classAttendance,
      dailyTrend
    };
  }

  // Top performers
  static getTopPerformers(): TopPerformer[] {
    const studentNames = [
      'Aminata Diallo', 'Mamadou Kane', 'Fatou Sow', 'Ibrahim Sy',
      'Aissatou Ba', 'Ousmane Fall', 'Mariama Ndiaye', 'Abdou Diouf'
    ];
    
    const classes = MockDataService.classes.getAll();
    
    return studentNames.slice(0, 5).map((name, index) => ({
      id: `student-top-${index + 1}`,
      name,
      className: classes[Math.floor(Math.random() * classes.length)].name,
      average: Math.round((16 + Math.random() * 4) * 10) / 10, // 16-20
      improvement: Math.round((1 + Math.random() * 3) * 10) / 10 // 1-4 points
    }));
  }

  // Most improved students
  static getMostImproved(): TopPerformer[] {
    const studentNames = [
      'Moussa Diop', 'Khady Mbaye', 'Cheikh Gueye', 'Awa Thiam',
      'Modou Faye', 'Bineta Lo', 'Serigne Mbacké'
    ];
    
    const classes = MockDataService.classes.getAll();
    
    return studentNames.slice(0, 5).map((name, index) => ({
      id: `student-improved-${index + 1}`,
      name,
      className: classes[Math.floor(Math.random() * classes.length)].name,
      average: Math.round((12 + Math.random() * 6) * 10) / 10, // 12-18
      improvement: Math.round((2 + Math.random() * 4) * 10) / 10 // 2-6 points
    }));
  }

  // Gestion des rapports
  static getAllReports(): AcademicReport[] {
    return [...this.reports].sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  static getReportById(id: string): AcademicReport | undefined {
    return this.reports.find(report => report.id === id);
  }

  static createReport(reportData: Omit<AcademicReport, 'id' | 'createdDate'>): AcademicReport {
    const newReport: AcademicReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    this.reports.unshift(newReport);
    return newReport;
  }

  static updateReport(id: string, updates: Partial<AcademicReport>): AcademicReport | null {
    const index = this.reports.findIndex(report => report.id === id);
    if (index === -1) return null;
    
    this.reports[index] = { ...this.reports[index], ...updates };
    return this.reports[index];
  }

  static deleteReport(id: string): boolean {
    const index = this.reports.findIndex(report => report.id === id);
    if (index === -1) return false;
    
    this.reports.splice(index, 1);
    return true;
  }

  // Analytiques avancées
  static getSubjectComparison(): Array<{
    subjectId: string;
    subjectName: string;
    classComparison: Array<{
      classId: string;
      className: string;
      average: number;
      rank: number;
    }>;
  }> {
    const subjects = MockDataService.subjects.getAll();
    const classes = MockDataService.classes.getAll();
    
    return subjects.map(subject => {
      const classComparison = classes.map(classe => ({
        classId: classe.id,
        className: classe.name,
        average: Math.round((10 + Math.random() * 8) * 10) / 10
      })).sort((a, b) => b.average - a.average)
        .map((item, index) => ({ ...item, rank: index + 1 }));
      
      return {
        subjectId: subject.id,
        subjectName: subject.name,
        classComparison
      };
    });
  }

  static getTeacherPerformance(): Array<{
    teacherId: string;
    teacherName: string;
    subjects: string[];
    classes: string[];
    averageScore: number;
    studentSatisfaction: number;
    attendanceImpact: number;
  }> {
    const teachers = MockDataService.teachers.getAll();
    const subjects = MockDataService.subjects.getAll();
    const classes = MockDataService.classes.getAll();
    
    return teachers.map(teacher => ({
      teacherId: teacher.id,
      teacherName: teacher.name,
      subjects: subjects.slice(0, Math.floor(Math.random() * 3) + 1).map(s => s.name),
      classes: classes.slice(0, Math.floor(Math.random() * 4) + 1).map(c => c.name),
      averageScore: Math.round((12 + Math.random() * 6) * 10) / 10,
      studentSatisfaction: Math.round((70 + Math.random() * 25)), // 70-95%
      attendanceImpact: Math.round((Math.random() - 0.5) * 10 * 10) / 10 // -5 à +5
    }));
  }

  // Prédictions et tendances
  static getPredictiveAnalysis(): {
    successRatePrediction: number;
    riskStudents: Array<{
      studentId: string;
      studentName: string;
      className: string;
      riskLevel: 'high' | 'medium' | 'low';
      currentAverage: number;
      predictedAverage: number;
      recommendations: string[];
    }>;
    classRankingPrediction: Array<{
      classId: string;
      className: string;
      currentRank: number;
      predictedRank: number;
      factors: string[];
    }>;
  } {
    const classes = MockDataService.classes.getAll();
    const studentNames = [
      'Fatima Cissé', 'Alpha Bah', 'Mariam Touré', 'Saliou Diouf',
      'Aminata Fall', 'Mamadou Sarr', 'Aïda Niang', 'Boubacar Sow'
    ];
    
    const riskStudents = studentNames.slice(0, 6).map((name, index) => {
      const currentAvg = 8 + Math.random() * 6; // 8-14
      const riskLevel = currentAvg < 10 ? 'high' : currentAvg < 12 ? 'medium' : 'low';
      
      return {
        studentId: `student-risk-${index + 1}`,
        studentName: name,
        className: classes[Math.floor(Math.random() * classes.length)].name,
        riskLevel: riskLevel as 'high' | 'medium' | 'low',
        currentAverage: Math.round(currentAvg * 10) / 10,
        predictedAverage: Math.round((currentAvg + (Math.random() - 0.3) * 2) * 10) / 10,
        recommendations: [
          'Soutien scolaire en mathématiques',
          'Suivi personnalisé',
          'Rencontre avec les parents'
        ].slice(0, riskLevel === 'high' ? 3 : 2)
      };
    });
    
    const classRankingPrediction = classes.map((classe, index) => ({
      classId: classe.id,
      className: classe.name,
      currentRank: index + 1,
      predictedRank: Math.max(1, Math.min(classes.length, index + 1 + Math.floor((Math.random() - 0.5) * 4))),
      factors: ['Performance en mathématiques', 'Assiduité', 'Participation']
    }));
    
    return {
      successRatePrediction: Math.round((75 + Math.random() * 15)), // 75-90%
      riskStudents,
      classRankingPrediction
    };
  }
}

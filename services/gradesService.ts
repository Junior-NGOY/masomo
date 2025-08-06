// Service de gestion des notes et évaluations des élèves
import { randomUUID } from 'crypto';

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  evaluationType: 'DEVOIR' | 'INTERROGATION' | 'EXAMEN' | 'TRAVAIL_PRATIQUE' | 'PARTICIPATION' | 'PROJET';
  title: string;
  description?: string;
  maxPoints: number;
  obtainedPoints: number;
  percentage: number;
  grade: string; // A+, A, B+, B, C+, C, D+, D, F
  date: string;
  term: 'TRIMESTRE_1' | 'TRIMESTRE_2' | 'TRIMESTRE_3' | 'SEMESTRE_1' | 'SEMESTRE_2';
  academicYear: string;
  className: string;
  comments?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectGradeSummary {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  totalEvaluations: number;
  averagePercentage: number;
  averageGrade: string;
  grades: Grade[];
  termAverages: {
    [term: string]: {
      average: number;
      grade: string;
      evaluationsCount: number;
    };
  };
}

export interface StudentGradeReport {
  studentId: string;
  studentName: string;
  className: string;
  academicYear: string;
  term: string;
  subjects: SubjectGradeSummary[];
  overallAverage: number;
  overallGrade: string;
  totalEvaluations: number;
  rank?: number;
  totalStudentsInClass?: number;
  generatedAt: string;
}

export interface EvaluationSchedule {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  className: string;
  evaluationType: Grade['evaluationType'];
  title: string;
  description?: string;
  scheduledDate: string;
  duration: number; // en minutes
  maxPoints: number;
  location?: string;
  instructions?: string;
  isPublished: boolean;
  createdAt: string;
}

class GradesServiceClass {
  private grades: Grade[] = [];
  private evaluationSchedules: EvaluationSchedule[] = [];

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    // Données d'exemple pour les notes
    this.grades = [
      {
        id: '1',
        studentId: 'student-1',
        studentName: 'Jean Mukendi',
        subjectId: 'math-001',
        subjectName: 'Mathématiques',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Kabamba',
        evaluationType: 'EXAMEN',
        title: 'Examen Trimestriel - Algèbre',
        description: 'Évaluation sur les équations du second degré',
        maxPoints: 100,
        obtainedPoints: 85,
        percentage: 85,
        grade: 'A',
        date: '2025-01-15',
        term: 'TRIMESTRE_1',
        academicYear: '2024-2025',
        className: '6ème Scientifique',
        comments: 'Excellent travail, continue ainsi!',
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        studentId: 'student-1',
        studentName: 'Jean Mukendi',
        subjectId: 'physics-001',
        subjectName: 'Physique',
        teacherId: 'teacher-2',
        teacherName: 'Prof. Mbuyi',
        evaluationType: 'TRAVAIL_PRATIQUE',
        title: 'TP - Mécanique',
        description: 'Étude du mouvement uniformément varié',
        maxPoints: 50,
        obtainedPoints: 42,
        percentage: 84,
        grade: 'A',
        date: '2025-01-12',
        term: 'TRIMESTRE_1',
        academicYear: '2024-2025',
        className: '6ème Scientifique',
        comments: 'Bonne maîtrise pratique',
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        studentId: 'student-1',
        studentName: 'Jean Mukendi',
        subjectId: 'french-001',
        subjectName: 'Français',
        teacherId: 'teacher-3',
        teacherName: 'Prof. Tshimanga',
        evaluationType: 'DEVOIR',
        title: 'Devoir de littérature',
        description: 'Analyse de texte - Victor Hugo',
        maxPoints: 20,
        obtainedPoints: 16,
        percentage: 80,
        grade: 'A-',
        date: '2025-01-10',
        term: 'TRIMESTRE_1',
        academicYear: '2024-2025',
        className: '6ème Scientifique',
        comments: 'Analyse pertinente, style à améliorer',
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        studentId: 'student-1',
        studentName: 'Jean Mukendi',
        subjectId: 'chemistry-001',
        subjectName: 'Chimie',
        teacherId: 'teacher-4',
        teacherName: 'Prof. Kasongo',
        evaluationType: 'INTERROGATION',
        title: 'Interrogation - Réactions chimiques',
        description: 'Questions sur l\'équilibrage des équations',
        maxPoints: 25,
        obtainedPoints: 20,
        percentage: 80,
        grade: 'A-',
        date: '2025-01-08',
        term: 'TRIMESTRE_1',
        academicYear: '2024-2025',
        className: '6ème Scientifique',
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Données d'exemple pour les évaluations programmées
    this.evaluationSchedules = [
      {
        id: '1',
        subjectId: 'math-001',
        subjectName: 'Mathématiques',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Kabamba',
        className: '6ème Scientifique',
        evaluationType: 'EXAMEN',
        title: 'Examen Final - Géométrie',
        description: 'Évaluation sur les théorèmes de géométrie plane',
        scheduledDate: '2025-02-15',
        duration: 120,
        maxPoints: 100,
        location: 'Salle A-101',
        instructions: 'Calculatrice scientifique autorisée. Apporter compas et règle.',
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        subjectId: 'physics-001',
        subjectName: 'Physique',
        teacherId: 'teacher-2',
        teacherName: 'Prof. Mbuyi',
        className: '6ème Scientifique',
        evaluationType: 'TRAVAIL_PRATIQUE',
        title: 'TP - Optique',
        description: 'Manipulation avec lentilles et miroirs',
        scheduledDate: '2025-02-10',
        duration: 90,
        maxPoints: 50,
        location: 'Laboratoire de Physique',
        instructions: 'Porter une blouse. Matériel fourni.',
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        subjectId: 'french-001',
        subjectName: 'Français',
        teacherId: 'teacher-3',
        teacherName: 'Prof. Tshimanga',
        className: '6ème Scientifique',
        evaluationType: 'DEVOIR',
        title: 'Devoir de grammaire',
        description: 'Exercices sur les temps verbaux',
        scheduledDate: '2025-02-05',
        duration: 60,
        maxPoints: 20,
        location: 'Salle B-203',
        isPublished: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  // Récupérer toutes les notes d'un élève
  getStudentGrades(studentId: string, term?: string, academicYear?: string): Grade[] {
    let grades = this.grades.filter(grade => 
      grade.studentId === studentId && grade.isPublished
    );

    if (term) {
      grades = grades.filter(grade => grade.term === term);
    }

    if (academicYear) {
      grades = grades.filter(grade => grade.academicYear === academicYear);
    }

    return grades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Récupérer les notes par matière
  getStudentGradesBySubject(studentId: string, term?: string): SubjectGradeSummary[] {
    const grades = this.getStudentGrades(studentId, term);
    const subjectMap = new Map<string, Grade[]>();

    // Grouper les notes par matière
    grades.forEach(grade => {
      if (!subjectMap.has(grade.subjectId)) {
        subjectMap.set(grade.subjectId, []);
      }
      subjectMap.get(grade.subjectId)!.push(grade);
    });

    // Créer le résumé par matière
    const summaries: SubjectGradeSummary[] = [];
    
    subjectMap.forEach((subjectGrades, subjectId) => {
      const firstGrade = subjectGrades[0];
      const totalPoints = subjectGrades.reduce((sum, g) => sum + g.obtainedPoints, 0);
      const maxPoints = subjectGrades.reduce((sum, g) => sum + g.maxPoints, 0);
      const averagePercentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

      // Calculer les moyennes par trimestre
      const termAverages: SubjectGradeSummary['termAverages'] = {};
      const termGroups = subjectGrades.reduce((acc, grade) => {
        if (!acc[grade.term]) {
          acc[grade.term] = [];
        }
        acc[grade.term].push(grade);
        return acc;
      }, {} as Record<string, Grade[]>);

      Object.entries(termGroups).forEach(([term, termGrades]) => {
        const termTotal = termGrades.reduce((sum, g) => sum + g.obtainedPoints, 0);
        const termMax = termGrades.reduce((sum, g) => sum + g.maxPoints, 0);
        const termAverage = termMax > 0 ? (termTotal / termMax) * 100 : 0;

        termAverages[term] = {
          average: termAverage,
          grade: this.calculateGradeFromPercentage(termAverage),
          evaluationsCount: termGrades.length
        };
      });

      summaries.push({
        subjectId,
        subjectName: firstGrade.subjectName,
        teacherName: firstGrade.teacherName,
        totalEvaluations: subjectGrades.length,
        averagePercentage,
        averageGrade: this.calculateGradeFromPercentage(averagePercentage),
        grades: subjectGrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        termAverages
      });
    });

    return summaries.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
  }

  // Générer un rapport complet de notes
  generateStudentGradeReport(studentId: string, term: string, academicYear: string): StudentGradeReport {
    const subjects = this.getStudentGradesBySubject(studentId, term);
    const allGrades = this.getStudentGrades(studentId, term, academicYear);
    
    // Calculer la moyenne générale
    const totalPoints = allGrades.reduce((sum, g) => sum + g.obtainedPoints, 0);
    const maxPoints = allGrades.reduce((sum, g) => sum + g.maxPoints, 0);
    const overallAverage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

    const firstGrade = allGrades[0];

    return {
      studentId,
      studentName: firstGrade?.studentName || 'Élève inconnu',
      className: firstGrade?.className || '',
      academicYear,
      term,
      subjects,
      overallAverage,
      overallGrade: this.calculateGradeFromPercentage(overallAverage),
      totalEvaluations: allGrades.length,
      generatedAt: new Date().toISOString()
    };
  }

  // Récupérer les évaluations programmées pour un élève
  getStudentEvaluationSchedule(className: string, startDate?: string, endDate?: string): EvaluationSchedule[] {
    let schedules = this.evaluationSchedules.filter(schedule => 
      schedule.className === className && schedule.isPublished
    );

    if (startDate) {
      schedules = schedules.filter(schedule => schedule.scheduledDate >= startDate);
    }

    if (endDate) {
      schedules = schedules.filter(schedule => schedule.scheduledDate <= endDate);
    }

    return schedules.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  // Ajouter une nouvelle note
  addGrade(gradeData: Omit<Grade, 'id' | 'percentage' | 'grade' | 'createdAt' | 'updatedAt'>): Grade {
    const percentage = gradeData.maxPoints > 0 ? (gradeData.obtainedPoints / gradeData.maxPoints) * 100 : 0;
    const grade: Grade = {
      ...gradeData,
      id: randomUUID(),
      percentage,
      grade: this.calculateGradeFromPercentage(percentage),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.grades.push(grade);
    return grade;
  }

  // Calculer la note littérale à partir du pourcentage
  private calculateGradeFromPercentage(percentage: number): string {
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 85) return 'A-';
    if (percentage >= 80) return 'B+';
    if (percentage >= 75) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 55) return 'C-';
    if (percentage >= 50) return 'D+';
    if (percentage >= 45) return 'D';
    if (percentage >= 40) return 'D-';
    return 'F';
  }

  // Obtenir les statistiques de classe pour une évaluation
  getEvaluationStats(evaluationId: string) {
    // Cette méthode pourrait être implémentée pour fournir des statistiques de classe
    return {
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      totalStudents: 0
    };
  }

  // Exporter les données pour Excel
  exportGradesData(studentId: string, term: string, academicYear: string) {
    const report = this.generateStudentGradeReport(studentId, term, academicYear);
    
    const exportData = report.subjects.flatMap(subject => 
      subject.grades.map(grade => ({
        'Matière': grade.subjectName,
        'Professeur': grade.teacherName,
        'Type d\'évaluation': this.getEvaluationTypeLabel(grade.evaluationType),
        'Titre': grade.title,
        'Date': new Date(grade.date).toLocaleDateString('fr-FR'),
        'Points obtenus': grade.obtainedPoints,
        'Points maximum': grade.maxPoints,
        'Pourcentage': `${grade.percentage.toFixed(1)}%`,
        'Note': grade.grade,
        'Commentaires': grade.comments || ''
      }))
    );

    return exportData;
  }

  private getEvaluationTypeLabel(type: Grade['evaluationType']): string {
    const labels = {
      'DEVOIR': 'Devoir',
      'INTERROGATION': 'Interrogation',
      'EXAMEN': 'Examen',
      'TRAVAIL_PRATIQUE': 'Travail Pratique',
      'PARTICIPATION': 'Participation',
      'PROJET': 'Projet'
    };
    return labels[type] || type;
  }
}

export const GradesService = new GradesServiceClass();

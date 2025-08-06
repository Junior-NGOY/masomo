// Service mock pour la gestion des devoirs et projets
import { MockDataService } from './mockServices';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subject: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  maxPoints: number;
  instructions: string;
  attachments?: string[];
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'OVERDUE';
  submissionCount: number;
  totalStudents: number;
  averageScore?: number;
  type: 'HOMEWORK' | 'PROJECT' | 'QUIZ' | 'EXAM';
  estimatedDuration: number; // en minutes
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  attachments: string[];
  score?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE' | 'MISSING';
  gradedBy?: string;
  gradedAt?: string;
}

export interface AssignmentStats {
  totalActive: number;
  totalDraft: number;
  totalCompleted: number;
  overdue: number;
  pendingReview: number;
  submissionRate: number;
  averageScore: number;
}

export interface SubjectAnalytics {
  name: string;
  totalAssignments: number;
  averageScore: number;
  submissionRate: number;
  difficulty: string;
}

export interface ClassAnalytics {
  name: string;
  totalStudents: number;
  averageScore: number;
  submissionRate: number;
  completionRate: number;
}

export class AssignmentMockService {
  private static assignments: Assignment[] = [
    {
      id: 'assign-001',
      title: 'Exercices de Mathématiques - Chapitre 5',
      description: 'Résolution d\'équations du premier degré et problèmes d\'application',
      subjectId: 'sub-001',
      subject: 'Mathématiques',
      classId: 'class-001',
      className: 'CP1 A',
      teacherId: 'teacher-001',
      teacherName: 'Mme Diallo',
      assignedDate: '2024-11-15T00:00:00Z',
      dueDate: '2024-11-25T23:59:59Z',
      maxPoints: 20,
      instructions: 'Résolvez tous les exercices des pages 45 à 48. Montrez toutes les étapes de calcul.',
      attachments: ['math_chapitre5.pdf', 'formules_reference.pdf'],
      status: 'ACTIVE',
      submissionCount: 18,
      totalStudents: 25,
      averageScore: 14.5,
      type: 'HOMEWORK',
      estimatedDuration: 60,
      difficulty: 'MEDIUM',
      tags: ['équations', 'algèbre', 'problèmes'],
      createdBy: 'teacher-001',
      createdAt: '2024-11-15T08:00:00Z',
      lastModified: '2024-11-15T08:00:00Z'
    },
    {
      id: 'assign-002',
      title: 'Rédaction - Mon Animal Préféré',
      description: 'Rédiger un texte descriptif sur votre animal préféré',
      subjectId: 'sub-002',
      subject: 'Français',
      classId: 'class-001',
      className: 'CP1 A',
      teacherId: 'teacher-002',
      teacherName: 'M. Kouassi',
      assignedDate: '2024-11-10T00:00:00Z',
      dueDate: '2024-11-20T23:59:59Z',
      maxPoints: 15,
      instructions: 'Rédigez un texte de 150 mots minimum décrivant votre animal préféré. Utilisez des adjectifs variés.',
      status: 'ACTIVE',
      submissionCount: 20,
      totalStudents: 25,
      averageScore: 12.8,
      type: 'HOMEWORK',
      estimatedDuration: 45,
      difficulty: 'EASY',
      tags: ['rédaction', 'description', 'vocabulaire'],
      createdBy: 'teacher-002',
      createdAt: '2024-11-10T09:00:00Z',
      lastModified: '2024-11-10T09:00:00Z'
    },
    {
      id: 'assign-003',
      title: 'Expérience - Les États de la Matière',
      description: 'Projet pratique sur les changements d\'état de la matière',
      subjectId: 'sub-003',
      subject: 'Sciences',
      classId: 'class-002',
      className: 'CP2 B',
      teacherId: 'teacher-003',
      teacherName: 'Dr Traore',
      assignedDate: '2024-11-12T00:00:00Z',
      dueDate: '2024-11-30T23:59:59Z',
      maxPoints: 25,
      instructions: 'Réalisez trois expériences simples montrant les changements d\'état. Documentez avec photos et observations.',
      attachments: ['protocole_experiences.pdf', 'fiche_observation.doc'],
      status: 'ACTIVE',
      submissionCount: 15,
      totalStudents: 28,
      type: 'PROJECT',
      estimatedDuration: 120,
      difficulty: 'HARD',
      tags: ['expérience', 'états', 'matière', 'observation'],
      createdBy: 'teacher-003',
      createdAt: '2024-11-12T10:30:00Z',
      lastModified: '2024-11-12T10:30:00Z'
    },
    {
      id: 'assign-004',
      title: 'Quiz - Géographie de l\'Afrique',
      description: 'Test rapide sur les pays et capitales d\'Afrique',
      subjectId: 'sub-004',
      subject: 'Histoire-Géographie',
      classId: 'class-003',
      className: 'CE1 C',
      teacherId: 'teacher-004',
      teacherName: 'Mme Keita',
      assignedDate: '2024-11-18T00:00:00Z',
      dueDate: '2024-11-22T23:59:59Z',
      maxPoints: 10,
      instructions: 'Quiz en ligne de 10 questions sur les pays africains et leurs capitales.',
      status: 'ACTIVE',
      submissionCount: 25,
      totalStudents: 30,
      averageScore: 7.8,
      type: 'QUIZ',
      estimatedDuration: 20,
      difficulty: 'MEDIUM',
      tags: ['géographie', 'afrique', 'capitales', 'quiz'],
      createdBy: 'teacher-004',
      createdAt: '2024-11-18T14:00:00Z',
      lastModified: '2024-11-18T14:00:00Z'
    },
    {
      id: 'assign-005',
      title: 'Dialogue en Anglais - À la Boutique',
      description: 'Créer un dialogue en anglais dans une situation d\'achat',
      subjectId: 'sub-006',
      subject: 'Anglais',
      classId: 'class-004',
      className: 'CE2 A',
      teacherId: 'teacher-006',
      teacherName: 'Miss Johnson',
      assignedDate: '2024-11-05T00:00:00Z',
      dueDate: '2024-11-15T23:59:59Z',
      maxPoints: 12,
      instructions: 'Rédigez un dialogue de 8 répliques minimum entre un client et un vendeur dans une boutique.',
      status: 'COMPLETED',
      submissionCount: 27,
      totalStudents: 27,
      averageScore: 9.5,
      type: 'HOMEWORK',
      estimatedDuration: 30,
      difficulty: 'EASY',
      tags: ['dialogue', 'anglais', 'conversation', 'vocabulaire'],
      createdBy: 'teacher-006',
      createdAt: '2024-11-05T11:00:00Z',
      lastModified: '2024-11-15T16:00:00Z'
    },
    {
      id: 'assign-006',
      title: 'Recherche - Personnages Historiques',
      description: 'Recherche sur un personnage historique africain',
      subjectId: 'sub-004',
      subject: 'Histoire-Géographie',
      classId: 'class-005',
      className: 'CM1 B',
      teacherId: 'teacher-004',
      teacherName: 'Mme Keita',
      assignedDate: '2024-11-01T00:00:00Z',
      dueDate: '2024-11-10T23:59:59Z',
      maxPoints: 18,
      instructions: 'Choisissez un personnage historique africain et rédigez une biographie de 200 mots.',
      status: 'OVERDUE',
      submissionCount: 20,
      totalStudents: 26,
      averageScore: 13.2,
      type: 'PROJECT',
      estimatedDuration: 90,
      difficulty: 'MEDIUM',
      tags: ['histoire', 'biographie', 'afrique', 'recherche'],
      createdBy: 'teacher-004',
      createdAt: '2024-11-01T09:00:00Z',
      lastModified: '2024-11-10T18:00:00Z'
    },
    {
      id: 'assign-007',
      title: 'Exercices de Conjugaison',
      description: 'Conjugaison des verbes du 1er groupe au présent',
      subjectId: 'sub-002',
      subject: 'Français',
      classId: 'class-006',
      className: 'CM2 A',
      teacherId: 'teacher-002',
      teacherName: 'M. Kouassi',
      assignedDate: '2024-11-20T00:00:00Z',
      dueDate: '2024-11-28T23:59:59Z',
      maxPoints: 15,
      instructions: 'Conjuguez les 20 verbes de la liste au présent de l\'indicatif avec tous les pronoms personnels.',
      status: 'DRAFT',
      submissionCount: 0,
      totalStudents: 29,
      type: 'HOMEWORK',
      estimatedDuration: 40,
      difficulty: 'EASY',
      tags: ['conjugaison', 'présent', 'verbes', 'grammaire'],
      createdBy: 'teacher-002',
      createdAt: '2024-11-20T15:30:00Z',
      lastModified: '2024-11-20T15:30:00Z'
    },
    {
      id: 'assign-008',
      title: 'Problèmes de Proportionnalité',
      description: 'Résolution de problèmes de proportionnalité et pourcentages',
      subjectId: 'sub-001',
      subject: 'Mathématiques',
      classId: 'class-005',
      className: 'CM1 B',
      teacherId: 'teacher-001',
      teacherName: 'Mme Diallo',
      assignedDate: '2024-11-19T00:00:00Z',
      dueDate: '2024-11-26T23:59:59Z',
      maxPoints: 22,
      instructions: 'Résolvez les 15 problèmes de proportionnalité. Utilisez les méthodes vues en classe.',
      attachments: ['problemes_proportionnalite.pdf'],
      status: 'ACTIVE',
      submissionCount: 12,
      totalStudents: 26,
      type: 'HOMEWORK',
      estimatedDuration: 75,
      difficulty: 'HARD',
      tags: ['proportionnalité', 'pourcentages', 'problèmes', 'calcul'],
      createdBy: 'teacher-001',
      createdAt: '2024-11-19T08:15:00Z',
      lastModified: '2024-11-19T08:15:00Z'
    }
  ];

  private static submissions: AssignmentSubmission[] = [
    {
      id: 'sub-001',
      assignmentId: 'assign-001',
      studentId: 'student-001',
      studentName: 'Jean Mukendi',
      submittedAt: '2024-11-20T14:30:00Z',
      content: 'Solutions des exercices du chapitre 5...',
      attachments: ['jean_math_ch5.pdf'],
      score: 16,
      feedback: 'Bon travail, quelques erreurs de calcul mineures.',
      status: 'GRADED',
      gradedBy: 'teacher-001',
      gradedAt: '2024-11-21T10:00:00Z'
    },
    // Ajoutez plus de soumissions selon le besoin...
  ];

  // Méthodes publiques
  static getAllAssignments(): Assignment[] {
    return [...this.assignments];
  }

  static getAssignmentById(id: string): Assignment | null {
    return this.assignments.find(assignment => assignment.id === id) || null;
  }

  static getAssignmentsByClass(classId: string): Assignment[] {
    return this.assignments.filter(assignment => assignment.classId === classId);
  }

  static getAssignmentsBySubject(subjectId: string): Assignment[] {
    return this.assignments.filter(assignment => assignment.subjectId === subjectId);
  }

  static getAssignmentsByStatus(status: Assignment['status']): Assignment[] {
    return this.assignments.filter(assignment => assignment.status === status);
  }

  static getAssignmentStats(): AssignmentStats {
    const totalActive = this.assignments.filter(a => a.status === 'ACTIVE').length;
    const totalDraft = this.assignments.filter(a => a.status === 'DRAFT').length;
    const totalCompleted = this.assignments.filter(a => a.status === 'COMPLETED').length;
    const overdue = this.assignments.filter(a => a.status === 'OVERDUE').length;
    
    const pendingReview = this.submissions.filter(s => s.status === 'SUBMITTED').length;
    
    const totalSubmissions = this.assignments.reduce((sum, a) => sum + a.submissionCount, 0);
    const totalExpected = this.assignments.reduce((sum, a) => sum + a.totalStudents, 0);
    const submissionRate = totalExpected > 0 ? Math.round((totalSubmissions / totalExpected) * 100) : 0;
    
    const gradedAssignments = this.assignments.filter(a => a.averageScore !== undefined);
    const averageScore = gradedAssignments.length > 0 
      ? gradedAssignments.reduce((sum, a) => sum + (a.averageScore || 0), 0) / gradedAssignments.length
      : 0;

    return {
      totalActive,
      totalDraft,
      totalCompleted,
      overdue,
      pendingReview,
      submissionRate,
      averageScore: Math.round(averageScore * 10) / 10
    };
  }

  static getSubjectAnalytics(): SubjectAnalytics[] {
    const subjects = new Map<string, {
      name: string;
      assignments: Assignment[];
    }>();

    this.assignments.forEach(assignment => {
      if (!subjects.has(assignment.subjectId)) {
        subjects.set(assignment.subjectId, {
          name: assignment.subject,
          assignments: []
        });
      }
      subjects.get(assignment.subjectId)!.assignments.push(assignment);
    });

    return Array.from(subjects.values()).map(subject => {
      const totalAssignments = subject.assignments.length;
      const gradedAssignments = subject.assignments.filter(a => a.averageScore !== undefined);
      const averageScore = gradedAssignments.length > 0
        ? gradedAssignments.reduce((sum, a) => sum + (a.averageScore || 0), 0) / gradedAssignments.length
        : 0;
      
      const totalSubmissions = subject.assignments.reduce((sum, a) => sum + a.submissionCount, 0);
      const totalExpected = subject.assignments.reduce((sum, a) => sum + a.totalStudents, 0);
      const submissionRate = totalExpected > 0 ? Math.round((totalSubmissions / totalExpected) * 100) : 0;

      const difficultyCount = subject.assignments.reduce((acc, a) => {
        acc[a.difficulty] = (acc[a.difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const difficulty = Object.keys(difficultyCount).reduce((a, b) => 
        difficultyCount[a] > difficultyCount[b] ? a : b, 'MEDIUM'
      );

      return {
        name: subject.name,
        totalAssignments,
        averageScore: Math.round(averageScore * 10) / 10,
        submissionRate,
        difficulty
      };
    });
  }

  static getClassAnalytics(): ClassAnalytics[] {
    const classes = new Map<string, {
      name: string;
      assignments: Assignment[];
    }>();

    this.assignments.forEach(assignment => {
      if (!classes.has(assignment.classId)) {
        classes.set(assignment.classId, {
          name: assignment.className,
          assignments: []
        });
      }
      classes.get(assignment.classId)!.assignments.push(assignment);
    });

    return Array.from(classes.values()).map(classe => {
      const gradedAssignments = classe.assignments.filter(a => a.averageScore !== undefined);
      const averageScore = gradedAssignments.length > 0
        ? gradedAssignments.reduce((sum, a) => sum + (a.averageScore || 0), 0) / gradedAssignments.length
        : 0;
      
      const totalSubmissions = classe.assignments.reduce((sum, a) => sum + a.submissionCount, 0);
      const totalExpected = classe.assignments.reduce((sum, a) => sum + a.totalStudents, 0);
      const submissionRate = totalExpected > 0 ? Math.round((totalSubmissions / totalExpected) * 100) : 0;
      
      const completedAssignments = classe.assignments.filter(a => a.status === 'COMPLETED').length;
      const completionRate = classe.assignments.length > 0 
        ? Math.round((completedAssignments / classe.assignments.length) * 100) : 0;

      // Prendre le nombre d'étudiants de la première affectation (ils devraient tous être identiques pour la même classe)
      const totalStudents = classe.assignments.length > 0 ? classe.assignments[0].totalStudents : 0;

      return {
        name: classe.name,
        totalStudents,
        averageScore: Math.round(averageScore * 10) / 10,
        submissionRate,
        completionRate
      };
    });
  }

  static createAssignment(assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'lastModified'>): Assignment {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    this.assignments.push(newAssignment);
    return newAssignment;
  }

  static updateAssignment(id: string, updates: Partial<Assignment>): Assignment | null {
    const index = this.assignments.findIndex(assignment => assignment.id === id);
    if (index === -1) return null;
    
    this.assignments[index] = {
      ...this.assignments[index],
      ...updates,
      lastModified: new Date().toISOString()
    };
    
    return this.assignments[index];
  }

  static deleteAssignment(id: string): boolean {
    const index = this.assignments.findIndex(assignment => assignment.id === id);
    if (index === -1) return false;
    
    this.assignments.splice(index, 1);
    return true;
  }

  static getSubmissionsByAssignment(assignmentId: string): AssignmentSubmission[] {
    return this.submissions.filter(submission => submission.assignmentId === assignmentId);
  }

  static submitAssignment(submissionData: Omit<AssignmentSubmission, 'id' | 'submittedAt'>): AssignmentSubmission {
    const newSubmission: AssignmentSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    
    this.submissions.push(newSubmission);
    
    // Mettre à jour le compteur de soumissions de l'assignment
    const assignment = this.getAssignmentById(submissionData.assignmentId);
    if (assignment) {
      assignment.submissionCount += 1;
    }
    
    return newSubmission;
  }

  static gradeSubmission(submissionId: string, score: number, feedback: string, gradedBy: string): AssignmentSubmission | null {
    const submission = this.submissions.find(s => s.id === submissionId);
    if (!submission) return null;
    
    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'GRADED';
    submission.gradedBy = gradedBy;
    submission.gradedAt = new Date().toISOString();
    
    // Recalculer la moyenne de l'assignment
    this.recalculateAssignmentAverage(submission.assignmentId);
    
    return submission;
  }

  private static recalculateAssignmentAverage(assignmentId: string): void {
    const submissions = this.getSubmissionsByAssignment(assignmentId);
    const gradedSubmissions = submissions.filter(s => s.score !== undefined);
    
    if (gradedSubmissions.length > 0) {
      const average = gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length;
      const assignment = this.getAssignmentById(assignmentId);
      if (assignment) {
        assignment.averageScore = Math.round(average * 10) / 10;
      }
    }
  }

  // Fonctions utilitaires
  static formatDate(date: string): string {
    return MockDataService.formatDate(date);
  }

  static getDifficultyText(difficulty: string): string {
    const texts = {
      'EASY': 'Facile',
      'MEDIUM': 'Moyen',
      'HARD': 'Difficile'
    };
    return texts[difficulty as keyof typeof texts] || difficulty;
  }

  static getTypeText(type: string): string {
    const texts = {
      'HOMEWORK': 'Devoir',
      'PROJECT': 'Projet',
      'QUIZ': 'Quiz',
      'EXAM': 'Examen'
    };
    return texts[type as keyof typeof texts] || type;
  }
}

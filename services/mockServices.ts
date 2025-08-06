"use client";

// Service centralisé pour toutes les données fictives des modules
// TODO: Remplacer par les vrais appels API une fois le backend terminé

import { DashboardMockDataService } from "./dashboardMockData";

// Types pour les différents modules
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  time?: string;
  reason?: string;
}

export interface ExaminationRecord {
  id: string;
  name: string;
  subject: string;
  className: string;
  date: string;
  time: string;
  duration: number; // minutes
  totalMarks: number;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  location: string;
}

export interface TransportRoute {
  id: string;
  routeName: string;
  driverName: string;
  vehicleNumber: string;
  capacity: number;
  currentStudents: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  stops: string[];
  estimatedTime: string;
}

export interface FinancialRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "PAID" | "PENDING" | "OVERDUE" | "PARTIALLY_PAID";
  paymentMethod?: string;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  targetAudience: string[];
  publishDate: string;
  expiryDate?: string;
  author: string;
  isActive: boolean;
}

export interface StaffRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joiningDate: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  subjects?: string[];
  classes?: string[];
}

export interface ResourceRecord {
  id: string;
  name: string;
  type: "BOOK" | "EQUIPMENT" | "FACILITY" | "DIGITAL";
  category: string;
  quantity: number;
  available: number;
  location: string;
  status: "AVAILABLE" | "BORROWED" | "MAINTENANCE" | "DAMAGED";
}

// Service de données fictives pour le module de présence
export class AttendanceMockService {
  static getAttendanceRecords(): AttendanceRecord[] {
    return [
      {
        id: "att_001",
        studentId: "std_001", 
        studentName: "Mukendi Jean",
        className: "6ème Primaire A",
        date: "2025-01-18",
        status: "PRESENT",
        time: "07:30"
      },
      {
        id: "att_002",
        studentId: "std_002",
        studentName: "Kasongo Marie", 
        className: "6ème Primaire A",
        date: "2025-01-18",
        status: "LATE",
        time: "08:15",
        reason: "Transport en retard"
      },
      {
        id: "att_003",
        studentId: "std_003",
        studentName: "Mbuyi Pierre",
        className: "5ème Primaire B", 
        date: "2025-01-18",
        status: "ABSENT",
        reason: "Malade"
      },
      {
        id: "att_004",
        studentId: "std_004",
        studentName: "Tshiala Grace",
        className: "6ème Primaire A",
        date: "2025-01-18", 
        status: "PRESENT",
        time: "07:25"
      },
      {
        id: "att_005",
        studentId: "std_005",
        studentName: "Kalala David",
        className: "4ème Primaire C",
        date: "2025-01-18",
        status: "EXCUSED",
        reason: "Rendez-vous médical"
      }
    ];
  }

  static getAttendanceStats() {
    return {
      totalStudents: 1247,
      presentToday: 1156,
      absentToday: 67,
      lateToday: 24,
      attendanceRate: 92.7
    };
  }
}

// Service de données fictives pour le module d'examens
export class ExaminationMockService {
  static getExaminations(): ExaminationRecord[] {
    return [
      {
        id: "exam_001",
        name: "Examen Trimestriel Mathématiques",
        subject: "Mathématiques",
        className: "6ème Primaire A",
        date: "2025-01-25",
        time: "08:00",
        duration: 120,
        totalMarks: 100,
        status: "SCHEDULED",
        location: "Salle A1"
      },
      {
        id: "exam_002", 
        name: "Test Français",
        subject: "Français",
        className: "5ème Primaire B",
        date: "2025-01-22",
        time: "10:30", 
        duration: 90,
        totalMarks: 80,
        status: "ONGOING",
        location: "Salle B2"
      },
      {
        id: "exam_003",
        name: "Évaluation Sciences Naturelles",
        subject: "Sciences",
        className: "4ème Primaire C", 
        date: "2025-01-20",
        time: "14:00",
        duration: 60,
        totalMarks: 50,
        status: "COMPLETED",
        location: "Laboratoire"
      },
      {
        id: "exam_004",
        name: "Examen Histoire et Géographie",
        subject: "Histoire-Géo",
        className: "6ème Primaire A",
        date: "2025-01-28",
        time: "08:00",
        duration: 90,
        totalMarks: 75,
        status: "SCHEDULED", 
        location: "Salle A2"
      }
    ];
  }

  static getExamStats() {
    return {
      scheduledExams: 12,
      ongoingExams: 3,
      completedExams: 45,
      averageScore: 78.4
    };
  }
}

// Service de données fictives pour le module de transport
export class TransportMockService {
  static getTransportRoutes(): TransportRoute[] {
    return [
      {
        id: "route_001",
        routeName: "Route Lubumbashi Centre",
        driverName: "Kabongo Emmanuel",
        vehicleNumber: "CD-1234-LU",
        capacity: 35,
        currentStudents: 32,
        status: "ACTIVE",
        stops: ["Av. Mobutu", "Place de la Poste", "Université", "Marché Central"],
        estimatedTime: "45 min"
      },
      {
        id: "route_002",
        routeName: "Route Ruashi",
        driverName: "Mukendi Joseph",
        vehicleNumber: "CD-5678-LU", 
        capacity: 40,
        currentStudents: 28,
        status: "ACTIVE",
        stops: ["Ruashi", "Kipushi", "Golf", "Centre-ville"],
        estimatedTime: "55 min"
      },
      {
        id: "route_003",
        routeName: "Route Kampemba",
        driverName: "Tshilombo André",
        vehicleNumber: "CD-9012-LU",
        capacity: 30,
        currentStudents: 0,
        status: "MAINTENANCE",
        stops: ["Kampemba", "Katuba", "Makomeno"],
        estimatedTime: "40 min"
      }
    ];
  }

  static getTransportStats() {
    return {
      totalVehicles: 8,
      activeRoutes: 6,
      studentsTransported: 245,
      averageOccupancy: 78.5
    };
  }
}

// Service de données fictives pour le module financier
export class FinanceMockService {
  static getFinancialRecords(): FinancialRecord[] {
    return [
      {
        id: "fee_001",
        studentId: "std_001",
        studentName: "Mukendi Jean",
        className: "6ème Primaire A",
        feeType: "Frais de scolarité Trimestre 2",
        amount: 150000,
        dueDate: "2025-01-31",
        paidDate: "2025-01-15",
        status: "PAID",
        paymentMethod: "Mobile Money"
      },
      {
        id: "fee_002",
        studentId: "std_002", 
        studentName: "Kasongo Marie",
        className: "6ème Primaire A",
        feeType: "Frais de scolarité Trimestre 2", 
        amount: 150000,
        dueDate: "2025-01-31",
        status: "PENDING"
      },
      {
        id: "fee_003",
        studentId: "std_003",
        studentName: "Mbuyi Pierre",
        className: "5ème Primaire B",
        feeType: "Frais d'activités parascolaires",
        amount: 25000,
        dueDate: "2025-01-20",
        status: "OVERDUE"
      },
      {
        id: "fee_004",
        studentId: "std_004",
        studentName: "Tshiala Grace", 
        className: "6ème Primaire A",
        feeType: "Frais de transport",
        amount: 45000,
        dueDate: "2025-02-01",
        paidDate: "2025-01-10",
        status: "PAID",
        paymentMethod: "Espèces"
      }
    ];
  }

  static getFinanceStats() {
    return {
      totalRevenue: 2840000,
      pendingPayments: 680000,
      collectionRate: 87.3,
      monthlyTarget: 2500000
    };
  }
}

// Service de données fictives pour les annonces
export class AnnouncementMockService {
  static getAnnouncements(): AnnouncementRecord[] {
    return [
      {
        id: "ann_001",
        title: "Réunion des parents - Trimestre 2",
        content: "Nous invitons tous les parents à la réunion trimestrielle qui aura lieu le samedi 25 janvier 2025 à 9h dans l'amphithéâtre principal.",
        priority: "HIGH",
        targetAudience: ["PARENTS", "TEACHERS"],
        publishDate: "2025-01-18",
        expiryDate: "2025-01-25",
        author: "Direction Générale",
        isActive: true
      },
      {
        id: "ann_002",
        title: "Nouvelles heures d'ouverture de la bibliothèque", 
        content: "La bibliothèque sera désormais ouverte de 7h30 à 17h30 du lundi au vendredi.",
        priority: "MEDIUM",
        targetAudience: ["STUDENTS", "TEACHERS"],
        publishDate: "2025-01-17",
        author: "Bibliothécaire en chef",
        isActive: true
      },
      {
        id: "ann_003",
        title: "Examens trimestriels - Calendrier",
        content: "Les examens du deuxième trimestre commenceront le 25 janvier. Veuillez consulter le planning détaillé sur le tableau d'affichage.",
        priority: "URGENT",
        targetAudience: ["STUDENTS", "PARENTS", "TEACHERS"],
        publishDate: "2025-01-16",
        expiryDate: "2025-02-05",
        author: "Coordinateur Académique", 
        isActive: true
      }
    ];
  }

  static getAnnouncementStats() {
    return {
      totalAnnouncements: 45,
      activeAnnouncements: 12,
      urgentAnnouncements: 3,
      viewRate: 89.2
    };
  }
}

// Service de données fictives pour le personnel
export class StaffMockService {
  static getStaffRecords(): StaffRecord[] {
    return [
      {
        id: "staff_001",
        name: "Mme Kabamba Julienne",
        role: "Enseignant",
        department: "Primaire", 
        email: "j.kabamba@ecole.cd",
        phone: "+243 85 123 4567",
        joiningDate: "2020-09-01",
        status: "ACTIVE",
        subjects: ["Mathématiques", "Sciences"],
        classes: ["6ème Primaire A", "5ème Primaire B"]
      },
      {
        id: "staff_002",
        name: "M. Tshimanga Robert",
        role: "Directeur Adjoint",
        department: "Administration",
        email: "r.tshimanga@ecole.cd", 
        phone: "+243 85 234 5678",
        joiningDate: "2018-01-15",
        status: "ACTIVE"
      },
      {
        id: "staff_003",
        name: "Mme Mukendi Esperance",
        role: "Enseignant",
        department: "Primaire",
        email: "e.mukendi@ecole.cd",
        phone: "+243 85 345 6789", 
        joiningDate: "2019-08-20",
        status: "ON_LEAVE",
        subjects: ["Français", "Histoire"],
        classes: ["4ème Primaire C"]
      },
      {
        id: "staff_004",
        name: "M. Kasongo Daniel",
        role: "Surveillant Général",
        department: "Administration",
        email: "d.kasongo@ecole.cd",
        phone: "+243 85 456 7890",
        joiningDate: "2021-03-10", 
        status: "ACTIVE"
      }
    ];
  }

  static getStaffStats() {
    return {
      totalStaff: 45,
      activeStaff: 42,
      onLeave: 3,
      teachingStaff: 32,
      administrativeStaff: 13
    };
  }
}

// Service de données fictives pour les ressources
export class ResourceMockService {
  static getResources(): ResourceRecord[] {
    return [
      {
        id: "res_001",
        name: "Ordinateurs portables",
        type: "EQUIPMENT",
        category: "Informatique", 
        quantity: 30,
        available: 25,
        location: "Laboratoire informatique",
        status: "AVAILABLE"
      },
      {
        id: "res_002",
        name: "Livres de mathématiques 6ème",
        type: "BOOK",
        category: "Manuel scolaire",
        quantity: 150,
        available: 142,
        location: "Bibliothèque", 
        status: "AVAILABLE"
      },
      {
        id: "res_003",
        name: "Projecteur multimédia",
        type: "EQUIPMENT",
        category: "Audio-visuel",
        quantity: 5,
        available: 3, 
        location: "Salle des professeurs",
        status: "BORROWED"
      },
      {
        id: "res_004",
        name: "Amphithéâtre principal",
        type: "FACILITY",
        category: "Salle",
        quantity: 1,
        available: 1,
        location: "Bâtiment principal",
        status: "AVAILABLE"
      }
    ];
  }

  static getResourceStats() {
    return {
      totalResources: 1250,
      availableResources: 1098,
      borrowedResources: 127,
      maintenanceResources: 25,
      utilizationRate: 76.4
    };
  }
}

// Service centralisé pour toutes les données fictives
export class MockDataService {
  static attendance = AttendanceMockService;
  static examinations = ExaminationMockService;
  static transport = TransportMockService;
  static finance = FinanceMockService;
  static announcements = AnnouncementMockService;
  static staff = StaffMockService;
  static resources = ResourceMockService;
  static dashboard = DashboardMockDataService;

  // Services pour les académiques
  static classes = {
    getAll: () => [
      { id: 'class-001', name: 'CP1 A', level: 'CP1', section: 'A', capacity: 30, currentStudents: 25 },
      { id: 'class-002', name: 'CP2 B', level: 'CP2', section: 'B', capacity: 30, currentStudents: 28 },
      { id: 'class-003', name: 'CE1 C', level: 'CE1', section: 'C', capacity: 32, currentStudents: 30 },
      { id: 'class-004', name: 'CE2 A', level: 'CE2', section: 'A', capacity: 30, currentStudents: 27 },
      { id: 'class-005', name: 'CM1 B', level: 'CM1', section: 'B', capacity: 28, currentStudents: 26 },
      { id: 'class-006', name: 'CM2 A', level: 'CM2', section: 'A', capacity: 30, currentStudents: 29 }
    ]
  };

  static subjects = {
    getAll: () => [
      { id: 'sub-001', name: 'Mathématiques', code: 'MATH', category: 'Sciences' },
      { id: 'sub-002', name: 'Français', code: 'FR', category: 'Langues' },
      { id: 'sub-003', name: 'Sciences', code: 'SCI', category: 'Sciences' },
      { id: 'sub-004', name: 'Histoire-Géographie', code: 'HG', category: 'Sciences Humaines' },
      { id: 'sub-005', name: 'Education Physique', code: 'EPS', category: 'Sports' },
      { id: 'sub-006', name: 'Anglais', code: 'EN', category: 'Langues' },
      { id: 'sub-007', name: 'Arts Plastiques', code: 'ART', category: 'Arts' },
      { id: 'sub-008', name: 'Musique', code: 'MUS', category: 'Arts' }
    ]
  };

  static teachers = {
    getAll: () => [
      { id: 'teacher-001', name: 'Mme Diallo', subject: 'Mathématiques', email: 'f.diallo@ecole.com' },
      { id: 'teacher-002', name: 'M. Kouassi', subject: 'Français', email: 'k.kouassi@ecole.com' },
      { id: 'teacher-003', name: 'Dr Traore', subject: 'Sciences', email: 'd.traore@ecole.com' },
      { id: 'teacher-004', name: 'Mme Keita', subject: 'Histoire-Géographie', email: 'm.keita@ecole.com' },
      { id: 'teacher-005', name: 'M. Fofana', subject: 'Education Physique', email: 'm.fofana@ecole.com' },
      { id: 'teacher-006', name: 'Miss Johnson', subject: 'Anglais', email: 'e.johnson@ecole.com' },
      { id: 'teacher-007', name: 'Mme Bamba', subject: 'Arts Plastiques', email: 'a.bamba@ecole.com' },
      { id: 'teacher-008', name: 'M. Sanogo', subject: 'Musique', email: 's.sanogo@ecole.com' },
      { id: 'teacher-009', name: 'M. Coulibaly', subject: 'Mathématiques', email: 'm.coulibaly@ecole.com' },
      { id: 'teacher-010', name: 'Mme Ouattara', subject: 'Français', email: 'o.ouattara@ecole.com' },
      { id: 'teacher-011', name: 'Mme Sidibe', subject: 'Mathématiques', email: 'm.sidibe@ecole.com' },
      { id: 'teacher-012', name: 'M. Kone', subject: 'Mathématiques', email: 'm.kone@ecole.com' }
    ]
  };

  // Fonction utilitaire pour formater les dates
  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-CD', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  }

  // Fonction utilitaire pour formater les montants
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Fonction utilitaire pour formater les pourcentages
  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }
}

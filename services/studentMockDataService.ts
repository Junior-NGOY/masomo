// Service de données fictives pour la gestion des élèves

// Interface pour les frais définis au niveau de la classe
export interface ClassFee {
  id: string;
  className: string;
  feeType: string;
  amount: number;
  dueDate?: string; // Pour frais unique
  academicYear: string;
  description?: string;
  isRecurring: boolean; // Pour les frais mensuels
  recurringType?: 'MONTHLY' | 'QUARTERLY' | 'SEMESTER' | 'ANNUAL';
  startDate?: string; // Date de début pour frais récurrents
  endDate?: string; // Date de fin pour frais récurrents
  dueDayOfMonth?: number; // Jour du mois pour l'échéance (ex: 15 pour le 15 de chaque mois)
  excludedMonths?: string[]; // Mois à exclure (ex: ['juillet', 'août'])
  category: 'TUITION' | 'TRANSPORT' | 'EXAM' | 'UNIFORM' | 'REGISTRATION' | 'OTHER';
  createdDate: string;
  createdBy: string;
}

// Interface pour les instances d'échéances générées
export interface FeeInstance {
  id: string;
  classFeeId: string;
  className: string;
  feeType: string;
  amount: number;
  dueDate: string;
  month?: string; // Pour frais mensuels
  period?: string; // Période (ex: "Septembre 2024", "1er Trimestre 2024")
  academicYear: string;
  isActive: boolean;
}

// Interface pour les paiements individuels des élèves
export interface StudentPayment {
  id: string;
  studentId: string;
  studentName: string;
  feeInstanceId: string; // Référence vers FeeInstance
  classFeeId: string; // Référence vers ClassFee parent
  paidDate?: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  paidAmount?: number;
  remainingAmount?: number;
  paymentMethod?: string;
  receiptNo?: string;
  notes?: string;
}

// Interface pour la vue combinée (pour la compatibilité)
export interface StudentFee {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  remainingAmount?: number;
  paymentMethod?: string;
  receiptNo?: string;
  notes?: string;
  classFeeId?: string; // Nouveau : référence vers le frais de classe
  schoolLogo?: string;
  schoolName?: string;
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  timeIn?: string;
  timeOut?: string;
  notes?: string;
  subject?: string;
}

export interface StudentID {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  idNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'LOST' | 'DAMAGED';
  photoUrl: string;
  parentContact: string;
  emergencyContact: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  className: string;
  imageUrl: string;
  phone: string;
  email: string;
  address: string;
  parentName: string;
  parentPhone: string;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  attendanceRate: number;
  averageGrade: number;
}

export class StudentMockDataService {
  // Générateur de frais mensuels (septembre à juin)
  private static generateMonthlyFees(studentId: string, studentName: string, className: string): StudentFee[] {
    const fees: StudentFee[] = [];
    const academicYear = "2024-2025";
    const monthlyAmount = 50000; // 50,000 FC par mois
    
    // Mois académiques de septembre à juin
    const academicMonths = [
      { month: "Septembre", dueDate: "2024-09-15" },
      { month: "Octobre", dueDate: "2024-10-15" },
      { month: "Novembre", dueDate: "2024-11-15" },
      { month: "Décembre", dueDate: "2024-12-15" },
      { month: "Janvier", dueDate: "2025-01-15" },
      { month: "Février", dueDate: "2025-02-15" },
      { month: "Mars", dueDate: "2025-03-15" },
      { month: "Avril", dueDate: "2025-04-15" },
      { month: "Mai", dueDate: "2025-05-15" },
      { month: "Juin", dueDate: "2025-06-15" }
    ];

    academicMonths.forEach((monthData, index) => {
      // Utiliser une date fixe pour éviter l'hydratation mismatch
      const currentDate = new Date('2025-02-15'); // Date fixe pour la cohérence
      const dueDate = new Date(monthData.dueDate);
      
      // Déterminer le statut basé sur la date et un pattern réaliste
      let status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
      let paidDate: string | undefined;
      let remainingAmount: number | undefined;
      let paymentMethod: string | undefined;
      let receiptNo: string | undefined;
      
      if (index < 4) { // Sep-Dec: payés
        status = 'PAID';
        // Utiliser des dates fixes basées sur l'index pour la cohérence
        const dayOffset = (index * 3) + 2; // Décalage de jours basé sur l'index
        const paymentDate = new Date(dueDate.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        paidDate = paymentDate.toISOString().split('T')[0];
        paymentMethod = index % 2 === 0 ? 'Mobile Money' : 'Espèces';
        receiptNo = `REC${academicYear.replace('-', '')}${studentId.replace('std_', '')}${String(index + 1).padStart(2, '0')}`;
      } else if (index === 4) { // Janvier: partiel pour certains élèves
        if (studentId === 'std_001') {
          status = 'PARTIAL';
          remainingAmount = 20000;
          paidDate = "2025-01-10";
          paymentMethod = 'Mobile Money';
          receiptNo = `REC${academicYear.replace('-', '')}${studentId.replace('std_', '')}${String(index + 1).padStart(2, '0')}`;
        } else {
          status = 'PAID';
          paidDate = "2025-01-12";
          paymentMethod = 'Espèces';
          receiptNo = `REC${academicYear.replace('-', '')}${studentId.replace('std_', '')}${String(index + 1).padStart(2, '0')}`;
        }
      } else if (index === 5) { // Février: en retard pour certains
        if (studentId === 'std_003') {
          status = 'OVERDUE';
        } else {
          status = 'PENDING';
        }
      } else { // Mars-Juin: en attente
        status = 'PENDING';
      }

      fees.push({
        id: `fee_${studentId}_${index + 1}`,
        studentId,
        studentName,
        className,
        feeType: `Frais de scolarité - ${monthData.month} ${academicYear}`,
        amount: monthlyAmount,
        dueDate: monthData.dueDate,
        paidDate,
        status,
        remainingAmount,
        paymentMethod,
        receiptNo,
        notes: status === 'PARTIAL' ? 'Paiement partiel effectué' : 
               status === 'OVERDUE' ? 'Paiement en retard - contactez l\'administration' : undefined
      });
    });

    return fees;
  }

  // Générateur de frais supplémentaires
  private static generateAdditionalFees(studentId: string, studentName: string, className: string): StudentFee[] {
    return [
      {
        id: `fee_${studentId}_inscription`,
        studentId,
        studentName,
        className,
        feeType: "Frais d'inscription 2024-2025",
        amount: 100000,
        dueDate: "2024-08-31",
        paidDate: "2024-08-25",
        status: 'PAID',
        paymentMethod: 'Virement bancaire',
        receiptNo: `INS${studentId.replace('std_', '')}2024`,
        notes: 'Frais d\'inscription payés avant la rentrée'
      },
      {
        id: `fee_${studentId}_uniforme`,
        studentId,
        studentName,
        className,
        feeType: "Uniforme scolaire",
        amount: 75000,
        dueDate: "2024-09-10",
        paidDate: "2024-09-05",
        status: 'PAID',
        paymentMethod: 'Espèces',
        receiptNo: `UNI${studentId.replace('std_', '')}2024`
      },
      {
        id: `fee_${studentId}_transport_t2`,
        studentId,
        studentName,
        className,
        feeType: "Transport scolaire - Trimestre 2",
        amount: 120000,
        dueDate: "2025-01-15",
        status: studentId === 'std_002' ? 'PAID' : 'PENDING',
        paidDate: studentId === 'std_002' ? "2025-01-10" : undefined,
        paymentMethod: studentId === 'std_002' ? 'Mobile Money' : undefined,
        receiptNo: studentId === 'std_002' ? `TRA${studentId.replace('std_', '')}2025` : undefined,
        notes: 'Transport pour janvier-mars 2025'
      },
      {
        id: `fee_${studentId}_examens_t2`,
        studentId,
        studentName,
        className,
        feeType: "Frais d'examens - 2ème trimestre",
        amount: 25000,
        dueDate: "2025-03-01",
        status: 'PENDING'
      }
    ];
  }

  // Données fictives des frais d'élèves
  static getStudentFees(): StudentFee[] {
    const allFees: StudentFee[] = [];
    
    // Profils d'élèves fictifs
    const students = [
      { id: "std_001", name: "Mukendi Jean", className: "6ème Primaire A" },
      { id: "std_002", name: "Kasongo Marie", className: "6ème Primaire A" },
      { id: "std_003", name: "Mbuyi Pierre", className: "5ème Primaire B" },
      { id: "std_004", name: "Tshiala Grace", className: "6ème Primaire A" },
      { id: "std_005", name: "Kalala David", className: "4ème Primaire C" }
    ];

    // Générer les frais pour chaque élève
    students.forEach(student => {
      // Frais mensuels de septembre à juin
      allFees.push(...this.generateMonthlyFees(student.id, student.name, student.className));
      // Frais supplémentaires
      allFees.push(...this.generateAdditionalFees(student.id, student.name, student.className));
    });

    return allFees;
  }

  // Données fictives des présences d'élèves
  static getStudentAttendance(): StudentAttendance[] {
    const attendanceData: StudentAttendance[] = [];
    const students = [
      { id: "std_001", name: "Mukendi Jean", className: "6ème Primaire A" },
      { id: "std_002", name: "Kasongo Marie", className: "6ème Primaire A" },
      { id: "std_003", name: "Mbuyi Pierre", className: "5ème Primaire B" },
      { id: "std_004", name: "Tshiala Grace", className: "6ème Primaire A" },
      { id: "std_005", name: "Kalala David", className: "4ème Primaire C" }
    ];

    const subjects = ["Français", "Mathématiques", "Sciences", "Histoire-Géo", "Anglais"];
    const statuses: Array<'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];

    // Générer des données pour les 30 derniers jours
    for (let i = 0; i < 30; i++) {
      // Utiliser une date fixe de référence pour éviter l'hydratation mismatch
      const baseDate = new Date('2025-02-15');
      baseDate.setDate(baseDate.getDate() - i);
      const dateStr = baseDate.toISOString().split('T')[0];

      students.forEach((student, studentIndex) => {
        subjects.forEach((subject, subjectIndex) => {
          const id = `att_${i}_${studentIndex}_${subjectIndex}`;
          // Utiliser un algorithme déterministe basé sur les indices pour générer le statut
          const deterministic = (i + studentIndex + subjectIndex) % 100;
          let status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
          
          if (deterministic < 85) status = 'PRESENT';
          else if (deterministic < 90) status = 'LATE';
          else if (deterministic < 95) status = 'EXCUSED';
          else status = 'ABSENT';

          attendanceData.push({
            id,
            studentId: student.id,
            studentName: student.name,
            className: student.className,
            date: dateStr,
            status,
            subject,
            timeIn: status === 'PRESENT' ? "08:00" : status === 'LATE' ? "08:15" : undefined,
            timeOut: status === 'PRESENT' || status === 'LATE' ? "15:30" : undefined,
            notes: status === 'ABSENT' ? "Absence non justifiée" : 
                   status === 'EXCUSED' ? "Justificatif médical" :
                   status === 'LATE' ? "Retard de 15 minutes" : undefined
          });
        });
      });
    }

    return attendanceData;
  }

  // Données fictives des cartes d'élèves
  static getStudentIDs(): StudentID[] {
    return [
      {
        id: "id_001",
        studentId: "std_001",
        studentName: "Mukendi Jean",
        className: "6ème Primaire A",
        idNumber: "ID-2025-001",
        issueDate: "2025-01-10",
        expiryDate: "2026-01-10",
        status: "ACTIVE",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        parentContact: "+243 85 123 4567",
        emergencyContact: "+243 99 123 4567"
      },
      {
        id: "id_002",
        studentId: "std_002",
        studentName: "Kasongo Marie",
        className: "6ème Primaire A",
        idNumber: "ID-2025-002",
        issueDate: "2025-01-10",
        expiryDate: "2026-01-10",
        status: "ACTIVE",
        photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
        parentContact: "+243 85 234 5678",
        emergencyContact: "+243 99 234 5678"
      },
      {
        id: "id_003",
        studentId: "std_003",
        studentName: "Mbuyi Pierre",
        className: "5ème Primaire B",
        idNumber: "ID-2025-003",
        issueDate: "2025-01-10",
        expiryDate: "2026-01-10",
        status: "DAMAGED",
        photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        parentContact: "+243 85 345 6789",
        emergencyContact: "+243 99 345 6789"
      },
      {
        id: "id_004",
        studentId: "std_004",
        studentName: "Tshiala Grace",
        className: "6ème Primaire A",
        idNumber: "ID-2025-004",
        issueDate: "2025-01-10",
        expiryDate: "2026-01-10",
        status: "LOST",
        photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        parentContact: "+243 85 456 7890",
        emergencyContact: "+243 99 456 7890"
      },
      {
        id: "id_005",
        studentId: "std_005",
        studentName: "Kalala David",
        className: "4ème Primaire C",
        idNumber: "ID-2025-005",
        issueDate: "2025-01-10",
        expiryDate: "2026-01-10",
        status: "ACTIVE",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        parentContact: "+243 85 567 8901",
        emergencyContact: "+243 99 567 8901"
      }
    ];
  }

  // Profils des élèves avec statistiques
  static getStudentProfiles(): StudentProfile[] {
    return [
      {
        id: "std_001",
        name: "Mukendi Jean",
        className: "6ème Primaire A",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        phone: "+243 85 123 4567",
        email: "jean.mukendi@etudiant.com",
        address: "Avenue Kasai, Lubumbashi",
        parentName: "Mukendi Paul",
        parentPhone: "+243 99 123 4567",
        totalFees: 300000,
        paidFees: 250000,
        pendingFees: 50000,
        attendanceRate: 92.5,
        averageGrade: 85.2
      },
      {
        id: "std_002",
        name: "Kasongo Marie",
        className: "6ème Primaire A",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
        phone: "+243 85 234 5678",
        email: "marie.kasongo@etudiant.com",
        address: "Boulevard du 30 Juin, Kinshasa",
        parentName: "Kasongo Joseph",
        parentPhone: "+243 99 234 5678",
        totalFees: 250000,
        paidFees: 250000,
        pendingFees: 0,
        attendanceRate: 95.8,
        averageGrade: 88.7
      },
      {
        id: "std_003",
        name: "Mbuyi Pierre",
        className: "5ème Primaire B",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        phone: "+243 85 345 6789",
        email: "pierre.mbuyi@etudiant.com",
        address: "Quartier Matonge, Lubumbashi",
        parentName: "Mbuyi André",
        parentPhone: "+243 99 345 6789",
        totalFees: 250000,
        paidFees: 150000,
        pendingFees: 100000,
        attendanceRate: 87.3,
        averageGrade: 78.4
      },
      {
        id: "std_004",
        name: "Tshiala Grace",
        className: "6ème Primaire A",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        phone: "+243 85 456 7890",
        email: "grace.tshiala@etudiant.com",
        address: "Avenue Lumumba, Kolwezi",
        parentName: "Tshiala Emmanuel",
        parentPhone: "+243 99 456 7890",
        totalFees: 250000,
        paidFees: 0,
        pendingFees: 250000,
        attendanceRate: 89.2,
        averageGrade: 82.1
      },
      {
        id: "std_005",
        name: "Kalala David",
        className: "4ème Primaire C",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        phone: "+243 85 567 8901",
        email: "david.kalala@etudiant.com",
        address: "Boulevard Kamanyola, Lubumbashi",
        parentName: "Kalala Robert",
        parentPhone: "+243 99 567 8901",
        totalFees: 330000,
        paidFees: 330000,
        pendingFees: 0,
        attendanceRate: 93.7,
        averageGrade: 91.3
      }
    ];
  }

  // Statistiques générales
  static getStudentStats() {
    const fees = this.getStudentFees();
    const attendance = this.getStudentAttendance();
    const profiles = this.getStudentProfiles();

    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidFees = fees.filter(fee => fee.status === 'PAID').reduce((sum, fee) => sum + fee.amount, 0);
    const pendingFees = totalFees - paidFees;

    const totalAttendanceRecords = attendance.length;
    const presentRecords = attendance.filter(att => att.status === 'PRESENT').length;
    const attendanceRate = (presentRecords / totalAttendanceRecords) * 100;

    return {
      totalStudents: profiles.length,
      totalFees,
      paidFees,
      pendingFees,
      overdueFees: fees.filter(fee => fee.status === 'OVERDUE').length,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      activeIDs: this.getStudentIDs().filter(id => id.status === 'ACTIVE').length,
      lostOrDamagedIDs: this.getStudentIDs().filter(id => id.status === 'LOST' || id.status === 'DAMAGED').length
    };
  }

  // Utilitaire de formatage
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Filtres pour les données
  static getStudentFeesByStudent(studentId: string): StudentFee[] {
    return this.getStudentFees().filter(fee => fee.studentId === studentId);
  }

  static getStudentAttendanceByStudent(studentId: string): StudentAttendance[] {
    return this.getStudentAttendance().filter(att => att.studentId === studentId);
  }

  static getStudentAttendanceByDate(date: string): StudentAttendance[] {
    return this.getStudentAttendance().filter(att => att.date === date);
  }

  static getStudentAttendanceByClass(className: string): StudentAttendance[] {
    return this.getStudentAttendance().filter(att => att.className === className);
  }

  // === NOUVELLES MÉTHODES POUR LA GESTION DES FRAIS DE CLASSE ===

  // Données fictives des frais de classe
  static getClassFees(): ClassFee[] {
    return [
      // Frais mensuels pour 6ème Primaire A
      {
        id: "cf_6a_tuition_monthly",
        className: "6ème Primaire A",
        feeType: "Frais de scolarité mensuel",
        amount: 50000,
        dueDate: "2024-09-15", // Base date, will be calculated monthly
        academicYear: "2024-2025",
        description: "Frais de scolarité payable chaque mois de septembre à juin",
        isRecurring: true,
        category: "TUITION",
        createdDate: "2024-08-01",
        createdBy: "Administration"
      },
      {
        id: "cf_6a_transport_t2",
        className: "6ème Primaire A",
        feeType: "Transport scolaire - Trimestre 2",
        amount: 120000,
        dueDate: "2025-01-15",
        academicYear: "2024-2025",
        description: "Transport scolaire pour le deuxième trimestre",
        isRecurring: false,
        category: "TRANSPORT",
        createdDate: "2024-12-01",
        createdBy: "Administration"
      },
      {
        id: "cf_6a_exam_t2",
        className: "6ème Primaire A",
        feeType: "Frais d'examens - 2ème trimestre",
        amount: 25000,
        dueDate: "2025-03-01",
        academicYear: "2024-2025",
        description: "Frais pour les examens du deuxième trimestre",
        isRecurring: false,
        category: "EXAM",
        createdDate: "2025-02-01",
        createdBy: "Administration"
      },
      // Frais pour 5ème Primaire B
      {
        id: "cf_5b_tuition_monthly",
        className: "5ème Primaire B",
        feeType: "Frais de scolarité mensuel",
        amount: 45000,
        dueDate: "2024-09-15",
        academicYear: "2024-2025",
        description: "Frais de scolarité payable chaque mois de septembre à juin",
        isRecurring: true,
        category: "TUITION",
        createdDate: "2024-08-01",
        createdBy: "Administration"
      },
      // Frais pour 4ème Primaire C
      {
        id: "cf_4c_tuition_monthly",
        className: "4ème Primaire C",
        feeType: "Frais de scolarité mensuel",
        amount: 40000,
        dueDate: "2024-09-15",
        academicYear: "2024-2025",
        description: "Frais de scolarité payable chaque mois de septembre à juin",
        isRecurring: true,
        category: "TUITION",
        createdDate: "2024-08-01",
        createdBy: "Administration"
      }
    ];
  }

  // Créer un nouveau frais de classe
  static createClassFee(classFee: Omit<ClassFee, 'id' | 'createdDate'>): ClassFee {
    const newFee: ClassFee = {
      ...classFee,
      id: `cf_${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    // Dans une vraie application, ceci serait sauvegardé en base de données
    console.log('Nouveau frais de classe créé:', newFee);
    
    return newFee;
  }

  // Obtenir les frais pour une classe spécifique
  static getClassFeesByClass(className: string): ClassFee[] {
    return this.getClassFees().filter(fee => fee.className === className);
  }

  // Obtenir tous les élèves affectés par un frais de classe
  static getStudentsAffectedByClassFee(classFeeId: string): StudentProfile[] {
    const classFee = this.getClassFees().find(fee => fee.id === classFeeId);
    if (!classFee) return [];
    
    return this.getStudentProfiles().filter(student => student.className === classFee.className);
  }

  // Générer automatiquement les paiements individuels pour un frais de classe
  static generateStudentPaymentsFromClassFee(classFee: ClassFee): StudentPayment[] {
    const studentsInClass = this.getStudentProfiles().filter(
      student => student.className === classFee.className
    );

    // Générer d'abord les instances de frais
    const feeInstances = this.generateFeeInstances(classFee);
    const payments: StudentPayment[] = [];

    // Créer un paiement pour chaque instance et chaque élève
    feeInstances.forEach(instance => {
      studentsInClass.forEach(student => {
        payments.push({
          id: `sp_${instance.id}_${student.id}`,
          studentId: student.id,
          studentName: student.name,
          feeInstanceId: instance.id,
          classFeeId: classFee.id,
          status: 'PENDING' as const,
          remainingAmount: instance.amount
        });
      });
    });

    return payments;
  }

  // Obtenir les classes uniques
  static getUniqueClasses(): string[] {
    const profiles = this.getStudentProfiles();
    return [...new Set(profiles.map(profile => profile.className))];
  }

  // Générer automatiquement les instances de frais pour les frais récurrents
  static generateFeeInstances(classFee: ClassFee): FeeInstance[] {
    const instances: FeeInstance[] = [];
    
    if (!classFee.isRecurring) {
      // Frais unique
      return [{
        id: `fi_${classFee.id}_single`,
        classFeeId: classFee.id,
        className: classFee.className,
        feeType: classFee.feeType,
        amount: classFee.amount,
        dueDate: classFee.dueDate!,
        academicYear: classFee.academicYear,
        isActive: true
      }];
    }

    // Frais récurrents
    switch (classFee.recurringType) {
      case 'MONTHLY':
        return this.generateMonthlyInstances(classFee);
      case 'QUARTERLY':
        return this.generateQuarterlyInstances(classFee);
      case 'SEMESTER':
        return this.generateSemesterInstances(classFee);
      case 'ANNUAL':
        return this.generateAnnualInstances(classFee);
      default:
        return [];
    }
  }

  // Générer les instances mensuelles (septembre à juin)
  private static generateMonthlyInstances(classFee: ClassFee): FeeInstance[] {
    const instances: FeeInstance[] = [];
    const academicMonths = [
      { month: "Septembre", date: "2024-09" },
      { month: "Octobre", date: "2024-10" },
      { month: "Novembre", date: "2024-11" },
      { month: "Décembre", date: "2024-12" },
      { month: "Janvier", date: "2025-01" },
      { month: "Février", date: "2025-02" },
      { month: "Mars", date: "2025-03" },
      { month: "Avril", date: "2025-04" },
      { month: "Mai", date: "2025-05" },
      { month: "Juin", date: "2025-06" }
    ];

    const dueDayOfMonth = classFee.dueDayOfMonth || 15; // Par défaut le 15 du mois
    const excludedMonths = classFee.excludedMonths || [];

    academicMonths.forEach((monthData, index) => {
      // Vérifier si ce mois n'est pas exclu
      if (!excludedMonths.includes(monthData.month.toLowerCase())) {
        const dueDate = `${monthData.date}-${dueDayOfMonth.toString().padStart(2, '0')}`;
        
        instances.push({
          id: `fi_${classFee.id}_${monthData.date}`,
          classFeeId: classFee.id,
          className: classFee.className,
          feeType: classFee.feeType,
          amount: classFee.amount,
          dueDate,
          month: monthData.month,
          period: `${monthData.month} ${classFee.academicYear.split('-')[monthData.date.startsWith('2024') ? 0 : 1]}`,
          academicYear: classFee.academicYear,
          isActive: true
        });
      }
    });

    return instances;
  }

  // Générer les instances trimestrielles
  private static generateQuarterlyInstances(classFee: ClassFee): FeeInstance[] {
    const instances: FeeInstance[] = [];
    const quarters = [
      { period: "1er Trimestre", dueDate: "2024-10-15" },
      { period: "2ème Trimestre", dueDate: "2025-01-15" },
      { period: "3ème Trimestre", dueDate: "2025-04-15" }
    ];

    quarters.forEach((quarter, index) => {
      instances.push({
        id: `fi_${classFee.id}_q${index + 1}`,
        classFeeId: classFee.id,
        className: classFee.className,
        feeType: classFee.feeType,
        amount: classFee.amount,
        dueDate: quarter.dueDate,
        period: quarter.period,
        academicYear: classFee.academicYear,
        isActive: true
      });
    });

    return instances;
  }

  // Générer les instances semestrielles
  private static generateSemesterInstances(classFee: ClassFee): FeeInstance[] {
    const instances: FeeInstance[] = [];
    const semesters = [
      { period: "1er Semestre", dueDate: "2024-11-15" },
      { period: "2ème Semestre", dueDate: "2025-03-15" }
    ];

    semesters.forEach((semester, index) => {
      instances.push({
        id: `fi_${classFee.id}_s${index + 1}`,
        classFeeId: classFee.id,
        className: classFee.className,
        feeType: classFee.feeType,
        amount: classFee.amount,
        dueDate: semester.dueDate,
        period: semester.period,
        academicYear: classFee.academicYear,
        isActive: true
      });
    });

    return instances;
  }

  // Générer l'instance annuelle
  private static generateAnnualInstances(classFee: ClassFee): FeeInstance[] {
    return [{
      id: `fi_${classFee.id}_annual`,
      classFeeId: classFee.id,
      className: classFee.className,
      feeType: classFee.feeType,
      amount: classFee.amount,
      dueDate: classFee.dueDate || "2024-10-15",
      period: `Année ${classFee.academicYear}`,
      academicYear: classFee.academicYear,
      isActive: true
    }];
  }

  // Créer automatiquement les paiements d'élèves pour toutes les instances d'un frais de classe
  static createStudentPaymentsForClassFee(classFee: ClassFee): StudentPayment[] {
    const feeInstances = this.generateFeeInstances(classFee);
    const studentsInClass = this.getStudentProfiles().filter(
      student => student.className === classFee.className
    );

    const payments: StudentPayment[] = [];

    feeInstances.forEach(instance => {
      studentsInClass.forEach(student => {
        payments.push({
          id: `sp_${instance.id}_${student.id}`,
          studentId: student.id,
          studentName: student.name,
          feeInstanceId: instance.id,
          classFeeId: classFee.id,
          status: 'PENDING',
          remainingAmount: instance.amount
        });
      });
    });

    return payments;
  }

  // === MÉTHODES DE MODIFICATION ===

  // Modifier un frais de classe (affecte tous les élèves de la classe)
  static updateClassFee(classFeeId: string, updates: Partial<ClassFee>): ClassFee | null {
    // Dans une vraie application, ceci serait une mise à jour en base de données
    const classFees = this.getClassFees();
    const feeIndex = classFees.findIndex(fee => fee.id === classFeeId);
    
    if (feeIndex === -1) {
      console.error(`Frais de classe non trouvé: ${classFeeId}`);
      return null;
    }

    const originalFee = classFees[feeIndex];
    const updatedFee: ClassFee = {
      ...originalFee,
      ...updates,
      id: classFeeId, // S'assurer que l'ID ne change pas
    };

    console.log('Frais de classe modifié:', updatedFee);

    // Si le montant change, il faut mettre à jour tous les paiements pendants
    if (updates.amount && updates.amount !== originalFee.amount) {
      this.updatePendingPaymentsForClassFee(classFeeId, updates.amount);
    }

    // Si la récurrence change, il faut régénérer les instances
    if (updates.isRecurring !== undefined || updates.recurringType || updates.dueDayOfMonth) {
      this.regenerateFeeInstancesForClassFee(updatedFee);
    }

    return updatedFee;
  }

  // Modifier un paiement individuel d'élève
  static updateStudentPayment(paymentId: string, updates: Partial<StudentPayment>): StudentPayment | null {
    // Dans une vraie application, ceci serait une mise à jour en base de données
    console.log(`Mise à jour du paiement ${paymentId}:`, updates);
    
    // Simulation d'une mise à jour réussie
    const mockUpdatedPayment: StudentPayment = {
      id: paymentId,
      studentId: "std_001", // Exemple
      studentName: "Mukendi Jean",
      feeInstanceId: "fi_example",
      classFeeId: "cf_example",
      status: 'PENDING',
      remainingAmount: 50000,
      ...updates
    };

    return mockUpdatedPayment;
  }

  // Modifier un frais individuel d'élève (pour la compatibilité avec l'ancien système)
  static updateStudentFee(feeId: string, updates: Partial<StudentFee>): StudentFee | null {
    const fees = this.getStudentFees();
    const feeIndex = fees.findIndex(fee => fee.id === feeId);
    
    if (feeIndex === -1) {
      console.error(`Frais d'élève non trouvé: ${feeId}`);
      return null;
    }

    const originalFee = fees[feeIndex];
    const updatedFee: StudentFee = {
      ...originalFee,
      ...updates,
      id: feeId, // S'assurer que l'ID ne change pas
    };

    console.log('Frais d\'élève modifié:', updatedFee);
    return updatedFee;
  }

  // Mettre à jour tous les paiements pendants d'un frais de classe
  private static updatePendingPaymentsForClassFee(classFeeId: string, newAmount: number): void {
    // Dans une vraie application, ceci serait une requête SQL comme :
    // UPDATE student_payments SET remainingAmount = newAmount 
    // WHERE classFeeId = classFeeId AND status IN ('PENDING', 'OVERDUE')
    
    console.log(`Mise à jour des paiements pendants pour le frais ${classFeeId} avec le nouveau montant: ${newAmount}`);
  }

  // Régénérer les instances de frais pour un frais de classe modifié
  private static regenerateFeeInstancesForClassFee(classFee: ClassFee): void {
    // Dans une vraie application, ceci impliquerait :
    // 1. Marquer les anciennes instances comme inactives
    // 2. Générer de nouvelles instances avec les nouveaux paramètres
    // 3. Créer les nouveaux paiements d'élèves si nécessaire
    
    console.log(`Régénération des instances de frais pour: ${classFee.id}`);
    const newInstances = this.generateFeeInstances(classFee);
    console.log('Nouvelles instances générées:', newInstances);
  }

  // Supprimer un frais de classe (avec confirmation)
  static deleteClassFee(classFeeId: string, force: boolean = false): boolean {
    const classFee = this.getClassFees().find(fee => fee.id === classFeeId);
    if (!classFee) {
      console.error(`Frais de classe non trouvé: ${classFeeId}`);
      return false;
    }

    // Vérifier s'il y a des paiements existants
    const hasPayments = this.hasExistingPayments(classFeeId);
    
    if (hasPayments && !force) {
      console.warn(`Impossible de supprimer le frais ${classFeeId} : des paiements existent. Utilisez force=true pour forcer la suppression.`);
      return false;
    }

    // Dans une vraie application, ceci supprimerait :
    // 1. Le frais de classe
    // 2. Toutes les instances associées
    // 3. Tous les paiements d'élèves associés (ou les marquer comme annulés)
    
    console.log(`Frais de classe supprimé: ${classFeeId}`);
    return true;
  }

  // Vérifier s'il existe des paiements pour un frais de classe
  private static hasExistingPayments(classFeeId: string): boolean {
    // Dans une vraie application, ceci serait une requête SQL
    // SELECT COUNT(*) FROM student_payments WHERE classFeeId = classFeeId AND paidAmount > 0
    
    // Simulation : supposons qu'il y a des paiements s'il s'agit d'un frais ancien
    return classFeeId.includes('tuition') || classFeeId.includes('transport');
  }

  // Dupliquer un frais de classe vers une autre classe
  static duplicateClassFeeToClass(sourceFeeId: string, targetClassName: string): ClassFee | null {
    const sourceFee = this.getClassFees().find(fee => fee.id === sourceFeeId);
    if (!sourceFee) {
      console.error(`Frais source non trouvé: ${sourceFeeId}`);
      return null;
    }

    const duplicatedFee: ClassFee = {
      ...sourceFee,
      id: `cf_${Date.now()}_duplicate`,
      className: targetClassName,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Administration (Dupliqué)'
    };

    console.log(`Frais dupliqué vers ${targetClassName}:`, duplicatedFee);
    return duplicatedFee;
  }
}

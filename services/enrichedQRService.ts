// Service pour la gestion des QR codes enrichis des cartes d'élèves
export interface StudentBasicInfo {
  id: string;
  studentId: string;
  name: string;
  class: string;
  school: string;
  admissionNumber: string;
  academicYear: string;
  issueDate: string;
  photoUrl?: string;
}

export interface StudentAcademicInfo {
  currentTerm: string;
  subjects: Array<{
    name: string;
    teacher: string;
    coefficient: number;
  }>;
  attendance: {
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
  behavior: {
    conduct: 'Excellent' | 'Bien' | 'Satisfaisant' | 'Insuffisant';
    disciplinePoints: number;
    observations: string[];
  };
}

export interface StudentResults {
  term: string;
  year: string;
  subjects: Array<{
    name: string;
    grade: number;
    coefficient: number;
    teacher: string;
    comment?: string;
  }>;
  termAverage: number;
  yearAverage: number;
  rank: {
    termRank: number;
    yearRank: number;
    totalStudents: number;
  };
  mentions: string[];
  generalComment: string;
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'exam' | 'event' | 'holiday';
  publishDate: string;
  targetAudience: 'all' | 'parents' | 'students' | 'teachers';
  priority: 'low' | 'medium' | 'high';
  validUntil?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface StudentFinancialInfo {
  fees: {
    totalAnnual: number;
    paid: number;
    pending: number;
    dueDate: string;
  };
  paymentHistory: Array<{
    date: string;
    amount: number;
    reference: string;
    method: string;
  }>;
  scholarships?: Array<{
    name: string;
    amount: number;
    period: string;
  }>;
}

export interface StudentContactInfo {
  student: {
    phone?: string;
    email?: string;
  };
  parents: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    profession?: string;
  }>;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
}

export interface EnrichedQRData {
  basic: StudentBasicInfo;
  academic?: StudentAcademicInfo;
  results?: StudentResults;
  announcements?: SchoolAnnouncement[];
  financial?: StudentFinancialInfo;
  contacts?: StudentContactInfo;
  metadata: {
    qrType: 'basic' | 'results' | 'announcement' | 'complete';
    generatedAt: string;
    validUntil?: string;
    schoolCode: string;
    securityHash: string;
  };
}

export class EnrichedQRService {
  private static schoolCode = 'MASOMO-PRO-2025';
  
  // Données mockées pour démonstration
  private static mockStudentData = {
    academic: {
      currentTerm: 'Trimestre 2',
      subjects: [
        { name: 'Mathématiques', teacher: 'Prof. Mukendi', coefficient: 4 },
        { name: 'Français', teacher: 'Prof. Kabila', coefficient: 3 },
        { name: 'Sciences', teacher: 'Prof. Tshisekedi', coefficient: 3 },
        { name: 'Histoire-Géo', teacher: 'Prof. Mbuyi', coefficient: 2 },
        { name: 'Anglais', teacher: 'Prof. Ngozi', coefficient: 2 },
        { name: 'Éducation Physique', teacher: 'Prof. Kiala', coefficient: 1 }
      ],
      attendance: {
        present: 85,
        absent: 8,
        late: 12,
        percentage: 89.5
      },
      behavior: {
        conduct: 'Bien' as const,
        disciplinePoints: 85,
        observations: ['Élève participatif', 'Bonne attitude en classe']
      }
    },
    results: {
      term: 'Trimestre 2',
      year: '2024-2025',
      subjects: [
        { name: 'Mathématiques', grade: 14.5, coefficient: 4, teacher: 'Prof. Mukendi', comment: 'Bon travail, continue' },
        { name: 'Français', grade: 16.0, coefficient: 3, teacher: 'Prof. Kabila', comment: 'Excellente expression écrite' },
        { name: 'Sciences', grade: 13.8, coefficient: 3, teacher: 'Prof. Tshisekedi', comment: 'Améliorer les expériences' },
        { name: 'Histoire-Géo', grade: 15.2, coefficient: 2, teacher: 'Prof. Mbuyi', comment: 'Bonne mémorisation' },
        { name: 'Anglais', grade: 12.5, coefficient: 2, teacher: 'Prof. Ngozi', comment: 'Travailler la prononciation' },
        { name: 'Éducation Physique', grade: 17.0, coefficient: 1, teacher: 'Prof. Kiala', comment: 'Très sportif' }
      ],
      termAverage: 14.8,
      yearAverage: 14.5,
      rank: {
        termRank: 8,
        yearRank: 12,
        totalStudents: 45
      },
      mentions: ['Tableau d\'honneur', 'Félicitations du conseil de classe'],
      generalComment: 'Bon élève, sérieux et appliqué. Poursuivre dans cette voie.'
    },
    financial: {
      fees: {
        totalAnnual: 500000,
        paid: 350000,
        pending: 150000,
        dueDate: '2025-03-15'
      },
      paymentHistory: [
        { date: '2024-09-15', amount: 200000, reference: 'PAY-001', method: 'Mobile Money' },
        { date: '2024-12-10', amount: 150000, reference: 'PAY-002', method: 'Espèces' }
      ],
      scholarships: [
        { name: 'Bourse d\'Excellence', amount: 100000, period: '2024-2025' }
      ]
    },
    contacts: {
      student: {
        phone: '+243 987 654 321',
        email: 'marie.kabila@student.masomopro.com'
      },
      parents: [
        {
          name: 'Jean Kabila',
          relationship: 'Père',
          phone: '+243 123 456 789',
          email: 'jean.kabila@gmail.com',
          address: 'Avenue Mobutu, Gombe, Kinshasa',
          profession: 'Ingénieur'
        },
        {
          name: 'Marie Mukendi',
          relationship: 'Mère',
          phone: '+243 987 123 456',
          email: 'marie.mukendi@gmail.com',
          profession: 'Enseignante'
        }
      ],
      emergencyContacts: [
        { name: 'Dr. Tshisekedi', phone: '+243 555 111 222', relationship: 'Médecin de famille' },
        { name: 'Uncle Paul', phone: '+243 444 333 555', relationship: 'Oncle' }
      ]
    }
  };

  private static currentAnnouncements: SchoolAnnouncement[] = [
    {
      id: 'ANN-2025-001',
      title: 'Résultats du Trimestre 2',
      content: 'Les résultats du deuxième trimestre sont disponibles. Les bulletins seront distribués vendredi 24 janvier. Réunion parents-professeurs le samedi 25 janvier à 9h.',
      type: 'exam',
      publishDate: '2025-01-20',
      targetAudience: 'all',
      priority: 'high',
      validUntil: '2025-01-30'
    },
    {
      id: 'ANN-2025-002',
      title: 'Journée Portes Ouvertes',
      content: 'Notre école organise une journée portes ouvertes le samedi 1er février de 8h à 16h. Venez découvrir nos programmes et nos installations.',
      type: 'event',
      publishDate: '2025-01-18',
      targetAudience: 'all',
      priority: 'medium',
      validUntil: '2025-02-01'
    },
    {
      id: 'ANN-2025-003',
      title: 'Rappel Frais Scolaires',
      content: 'Rappel: Les frais du trimestre 3 sont dus avant le 15 mars. Possibilité de paiement échelonné. Contactez la comptabilité.',
      type: 'general',
      publishDate: '2025-01-15',
      targetAudience: 'parents',
      priority: 'medium',
      validUntil: '2025-03-15'
    }
  ];

  // Générer un hash de sécurité simple
  private static generateSecurityHash(data: any): string {
    const str = JSON.stringify(data) + this.schoolCode;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Créer un QR code basique (identification simple)
  static createBasicQR(student: any): EnrichedQRData {
    const basic: StudentBasicInfo = {
      id: student.id,
      studentId: student.studentId || student.idNumber,
      name: student.studentName,
      class: student.className,
      school: 'École Masomo Pro',
      admissionNumber: student.idNumber,
      academicYear: '2024-2025',
      issueDate: student.issueDate || new Date().toISOString().split('T')[0],
      photoUrl: student.photoUrl
    };

    const qrData: EnrichedQRData = {
      basic,
      metadata: {
        qrType: 'basic',
        generatedAt: new Date().toISOString(),
        schoolCode: this.schoolCode,
        securityHash: this.generateSecurityHash(basic)
      }
    };

    return qrData;
  }

  // Créer un QR code avec résultats (pour les proclamations)
  static createResultsQR(student: any): EnrichedQRData {
    const basic = this.createBasicQR(student).basic;
    const results = this.mockStudentData.results;
    const academic = this.mockStudentData.academic;

    const qrData: EnrichedQRData = {
      basic,
      academic,
      results,
      metadata: {
        qrType: 'results',
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Valide 30 jours
        schoolCode: this.schoolCode,
        securityHash: this.generateSecurityHash({ basic, academic, results })
      }
    };

    return qrData;
  }

  // Créer un QR code avec annonces
  static createAnnouncementQR(student: any): EnrichedQRData {
    const basic = this.createBasicQR(student).basic;
    const announcements = this.currentAnnouncements.filter(
      ann => ann.targetAudience === 'all' || ann.targetAudience === 'students'
    );

    const qrData: EnrichedQRData = {
      basic,
      announcements,
      metadata: {
        qrType: 'announcement',
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Valide 7 jours
        schoolCode: this.schoolCode,
        securityHash: this.generateSecurityHash({ basic, announcements })
      }
    };

    return qrData;
  }

  // Créer un QR code complet (toutes les informations)
  static createCompleteQR(student: any): EnrichedQRData {
    const basic = this.createBasicQR(student).basic;
    const academic = this.mockStudentData.academic;
    const results = this.mockStudentData.results;
    const financial = this.mockStudentData.financial;
    const contacts = this.mockStudentData.contacts;
    const announcements = this.currentAnnouncements;

    const qrData: EnrichedQRData = {
      basic,
      academic,
      results,
      financial,
      contacts,
      announcements,
      metadata: {
        qrType: 'complete',
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Valide 90 jours
        schoolCode: this.schoolCode,
        securityHash: this.generateSecurityHash({ basic, academic, results, financial, contacts, announcements })
      }
    };

    return qrData;
  }

  // Vérifier la validité d'un QR code
  static verifyQRData(qrData: EnrichedQRData): { valid: boolean; reason?: string } {
    // Vérifier le code école
    if (qrData.metadata.schoolCode !== this.schoolCode) {
      return { valid: false, reason: 'Code école invalide' };
    }

    // Vérifier la date d'expiration
    if (qrData.metadata.validUntil) {
      const now = new Date();
      const validUntil = new Date(qrData.metadata.validUntil);
      if (now > validUntil) {
        return { valid: false, reason: 'QR Code expiré' };
      }
    }

    // Vérifier le hash de sécurité (simplifié pour la démo)
    const { securityHash, ...metadataWithoutHash } = qrData.metadata;
    const dataToHash = {
      ...qrData,
      metadata: metadataWithoutHash
    };
    const expectedHash = this.generateSecurityHash(dataToHash);
    
    if (qrData.metadata.securityHash !== expectedHash) {
      return { valid: false, reason: 'Hash de sécurité invalide' };
    }

    return { valid: true };
  }

  // Générer l'URL du QR code selon le type
  static generateQRCodeDataURL(qrData: EnrichedQRData, size: number = 150): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const QRCode = (await import('qrcode')).default;
        const qrString = JSON.stringify(qrData);
        
        const dataURL = await QRCode.toDataURL(qrString, {
          width: size,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M' // Niveau de correction d'erreur moyen
        });
        
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Créer un QR code selon le contexte
  static createContextualQR(
    student: any, 
    context: 'basic' | 'results' | 'announcement' | 'complete' = 'basic'
  ): EnrichedQRData {
    switch (context) {
      case 'results':
        return this.createResultsQR(student);
      case 'announcement':
        return this.createAnnouncementQR(student);
      case 'complete':
        return this.createCompleteQR(student);
      default:
        return this.createBasicQR(student);
    }
  }

  // Formatter les données pour l'affichage
  static formatQRDataForDisplay(qrData: EnrichedQRData): any {
    const formatted: any = {
      basic: qrData.basic,
      metadata: qrData.metadata
    };

    if (qrData.results) {
      formatted.results = {
        ...qrData.results,
        formattedAverage: `${qrData.results.termAverage.toFixed(1)}/20`,
        formattedRank: `${qrData.results.rank.termRank}/${qrData.results.rank.totalStudents}`
      };
    }

    if (qrData.academic) {
      formatted.academic = {
        ...qrData.academic,
        formattedAttendance: `${qrData.academic.attendance.percentage}% (${qrData.academic.attendance.present}P/${qrData.academic.attendance.absent}A)`
      };
    }

    if (qrData.financial) {
      formatted.financial = {
        ...qrData.financial,
        formattedBalance: `${qrData.financial.fees.paid.toLocaleString()} FC payés / ${qrData.financial.fees.totalAnnual.toLocaleString()} FC total`,
        formattedPending: `${qrData.financial.fees.pending.toLocaleString()} FC restants`
      };
    }

    return formatted;
  }
}

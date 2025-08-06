// Service de gestion QR Code pour Masomo Pro
import * as CryptoJS from 'crypto-js';

export interface QRCodeData {
  id: string;
  userId: string;
  userType: 'STUDENT' | 'STAFF';
  schoolId: string;
  validUntil: string;
  hash: string;
}

export interface QRScanResult {
  success: boolean;
  studentId?: string;
  studentName?: string;
  error?: string;
  confidence: number;
}

export interface StudentQRCard {
  studentId: string;
  studentName: string;
  className: string;
  qrCode: string;
  generatedAt: string;
  validUntil: string;
}

export class QRCodeService {
  private static readonly SECRET_KEY = process.env.NEXT_PUBLIC_QR_SECRET || 'masomo_pro_qr_secret_2025';
  private static readonly SCHOOL_ID = 'masomo_pro_school';
  private static readonly QR_PREFIX = 'MASOMO';

  /**
   * Générer un QR code sécurisé pour un étudiant
   */
  static generateStudentQR(studentId: string, studentName: string, className: string): StudentQRCard {
    const now = new Date();
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1); // Valide 1 an

    const qrData: QRCodeData = {
      id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: studentId,
      userType: 'STUDENT',
      schoolId: this.SCHOOL_ID,
      validUntil: validUntil.toISOString(),
      hash: ''
    };

    // Générer le hash de sécurité
    const dataToHash = `${qrData.id}${qrData.userId}${qrData.userType}${qrData.schoolId}${qrData.validUntil}`;
    qrData.hash = CryptoJS.SHA256(dataToHash + this.SECRET_KEY).toString();

    // Encoder en base64
    const qrString = `${this.QR_PREFIX}:${btoa(JSON.stringify(qrData))}`;

    return {
      studentId,
      studentName,
      className,
      qrCode: qrString,
      generatedAt: now.toISOString(),
      validUntil: validUntil.toISOString()
    };
  }

  /**
   * Scanner et valider un QR code
   */
  static async scanQRCode(qrString: string): Promise<QRScanResult> {
    try {
      // Vérifier le préfixe
      if (!qrString.startsWith(`${this.QR_PREFIX}:`)) {
        return {
          success: false,
          error: 'QR code invalide - Format non reconnu',
          confidence: 0
        };
      }

      // Extraire et décoder les données
      const encodedData = qrString.replace(`${this.QR_PREFIX}:`, '');
      const decodedData = atob(encodedData);
      const qrData: QRCodeData = JSON.parse(decodedData);

      // Valider la structure
      if (!this.validateQRStructure(qrData)) {
        return {
          success: false,
          error: 'QR code invalide - Structure corrompue',
          confidence: 0
        };
      }

      // Vérifier la date d'expiration
      if (new Date(qrData.validUntil) < new Date()) {
        return {
          success: false,
          error: 'QR code expiré',
          confidence: 0
        };
      }

      // Vérifier le hash de sécurité
      const dataToHash = `${qrData.id}${qrData.userId}${qrData.userType}${qrData.schoolId}${qrData.validUntil}`;
      const expectedHash = CryptoJS.SHA256(dataToHash + this.SECRET_KEY).toString();
      
      if (qrData.hash !== expectedHash) {
        return {
          success: false,
          error: 'QR code invalide - Sécurité compromise',
          confidence: 0
        };
      }

      // Vérifier que c'est notre école
      if (qrData.schoolId !== this.SCHOOL_ID) {
        return {
          success: false,
          error: 'QR code d\'une autre école',
          confidence: 0
        };
      }

      // Récupérer les infos de l'étudiant (simulé)
      const studentInfo = await this.getStudentInfo(qrData.userId);
      if (!studentInfo) {
        return {
          success: false,
          error: 'Étudiant non trouvé dans la base de données',
          confidence: 0
        };
      }

      return {
        success: true,
        studentId: qrData.userId,
        studentName: studentInfo.name,
        confidence: 100 // QR code valide = 100% de confiance
      };

    } catch (error) {
      return {
        success: false,
        error: `Erreur de scan: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        confidence: 0
      };
    }
  }

  /**
   * Valider la structure d'un QR code
   */
  private static validateQRStructure(qrData: any): qrData is QRCodeData {
    return (
      qrData &&
      typeof qrData.id === 'string' &&
      typeof qrData.userId === 'string' &&
      typeof qrData.userType === 'string' &&
      typeof qrData.schoolId === 'string' &&
      typeof qrData.validUntil === 'string' &&
      typeof qrData.hash === 'string' &&
      (qrData.userType === 'STUDENT' || qrData.userType === 'STAFF')
    );
  }

  /**
   * Simuler la récupération d'infos étudiant
   */
  private static async getStudentInfo(studentId: string): Promise<{name: string, className: string} | null> {
    // Simulation - À remplacer par un vrai appel API
    const mockStudents: Record<string, {name: string, className: string}> = {
      'STU001': { name: 'Jean Mukamba', className: '6ème A' },
      'STU002': { name: 'Marie Kabongo', className: '6ème A' },
      'STU003': { name: 'Paul Mbuyi', className: '6ème B' },
      'STU004': { name: 'Grace Tshimanga', className: '7ème A' },
      'STU005': { name: 'David Kasongo', className: '7ème B' }
    };

    return mockStudents[studentId] || null;
  }

  /**
   * Générer des QR codes en masse pour une classe
   */
  static generateClassQRCodes(className: string, students: Array<{id: string, name: string}>): StudentQRCard[] {
    return students.map(student => 
      this.generateStudentQR(student.id, student.name, className)
    );
  }

  /**
   * Valider un QR code sans scan (pour tests)
   */
  static validateQRCode(qrString: string): { valid: boolean, data?: QRCodeData, error?: string } {
    try {
      if (!qrString.startsWith(`${this.QR_PREFIX}:`)) {
        return { valid: false, error: 'Format invalide' };
      }

      const encodedData = qrString.replace(`${this.QR_PREFIX}:`, '');
      const decodedData = atob(encodedData);
      const qrData: QRCodeData = JSON.parse(decodedData);

      if (!this.validateQRStructure(qrData)) {
        return { valid: false, error: 'Structure invalide' };
      }

      return { valid: true, data: qrData };
    } catch (error) {
      return { valid: false, error: 'Erreur de décodage' };
    }
  }

  /**
   * Obtenir les statistiques des QR codes
   */
  static getQRStats(): {
    totalGenerated: number;
    totalScanned: number;
    successfulScans: number;
    failedScans: number;
    averageConfidence: number;
  } {
    // Simulation - À remplacer par de vraies données
    return {
      totalGenerated: 150,
      totalScanned: 89,
      successfulScans: 85,
      failedScans: 4,
      averageConfidence: 98.5
    };
  }

  /**
   * Générer un URL de QR code pour affichage
   */
  static generateQRCodeURL(qrString: string, size: number = 200): string {
    // Utilise un service public pour générer l'image QR
    const encodedQR = encodeURIComponent(qrString);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedQR}&format=png&margin=10`;
  }

  /**
   * Exporter des QR codes pour impression
   */
  static exportQRCodesForPrint(qrCards: StudentQRCard[]): {
    csvData: string;
    htmlCards: string;
  } {
    // Export CSV
    const csvHeaders = ['ID Étudiant', 'Nom', 'Classe', 'QR Code', 'Date Génération', 'Valide Jusqu\'au'];
    const csvRows = qrCards.map(card => [
      card.studentId,
      card.studentName,
      card.className,
      card.qrCode,
      new Date(card.generatedAt).toLocaleDateString('fr-FR'),
      new Date(card.validUntil).toLocaleDateString('fr-FR')
    ]);
    const csvData = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');

    // Export HTML pour impression de cartes
    const htmlCards = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cartes QR - Masomo Pro</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .card { 
          width: 8.5cm; height: 5.4cm; border: 2px solid #333; 
          margin: 10px; padding: 15px; display: inline-block; 
          page-break-inside: avoid; text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; border-radius: 10px;
        }
        .qr { margin: 10px 0; }
        .student-name { font-size: 16px; font-weight: bold; margin: 5px 0; }
        .student-id { font-size: 12px; opacity: 0.9; }
        .school-name { font-size: 14px; margin-bottom: 10px; }
        .footer { font-size: 10px; margin-top: 10px; opacity: 0.8; }
        @media print { 
          body { margin: 0; } 
          .card { margin: 5px; }
        }
      </style>
    </head>
    <body>
      ${qrCards.map(card => `
        <div class="card">
          <div class="school-name">🎓 MASOMO PRO</div>
          <div class="student-name">${card.studentName}</div>
          <div class="student-id">${card.studentId} • ${card.className}</div>
          <div class="qr">
            <img src="${this.generateQRCodeURL(card.qrCode, 120)}" alt="QR Code" />
          </div>
          <div class="footer">
            Valide jusqu'au ${new Date(card.validUntil).toLocaleDateString('fr-FR')}
          </div>
        </div>
      `).join('')}
    </body>
    </html>`;

    return { csvData, htmlCards };
  }

  /**
   * Détecter le type de scanner disponible
   */
  static async detectScannerCapabilities(): Promise<{
    hasCamera: boolean;
    hasWebRTC: boolean;
    supportedFormats: string[];
  }> {
    const capabilities = {
      hasCamera: false,
      hasWebRTC: !!navigator.mediaDevices,
      supportedFormats: ['QR Code', 'Data Matrix', 'Code 128']
    };

    if (typeof navigator !== 'undefined' && navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        capabilities.hasCamera = devices.some(device => device.kind === 'videoinput');
      } catch (error) {
        console.warn('Impossible de détecter les caméras:', error);
      }
    }

    return capabilities;
  }
}

// Service de gestion biométrique pour Masomo Pro
import { BiometricNotificationService } from './biometricNotificationService';

export interface BiometricDevice {
  id: string;
  name: string;
  type: 'FINGERPRINT' | 'FACE' | 'IRIS' | 'VOICE';
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  location: string;
  lastSync: string;
}

export interface BiometricRecord {
  id: string;
  userId: string;
  userName: string;
  userType: 'STUDENT' | 'STAFF';
  deviceId: string;
  timestamp: string;
  biometricType: 'FINGERPRINT' | 'FACE' | 'IRIS' | 'VOICE';
  confidence: number; // 0-100
  status: 'SUCCESS' | 'FAILED' | 'RETRY';
  location: string;
  metadata?: {
    temperature?: number;
    maskDetected?: boolean;
    quality?: number;
  };
}

export interface BiometricTemplate {
  id: string;
  userId: string;
  userType: 'STUDENT' | 'STAFF';
  biometricType: 'FINGERPRINT' | 'FACE' | 'IRIS' | 'VOICE';
  template: string; // Template encodé
  quality: number;
  createdAt: string;
  isActive: boolean;
}

export class BiometricService {
  private static devices: BiometricDevice[] = [
    {
      id: "fp001",
      name: "Lecteur Entrée Principale",
      type: "FINGERPRINT",
      status: "ONLINE",
      location: "ENTREE_PRINCIPALE",
      lastSync: new Date().toISOString()
    },
    {
      id: "face001", 
      name: "Caméra Bureau Direction",
      type: "FACE",
      status: "ONLINE", 
      location: "BUREAU_DIRECTION",
      lastSync: new Date().toISOString()
    }
  ];

  private static records: BiometricRecord[] = [];
  private static templates: BiometricTemplate[] = [];

  // Vérifier le support WebAuthn
  static isWebAuthnSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.PublicKeyCredential && navigator.credentials && navigator.credentials.create);
  }

  // Méthodes Web API (pour navigateurs modernes)
  static async registerWebAuthnBiometric(userId: string, userType: 'STUDENT' | 'STAFF', userName?: string): Promise<{success: boolean, credential?: any, error?: string}> {
    try {
      if (!window.PublicKeyCredential) {
        return { success: false, error: "WebAuthn non supporté sur cet appareil" };
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const displayName = userName || `${userType} ${userId}`;

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "Masomo Pro", id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(userId),
            name: displayName,
            displayName: displayName
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "preferred"
          },
          timeout: 60000
        }
      }) as PublicKeyCredential;

      if (credential) {
        // Sauvegarder le template biométrique
        await this.saveWebAuthnTemplate(userId, credential);
        
        // Notification d'enrôlement réussi
        BiometricNotificationService.notifyEnrollment(userId, userType, true, 'webauthn_browser');
        
        return { success: true, credential };
      }

      // Notification d'enrôlement échoué
      BiometricNotificationService.notifyEnrollment(userId, userType, false, 'webauthn_browser');
      return { success: false, error: "Échec de l'enregistrement biométrique" };
    } catch (error) {
      console.error("Erreur WebAuthn:", error);
      
      // Notification d'erreur d'enrôlement
      BiometricNotificationService.notifyEnrollment(userId, userType, false, 'webauthn_browser');
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  }

  static async authenticateWebAuthnBiometric(userId: string): Promise<{success: boolean, confidence?: number, error?: string}> {
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const userTemplates = this.templates.filter(t => t.userId === userId && t.isActive);
      if (userTemplates.length === 0) {
        // Notification d'échec - pas de template
        BiometricNotificationService.notifyVerification(userId, 'STUDENT', false, 0, 'webauthn_browser');
        return { success: false, error: "Aucun template biométrique trouvé pour cet utilisateur" };
      }

      const allowCredentials = userTemplates.map(template => ({
        id: new TextEncoder().encode(template.id),
        type: "public-key" as const
      }));

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials,
          userVerification: "required",
          timeout: 60000
        }
      });

      if (assertion) {
        const confidence = 95; // WebAuthn est très fiable
        const userTemplate = userTemplates[0]; // Premier template trouvé
        
        // Enregistrer la tentative d'authentification
        const record: BiometricRecord = {
          id: `bio_${Date.now()}`,
          userId,
          userName: "Utilisateur", // À récupérer depuis la base de données
          userType: userTemplate.userType,
          deviceId: "web_browser",
          timestamp: new Date().toISOString(),
          biometricType: "FINGERPRINT", // WebAuthn peut être empreinte ou visage
          confidence,
          status: "SUCCESS",
          location: "WEB_BROWSER"
        };

        this.records.push(record);
        
        // Notification de vérification réussie
        BiometricNotificationService.notifyVerification(userId, userTemplate.userType, true, confidence, 'webauthn_browser');
        
        return { success: true, confidence };
      }

      // Notification de vérification échouée
      BiometricNotificationService.notifyVerification(userId, 'STUDENT', false, 0, 'webauthn_browser');
      return { success: false, error: "Authentification biométrique échouée" };
    } catch (error) {
      console.error("Erreur authentification WebAuthn:", error);
      
      // Notification d'erreur d'authentification
      BiometricNotificationService.notifyVerification(userId, 'STUDENT', false, 0, 'webauthn_browser');
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur d'authentification" 
      };
    }
  }

  // Méthodes pour hardware externe
  static async connectExternalDevice(deviceConfig: {
    type: 'FINGERPRINT' | 'FACE';
    endpoint: string;
    apiKey?: string;
  }): Promise<{success: boolean, deviceId?: string, error?: string}> {
    try {
      // Simulation d'une connexion à un device externe via API REST
      const response = await fetch(`${deviceConfig.endpoint}/api/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': deviceConfig.apiKey ? `Bearer ${deviceConfig.apiKey}` : ''
        },
        body: JSON.stringify({
          school_id: "masomo_pro",
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        const deviceId = `ext_${Date.now()}`;
        
        // Ajouter le device à la liste
        this.devices.push({
          id: deviceId,
          name: `Device ${deviceConfig.type}`,
          type: deviceConfig.type,
          status: "ONLINE",
          location: "EXTERNE",
          lastSync: new Date().toISOString()
        });

        return { success: true, deviceId };
      }

      return { success: false, error: "Impossible de se connecter au device" };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur de connexion" 
      };
    }
  }

  static async enrollBiometricTemplate(
    userId: string,
    userType: 'STUDENT' | 'STAFF',
    biometricType: 'FINGERPRINT' | 'FACE',
    deviceId: string
  ): Promise<{success: boolean, templateId?: string, error?: string}> {
    try {
      // Simulation de l'enrôlement biométrique
      const templateId = `tpl_${userId}_${biometricType}_${Date.now()}`;
      
      const template: BiometricTemplate = {
        id: templateId,
        userId,
        userType,
        biometricType,
        template: `ENCODED_TEMPLATE_${Math.random().toString(36)}`, // Template simulé
        quality: Math.floor(Math.random() * 20) + 80, // Qualité 80-100
        createdAt: new Date().toISOString(),
        isActive: true
      };

      this.templates.push(template);
      
      return { success: true, templateId };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur d'enrôlement" 
      };
    }
  }

  static async verifyBiometric(
    userId: string,
    biometricData: string,
    deviceId: string
  ): Promise<{success: boolean, confidence?: number, record?: BiometricRecord, error?: string}> {
    try {
      // Simulation de la vérification biométrique
      const userTemplates = this.templates.filter(t => t.userId === userId && t.isActive);
      
      if (userTemplates.length === 0) {
        return { success: false, error: "Aucun template trouvé pour cet utilisateur" };
      }

      // Simulation d'un matching avec confidence variable
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100
      const isMatch = confidence > 75;

      const record: BiometricRecord = {
        id: `bio_${Date.now()}`,
        userId,
        userName: "Utilisateur", // À récupérer depuis la base
        userType: userTemplates[0].userType,
        deviceId,
        timestamp: new Date().toISOString(),
        biometricType: userTemplates[0].biometricType,
        confidence,
        status: isMatch ? "SUCCESS" : "FAILED",
        location: this.devices.find(d => d.id === deviceId)?.location || "UNKNOWN"
      };

      this.records.push(record);
      
      return { 
        success: isMatch, 
        confidence, 
        record,
        error: isMatch ? undefined : "Correspondance biométrique insuffisante"
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur de vérification" 
      };
    }
  }

  // Méthodes utilitaires
  static getDevices(): BiometricDevice[] {
    return [...this.devices];
  }

  static getRecentRecords(limit: number = 50): BiometricRecord[] {
    return this.records
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  static getUserTemplates(userId: string): BiometricTemplate[] {
    return this.templates.filter(t => t.userId === userId && t.isActive);
  }

  static getAttendanceFromBiometric(date?: string): {
    students: Array<{userId: string, checkIn: string, method: string}>,
    staff: Array<{userId: string, checkIn: string, method: string}>
  } {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const dayRecords = this.records.filter(r => 
      r.timestamp.startsWith(targetDate) && r.status === 'SUCCESS'
    );

    return {
      students: dayRecords
        .filter(r => r.userType === 'STUDENT')
        .map(r => ({
          userId: r.userId,
          checkIn: r.timestamp,
          method: `${r.biometricType}_${r.deviceId}`
        })),
      staff: dayRecords
        .filter(r => r.userType === 'STAFF')
        .map(r => ({
          userId: r.userId,
          checkIn: r.timestamp,
          method: `${r.biometricType}_${r.deviceId}`
        }))
    };
  }

  private static async saveWebAuthnTemplate(userId: string, credential: PublicKeyCredential): Promise<void> {
    const template: BiometricTemplate = {
      id: `webauthn_${userId}_${Date.now()}`,
      userId,
      userType: "STUDENT", // À déterminer selon le contexte
      biometricType: "FINGERPRINT", // WebAuthn peut être empreinte ou face
      template: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
      quality: 95,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    this.templates.push(template);
  }

  // Méthodes d'analyse et rapports
  static getBiometricStats(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const periodRecords = this.records.filter(r => {
      const recordDate = new Date(r.timestamp);
      return recordDate >= start && recordDate <= end;
    });

    const successfulAuths = periodRecords.filter(r => r.status === 'SUCCESS');
    const failedAuths = periodRecords.filter(r => r.status === 'FAILED');

    return {
      totalAttempts: periodRecords.length,
      successful: successfulAuths.length,
      failed: failedAuths.length,
      successRate: periodRecords.length > 0 ? (successfulAuths.length / periodRecords.length) * 100 : 0,
      averageConfidence: successfulAuths.length > 0 
        ? successfulAuths.reduce((sum, r) => sum + r.confidence, 0) / successfulAuths.length 
        : 0,
      byType: {
        fingerprint: periodRecords.filter(r => r.biometricType === 'FINGERPRINT').length,
        face: periodRecords.filter(r => r.biometricType === 'FACE').length,
        iris: periodRecords.filter(r => r.biometricType === 'IRIS').length,
        voice: periodRecords.filter(r => r.biometricType === 'VOICE').length
      },
      byUserType: {
        students: periodRecords.filter(r => r.userType === 'STUDENT').length,
        staff: periodRecords.filter(r => r.userType === 'STAFF').length
      }
    };
  }
}

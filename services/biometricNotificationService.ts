// services/biometricNotificationService.ts
export interface BiometricNotification {
  id: string;
  type: 'ENROLLMENT' | 'VERIFICATION' | 'ATTENDANCE' | 'SECURITY_ALERT';
  userId: string;
  userType: 'STUDENT' | 'STAFF';
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  message: string;
  timestamp: Date;
  metadata?: {
    classId?: string;
    deviceId?: string;
    confidenceScore?: number;
    location?: string;
    attendanceType?: 'CHECK_IN' | 'CHECK_OUT';
  };
}

export class BiometricNotificationService {
  private static notifications: BiometricNotification[] = [];
  private static listeners: ((notification: BiometricNotification) => void)[] = [];

  /**
   * Ajouter une notification biométrique
   */
  static addNotification(notification: Omit<BiometricNotification, 'id' | 'timestamp'>): void {
    const newNotification: BiometricNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    this.notifications.unshift(newNotification);
    
    // Limiter à 100 notifications max
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Notifier tous les listeners
    this.listeners.forEach(listener => listener(newNotification));

    // Log console pour le développement
    console.log(`🔐 Biometric Event: ${newNotification.type} - ${newNotification.status}`, newNotification);
  }

  /**
   * Notification d'enrôlement
   */
  static notifyEnrollment(userId: string, userType: 'STUDENT' | 'STAFF', success: boolean, deviceId?: string): void {
    this.addNotification({
      type: 'ENROLLMENT',
      userId,
      userType,
      status: success ? 'SUCCESS' : 'FAILED',
      message: success 
        ? `Enrôlement biométrique réussi pour ${userType.toLowerCase()} ${userId}`
        : `Échec de l'enrôlement biométrique pour ${userType.toLowerCase()} ${userId}`,
      metadata: { deviceId }
    });
  }

  /**
   * Notification de vérification
   */
  static notifyVerification(
    userId: string, 
    userType: 'STUDENT' | 'STAFF', 
    success: boolean, 
    confidenceScore?: number,
    deviceId?: string
  ): void {
    this.addNotification({
      type: 'VERIFICATION',
      userId,
      userType,
      status: success ? 'SUCCESS' : 'FAILED',
      message: success 
        ? `Vérification biométrique réussie pour ${userType.toLowerCase()} ${userId}${confidenceScore ? ` (${confidenceScore}%)` : ''}`
        : `Échec de vérification biométrique pour ${userType.toLowerCase()} ${userId}`,
      metadata: { deviceId, confidenceScore }
    });
  }

  /**
   * Notification de présence via biométrie
   */
  static notifyAttendance(
    userId: string,
    userType: 'STUDENT' | 'STAFF',
    success: boolean,
    classId?: string,
    attendanceType: 'CHECK_IN' | 'CHECK_OUT' = 'CHECK_IN',
    location?: string
  ): void {
    this.addNotification({
      type: 'ATTENDANCE',
      userId,
      userType,
      status: success ? 'SUCCESS' : 'FAILED',
      message: success 
        ? `Présence enregistrée par biométrie: ${userType.toLowerCase()} ${userId} (${attendanceType === 'CHECK_IN' ? 'Arrivée' : 'Départ'})`
        : `Échec d'enregistrement de présence pour ${userType.toLowerCase()} ${userId}`,
      metadata: { classId, attendanceType, location }
    });
  }

  /**
   * Alerte de sécurité
   */
  static notifySecurityAlert(
    userId: string,
    userType: 'STUDENT' | 'STAFF',
    alertType: 'MULTIPLE_FAILED_ATTEMPTS' | 'SUSPICIOUS_ACTIVITY' | 'DEVICE_TAMPER',
    details: string
  ): void {
    this.addNotification({
      type: 'SECURITY_ALERT',
      userId,
      userType,
      status: 'WARNING',
      message: `🚨 Alerte sécurité: ${details} pour ${userType.toLowerCase()} ${userId}`,
      metadata: { location: alertType }
    });
  }

  /**
   * Obtenir toutes les notifications
   */
  static getNotifications(limit?: number): BiometricNotification[] {
    return limit ? this.notifications.slice(0, limit) : [...this.notifications];
  }

  /**
   * Obtenir les notifications par type
   */
  static getNotificationsByType(type: BiometricNotification['type']): BiometricNotification[] {
    return this.notifications.filter(notif => notif.type === type);
  }

  /**
   * Obtenir les notifications par utilisateur
   */
  static getNotificationsByUser(userId: string): BiometricNotification[] {
    return this.notifications.filter(notif => notif.userId === userId);
  }

  /**
   * Obtenir les notifications récentes (dernières 24h)
   */
  static getRecentNotifications(): BiometricNotification[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return this.notifications.filter(notif => notif.timestamp > yesterday);
  }

  /**
   * Marquer une notification comme lue
   */
  static markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      // Vous pouvez ajouter une propriété 'read' si nécessaire
      console.log(`Notification ${notificationId} marquée comme lue`);
    }
  }

  /**
   * Supprimer une notification
   */
  static removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  /**
   * Vider toutes les notifications
   */
  static clearNotifications(): void {
    this.notifications = [];
  }

  /**
   * S'abonner aux nouvelles notifications
   */
  static subscribe(listener: (notification: BiometricNotification) => void): () => void {
    this.listeners.push(listener);
    
    // Retourner une fonction de désabonnement
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Obtenir les statistiques des notifications
   */
  static getNotificationStats(): {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    recent: number;
  } {
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let recent = 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.notifications.forEach(notif => {
      // Par type
      byType[notif.type] = (byType[notif.type] || 0) + 1;
      
      // Par statut
      byStatus[notif.status] = (byStatus[notif.status] || 0) + 1;
      
      // Récentes
      if (notif.timestamp > yesterday) {
        recent++;
      }
    });

    return {
      total: this.notifications.length,
      byType,
      byStatus,
      recent
    };
  }

  /**
   * Exporter les notifications (pour rapports)
   */
  static exportNotifications(format: 'JSON' | 'CSV' = 'JSON'): string {
    if (format === 'CSV') {
      const headers = ['ID', 'Type', 'UserID', 'UserType', 'Status', 'Message', 'Timestamp'];
      const rows = this.notifications.map(n => [
        n.id,
        n.type,
        n.userId,
        n.userType,
        n.status,
        n.message.replace(/,/g, ';'), // Échapper les virgules
        n.timestamp.toISOString()
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(this.notifications, null, 2);
  }

  /**
   * Simuler des notifications de test (pour développement)
   */
  static generateTestNotifications(): void {
    const testUsers = [
      { id: 'STU001', type: 'STUDENT' as const },
      { id: 'STU002', type: 'STUDENT' as const },
      { id: 'STAFF001', type: 'STAFF' as const }
    ];

    // Enrôlements
    testUsers.forEach(user => {
      this.notifyEnrollment(user.id, user.type, Math.random() > 0.2, 'device_001');
    });

    // Vérifications
    testUsers.forEach(user => {
      this.notifyVerification(user.id, user.type, Math.random() > 0.1, Math.floor(Math.random() * 40) + 60, 'device_001');
    });

    // Présences
    testUsers.filter(u => u.type === 'STUDENT').forEach(user => {
      this.notifyAttendance(user.id, user.type, true, 'class_001', 'CHECK_IN', 'Entrée principale');
    });

    // Alerte de sécurité (rare)
    if (Math.random() > 0.8) {
      this.notifySecurityAlert('STU001', 'STUDENT', 'MULTIPLE_FAILED_ATTEMPTS', 'Tentatives multiples d\'authentification échouées');
    }
  }
}

// Type guards pour TypeScript
export const isBiometricNotification = (obj: any): obj is BiometricNotification => {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.type === 'string' &&
         typeof obj.userId === 'string' &&
         typeof obj.userType === 'string' &&
         typeof obj.status === 'string' &&
         typeof obj.message === 'string' &&
         obj.timestamp instanceof Date;
};

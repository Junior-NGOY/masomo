import { useState, useEffect, useCallback } from 'react';
import { BiometricService } from '@/services/biometricService';
import { BiometricNotificationService, type BiometricNotification } from '@/services/biometricNotificationService';
import { toast } from 'sonner';

interface UseBiometricOptions {
  enableNotifications?: boolean;
  autoLoadStats?: boolean;
}

interface BiometricStats {
  totalEnrollments: number;
  successfulVerifications: number;
  failedVerifications: number;
  averageConfidence: number;
  devicesOnline: number;
  recentActivity: number;
}

export function useBiometric(options: UseBiometricOptions = {}) {
  const { enableNotifications = true, autoLoadStats = true } = options;

  // États
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [stats, setStats] = useState<BiometricStats | null>(null);
  const [notifications, setNotifications] = useState<BiometricNotification[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  // Vérifier le support WebAuthn au montage
  useEffect(() => {
    const supported = BiometricService.isWebAuthnSupported();
    setIsSupported(supported);
    
    if (autoLoadStats) {
      loadStats();
      loadDevices();
    }

    if (enableNotifications) {
      loadNotifications();
      
      // S'abonner aux nouvelles notifications
      const unsubscribe = BiometricNotificationService.subscribe((notification) => {
        setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Garder les 50 dernières
        
        // Toast pour les notifications importantes
        if (notification.type === 'SECURITY_ALERT') {
          toast.error(notification.message);
        }
      });

      return () => unsubscribe();
    }
  }, [autoLoadStats, enableNotifications]);

  // Charger les statistiques
  const loadStats = useCallback(async () => {
    try {
      const biometricStats = await BiometricService.getBiometricStats();
      const notificationStats = BiometricNotificationService.getNotificationStats();
      const devices = BiometricService.getDevices();
      
      setStats({
        totalEnrollments: biometricStats.totalAttempts || 0,
        successfulVerifications: biometricStats.successful || 0,
        failedVerifications: biometricStats.failed || 0,
        averageConfidence: biometricStats.averageConfidence || 0,
        devicesOnline: devices.filter((d: any) => d.status === 'ONLINE').length || 0,
        recentActivity: notificationStats.recent || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }, []);

  // Charger les appareils
  const loadDevices = useCallback(async () => {
    try {
      const deviceList = BiometricService.getDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error('Erreur lors du chargement des appareils:', error);
    }
  }, []);

  // Charger les notifications
  const loadNotifications = useCallback(() => {
    const recentNotifications = BiometricNotificationService.getNotifications(50);
    setNotifications(recentNotifications);
  }, []);

  // Enrôlement biométrique
  const enroll = useCallback(async (userId: string, userType: 'STUDENT' | 'STAFF', userName?: string) => {
    if (!isSupported) {
      toast.error('WebAuthn non supporté sur cet appareil');
      return { success: false, error: 'WebAuthn non supporté' };
    }

    setIsEnrolling(true);
    try {
      const result = await BiometricService.registerWebAuthnBiometric(userId, userType, userName);
      
      if (result.success) {
        toast.success(`Enrôlement réussi pour ${userName || userId}`);
        if (autoLoadStats) {
          loadStats();
        }
      } else {
        toast.error(result.error || 'Erreur lors de l\'enrôlement');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur d'enrôlement: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setIsEnrolling(false);
    }
  }, [isSupported, autoLoadStats, loadStats]);

  // Vérification biométrique
  const verify = useCallback(async (userId: string) => {
    if (!isSupported) {
      toast.error('WebAuthn non supporté sur cet appareil');
      return { success: false, error: 'WebAuthn non supporté' };
    }

    setIsVerifying(true);
    try {
      const result = await BiometricService.authenticateWebAuthnBiometric(userId);
      
      if (result.success) {
        toast.success(`Vérification réussie (${result.confidence}%)`);
        if (autoLoadStats) {
          loadStats();
        }
      } else {
        toast.error(result.error || 'Vérification échouée');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur de vérification: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setIsVerifying(false);
    }
  }, [isSupported, autoLoadStats, loadStats]);

  // Vérification avec présence automatique
  const verifyAndMarkAttendance = useCallback(async (
    userId: string, 
    classId?: string, 
    userType: 'STUDENT' | 'STAFF' = 'STUDENT'
  ) => {
    const verificationResult = await verify(userId);
    
    if (verificationResult.success) {
      // Notifier la présence via biométrie
      BiometricNotificationService.notifyAttendance(
        userId, 
        userType, 
        true, 
        classId, 
        'CHECK_IN', 
        'Biometric Scanner'
      );
      
      return {
        success: true,
        confidence: verificationResult.confidence,
        attendanceRecorded: true
      };
    }
    
    return verificationResult;
  }, [verify]);

  // Connecter un appareil externe
  const connectDevice = useCallback(async (deviceConfig: any) => {
    try {
      const result = await BiometricService.connectExternalDevice(deviceConfig);
      
      if (result.success) {
        toast.success('Appareil connecté avec succès');
        loadDevices();
      } else {
        toast.error(result.error || 'Erreur de connexion');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur de connexion: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }, [loadDevices]);

  // Obtenir le statut de l'appareil
  const getDeviceStatus = useCallback(async () => {
    try {
      const devices = BiometricService.getDevices();
      return {
        connected: devices.length > 0,
        onlineDevices: devices.filter(d => d.status === 'ONLINE').length,
        totalDevices: devices.length
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      return null;
    }
  }, []);

  // Nettoyer les notifications
  const clearNotifications = useCallback(() => {
    BiometricNotificationService.clearNotifications();
    setNotifications([]);
    if (autoLoadStats) {
      loadStats();
    }
    toast.success('Notifications supprimées');
  }, [autoLoadStats, loadStats]);

  // Générer des notifications de test
  const generateTestNotifications = useCallback(() => {
    BiometricNotificationService.generateTestNotifications();
    loadNotifications();
    if (autoLoadStats) {
      loadStats();
    }
    toast.success('Notifications de test générées');
  }, [loadNotifications, autoLoadStats, loadStats]);

  // Exporter les données
  const exportData = useCallback((format: 'JSON' | 'CSV' = 'CSV') => {
    try {
      const data = BiometricNotificationService.exportNotifications(format);
      const blob = new Blob([data], { 
        type: format === 'CSV' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `biometric_data_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Données exportées en ${format}`);
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  }, []);

  return {
    // États
    isSupported,
    isEnrolling,
    isVerifying,
    stats,
    notifications,
    devices,
    
    // Actions principales
    enroll,
    verify,
    verifyAndMarkAttendance,
    
    // Gestion des appareils
    connectDevice,
    getDeviceStatus,
    loadDevices,
    
    // Gestion des données
    loadStats,
    loadNotifications,
    clearNotifications,
    generateTestNotifications,
    exportData,
    
    // Utilitaires
    refresh: () => {
      loadStats();
      loadNotifications();
      loadDevices();
    }
  };
}

// Hook simplifié pour la vérification rapide
export function useBiometricVerification() {
  const { verify, isVerifying, isSupported } = useBiometric({
    enableNotifications: false,
    autoLoadStats: false
  });
  
  return {
    verify,
    isVerifying,
    isSupported
  };
}

// Hook simplifié pour l'enrôlement rapide
export function useBiometricEnrollment() {
  const { enroll, isEnrolling, isSupported } = useBiometric({
    enableNotifications: false,
    autoLoadStats: false
  });
  
  return {
    enroll,
    isEnrolling,
    isSupported
  };
}

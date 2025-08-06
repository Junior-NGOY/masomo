"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Fingerprint, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Clock,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { BiometricService } from '@/services/biometricService';

export default function BiometricTestPage() {
  const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);
  const [testUserId, setTestUserId] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'enrolling' | 'success' | 'error'>('idle');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [biometricStats, setBiometricStats] = useState<any>(null);
  const [deviceStatus, setDeviceStatus] = useState<any>(null);

  useEffect(() => {
    checkWebAuthnSupport();
    loadBiometricStats();
    checkDeviceStatus();
  }, []);

  const checkWebAuthnSupport = () => {
    const supported = BiometricService.isWebAuthnSupported();
    setIsWebAuthnSupported(supported);
    
    if (!supported) {
      toast.error('WebAuthn n\'est pas supporté par ce navigateur');
    } else {
      toast.success('WebAuthn est supporté par ce navigateur');
    }
  };

  const loadBiometricStats = async () => {
    try {
      const stats = await BiometricService.getBiometricStats();
      setBiometricStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const checkDeviceStatus = async () => {
    try {
      const devices = BiometricService.getDevices();
      const status = {
        hasFingerprint: devices.some(d => d.type === 'FINGERPRINT'),
        hasFace: devices.some(d => d.type === 'FACE'),
        onlineDevices: devices.filter(d => d.status === 'ONLINE').length,
        totalDevices: devices.length,
        devices: devices
      };
      setDeviceStatus(status);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de l\'appareil:', error);
    }
  };

  const handleEnrollment = async () => {
    if (!testUserId.trim()) {
      toast.error('Veuillez saisir un ID utilisateur');
      return;
    }

    setEnrollmentStatus('enrolling');
    try {
      const result = await BiometricService.registerWebAuthnBiometric(testUserId, 'STUDENT');
      
      if (result.success) {
        setEnrollmentStatus('success');
        toast.success('Enrôlement biométrique réussi !');
        await loadBiometricStats();
      } else {
        setEnrollmentStatus('error');
        toast.error(result.error || 'Erreur lors de l\'enrôlement');
      }
    } catch (error) {
      setEnrollmentStatus('error');
      console.error('Erreur d\'enrôlement:', error);
      toast.error('Erreur lors de l\'enrôlement biométrique');
    }
  };

  const handleVerification = async () => {
    if (!testUserId.trim()) {
      toast.error('Veuillez saisir un ID utilisateur');
      return;
    }

    setVerificationStatus('verifying');
    try {
      const result = await BiometricService.authenticateWebAuthnBiometric(testUserId);
      
      if (result.success) {
        setVerificationStatus('success');
        toast.success(`Vérification réussie ! Score: ${result.confidence || 'N/A'}`);
      } else {
        setVerificationStatus('error');
        toast.error(result.error || 'Vérification échouée');
      }
    } catch (error) {
      setVerificationStatus('error');
      console.error('Erreur de vérification:', error);
      toast.error('Erreur lors de la vérification biométrique');
    }
  };

  const resetStatuses = () => {
    setEnrollmentStatus('idle');
    setVerificationStatus('idle');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'enrolling':
      case 'verifying': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'enrolling':
      case 'verifying': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Test Système Biométrique
        </h1>
        <p className="text-gray-600 mt-1">
          Interface de test pour valider les fonctionnalités biométriques
        </p>
      </div>

      {/* Support WebAuthn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Support Navigateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={isWebAuthnSupported ? getStatusColor('success') : getStatusColor('error')}>
              {isWebAuthnSupported ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  WebAuthn Supporté
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-1" />
                  WebAuthn Non Supporté
                </>
              )}
            </Badge>
            
            {deviceStatus && (
              <Badge className={deviceStatus.hasFingerprint ? getStatusColor('success') : getStatusColor('error')}>
                {deviceStatus.hasFingerprint ? (
                  <>
                    <Fingerprint className="w-4 h-4 mr-1" />
                    Capteur Détecté
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Aucun Capteur
                  </>
                )}
              </Badge>
            )}
          </div>

          {!isWebAuthnSupported && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-900">Navigateur non compatible</h4>
              <p className="text-sm text-red-700 mt-1">
                Pour utiliser les fonctionnalités biométriques, veuillez utiliser un navigateur moderne comme:
              </p>
              <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
                <li>Chrome 67+ / Edge 79+</li>
                <li>Firefox 60+</li>
                <li>Safari 14+</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interface de test */}
      {isWebAuthnSupported && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test d'enrôlement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Test d'Enrôlement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="enrollUserId">ID Utilisateur</Label>
                <Input
                  id="enrollUserId"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  placeholder="ex: student_001"
                  disabled={enrollmentStatus === 'enrolling'}
                />
              </div>

              <Button
                onClick={handleEnrollment}
                disabled={!testUserId.trim() || enrollmentStatus === 'enrolling'}
                className="w-full flex items-center gap-2"
              >
                {enrollmentStatus === 'enrolling' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Fingerprint className="w-4 h-4" />
                )}
                {enrollmentStatus === 'enrolling' ? 'Enrôlement en cours...' : 'Démarrer l\'enrôlement'}
              </Button>

              {enrollmentStatus !== 'idle' && (
                <Badge className={`${getStatusColor(enrollmentStatus)} w-full justify-center p-2`}>
                  {getStatusIcon(enrollmentStatus)}
                  <span className="ml-2">
                    {enrollmentStatus === 'enrolling' && 'Enrôlement en cours...'}
                    {enrollmentStatus === 'success' && 'Enrôlement réussi'}
                    {enrollmentStatus === 'error' && 'Erreur d\'enrôlement'}
                  </span>
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Test de vérification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Test de Vérification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="verifyUserId">ID Utilisateur</Label>
                <Input
                  id="verifyUserId"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  placeholder="ex: student_001"
                  disabled={verificationStatus === 'verifying'}
                />
              </div>

              <Button
                onClick={handleVerification}
                disabled={!testUserId.trim() || verificationStatus === 'verifying'}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                {verificationStatus === 'verifying' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                {verificationStatus === 'verifying' ? 'Vérification en cours...' : 'Vérifier l\'identité'}
              </Button>

              {verificationStatus !== 'idle' && (
                <Badge className={`${getStatusColor(verificationStatus)} w-full justify-center p-2`}>
                  {getStatusIcon(verificationStatus)}
                  <span className="ml-2">
                    {verificationStatus === 'verifying' && 'Vérification en cours...'}
                    {verificationStatus === 'success' && 'Vérification réussie'}
                    {verificationStatus === 'error' && 'Vérification échouée'}
                  </span>
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            onClick={resetStatuses}
            variant="outline"
            className="flex items-center gap-2"
          >
            Réinitialiser les tests
          </Button>
          
          <Button
            onClick={loadBiometricStats}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Actualiser les statistiques
          </Button>

          <Button
            onClick={checkDeviceStatus}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Vérifier l'appareil
          </Button>
        </CardContent>
      </Card>

      {/* Statistiques */}
      {biometricStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Statistiques Biométriques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {biometricStats.totalEnrollments || 0}
                </div>
                <div className="text-sm text-gray-600">Enrôlements</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {biometricStats.successfulVerifications || 0}
                </div>
                <div className="text-sm text-gray-600">Vérifications réussies</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {biometricStats.failedVerifications || 0}
                </div>
                <div className="text-sm text-gray-600">Échecs</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {biometricStats.averageConfidence || 0}%
                </div>
                <div className="text-sm text-gray-600">Confiance moyenne</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Fingerprint className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Instructions de test</h3>
              <div className="text-sm text-blue-700 mt-2 space-y-1">
                <p>• <strong>Enrôlement:</strong> Saisissez un ID utilisateur et cliquez sur "Démarrer l'enrôlement"</p>
                <p>• <strong>Vérification:</strong> Utilisez le même ID pour tester la vérification</p>
                <p>• <strong>Biométrie:</strong> Suivez les instructions de votre navigateur pour scanner</p>
                <p>• <strong>Sécurité:</strong> Les données biométriques restent sur votre appareil</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Scan, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Smartphone,
  Zap,
  User,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeService, type QRScanResult } from '@/services/qrCodeService';

interface QRCodeScannerProps {
  onScanSuccess: (result: QRScanResult) => void;
  onScanError?: (error: string) => void;
  className?: string;
  isActive?: boolean;
}

export function QRCodeScanner({ 
  onScanSuccess, 
  onScanError, 
  className = '', 
  isActive = false 
}: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [capabilities, setCapabilities] = useState<any>(null);
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const checkScannerCapabilities = async () => {
    const caps = await QRCodeService.detectScannerCapabilities();
    setCapabilities(caps);
  };

  const startCamera = useCallback(async () => {
    try {
      if (!capabilities?.hasCamera) {
        toast.error('Aucune caméra détectée sur cet appareil');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Caméra arrière préférée
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      toast.success('Caméra activée - Pointez vers un QR code');
    } catch (error) {
      console.error('Erreur caméra:', error);
      toast.error('Impossible d\'accéder à la caméra');
      setIsScanning(false);
    }
  }, [capabilities?.hasCamera]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    checkScannerCapabilities();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isActive && isScanning) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive, isScanning, startCamera]);

  const handleScanToggle = () => {
    if (isScanning) {
      setIsScanning(false);
      stopCamera();
    } else {
      setIsScanning(true);
      setScanResult(null);
    }
  };

  const handleManualScan = async () => {
    if (!manualInput.trim()) {
      toast.error('Veuillez saisir un code QR');
      return;
    }

    const result = await QRCodeService.scanQRCode(manualInput.trim());
    setScanResult(result);

    if (result.success) {
      onScanSuccess(result);
      toast.success(`QR scanné: ${result.studentName}`);
    } else {
      onScanError?.(result.error || 'Erreur de scan');
      toast.error(result.error || 'QR code invalide');
    }
  };

  const handleCameraScan = async () => {
    // Simulation d'un scan depuis la caméra
    // Dans une vraie implémentation, vous utiliseriez une bibliothèque comme ZXing ou QuaggaJS
    const testQRCodes = [
      'MASOMO:eyJpZCI6InFyXzE2NDI2ODUyMDAiLCJ1c2VySWQiOiJTVFUwMDEiLCJ1c2VyVHlwZSI6IlNUVURFTlQifQ==',
      'MASOMO:eyJpZCI6InFyXzE2NDI2ODUyMDEiLCJ1c2VySWQiOiJTVFUwMDIiLCJ1c2VyVHlwZSI6IlNUVURFTlQifQ=='
    ];
    
    const randomQR = testQRCodes[Math.floor(Math.random() * testQRCodes.length)];
    const result = await QRCodeService.scanQRCode(randomQR);
    
    setScanResult(result);

    if (result.success) {
      onScanSuccess(result);
      toast.success(`QR scanné: ${result.studentName}`);
      setIsScanning(false);
    } else {
      onScanError?.(result.error || 'Erreur de scan');
      toast.error(result.error || 'QR code invalide');
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setManualInput('');
    setIsScanning(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Statut des capacités */}
      {capabilities && (
        <Alert className={capabilities.hasCamera ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center gap-2">
              {capabilities.hasCamera ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-800">Caméra détectée - Scan disponible</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-orange-800">Aucune caméra - Saisie manuelle uniquement</span>
                </>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Interface de scan caméra */}
      {capabilities?.hasCamera && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Scanner QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vidéo de la caméra */}
            {isScanning && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-w-md mx-auto rounded-lg border-2 border-dashed border-blue-300"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-blue-500 rounded-lg"></div>
                </div>
              </div>
            )}

            {/* Contrôles */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleScanToggle}
                variant={isScanning ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Démarrer Scan
                  </>
                )}
              </Button>

              {isScanning && (
                <Button
                  onClick={handleCameraScan}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Capturer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saisie manuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Saisie Manuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Collez ou tapez le code QR ici..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isScanning}
            />
          </div>
          
          <Button
            onClick={handleManualScan}
            disabled={!manualInput.trim() || isScanning}
            className="w-full flex items-center gap-2"
          >
            <Scan className="w-4 h-4" />
            Scanner Code Manual
          </Button>
        </CardContent>
      </Card>

      {/* Résultat du scan */}
      {scanResult && (
        <Card className={scanResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {scanResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
              )}
              
              <div className="flex-1">
                {scanResult.success ? (
                  <div>
                    <h4 className="font-medium text-green-900">QR Code Valide</h4>
                    <div className="text-sm text-green-700 mt-1 space-y-1">
                      <p><strong>Étudiant:</strong> {scanResult.studentName}</p>
                      <p><strong>ID:</strong> {scanResult.studentId}</p>
                      <p><strong>Confiance:</strong> {scanResult.confidence}%</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-red-900">Erreur de Scan</h4>
                    <p className="text-sm text-red-700 mt-1">{scanResult.error}</p>
                  </div>
                )}
              </div>

              <Badge className={scanResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {scanResult.success ? 'Succès' : 'Échec'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button
          onClick={resetScanner}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Scan className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Instructions</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Utilisez la caméra pour scanner automatiquement</li>
                <li>Ou collez/tapez le code QR manuellement</li>
                <li>Assurez-vous que le QR code est bien visible et net</li>
                <li>Les codes QR Masomo Pro commencent par "MASOMO:"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant simplifié pour usage rapide
export function QRCodeScannerSimple({ onScan }: { onScan: (studentId: string, studentName: string) => void }) {
  const handleScanSuccess = (result: QRScanResult) => {
    if (result.success && result.studentId && result.studentName) {
      onScan(result.studentId, result.studentName);
    }
  };

  return (
    <QRCodeScanner
      onScanSuccess={handleScanSuccess}
      onScanError={(error) => console.error('Erreur QR:', error)}
      isActive={true}
    />
  );
}

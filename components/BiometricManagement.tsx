"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Fingerprint,
  Eye,
  Scan,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  User,
  Settings,
  Activity,
  Shield,
  Smartphone,
  Camera,
  AlertTriangle,
  Clock
} from "lucide-react";
import { BiometricDevice, BiometricRecord } from "@/services/biometricService";
import { useBiometric } from "@/hooks/useBiometric";

export default function BiometricManagement() {
  const { 
    devices, 
    records: recentRecords, 
    stats, 
    enroll, 
    verify, 
    refresh,
    isEnrolling,
    isVerifying
  } = useBiometric();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);

  const handleWebAuthnEnroll = async () => {
    if (!selectedUserId.trim()) {
      setMessage({type: 'error', text: 'Veuillez saisir un ID utilisateur'});
      return;
    }

    setMessage(null);

    try {
      const result = await enroll(selectedUserId, "STUDENT");

      if (result.success) {
        setMessage({type: 'success', text: 'Empreinte biométrique enregistrée avec succès!'});
        refresh();
      } else {
        setMessage({type: 'error', text: result.error || 'Erreur lors de l\'enregistrement'});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'Erreur système lors de l\'enregistrement'});
    }
  };

  const handleWebAuthnVerify = async () => {
    if (!selectedUserId.trim()) {
      setMessage({type: 'error', text: 'Veuillez saisir un ID utilisateur'});
      return;
    }

    setMessage(null);

    try {
      const result = await verify(selectedUserId);

      if (result.success) {
        setMessage({
          type: 'success', 
          text: `Authentification réussie! Confiance: ${result.confidence}%`
        });
        refresh();
      } else {
        setMessage({type: 'error', text: result.error || 'Authentification échouée'});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'Erreur système lors de l\'authentification'});
    }
  };

  const getDeviceIcon = (type: string) => {
    const icons = {
      FINGERPRINT: Fingerprint,
      FACE: Camera,
      IRIS: Eye,
      VOICE: Activity
    };
    const Icon = icons[type as keyof typeof icons] || Scan;
    return <Icon className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ONLINE: "bg-green-100 text-green-800 border-green-200",
      OFFLINE: "bg-red-100 text-red-800 border-red-200",
      MAINTENANCE: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRecordIcon = (status: string) => {
    return status === 'SUCCESS' ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Gestion Biométrique
          </h1>
          <p className="text-gray-600 mt-1">
            Système d'authentification biométrique intégré
          </p>
        </div>
      </div>

      {/* Message d'alerte */}
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 
                         message.type === 'success' ? 'border-green-200 bg-green-50' : 
                         'border-blue-200 bg-blue-50'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Statistiques biométriques */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tentatives (7j)</p>
                  <p className="text-xl font-bold">{stats.totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de succès</p>
                  <p className="text-xl font-bold text-green-600">{stats.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Scan className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confiance moy.</p>
                  <p className="text-xl font-bold text-purple-600">{stats.averageConfidence.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Élèves/Personnel</p>
                  <p className="text-xl font-bold text-orange-600">
                    {stats.byUserType.students}/{stats.byUserType.staff}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions rapides WebAuthn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Test WebAuthn (Navigateur)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">ID Utilisateur</label>
              <Input
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                placeholder="ex: STD001 ou STAFF001"
              />
            </div>
            <Button 
              onClick={handleWebAuthnEnroll}
              disabled={isEnrolling}
              className="flex items-center gap-2"
            >
              <Fingerprint className="h-4 w-4" />
              {isEnrolling ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button 
              variant="outline"
              onClick={handleWebAuthnVerify}
              disabled={isVerifying}
              className="flex items-center gap-2"
            >
              <Scan className="h-4 w-4" />
              {isVerifying ? "Vérification..." : "Vérifier"}
            </Button>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              WebAuthn utilise les capteurs biométriques de votre appareil (empreinte, Face ID, Windows Hello).
              Assurez-vous que votre navigateur et appareil supportent cette fonctionnalité.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Devices biométriques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Appareils Biométriques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <Card key={device.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <span className="font-medium">{device.name}</span>
                    </div>
                    <Badge className={getStatusColor(device.status)}>
                      {device.status === 'ONLINE' ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                      {device.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Type: {device.type}</div>
                    <div>Emplacement: {device.location}</div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Sync: {new Date(device.lastSync).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique récent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune activité biométrique récente</p>
            ) : (
              recentRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRecordIcon(record.status)}
                    <div>
                      <div className="font-medium">{record.userName} ({record.userId})</div>
                      <div className="text-sm text-gray-600">
                        {record.biometricType} • {record.location} • Confiance: {record.confidence}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {new Date(record.timestamp).toLocaleTimeString('fr-FR')}
                    </div>
                    <Badge className={record.userType === 'STUDENT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                      {record.userType}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

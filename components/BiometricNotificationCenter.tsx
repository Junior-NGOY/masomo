"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Fingerprint,
  Shield,
  Users,
  Clock,
  Trash2,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  BiometricNotificationService, 
  type BiometricNotification 
} from '@/services/biometricNotificationService';
import { useBiometric } from "@/hooks/useBiometric";

export function BiometricNotificationCenter() {
  const { notifications, refresh } = useBiometric();
  const [showAll, setShowAll] = useState(false);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return {
      total: notifications.length,
      today: notifications.filter(n => new Date(n.timestamp) >= today).length,
      errors: notifications.filter(n => n.status === 'FAILED').length,
      warnings: notifications.filter(n => n.status === 'WARNING').length,
      recent: notifications.filter(n => (now.getTime() - new Date(n.timestamp).getTime()) < 3600000).length,
      byStatus: {
        SUCCESS: notifications.filter(n => n.status === 'SUCCESS').length,
        FAILED: notifications.filter(n => n.status === 'FAILED').length,
        WARNING: notifications.filter(n => n.status === 'WARNING').length
      }
    };
  }, [notifications]);

  const handleClearAll = () => {
    BiometricNotificationService.clearNotifications();
    refresh();
    toast.success('Toutes les notifications ont été supprimées');
  };

  const handleGenerateTest = () => {
    BiometricNotificationService.generateTestNotifications();
    refresh();
    toast.success('Notifications de test générées');
  };

  const handleExport = () => {
    const csvData = BiometricNotificationService.exportNotifications('CSV');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biometric_notifications_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Notifications exportées en CSV');
  };

  const getNotificationIcon = (notification: BiometricNotification) => {
    switch (notification.type) {
      case 'ENROLLMENT': return <Fingerprint className="w-4 h-4" />;
      case 'VERIFICATION': return <Shield className="w-4 h-4" />;
      case 'ATTENDANCE': return <Users className="w-4 h-4" />;
      case 'SECURITY_ALERT': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (notification: BiometricNotification) => {
    switch (notification.status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800 border-green-200';
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARNING': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="w-3 h-3" />;
      case 'FAILED': return <XCircle className="w-3 h-3" />;
      case 'WARNING': return <AlertTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BellRing className="w-5 h-5" />
            Centre de Notifications Biométriques
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Suivi en temps réel des activités biométriques
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateTest}
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Test
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Vider
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.byStatus.SUCCESS || 0}</div>
              <div className="text-sm text-gray-600">Succès</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.byStatus.FAILED || 0}</div>
              <div className="text-sm text-gray-600">Échecs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.byStatus.WARNING || 0}</div>
              <div className="text-sm text-gray-600">Alertes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.recent}</div>
              <div className="text-sm text-gray-600">24h</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notifications Récentes</CardTitle>
            {notifications.length > 10 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showAll ? 'Voir moins' : `Voir tout (${notifications.length})`}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune notification biométrique</p>
              <p className="text-sm mt-1">Les activités apparaîtront ici en temps réel</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="divide-y">
                {displayedNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      {/* Icône du type */}
                      <div className={`p-2 rounded-full ${getNotificationColor(notification)}`}>
                        {getNotificationIcon(notification)}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.message}
                            </p>
                            
                            {/* Métadonnées */}
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span>ID: {notification.userId}</span>
                              <span>•</span>
                              <span>{notification.userType}</span>
                              {notification.metadata?.classId && (
                                <>
                                  <span>•</span>
                                  <span>Classe: {notification.metadata.classId}</span>
                                </>
                              )}
                              {notification.metadata?.confidenceScore && (
                                <>
                                  <span>•</span>
                                  <span>Score: {notification.metadata.confidenceScore}%</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Timestamp et statut */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={`${getNotificationColor(notification)} text-xs flex items-center gap-1`}>
                              {getStatusIcon(notification.status)}
                              {notification.status}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Légende des types */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-3">Types de Notifications</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <Fingerprint className="w-4 h-4" />
              <span>Enrôlement</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <Shield className="w-4 h-4" />
              <span>Vérification</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <Users className="w-4 h-4" />
              <span>Présence</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <AlertTriangle className="w-4 h-4" />
              <span>Alerte Sécurité</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

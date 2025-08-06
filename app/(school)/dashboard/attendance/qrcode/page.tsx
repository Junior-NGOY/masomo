"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Scan, CreditCard, BarChart3 } from 'lucide-react';
import { QRCodeScanner } from '@/components/QRCodeScanner';
import { QRCardGenerator } from '@/components/QRCardGenerator';

export default function QRCodeManagementPage() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <QrCode className="w-6 h-6" />
          Système QR Code
        </h1>
        <p className="text-gray-600 mt-1">
          Gestion complète des cartes QR et scanner pour la présence
        </p>
      </div>

      {/* Interface à onglets */}
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Générateur
          </TabsTrigger>
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Scan className="w-4 h-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Aide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <QRCardGenerator />
        </TabsContent>

        <TabsContent value="scanner">
          <QRCodeScanner
            onScanSuccess={(result) => {
              console.log('QR scanné:', result);
            }}
            onScanError={(error) => {
              console.error('Erreur scan:', error);
            }}
            isActive={true}
          />
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Statistiques QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Statistiques détaillées</p>
                <p className="text-sm mt-1">Métriques d'utilisation des QR codes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <div className="space-y-6">
            {/* Comparaison QR vs Biométrique */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code vs Biométrique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      QR Code
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sécurité:</span>
                        <span className="text-orange-600">⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coût:</span>
                        <span className="text-green-600">⭐⭐⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compatibilité:</span>
                        <span className="text-green-600">⭐⭐⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vitesse:</span>
                        <span className="text-blue-600">⭐⭐⭐⭐</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <span>🔐</span>
                      Biométrique
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sécurité:</span>
                        <span className="text-green-600">⭐⭐⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coût:</span>
                        <span className="text-orange-600">⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compatibilité:</span>
                        <span className="text-orange-600">⭐⭐⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vitesse:</span>
                        <span className="text-green-600">⭐⭐⭐⭐⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guide d'utilisation */}
            <Card>
              <CardHeader>
                <CardTitle>Guide d'Utilisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium text-blue-900 mb-2">1. Génération des Cartes</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                      <li>Sélectionnez une classe dans l'onglet "Générateur"</li>
                      <li>Cliquez sur "Générer toutes les cartes"</li>
                      <li>Téléchargez le CSV ou imprimez les cartes</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-medium text-green-900 mb-2">2. Scan pour Présence</h4>
                    <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                      <li>Utilisez l'onglet "Scanner" pour lire les QR codes</li>
                      <li>Pointez la caméra vers le QR code</li>
                      <li>La présence est marquée automatiquement</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-purple-50">
                    <h4 className="font-medium text-purple-900 mb-2">3. Sécurité</h4>
                    <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
                      <li>Chaque QR code est unique et sécurisé</li>
                      <li>Hash SHA-256 pour éviter la contrefaçon</li>
                      <li>Date d'expiration automatique</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

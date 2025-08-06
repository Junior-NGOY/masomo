"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, QrCode, User, Phone, Calendar, MapPin, Eye } from 'lucide-react';
import { StudentID } from '@/services/studentMockDataService';
import { EnrichedQRService, EnrichedQRData } from '@/services/enrichedQRService';
import EnrichedQRViewer from './EnrichedQRViewer';

interface QRCodeViewerProps {
  student: StudentID | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeViewer({ student, isOpen, onClose }: QRCodeViewerProps) {
  const [qrCodeData, setQrCodeData] = useState<EnrichedQRData | null>(null);
  const [selectedQRType, setSelectedQRType] = useState<'basic' | 'results' | 'announcement' | 'complete'>('basic');
  const [showEnrichedViewer, setShowEnrichedViewer] = useState(false);

  React.useEffect(() => {
    if (student && isOpen) {
      // Générer les données enrichies selon le type sélectionné
      const enrichedData = EnrichedQRService.createContextualQR(student, selectedQRType);
      setQrCodeData(enrichedData);
    }
  }, [student, isOpen, selectedQRType]);

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Enrichi
            </h2>
            <Select value={selectedQRType} onValueChange={(value: 'basic' | 'results' | 'announcement' | 'complete') => setSelectedQRType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Standard</SelectItem>
                <SelectItem value="results">Résultats</SelectItem>
                <SelectItem value="announcement">Annonces</SelectItem>
                <SelectItem value="complete">Complet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            {qrCodeData && (
              <Button 
                variant="outline" 
                onClick={() => setShowEnrichedViewer(true)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Voir Détails
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Photo et QR Code */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Image
                    src={student.photoUrl}
                    alt={student.studentName}
                    width={128}
                    height={128}
                    className="w-32 h-32 mx-auto rounded-lg object-cover border-2 border-gray-200 mb-4"
                  />
                  <h3 className="font-bold text-lg">{student.studentName}</h3>
                  <p className="text-gray-600">{student.className}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contenu du QR Code ({selectedQRType})</CardTitle>
                </CardHeader>
                <CardContent>
                  {qrCodeData && (
                    <div className="space-y-2">
                      <div className="text-xs">
                        <span className="font-medium">Type:</span> {qrCodeData.metadata.qrType}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Généré:</span> {new Date(qrCodeData.metadata.generatedAt).toLocaleString('fr-FR')}
                      </div>
                      {qrCodeData.metadata.validUntil && (
                        <div className="text-xs">
                          <span className="font-medium">Valide jusqu'au:</span> {new Date(qrCodeData.metadata.validUntil).toLocaleString('fr-FR')}
                        </div>
                      )}
                      <div className="text-xs">
                        <span className="font-medium">Sections incluses:</span>
                        <ul className="list-disc list-inside ml-2 mt-1">
                          <li>Informations de base</li>
                          {qrCodeData.academic && <li>Données académiques</li>}
                          {qrCodeData.results && <li>Résultats scolaires</li>}
                          {qrCodeData.announcements && <li>Annonces ({qrCodeData.announcements.length})</li>}
                          {qrCodeData.financial && <li>Informations financières</li>}
                          {qrCodeData.contacts && <li>Coordonnées de contact</li>}
                        </ul>
                      </div>
                      <div className="pt-2 border-t">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setShowEnrichedViewer(true)}
                          className="w-full"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir tous les détails
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informations détaillées */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations Étudiant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom complet</label>
                    <p className="font-medium">{student.studentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Classe</label>
                    <p className="font-medium">{student.className}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Numéro ID</label>
                    <p className="font-mono font-medium">{student.idNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <p className="font-medium">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        student.status === 'EXPIRED' ? 'bg-orange-100 text-orange-800' :
                        student.status === 'LOST' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status === 'ACTIVE' ? 'Active' :
                         student.status === 'EXPIRED' ? 'Expirée' :
                         student.status === 'LOST' ? 'Perdue' : 'Endommagée'}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Dates importantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date d'émission</label>
                    <p className="font-medium">{new Date(student.issueDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date d'expiration</label>
                    <p className="font-medium">{new Date(student.expiryDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact parent</label>
                    <p className="font-medium">{student.parentContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact d'urgence</label>
                    <p className="font-medium">{student.emergencyContact}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button>
              Imprimer la carte
            </Button>
          </div>
        </div>
      </div>

      {/* Viewer enrichi */}
      {qrCodeData && (
        <EnrichedQRViewer 
          qrData={qrCodeData}
          isOpen={showEnrichedViewer}
          onClose={() => setShowEnrichedViewer(false)}
        />
      )}
    </div>
  );
}

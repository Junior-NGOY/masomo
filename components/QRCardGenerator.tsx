"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  //Download, 
  Printer, 
  Users, 
  User,
  //FileImage,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeService, type StudentQRCard } from '@/services/qrCodeService';

interface QRCardGeneratorProps {
  className?: string;
}

export function QRCardGenerator({ className = '' }: QRCardGeneratorProps) {
  const [students, setStudents] = useState<Array<{id: string, name: string}>>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [generatedCards, setGeneratedCards] = useState<StudentQRCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Classes simulées
  const classes = [
    '6ème A', '6ème B', '6ème C',
    '7ème A', '7ème B', '7ème C',
    '8ème A', '8ème B', '8ème C'
  ];

  // Étudiants simulés
  const mockStudentsByClass = useMemo(() => ({
    '6ème A': [
      { id: 'STU001', name: 'Jean Mukamba' },
      { id: 'STU002', name: 'Marie Kabongo' },
      { id: 'STU003', name: 'Paul Mbuyi' },
      { id: 'STU004', name: 'Grace Tshimanga' },
      { id: 'STU005', name: 'David Kasongo' }
    ],
    '6ème B': [
      { id: 'STU006', name: 'Sarah Lukusa' },
      { id: 'STU007', name: 'Michel Nzeza' },
      { id: 'STU008', name: 'Esther Mujinga' }
    ],
    '7ème A': [
      { id: 'STU009', name: 'Joseph Kalala' },
      { id: 'STU010', name: 'Ruth Mwanza' },
      { id: 'STU011', name: 'Daniel Mpiana' }
    ]
  }), []);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setStudents(mockStudentsByClass[selectedClass as keyof typeof mockStudentsByClass] || []);
    }
  }, [selectedClass, mockStudentsByClass]);

  const loadStats = () => {
    const qrStats = QRCodeService.getQRStats();
    setStats(qrStats);
  };

  const handleGenerateCards = async () => {
    if (!selectedClass || students.length === 0) {
      toast.error('Veuillez sélectionner une classe avec des étudiants');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulation d'un délai de génération
      await new Promise(resolve => setTimeout(resolve, 1500));

      const cards = QRCodeService.generateClassQRCodes(selectedClass, students);
      setGeneratedCards(cards);
      
      toast.success(`${cards.length} cartes QR générées pour ${selectedClass}`);
      loadStats();
    } catch (error) {
      toast.error('Erreur lors de la génération des cartes QR');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCSV = () => {
    if (generatedCards.length === 0) {
      toast.error('Aucune carte à exporter');
      return;
    }

    const { csvData } = QRCodeService.exportQRCodesForPrint(generatedCards);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr_cards_${selectedClass.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Données CSV téléchargées');
  };

  const handlePrintCards = () => {
    if (generatedCards.length === 0) {
      toast.error('Aucune carte à imprimer');
      return;
    }

    const { htmlCards } = QRCodeService.exportQRCodesForPrint(generatedCards);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlCards);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
      toast.success('Ouverture de l\'aperçu d\'impression');
    }
  };

  const handleGenerateSingle = () => {
    const studentName = prompt('Nom de l\'étudiant:');
    const studentId = prompt('ID de l\'étudiant:');
    
    if (studentName && studentId) {
      const card = QRCodeService.generateStudentQR(studentId, studentName, selectedClass || 'Non assigné');
      setGeneratedCards([card]);
      toast.success(`Carte QR générée pour ${studentName}`);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Générateur de Cartes QR
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Créez des cartes d'identité avec QR codes pour la prise de présence
        </p>
      </div>

      {/* Statistiques rapides */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalGenerated}</div>
              <div className="text-sm text-gray-600">Cartes générées</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.successfulScans}</div>
              <div className="text-sm text-gray-600">Scans réussis</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.failedScans}</div>
              <div className="text-sm text-gray-600">Scans échoués</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.averageConfidence}%</div>
              <div className="text-sm text-gray-600">Fiabilité moyenne</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class-select">Classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(className => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Étudiants détectés</Label>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {students.length} étudiants
                </Badge>
                {selectedClass && students.length === 0 && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Aucun étudiant
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Liste des étudiants */}
          {students.length > 0 && (
            <div>
              <Label>Étudiants de la classe {selectedClass}</Label>
              <div className="mt-2 p-3 border rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center gap-2 text-sm">
                      <User className="w-3 h-3 text-gray-500" />
                      <span>{student.name}</span>
                      <span className="text-gray-500">({student.id})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions de génération */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerateCards}
              disabled={!selectedClass || students.length === 0 || isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <QrCode className="w-4 h-4" />
              )}
              Générer toutes les cartes
            </Button>
            
            <Button
              onClick={handleGenerateSingle}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Carte individuelle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cartes générées */}
      {generatedCards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Cartes Générées ({generatedCards.length})
              </span>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadCSV}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  CSV
                </Button>
                
                <Button
                  onClick={handlePrintCards}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aperçu des cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {generatedCards.map((card, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{card.studentName}</div>
                    <div className="text-sm text-gray-600">{card.studentId} • {card.className}</div>
                    
                    {/* QR Code */}
                    <div className="my-3">
                      <Image 
                        src={QRCodeService.generateQRCodeURL(card.qrCode, 100)}
                        alt={`QR Code pour ${card.studentName}`}
                        width={100}
                        height={100}
                        className="mx-auto border rounded"
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Valide jusqu'au {new Date(card.validUntil).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Informations techniques */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Informations Techniques</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Format:</strong> QR Code sécurisé avec hash SHA-256</p>
                <p>• <strong>Validité:</strong> 1 an à partir de la génération</p>
                <p>• <strong>Sécurité:</strong> Codes uniques non-transférables</p>
                <p>• <strong>Compatibilité:</strong> Tout scanner QR standard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <QrCode className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Instructions d'utilisation</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Sélectionnez une classe pour voir les étudiants</li>
                <li>Cliquez sur "Générer toutes les cartes" pour créer les QR codes</li>
                <li>Téléchargez le CSV pour archivage ou import</li>
                <li>Utilisez "Imprimer" pour créer des cartes physiques</li>
                <li>Les QR codes sont valides pendant 1 an</li>
                <li>Chaque code est unique et sécurisé</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

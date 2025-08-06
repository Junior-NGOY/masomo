"use client";

import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Printer, X, Settings, Shield } from 'lucide-react';
import StudentIDCard from './StudentIDCard';
import { StudentID } from '@/services/studentMockDataService';

interface PrintStudentCardsProps {
  students: StudentID[];
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintStudentCards({ students, isOpen, onClose }: PrintStudentCardsProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [printFormat, setPrintFormat] = useState<'standard' | 'large' | 'mini'>('standard');
  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState('ÉCOLE MASOMO PRO');
  const [watermarkType, setWatermarkType] = useState<'text' | 'pattern' | 'logo'>('text');
  const [qrCodeType, setQrCodeType] = useState<'basic' | 'results' | 'announcement' | 'complete'>('basic');

  const formats = {
    standard: {
      name: 'Standard (8.56cm x 5.4cm)',
      description: 'Norme ISO ID-1 (Visa/MasterCard) - 4 cartes par page',
      cardsPerPage: 4,
      width: '8.56cm',
      height: '5.4cm',
      gridCols: 'repeat(2, 1fr)',
      gap: '1cm'
    },
    large: {
      name: 'Large (12cm x 7.5cm)',
      description: 'Plus lisible - 2 cartes par page',
      cardsPerPage: 2,
      width: '12cm',
      height: '7.5cm',
      gridCols: 'repeat(1, 1fr)',
      gap: '1.5cm'
    },
    mini: {
      name: 'Compact (7cm x 4.4cm)',
      description: 'Économique - 6 cartes par page',
      cardsPerPage: 6,
      width: '7cm',
      height: '4.4cm',
      gridCols: 'repeat(3, 1fr)',
      gap: '0.8cm'
    }
  };

  const currentFormat = formats[printFormat];

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Cartes_Etudiants_${printFormat}_${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 1.5cm 1cm;
      }
      
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        
        .print-container {
          display: grid;
          grid-template-columns: ${currentFormat.gridCols};
          gap: ${currentFormat.gap};
          width: 100%;
          justify-items: center;
        }
        
        .student-card {
          page-break-inside: avoid;
          break-inside: avoid;
          width: ${currentFormat.width} !important;
          height: ${currentFormat.height} !important;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        /* Ensure proper sizing for different formats */
        .student-card .text-xs { font-size: ${printFormat === 'mini' ? '0.6rem' : '0.75rem'} !important; }
        .student-card .text-sm { font-size: ${printFormat === 'mini' ? '0.7rem' : '0.875rem'} !important; }
        .student-card .text-lg { font-size: ${printFormat === 'mini' ? '0.9rem' : '1.125rem'} !important; }
      }
    `,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Aperçu d'impression - {students.length} carte(s)</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Options de format d'impression */}
        <div className="p-4 border-b bg-gray-50 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Format d'impression:</span>
            </div>
            <Select value={printFormat} onValueChange={(value: 'standard' | 'large' | 'mini') => setPrintFormat(value)}>
              <SelectTrigger className="w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(formats).map(([key, format]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <div className="font-medium">{format.name}</div>
                      <div className="text-xs text-gray-500">{format.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">
              {currentFormat.cardsPerPage} carte(s) par page
            </div>
          </div>

          {/* Options de sécurité */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Sécurité:</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="watermark" 
                  checked={showWatermark}
                  onCheckedChange={(checked) => setShowWatermark(checked === true)}
                />
                <label 
                  htmlFor="watermark" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Filigrane de sécurité
                </label>
              </div>

              {showWatermark && (
                <div className="flex items-center gap-2">
                  <label className="text-sm">Texte:</label>
                  <Input
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Texte du filigrane"
                    className="w-48 h-8"
                  />
                </div>
              )}
            </div>

            {/* Configuration du type de QR code */}
            <div className="flex items-center gap-4 pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Type de QR Code:</span>
              </div>
              <Select value={qrCodeType} onValueChange={(value: 'basic' | 'results' | 'announcement' | 'complete') => setQrCodeType(value)}>
                <SelectTrigger className="w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">
                    <div>
                      <div className="font-medium">Standard</div>
                      <div className="text-xs text-gray-500">Informations de base uniquement</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="results">
                    <div>
                      <div className="font-medium">Résultats Scolaires</div>
                      <div className="text-xs text-gray-500">Inclut notes et bulletins</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="announcement">
                    <div>
                      <div className="font-medium">Annonces</div>
                      <div className="text-xs text-gray-500">Communiqués et informations</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="complete">
                    <div>
                      <div className="font-medium">Complet</div>
                      <div className="text-xs text-gray-500">Toutes les informations disponibles</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Aperçu pour l'écran */}
          <div className={`grid gap-4 mb-6 ${
            printFormat === 'mini' ? 'grid-cols-1 md:grid-cols-3' :
            printFormat === 'large' ? 'grid-cols-1' :
            'grid-cols-1 md:grid-cols-2'
          }`}>
            {students.map((student) => (
              <div key={student.id} className="border rounded-lg p-2">
                <StudentIDCard 
                  student={student} 
                  showQRCode={true} 
                  isPrintMode={false}
                  size={printFormat}
                  showWatermark={showWatermark}
                  watermarkText={watermarkText}
                  watermarkType={watermarkType}
                  qrCodeType={qrCodeType}
                />
              </div>
            ))}
          </div>

          {/* Version cachée pour l'impression */}
          <div className="hidden print:block">
            <div ref={printRef}>
              {/* Diviser les cartes par page selon le format */}
              {Array.from({ length: Math.ceil(students.length / currentFormat.cardsPerPage) }).map((_, pageIndex) => (
                <div key={pageIndex} className={pageIndex > 0 ? "page-break" : ""}>
                  <div className="print-container">
                    {students
                      .slice(pageIndex * currentFormat.cardsPerPage, (pageIndex + 1) * currentFormat.cardsPerPage)
                      .map((student) => (
                        <div key={`print-${student.id}`} className="student-card">
                          <StudentIDCard 
                            student={student} 
                            showQRCode={true} 
                            isPrintMode={true}
                            size={printFormat}
                            showWatermark={showWatermark}
                            watermarkText={watermarkText}
                            watermarkType={watermarkType}
                            qrCodeType={qrCodeType}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Format sélectionné:</strong> {currentFormat.name}</p>
                <p><strong>Cartes par page:</strong> {currentFormat.cardsPerPage}</p>
              </div>
              <div className="text-right">
                <p><strong>Total de cartes:</strong> {students.length}</p>
                <p><strong>Pages à imprimer:</strong> {Math.ceil(students.length / currentFormat.cardsPerPage)}</p>
              </div>
            </div>
            <div className="border-t pt-2 mt-2">
              <p>• Recommandé: Utilisez du papier cartonné 250-300g/m² pour un meilleur rendu</p>
              <p>• Assurez-vous que votre imprimante est configurée pour imprimer en couleur</p>
              <p>• Les QR codes nécessitent une bonne qualité d'impression pour être lisibles</p>
            </div>
          </div>
        </div>

        {/* Configuration du filigrane */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Filigrane de sécurité</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-watermark"
                checked={showWatermark}
                onCheckedChange={(checked) => setShowWatermark(checked === true)}
              />
              <label htmlFor="show-watermark" className="text-sm">Activer le filigrane</label>
            </div>
            
            {showWatermark && (
              <>
                <div className="ml-6 space-y-2">
                  <label className="text-xs text-gray-600">Type de filigrane</label>
                  <Select value={watermarkType} onValueChange={(value: 'text' | 'pattern' | 'logo') => setWatermarkType(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisir le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texte avec rayures</SelectItem>
                      <SelectItem value="pattern">Motif de points</SelectItem>
                      <SelectItem value="logo">Logo de l'école</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {watermarkType === 'text' && (
                  <div className="ml-6">
                    <label className="text-xs text-gray-600">Texte du filigrane</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full text-xs p-1 border rounded"
                      placeholder="MASOMO PRO"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, forwardRef } from 'react';
import Image from 'next/image';
import { StudentID } from '@/services/studentMockDataService';
import { EnrichedQRService } from '@/services/enrichedQRService';
import { Calendar, Phone } from 'lucide-react';

interface StudentIDCardProps {
  student: StudentID;
  showQRCode?: boolean;
  isPrintMode?: boolean;
  size?: 'mini' | 'standard' | 'large';
  showWatermark?: boolean;
  watermarkText?: string;
  watermarkType?: 'text' | 'pattern' | 'logo';
  qrCodeType?: 'basic' | 'results' | 'announcement' | 'complete';
}

const StudentIDCard = forwardRef<HTMLDivElement, StudentIDCardProps>(
  ({ student, showQRCode = true, isPrintMode = false, size = 'standard', showWatermark = true, watermarkText = 'ÉCOLE MASOMO PRO', watermarkType = 'text', qrCodeType = 'basic' }, ref) => {
    const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Créer les données enrichies selon le type demandé
        const enrichedData = EnrichedQRService.createContextualQR(student, qrCodeType);
        
        // Générer le QR code avec une taille adaptée au format
        const qrSize = size === 'mini' ? 100 : size === 'large' ? 180 : 150;
        const qrCodeURL = await EnrichedQRService.generateQRCodeDataURL(enrichedData, qrSize);
        
        setQrCodeDataURL(qrCodeURL);
      } catch (error) {
        console.error('Erreur lors de la génération du QR code:', error);
      }
    };

    if (showQRCode) {
      generateQRCode();
    }
  }, [student, showQRCode, size, qrCodeType]);    const getStatusColor = (status: string) => {
      switch (status) {
        case 'ACTIVE':
          return 'bg-green-500';
        case 'EXPIRED':
          return 'bg-orange-500';
        case 'LOST':
          return 'bg-red-500';
        case 'DAMAGED':
          return 'bg-yellow-500';
        default:
          return 'bg-gray-500';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'ACTIVE':
          return 'Active';
        case 'EXPIRED':
          return 'Expirée';
        case 'LOST':
          return 'Perdue';
        case 'DAMAGED':
          return 'Endommagée';
        default:
          return 'Inconnue';
      }
    };

    const renderWatermark = () => {
      if (!showWatermark) return null;

      switch (watermarkType) {
        case 'pattern':
          return (
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.02) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.02) 2px, transparent 2px)`,
                backgroundSize: '20px 20px'
              }}
            />
          );
          
        case 'logo':
          return (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="text-blue-100/10 font-bold text-6xl transform -rotate-45 select-none">
                MP
              </div>
            </div>
          );
          
        default: // 'text'
          return (
            <div 
              className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  rgba(59, 130, 246, 0.03) 20px,
                  rgba(59, 130, 246, 0.03) 40px
                )`
              }}
            >
              <div 
                className="text-blue-200/20 font-bold select-none transform -rotate-45"
                style={{
                  fontSize: size === 'mini' ? '0.6rem' : size === 'large' ? '1rem' : '0.8rem',
                  letterSpacing: '0.1em',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {watermarkText}
              </div>
            </div>
          );
      }
    };

    return (
      <div 
        ref={ref}
        className={`
          bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg relative
          ${isPrintMode ? 'w-[8.5cm] h-[5.4cm]' : 'w-full max-w-md'}
          ${isPrintMode ? 'text-xs' : 'text-sm'}
          print:shadow-none print:border-black print:border-2
        `}
        style={isPrintMode ? { 
          width: '8.5cm', 
          height: '5.4cm',
          pageBreakInside: 'avoid'
        } : {}}
      >
        {/* Filigrane de sécurité */}
        {renderWatermark()}
        {/* En-tête de la carte */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 relative z-20">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className={`font-bold ${isPrintMode ? 'text-sm' : 'text-lg'}`}>
                École Masomo Pro
              </h3>
              <p className={`text-blue-100 ${isPrintMode ? 'text-xs' : 'text-sm'}`}>
                Carte d'Identité Étudiant
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-xs">ID:</p>
              <p className={`font-mono ${isPrintMode ? 'text-xs' : 'text-sm'}`}>
                {student.idNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Corps de la carte */}
        <div className="p-3 flex-1 relative z-20">
          <div className="flex gap-3 h-full">
            {/* Photo de l'élève */}
            <div className="flex-shrink-0">
              <Image
                src={student.photoUrl}
                alt={student.studentName}
                width={isPrintMode ? 64 : 80}
                height={isPrintMode ? 80 : 96}
                className={`
                  ${isPrintMode ? 'w-16 h-20' : 'w-20 h-24'} 
                  rounded object-cover border-2 border-gray-200
                `}
              />
            </div>

            {/* Informations de l'élève */}
            <div className="flex-1 space-y-1">
              <div>
                <h4 className={`font-bold ${isPrintMode ? 'text-sm' : 'text-lg'}`}>
                  {student.studentName}
                </h4>
                <p className={`text-gray-600 ${isPrintMode ? 'text-xs' : 'text-sm'}`}>
                  {student.className}
                </p>
              </div>
              
              <div className={`space-y-1 ${isPrintMode ? 'text-xs' : 'text-sm'}`}>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span>Émise: {new Date(student.issueDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span>Expire: {new Date(student.expiryDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="truncate">{student.parentContact}</span>
                </div>
              </div>

              {/* Statut */}
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(student.status)}`}></div>
                <span className={`text-gray-600 ${isPrintMode ? 'text-xs' : 'text-sm'}`}>
                  {getStatusText(student.status)}
                </span>
              </div>
            </div>

            {/* QR Code */}
            {showQRCode && qrCodeDataURL && (
              <div className="flex-shrink-0 flex flex-col items-center">
                <Image
                  src={qrCodeDataURL}
                  alt="QR Code"
                  width={isPrintMode ? 64 : 80}
                  height={isPrintMode ? 64 : 80}
                  className={`${isPrintMode ? 'w-16 h-16' : 'w-20 h-20'}`}
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  QR Code
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pied de carte */}
        <div className="bg-gray-50 px-3 py-2 border-t relative z-20">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Urgence: {student.emergencyContact}
            </p>
            <p className="text-xs text-gray-500">
              École Masomo Pro
            </p>
          </div>
        </div>
      </div>
    );
  }
);

StudentIDCard.displayName = 'StudentIDCard';

export default StudentIDCard;

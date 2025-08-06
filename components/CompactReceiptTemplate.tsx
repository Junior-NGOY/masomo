"use client";

import React from "react";
import Image from 'next/image';
import { StudentFee } from "@/services/studentMockDataService";

interface CompactReceiptTemplateProps {
  fee: StudentFee;
}

export default function CompactReceiptTemplate({ fee }: CompactReceiptTemplateProps) {
  // Données pour le QR code - informations de paiement
  const qrData = JSON.stringify({
    receiptNo: fee.receiptNo,
    studentId: fee.studentId,
    studentName: fee.studentName,
    amount: fee.amount,
    feeType: fee.feeType,
    paidDate: fee.paidDate,
    paymentMethod: fee.paymentMethod,
    school: "École Masomo Pro"
  });

  // URL pour générer le QR code avec les données de paiement
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="receipt-container" style={{
      width: '80mm',
      minHeight: '80mm',
      maxWidth: '80mm',
      backgroundColor: 'white',
      fontFamily: 'monospace',
      fontSize: '8px',
      lineHeight: '1.2',
      padding: '4mm',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',
      border: '1px solid #ddd'
    }}>
      {/* Filigrane de sécurité */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: '12px',
        color: '#f0f0f0',
        fontWeight: 'bold',
        zIndex: 1,
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
      }}>
        MASOMO PRO OFFICIEL
      </div>

      {/* Contenu principal */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* En-tête école */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: '2mm', marginBottom: '2mm' }}>
          <div style={{ fontWeight: 'bold', fontSize: '10px' }}>ÉCOLE MASOMO PRO</div>
          <div style={{ fontSize: '7px' }}>Avenue de l'Education, Lubumbashi</div>
          <div style={{ fontSize: '7px' }}>Tél: +243 85 123 4567</div>
        </div>

        {/* Titre du reçu */}
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '9px', marginBottom: '3mm' }}>
          REÇU DE PAIEMENT
        </div>

        {/* Informations principales */}
        <div style={{ marginBottom: '3mm' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
            <span>Reçu N°:</span>
            <span style={{ fontWeight: 'bold' }}>{fee.receiptNo}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
            <span>Date:</span>
            <span>{fee.paidDate ? new Date(fee.paidDate).toLocaleDateString('fr-FR') : 'N/A'}</span>
          </div>
        </div>

        {/* Informations étudiant */}
        <div style={{ borderTop: '1px dashed #000', paddingTop: '2mm', marginBottom: '2mm' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '1mm' }}>ÉTUDIANT:</div>
          <div style={{ fontSize: '7px', marginBottom: '0.5mm' }}>{fee.studentName}</div>
          <div style={{ fontSize: '7px', marginBottom: '1mm' }}>{fee.className}</div>
        </div>

        {/* Détails du paiement */}
        <div style={{ borderTop: '1px dashed #000', paddingTop: '2mm', marginBottom: '2mm' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '1mm' }}>PAIEMENT:</div>
          <div style={{ fontSize: '7px', marginBottom: '0.5mm' }}>{fee.feeType}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
            <span style={{ fontSize: '7px' }}>Montant:</span>
            <span style={{ fontWeight: 'bold', fontSize: '8px' }}>
              {new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
                minimumFractionDigits: 0
              }).format(fee.amount)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
            <span style={{ fontSize: '7px' }}>Méthode:</span>
            <span style={{ fontSize: '7px' }}>{fee.paymentMethod || 'N/A'}</span>
          </div>
        </div>

        {/* Pied de page avec QR code */}
        <div style={{ 
          borderTop: '1px solid #000', 
          paddingTop: '2mm',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '6px', marginBottom: '0.5mm' }}>Merci pour votre paiement</div>
            <div style={{ fontSize: '6px', marginBottom: '0.5mm' }}>Conservez ce reçu</div>
            <div style={{ fontSize: '6px' }}>Année scolaire 2024-2025</div>
          </div>
          
          {/* QR Code */}
          <div style={{ textAlign: 'center' }}>
            <Image 
              src={qrCodeUrl}
              alt="QR Code"
              width={57}
              height={57}
              style={{ 
                width: '15mm', 
                height: '15mm',
                border: '1px solid #ddd'
              }}
            />
            <div style={{ fontSize: '5px', marginTop: '0.5mm' }}>Code de vérification</div>
          </div>
        </div>

        {/* Numéro de série en bas */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '5px', 
          marginTop: '2mm',
          color: '#666'
        }}>
          Série: MP-{fee.receiptNo}-{new Date().getFullYear()}
        </div>
      </div>

      <style jsx>{`
        @media print {
          .receipt-container {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            padding: 4mm !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          @page {
            size: 80mm 80mm;
            margin: 0;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

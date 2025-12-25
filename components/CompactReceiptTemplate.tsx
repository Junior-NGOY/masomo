/* eslint-disable @next/next/no-img-element */
import React from "react";
import { StudentFee } from "@/services/studentMockDataService";

interface CompactReceiptTemplateProps {
  fee: StudentFee & { 
    paidAmount?: number; 
    paymentMethod?: string; 
    signature?: string;
    studentLastName?: string;
    studentFirstName?: string;
    classSection?: string;
    schoolLogo?: string;
  };
  paymentAmount?: number; // Montant payé à cette transaction
  balanceBefore?: number; // Solde avant ce paiement
}

export default function CompactReceiptTemplate({ fee, paymentAmount: propPaymentAmount, balanceBefore: propBalanceBefore }: CompactReceiptTemplateProps) {
  // DEBUG: Afficher les données reçues pour diagnostic
  console.log("Receipt data:", {
    studentLastName: fee.studentLastName,
    studentFirstName: fee.studentFirstName,
    studentName: fee.studentName,
    className: fee.className,
    classSection: fee.classSection,
    schoolLogo: fee.schoolLogo
  });

  // Utiliser le montant payé de la transaction si fourni, sinon les données des frais
  const transactionAmount = propPaymentAmount || fee.paidAmount || fee.amount;
  const beforePayment = propBalanceBefore || fee.amount;
  const afterPayment = Math.max(0, beforePayment - transactionAmount);
  
  // Générer un code de vérification court (premiers 8 caractères de la signature)
  const verificationCode = fee.signature ? fee.signature.substring(0, 8).toUpperCase() : 'N/A';
  
  // Formater la méthode de paiement
  const formatPaymentMethod = (method?: string) => {
    if (!method) return 'N/A';
    const methodMap: Record<string, string> = {
      CASH: 'Espèces',
      MOBILE_MONEY: 'Mobile Money',
      ORANGE_MONEY: 'Orange Money',
      AIRTEL_MONEY: 'Airtel Money',
      BANK_TRANSFER: 'Virement bancaire',
      CREDIT_CARD: 'Carte bancaire',
      CHEQUE: 'Chèque',
      OTHER: 'Autre'
    };
    return methodMap[method] || method;
  };
  
  // Données pour le QR code - informations de paiement avec signature
  const qrData = fee.receiptNo ? JSON.stringify({
    receiptNo: fee.receiptNo,
    studentId: fee.studentId,
    studentName: fee.studentName,
    amount: transactionAmount,
    feeType: fee.feeType,
    paidDate: fee.paidDate,
    paymentMethod: fee.paymentMethod,
    signature: fee.signature,
    school: "École Masomo Pro"
  }) : null;

  // URL pour générer le QR code avec les données de paiement
  // Ne générer que si nous avons les données nécessaires
  const qrCodeUrl = qrData ? `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(qrData)}` : null;

  return (
    <div className="receipt-container" style={{
      width: '80mm',
      maxWidth: '80mm',
      backgroundColor: 'white',
      fontFamily: 'monospace',
      fontSize: '7px',
      lineHeight: '1.1',
      padding: '2mm',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',
      border: '1px solid #ddd',
      pageBreakInside: 'avoid'
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
        {/* En-tête avec logo */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: '1mm', marginBottom: '1mm', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2mm' }}>
          {/* Logo de l'école - optionnel */}
          {fee.schoolLogo && fee.schoolLogo.trim() !== '' && fee.schoolLogo.startsWith('http') && (
            <div style={{ flexShrink: 0 }}>
              <img 
                src={fee.schoolLogo} 
                alt="Logo" 
                loading="lazy"
                decoding="async"
                style={{ 
                  maxWidth: '15mm', 
                  height: 'auto', 
                  maxHeight: '15mm',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          {/* Infos école */}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '10px' }}>ÉCOLE MASOMO PRO</div>
            <div style={{ fontSize: '7px' }}>Avenue de l'Education, Lubumbashi</div>
            <div style={{ fontSize: '7px' }}>Tél: +243 85 123 4567</div>
          </div>
        </div>

        {/* Titre du reçu */}
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '8px', marginBottom: '1mm' }}>
          REÇU DE PAIEMENT
        </div>

        {/* Informations principales */}
        <div style={{ marginBottom: '1mm' }}>
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
        <div style={{ borderTop: '1px dashed #000', paddingTop: '1mm', marginBottom: '1mm' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '1mm' }}>ÉTUDIANT:</div>
          <div style={{ fontSize: '7px', marginBottom: '0.5mm', fontWeight: 'bold' }}>
            {fee.studentLastName && fee.studentFirstName 
              ? `${fee.studentLastName} ${fee.studentFirstName}` 
              : fee.studentName}
          </div>
          <div style={{ fontSize: '7px', marginBottom: '1mm' }}>
            {fee.classSection ? `${fee.className} ${fee.classSection}` : fee.className}
          </div>
        </div>

        {/* Détails du paiement */}
        <div style={{ borderTop: '1px dashed #000', paddingTop: '1mm', marginBottom: '1mm' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '1mm' }}>PAIEMENT:</div>
          <div style={{ fontSize: '7px', marginBottom: '0.5mm' }}>{fee.feeType}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
            <span style={{ fontSize: '7px' }}>Montant total:</span>
            <span style={{ fontWeight: 'bold', fontSize: '8px' }}>
              {new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
                minimumFractionDigits: 0
              }).format(fee.amount)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
            <span style={{ fontSize: '7px' }}>Solde avant:</span>
            <span style={{ fontWeight: 'bold', fontSize: '8px' }}>
              {new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
                minimumFractionDigits: 0
              }).format(beforePayment)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
            <span style={{ fontSize: '7px' }}>Montant payé:</span>
            <span style={{ fontWeight: 'bold', fontSize: '8px', color: '#2e7d32' }}>
              {new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
                minimumFractionDigits: 0
              }).format(transactionAmount)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm', borderTop: '1px dashed #999', paddingTop: '0.5mm' }}>
            <span style={{ fontSize: '7px', fontWeight: 'bold' }}>Solde après:</span>
            <span style={{ fontWeight: 'bold', fontSize: '8px', color: afterPayment > 0 ? '#d32f2f' : '#2e7d32' }}>
              {new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
                minimumFractionDigits: 0
              }).format(afterPayment)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
            <span style={{ fontSize: '7px' }}>Méthode:</span>
            <span style={{ fontSize: '7px' }}>{formatPaymentMethod(fee.paymentMethod)}</span>
          </div>
        </div>

        {/* Pied de page avec QR code */}
        <div style={{ 
          borderTop: '1px solid #000', 
          paddingTop: '1mm',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pageBreakInside: 'avoid'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '6px', marginBottom: '0.5mm' }}>Merci pour votre paiement</div>
            <div style={{ fontSize: '6px', marginBottom: '0.5mm' }}>Conservez ce reçu</div>
            <div style={{ fontSize: '6px' }}>Année scolaire 2024-2025</div>
          </div>
          
          {/* QR Code */}
          {qrCodeUrl && (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <img 
                src={qrCodeUrl}
                alt="QR"
                loading="lazy"
                decoding="async"
                style={{ 
                  width: '12mm', 
                  height: '12mm',
                  border: '1px solid #ddd'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
              <div style={{ fontSize: '4px', marginTop: '0.25mm' }}>Verif</div>
            </div>
          )}
        </div>

        {/* Code de vérification court pour vérification manuelle */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '5px',
          marginTop: '0.5mm',
          padding: '0.5mm',
          border: '1px dashed #999',
          backgroundColor: '#f9f9f9',
          pageBreakInside: 'avoid'
        }}>
          <div style={{ fontSize: '6px', fontWeight: 'bold', color: '#333' }}>
            {verificationCode}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .receipt-container {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            padding: 2mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid !important;
          }
          
          @page {
            size: 80mm auto;
            margin: 0;
            padding: 0;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            page-break-inside: avoid !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { StudentFee, StudentMockDataService } from "@/services/studentMockDataService";

interface ReceiptTemplateProps {
  fee: StudentFee;
  schoolInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
    rccm?: string;
    idNat?: string;
  };
}

export default function ReceiptTemplate({ fee, schoolInfo }: ReceiptTemplateProps) {
  const defaultSchoolInfo = {
    name: "École Masomo Pro",
    address: "Avenue de la Paix, Commune de Gombe, Kinshasa - RDC",
    phone: "+243 81 234 5678",
    email: "contact@masomopro.cd",
    logo: "/images/school-logo.png",
    rccm: "CD/KIN/RCCM/23-B-1234",
    idNat: "01-123-N45678Z"
  };

  const school = schoolInfo || defaultSchoolInfo;
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const currentTime = new Date().toLocaleTimeString('fr-FR');

  // Récupérer les informations de l'étudiant
  const studentProfiles = StudentMockDataService.getStudentProfiles();
  const student = studentProfiles.find(s => s.id === fee.studentId);

  // Calculer le montant payé
  const paidAmount = fee.status === 'PAID' 
    ? fee.amount 
    : fee.status === 'PARTIAL' 
    ? fee.amount - (fee.remainingAmount || 0)
    : 0;

  // Fonction pour convertir un nombre en lettres (simplifié)
  const numberToWords = (num: number): string => {
    const ones = [
      '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
      'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept',
      'dix-huit', 'dix-neuf'
    ];
    
    const tens = [
      '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix',
      'quatre-vingt', 'quatre-vingt-dix'
    ];

    if (num === 0) return 'zéro';
    if (num < 20) return ones[num];
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
    }
    if (num < 1000) {
      return ones[Math.floor(num / 100)] + ' cent' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      return (thousands === 1 ? 'mille' : numberToWords(thousands) + ' mille') + 
             (remainder !== 0 ? ' ' + numberToWords(remainder) : '');
    }
    return 'Montant trop élevé';
  };

  const amountInWords = numberToWords(paidAmount) + ' francs congolais';

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto print:max-w-none print:m-0 print:p-6 relative overflow-hidden">
      {/* Filigrane de sécurité */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none transform rotate-45">
        <div className="text-6xl font-bold text-gray-500 select-none">
          MASOMO PRO
        </div>
      </div>
      
      {/* Pattern de sécurité en arrière-plan */}
      <div className="absolute inset-0 opacity-3 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.02) 10px,
            rgba(0,0,0,0.02) 20px
          )`
        }}></div>
      </div>

      <div className="relative z-10">
        {/* En-tête de l'école */}
        <div className="border-b-2 border-blue-600 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">MP</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">{school.name}</h1>
                <p className="text-sm text-gray-600 max-w-md">{school.address}</p>
                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                  <span>Tél: {school.phone}</span>
                  <span>Email: {school.email}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right text-xs text-gray-500">
              <p>RCCM: {school.rccm}</p>
              <p>Id. Nat: {school.idNat}</p>
            </div>
          </div>
        </div>

        {/* Titre du reçu */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">REÇU DE PAIEMENT</h2>
          <div className="flex justify-center gap-8 text-sm">
            <span className="bg-blue-100 px-3 py-1 rounded">N° {fee.receiptNo}</span>
            <span className="bg-gray-100 px-3 py-1 rounded">Date: {currentDate}</span>
            <span className="bg-gray-100 px-3 py-1 rounded">Heure: {currentTime}</span>
          </div>
        </div>

        {/* Informations du paiement */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Informations élève */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-800 mb-3">INFORMATIONS ÉLÈVE</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom complet:</span>
                <span className="font-medium">{fee.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Classe:</span>
                <span className="font-medium">{fee.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID Élève:</span>
                <span className="font-medium">{fee.studentId.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Détails du paiement */}
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-800 mb-3">DÉTAILS DU PAIEMENT</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type de frais:</span>
                <span className="font-medium">{fee.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Méthode:</span>
                <span className="font-medium">{fee.paymentMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date d'échéance:</span>
                <span className="font-medium">{new Date(fee.dueDate).toLocaleDateString('fr-FR')}</span>
              </div>
              {fee.paidDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de paiement:</span>
                  <span className="font-medium text-green-600">
                    {new Date(fee.paidDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Récapitulatif financier */}
        <div className="border-2 border-blue-200 rounded-lg p-6 mb-8 bg-blue-50">
          <h3 className="font-bold text-lg text-blue-900 mb-4">RÉCAPITULATIF FINANCIER</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span>Montant total des frais:</span>
              <span className="font-bold">{(fee.amount).toLocaleString('fr-FR')} FC</span>
            </div>
            
            <div className="flex justify-between text-lg text-green-600">
              <span>Montant payé:</span>
              <span className="font-bold">{paidAmount.toLocaleString('fr-FR')} FC</span>
            </div>
            
            {fee.remainingAmount && fee.remainingAmount > 0 && (
              <div className="flex justify-between text-lg text-orange-600">
                <span>Solde restant:</span>
                <span className="font-bold">{fee.remainingAmount.toLocaleString('fr-FR')} FC</span>
              </div>
            )}
            
            <div className="border-t-2 border-blue-300 pt-3 mt-4">
              <div className="bg-white p-3 rounded border">
                <span className="text-sm text-gray-600">Montant en lettres:</span>
                <p className="font-medium text-blue-900 capitalize">
                  {amountInWords}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statut du paiement */}
        <div className="text-center mb-8">
          <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg ${
            fee.status === 'PAID' ? 'bg-green-500' :
            fee.status === 'PARTIAL' ? 'bg-orange-500' :
            'bg-gray-500'
          }`}>
            {fee.status === 'PAID' ? '✓ PAIEMENT COMPLET' :
             fee.status === 'PARTIAL' ? '◐ PAIEMENT PARTIEL' :
             'PAIEMENT EN ATTENTE'}
          </div>
        </div>

        {/* Notes et observations */}
        {fee.notes && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h4 className="font-semibold text-yellow-800">Notes:</h4>
            <p className="text-yellow-700">{fee.notes}</p>
          </div>
        )}

        {/* Signatures */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="text-center">
            <div className="border-t-2 border-gray-300 pt-2 mt-16">
              <p className="font-semibold">Signature du Caissier</p>
              <p className="text-xs text-gray-500">Administration</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-300 pt-2 mt-16">
              <p className="font-semibold">Signature du Parent/Tuteur</p>
              <p className="text-xs text-gray-500">Payeur</p>
            </div>
          </div>
        </div>

        {/* Code de vérification et mentions légales */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>
              <p>Code de vérification: {fee.receiptNo}-{Date.now().toString().slice(-6)}</p>
              <p>Ce reçu est généré électroniquement et constitue une preuve de paiement valide.</p>
            </div>
            <div className="text-right">
              <p>Document généré le {currentDate} à {currentTime}</p>
              <p>École Masomo Pro - Tous droits réservés</p>
            </div>
          </div>
        </div>

        {/* QR Code de vérification (placeholder) */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gray-100 border rounded flex items-center justify-center">
          <div className="text-xs text-center text-gray-500">
            <div className="w-12 h-12 bg-gray-300 rounded mb-1"></div>
            <span>QR Code</span>
          </div>
        </div>
      </div>

      {/* Styles d'impression */}
      <style jsx>{`
        @media print {
          body { margin: 0; }
          .print\\:max-w-none { max-width: none !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:p-6 { padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}

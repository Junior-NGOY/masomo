"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from "lucide-react";
import CompactReceiptTemplate from "@/components/CompactReceiptTemplate";
import { StudentFee } from "@/services/studentMockDataService";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: StudentFee | null;
  paymentAmount?: number; // Montant payé à cette transaction spécifique
  balanceBefore?: number; // Solde avant ce paiement
}

export default function ReceiptModal({ isOpen, onClose, fee, paymentAmount, balanceBefore }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Reçu-${fee?.receiptNo || 'N/A'}`,
    pageStyle: `
      @page {
        size: 80mm 80mm;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .receipt-container {
          width: 80mm !important;
          max-width: 80mm !important;
          margin: 0 !important;
          padding: 4mm !important;
        }
      }
    `,
  });

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !fee) return;

    try {
      // Import dynamique pour éviter les erreurs côté serveur
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 80],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `Reçu-${fee.receiptNo}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF");
    }
  };

  if (!fee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Aperçu du Reçu - {fee.receiptNo}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div ref={receiptRef}>
            <CompactReceiptTemplate 
              fee={fee} 
              paymentAmount={paymentAmount}
              balanceBefore={balanceBefore}
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimer le reçu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

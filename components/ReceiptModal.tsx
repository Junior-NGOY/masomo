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
}

export default function ReceiptModal({ isOpen, onClose, fee }: ReceiptModalProps) {
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

  const handleDownloadPDF = () => {
    // Pour l'instant, nous utilisons l'impression
    // Dans une vraie application, vous pourriez utiliser une bibliothèque comme jsPDF
    handlePrint();
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
            <CompactReceiptTemplate fee={fee} />
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

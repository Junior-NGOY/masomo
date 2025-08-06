"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Banknote,
  X,
  AlertCircle
} from "lucide-react";
import { StudentMockDataService, StudentFee } from "@/services/studentMockDataService";

interface PaymentModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  fee?: StudentFee | null;
  studentName?: string;
}

export default function PaymentModal({ isOpen, onClose, fee, studentName }: PaymentModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Utilise l'état externe si fourni, sinon l'état interne
  const modalOpen = isOpen !== undefined ? isOpen : internalOpen;
  const handleClose = onClose || (() => setInternalOpen(false));

  // Mock fee pour le mode autonome
  const defaultFee: StudentFee = {
    id: "mock_fee",
    studentId: "mock_student",
    studentName: "Élève sélectionné",
    className: "6ème A",
    feeType: "Frais de scolarité",
    amount: 150000,
    remainingAmount: 150000,
    dueDate: new Date().toISOString().split('T')[0],
    status: "PENDING"
  };

  const activeFee = fee || defaultFee;
  const activeStudentName = studentName || "Élève sélectionné";

  const outstandingAmount = activeFee.remainingAmount || activeFee.amount;
  const isPartialPayment = amount && parseFloat(amount) < outstandingAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod || !amount) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsProcessing(true);

    // Simulation du processus de paiement
    setTimeout(() => {
      alert(`Paiement de ${StudentMockDataService.formatCurrency(parseFloat(amount))} enregistré avec succès!`);
      setIsProcessing(false);
      handleClose();
      
      // Reset form
      setPaymentMethod("");
      setAmount("");
      setTransactionRef("");
      setNotes("");
    }, 2000);
  };

  const paymentMethods = [
    { 
      id: "mobile_money", 
      name: "Mobile Money", 
      icon: Smartphone,
      description: "Paiement via Orange Money, Airtel Money, etc."
    },
    { 
      id: "cash", 
      name: "Espèces", 
      icon: Banknote,
      description: "Paiement en liquide"
    },
    { 
      id: "bank_transfer", 
      name: "Virement bancaire", 
      icon: CreditCard,
      description: "Virement ou carte bancaire"
    }
  ];

  return (
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      {/* Si pas de props externes, afficher le trigger button */}
      {isOpen === undefined && (
        <Button 
          onClick={() => setInternalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Nouveau Paiement
        </Button>
      )}
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Enregistrer un paiement
            </span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Enregistrez un nouveau paiement pour {activeStudentName}
          </DialogDescription>
        </DialogHeader>

        {/* Informations sur les frais */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{activeFee.feeType}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div>
              <span className="text-sm text-gray-500">Montant total:</span>
              <p className="font-semibold">{StudentMockDataService.formatCurrency(activeFee.amount)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Montant dû:</span>
              <p className="font-semibold text-red-600">
                {StudentMockDataService.formatCurrency(outstandingAmount)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Date d'échéance:</span>
              <p className="font-medium">{new Date(activeFee.dueDate).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Statut:</span>
              <p className={`font-medium ${
                activeFee.status === 'OVERDUE' ? 'text-red-600' : 
                activeFee.status === 'PARTIAL' ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {activeFee.status === 'OVERDUE' ? 'En retard' : 
                 activeFee.status === 'PARTIAL' ? 'Partiel' : 'En attente'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de paiement */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Méthode de paiement */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Méthode de paiement *</Label>
            <div className="grid gap-3 md:grid-cols-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer border-2 transition-colors ${
                      paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${
                        paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <h3 className="font-medium text-sm">{method.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Montant */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium">
              Montant à payer * 
              <span className="text-sm font-normal text-gray-500">
                (Max: {StudentMockDataService.formatCurrency(outstandingAmount)})
              </span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Montant en FC"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={outstandingAmount}
              required
              className="text-lg"
            />
            {isPartialPayment && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                Paiement partiel - Solde restant: {StudentMockDataService.formatCurrency(outstandingAmount - parseFloat(amount))}
              </div>
            )}
          </div>

          {/* Référence de transaction */}
          <div className="space-y-2">
            <Label htmlFor="transactionRef" className="text-base font-medium">
              Référence de transaction
            </Label>
            <Input
              id="transactionRef"
              placeholder="Numéro de transaction ou référence"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">
              Notes (optionnel)
            </Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires sur le paiement..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || !paymentMethod || !amount}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                "Traitement..."
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Enregistrer le paiement
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

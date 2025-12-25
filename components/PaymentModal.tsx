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
import { StudentFee } from "@/hooks/useStudentFees";
import { createPayment } from "@/actions/studentFees";
import { formatCurrency } from "@/utils/format";

interface PaymentModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  fee?: StudentFee | null;
  studentName?: string;
  onPaymentSuccess?: () => void;
}

export default function PaymentModal({ isOpen, onClose, fee, studentName, onPaymentSuccess }: PaymentModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Utilise l'état externe si fourni, sinon l'état interne
  const modalOpen = isOpen !== undefined ? isOpen : internalOpen;
  const handleClose = () => {
    if (onClose) onClose();
    else setInternalOpen(false);
    // Reset form
    setPaymentMethod("");
    setAmount("");
    setTransactionRef("");
    setNotes("");
    setError("");
  };

  // Montant dû
  const outstandingAmount = fee?.remainingAmount || fee?.amount || 0;
  const isPartialPayment = amount && parseFloat(amount) < outstandingAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!paymentMethod || !amount) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      setError("Le montant doit être supérieur à 0");
      return;
    }

    if (paymentAmount > outstandingAmount) {
      setError(`Le montant ne peut pas dépasser ${formatCurrency(outstandingAmount)}`);
      return;
    }

    if (!fee?.id) {
      setError("Les informations sur les frais sont manquantes");
      return;
    }

    setIsProcessing(true);

    try {
      // Appel à l'API pour enregistrer le paiement avec reçu
      await createPayment({
        studentFeeStructureId: fee.id,
        studentId: fee.studentId,
        amount: paymentAmount,
        paymentMethod,
        transactionReference: transactionRef,
        notes,
      });
      
      // Succès
      alert(`Paiement de ${formatCurrency(paymentAmount)} enregistré avec succès! Un reçu a été généré.`);
      
      // Callback pour rafraîchir les données
      if (onPaymentSuccess) {
        onPaymentSuccess();
      } else {
        window.location.reload();
      }
      
      handleClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement du paiement");
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
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

  // Valeurs affichées
  const activeStudentName = studentName || "Élève sélectionné";

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
        {fee && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{fee.feeType}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div>
                <span className="text-sm text-gray-500">Montant total:</span>
                <p className="font-semibold">{formatCurrency(fee.amount)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Montant dû:</span>
                <p className="font-semibold text-red-600">
                  {formatCurrency(outstandingAmount)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Date d'échéance:</span>
                <p className="font-medium">{new Date(fee.dueDate).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Statut:</span>
                <p className={`font-medium ${
                  fee.status === 'OVERDUE' ? 'text-red-600' : 
                  fee.status === 'PARTIAL' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {fee.status === 'OVERDUE' ? 'En retard' : 
                   fee.status === 'PARTIAL' ? 'Partiel' : 'En attente'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md mb-4">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

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
                (Max: {formatCurrency(outstandingAmount)})
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
                Paiement partiel - Solde restant: {formatCurrency(outstandingAmount - parseFloat(amount))}
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
              disabled={isProcessing || !paymentMethod || !amount || !fee}
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

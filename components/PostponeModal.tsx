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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  X,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { StudentMockDataService, StudentFee } from "@/services/studentMockDataService";

interface PostponeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: StudentFee | null;
  studentName?: string;
  onConfirm: (feeId: string, newDate: string, reason: string) => Promise<void>;
}

export default function PostponeModal({ isOpen, onClose, fee, studentName, onConfirm }: PostponeModalProps) {
  const [newDueDate, setNewDueDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!fee) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reporter un paiement</DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-500">
            Aucun frais sélectionné
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const outstandingAmount = fee.remainingAmount || fee.amount;
  const currentDueDate = new Date(fee.dueDate);
  const selectedDate = newDueDate ? new Date(newDueDate) : null;
  const isValidDate = selectedDate && selectedDate > currentDueDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDueDate || !reason) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!isValidDate) {
      alert("La nouvelle date d'échéance doit être postérieure à la date actuelle");
      return;
    }

    setIsProcessing(true);

    try {
      await onConfirm(fee.id, newDueDate, reason);
      onClose();
      // Reset form
      setNewDueDate("");
      setReason("");
      setNotes("");
    } catch (error) {
      console.error("Error postponing fee:", error);
      alert("Une erreur est survenue lors du report du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const commonReasons = [
    "Difficultés financières temporaires",
    "Attente de transfert de fonds",
    "Problème de santé familial",
    "Retard de salaire",
    "Autre situation exceptionnelle"
  ];

  // Calculer la date minimum (demain)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Reporter un paiement
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Demande de report d'échéance pour {studentName}
          </DialogDescription>
        </DialogHeader>

        {/* Informations sur les frais */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{fee.feeType}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div>
              <span className="text-sm text-gray-500">Montant dû:</span>
              <p className="font-semibold text-red-600">
                {StudentMockDataService.formatCurrency(outstandingAmount)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Échéance actuelle:</span>
              <p className="font-medium text-orange-600">
                {currentDueDate.toLocaleDateString('fr-FR')}
              </p>
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
            {fee.status === 'OVERDUE' && (
              <div>
                <span className="text-sm text-gray-500">Jours de retard:</span>
                <p className="font-medium text-red-600">
                  {Math.floor((new Date('2025-02-15').getTime() - currentDueDate.getTime()) / (1000 * 60 * 60 * 24))} jours
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerte pour les retards */}
        {fee.status === 'OVERDUE' && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Paiement en retard</p>
              <p className="text-amber-700">
                Ce paiement est déjà en retard. Un report nécessite une justification et peut être soumis à des frais supplémentaires.
              </p>
            </div>
          </div>
        )}

        {/* Formulaire de report */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nouvelle date d'échéance */}
          <div className="space-y-2">
            <Label htmlFor="newDueDate" className="text-base font-medium">
              Nouvelle date d'échéance *
            </Label>
            <Input
              id="newDueDate"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              min={minDate}
              required
              className="text-lg"
            />
            {selectedDate && isValidDate && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                Extension de {Math.ceil((selectedDate.getTime() - currentDueDate.getTime()) / (1000 * 60 * 60 * 24))} jours
              </div>
            )}
          </div>

          {/* Raison du report */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Raison du report *</Label>
            <div className="grid gap-2">
              {commonReasons.map((commonReason, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  className={`justify-start text-left h-auto p-3 ${
                    reason === commonReason ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setReason(commonReason)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      reason === commonReason ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {reason === commonReason && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="text-sm">{commonReason}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Notes supplémentaires */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">
              Détails supplémentaires (optionnel)
            </Label>
            <Textarea
              id="notes"
              placeholder="Ajoutez des détails sur la situation qui justifie ce report..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Information importante */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">À noter</p>
                <p className="text-blue-700">
                  Cette demande de report sera examinée par l'administration. 
                  Une notification vous sera envoyée une fois la décision prise.
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || !newDueDate || !reason || !isValidDate}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                "Traitement..."
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Soumettre la demande
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

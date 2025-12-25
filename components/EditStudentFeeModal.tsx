"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StudentFee } from "@/hooks/useStudentFees";
import { 
  Calendar,
  DollarSign,
  Save,
  Trash2,
  Copy,
  AlertTriangle,
  User,
  FileText,
  CreditCard
} from "lucide-react";

interface EditStudentFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: StudentFee | null;
  onUpdate: (updatedFee: StudentFee) => void;
  onDelete: (feeId: string) => void;
  onDuplicate?: (fee: StudentFee) => void;
}

export default function EditStudentFeeModal({
  isOpen,
  onClose,
  fee,
  onUpdate,
  onDelete,
  onDuplicate
}: EditStudentFeeModalProps) {
  // États du formulaire
  const [formData, setFormData] = useState({
    feeType: "",
    amount: "",
    dueDate: "",
    status: "PENDING" as "PAID" | "PENDING" | "OVERDUE" | "PARTIAL",
    paymentMethod: "",
    paidDate: "",
    receiptNo: "",
    remainingAmount: "",
    notes: ""
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser le formulaire quand la modal s'ouvre
  useEffect(() => {
    if (fee && isOpen) {
      setFormData({
        feeType: fee.feeType,
        amount: fee.amount.toString(),
        dueDate: fee.dueDate,
        status: fee.status,
        paymentMethod: fee.paymentMethod || "",
        paidDate: fee.paidDate || "",
        receiptNo: fee.receiptNo || "",
        remainingAmount: (fee.remainingAmount || 0).toString(),
        notes: fee.notes || ""
      });
    }
  }, [fee, isOpen]);

  // Types de frais disponibles
  const feeTypes = [
    "Frais de scolarité",
    "Transport scolaire",
    "Cantine",
    "Frais d'examens",
    "Matériel scolaire",
    "Activités extrascolaires",
    "Assurance scolaire",
    "Frais de bibliothèque",
    "Uniformes scolaires",
    "Autre"
  ];

  // Méthodes de paiement
  const paymentMethods = [
    "Espèces",
    "Virement bancaire",
    "Mobile Money",
    "Carte bancaire",
    "Chèque"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculer automatiquement le montant restant si nécessaire
    if (field === 'amount' && formData.status === 'PARTIAL') {
      const newAmount = parseFloat(value) || 0;
      const remainingAmount = parseFloat(formData.remainingAmount) || 0;
      if (remainingAmount > newAmount) {
        setFormData(prev => ({
          ...prev,
          remainingAmount: newAmount.toString()
        }));
      }
    }
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({
      ...prev,
      status: status as "PAID" | "PENDING" | "OVERDUE" | "PARTIAL",
      // Réinitialiser certains champs selon le statut
      paidDate: status === 'PAID' ? (prev.paidDate || new Date().toISOString().split('T')[0]) : prev.paidDate,
      remainingAmount: status === 'PAID' ? "0" : prev.remainingAmount,
      receiptNo: status === 'PAID' ? (prev.receiptNo || `REC-${Date.now()}`) : prev.receiptNo
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fee) return;

    setIsSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      const remainingAmount = parseFloat(formData.remainingAmount) || 0;

      // Validation
      if (amount <= 0) {
        alert("Le montant doit être supérieur à 0");
        return;
      }

      if (formData.status === 'PARTIAL' && remainingAmount >= amount) {
        alert("Le montant restant doit être inférieur au montant total");
        return;
      }

      const updatedFee: StudentFee = {
        ...fee,
        feeType: formData.feeType,
        amount: amount,
        dueDate: formData.dueDate,
        status: formData.status,
        paymentMethod: formData.paymentMethod || undefined,
        paidDate: formData.paidDate || undefined,
        receiptNo: formData.receiptNo || undefined,
        remainingAmount: remainingAmount > 0 ? remainingAmount : undefined,
        notes: formData.notes || undefined
      };

      onUpdate(updatedFee);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Une erreur est survenue lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (fee) {
      onDelete(fee.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleDuplicate = () => {
    if (!fee) return;

    if (onDuplicate) {
      onDuplicate(fee);
      onClose();
      return;
    }

    const duplicatedFee: StudentFee = {
      ...fee,
      id: `fee_${Date.now()}`,
      status: 'PENDING',
      paidDate: undefined,
      receiptNo: undefined,
      paymentMethod: undefined,
      notes: `Copie de ${fee.feeType}`,
      remainingAmount: fee.amount
    };

    onUpdate(duplicatedFee);
    onClose();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PAID: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      OVERDUE: "bg-red-100 text-red-800",
      PARTIAL: "bg-blue-100 text-blue-800"
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const getStatusText = (status: string) => {
    const texts = {
      PAID: "Payé",
      PENDING: "En attente",
      OVERDUE: "En retard",
      PARTIAL: "Paiement partiel"
    };
    return texts[status as keyof typeof texts] || "En attente";
  };

  if (!fee) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le frais scolaire</DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-500">
            Aucun frais sélectionné
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Modifier le frais scolaire
          </DialogTitle>
        </DialogHeader>

        {showDeleteConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Confirmer la suppression</span>
            </div>
            <p className="text-red-700 text-sm mb-3">
              Êtes-vous sûr de vouloir supprimer ce frais ? Cette action est irréversible.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                Supprimer définitivement
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feeType">Type de frais *</Label>
              <Input 
                id="feeType" 
                value={formData.feeType} 
                disabled 
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">Le type de frais ne peut pas être modifié.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant (CDF) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="pl-10"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Date d'échéance et statut */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Statut du paiement</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="PAID">Payé</SelectItem>
                  <SelectItem value="PARTIAL">Paiement partiel</SelectItem>
                  <SelectItem value="OVERDUE">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informations de paiement (si payé ou partiel) */}
          {(formData.status === 'PAID' || formData.status === 'PARTIAL') && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900">Informations de paiement</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map(method => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paidDate">Date de paiement</Label>
                  <Input
                    id="paidDate"
                    type="date"
                    value={formData.paidDate}
                    onChange={(e) => handleInputChange('paidDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="receiptNo">Numéro de reçu</Label>
                  <Input
                    id="receiptNo"
                    value={formData.receiptNo}
                    onChange={(e) => handleInputChange('receiptNo', e.target.value)}
                    placeholder="REC-XXXX"
                  />
                </div>

                {formData.status === 'PARTIAL' && (
                  <div className="space-y-2">
                    <Label htmlFor="remainingAmount">Montant restant (CDF)</Label>
                    <Input
                      id="remainingAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.remainingAmount}
                      onChange={(e) => handleInputChange('remainingAmount', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ajouter des notes ou commentaires..."
              rows={3}
            />
          </div>

          {/* Aperçu du statut */}
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold text-gray-900 mb-2">Aperçu</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">Statut actuel:</span>
              <Badge className={getStatusColor(formData.status)}>
                {getStatusText(formData.status)}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              <p>Élève: {fee.studentName}</p>
              <p>Classe: {fee.className}</p>
              <p>Montant total: {parseFloat(formData.amount || "0").toLocaleString()} CDF</p>
              {formData.status === 'PARTIAL' && (
                <p>Montant restant: {parseFloat(formData.remainingAmount || "0").toLocaleString()} CDF</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDuplicate}
              >
                <Copy className="h-4 w-4 mr-2" />
                Dupliquer
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sauvegarde..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

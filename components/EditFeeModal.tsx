"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Edit3, 
  X,
  AlertCircle,
  Calculator,
  Calendar,
  Users,
  Save,
  Trash2,
  Copy,
  History
} from "lucide-react";
import { StudentMockDataService, ClassFee } from "@/services/studentMockDataService";

interface EditFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: ClassFee | null;
  onFeeUpdated?: (updatedFee: ClassFee) => void;
}

export default function EditFeeModal({ isOpen, onClose, fee, onFeeUpdated }: EditFeeModalProps) {
  const [feeType, setFeeType] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringType, setRecurringType] = useState<string>("");
  const [dueDayOfMonth, setDueDayOfMonth] = useState<string>("15");
  const [excludedMonths, setExcludedMonths] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Initialiser les valeurs du formulaire quand la modal s'ouvre
  useEffect(() => {
    if (fee && isOpen) {
      setFeeType(fee.feeType);
      setSelectedClass(fee.className);
      setAmount(fee.amount.toString());
      setDueDate(fee.dueDate || "");
      setDescription(fee.description || "");
      setCategory(fee.category);
      setIsRecurring(fee.isRecurring);
      setRecurringType(fee.recurringType || "");
      setDueDayOfMonth(fee.dueDayOfMonth?.toString() || "15");
      setExcludedMonths(fee.excludedMonths || []);
    }
  }, [fee, isOpen]);

  const classes = ["6ème Primaire A", "5ème Primaire B", "4ème Primaire C", "3ème Primaire A", "2ème Primaire B"];
  
  const categories = [
    { id: "TUITION", name: "Frais de scolarité", icon: "📚" },
    { id: "TRANSPORT", name: "Transport", icon: "🚌" },
    { id: "EXAM", name: "Examens", icon: "📝" },
    { id: "UNIFORM", name: "Uniforme", icon: "👔" },
    { id: "REGISTRATION", name: "Inscription", icon: "📋" },
    { id: "OTHER", name: "Autre", icon: "📄" }
  ];

  const recurringOptions = [
    { id: "MONTHLY", name: "Mensuel", description: "Chaque mois (Sept-Juin)" },
    { id: "QUARTERLY", name: "Trimestriel", description: "3 fois par an" },
    { id: "SEMESTER", name: "Semestriel", description: "2 fois par an" },
    { id: "ANNUAL", name: "Annuel", description: "Une fois par an" }
  ];

  const availableMonths = [
    "septembre", "octobre", "novembre", "décembre", 
    "janvier", "février", "mars", "avril", "mai", "juin"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fee || !feeType || !selectedClass || !amount || !category) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsProcessing(true);

    const updates: Partial<ClassFee> = {
      feeType,
      className: selectedClass,
      amount: parseFloat(amount),
      dueDate: !isRecurring ? dueDate : undefined,
      description: description || undefined,
      category: category as ClassFee['category'],
      isRecurring,
      recurringType: isRecurring ? (recurringType as ClassFee['recurringType']) : undefined,
      dueDayOfMonth: isRecurring && recurringType === 'MONTHLY' ? parseInt(dueDayOfMonth) : undefined,
      excludedMonths: isRecurring && excludedMonths.length > 0 ? excludedMonths : undefined,
    };

    try {
      // Simulation de la mise à jour
      setTimeout(() => {
        const updatedFee = StudentMockDataService.updateClassFee(fee.id, updates);
        if (updatedFee) {
          alert("Frais modifié avec succès!");
          onFeeUpdated?.(updatedFee);
          onClose();
        } else {
          alert("Erreur lors de la modification du frais");
        }
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert("Une erreur s'est produite lors de la modification");
      setIsProcessing(false);
    }
  };

  const handleDelete = () => {
    if (!fee) return;
    
    setIsProcessing(true);
    
    // Simulation de la suppression
    setTimeout(() => {
      const deleted = StudentMockDataService.deleteClassFee(fee.id, true);
      if (deleted) {
        alert("Frais supprimé avec succès!");
        onClose();
      } else {
        alert("Erreur lors de la suppression du frais");
      }
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }, 1000);
  };

  const handleDuplicate = () => {
    if (!fee) return;
    
    const newClass = prompt("Vers quelle classe voulez-vous dupliquer ce frais ?", "");
    if (!newClass) return;
    
    const duplicated = StudentMockDataService.duplicateClassFeeToClass(fee.id, newClass);
    if (duplicated) {
      alert(`Frais dupliqué avec succès vers ${newClass}!`);
    } else {
      alert("Erreur lors de la duplication");
    }
  };

  const resetForm = () => {
    if (fee) {
      setFeeType(fee.feeType);
      setSelectedClass(fee.className);
      setAmount(fee.amount.toString());
      setDueDate(fee.dueDate || "");
      setDescription(fee.description || "");
      setCategory(fee.category);
      setIsRecurring(fee.isRecurring);
      setRecurringType(fee.recurringType || "");
      setDueDayOfMonth(fee.dueDayOfMonth?.toString() || "15");
      setExcludedMonths(fee.excludedMonths || []);
    }
  };

  const toggleExcludedMonth = (month: string) => {
    setExcludedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const affectedStudents = fee ? StudentMockDataService.getStudentsAffectedByClassFee(fee.id) : [];

  if (!fee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-blue-600" />
              Modifier le frais de classe
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleDuplicate}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Modifiez les paramètres du frais. Les modifications affecteront tous les élèves de la classe concernée.
          </DialogDescription>
        </DialogHeader>

        {/* Informations actuelles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informations actuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <span className="text-sm text-gray-500">ID:</span>
                <p className="font-mono text-sm">{fee.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Créé le:</span>
                <p className="font-medium">{fee.createdDate}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Élèves affectés:</span>
                <p className="font-medium text-blue-600">{affectedStudents.length} élève(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de modification */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de frais et classe */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feeType" className="text-base font-medium">
                Type de frais *
              </Label>
              <Input
                id="feeType"
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                placeholder="Ex: Frais de scolarité mensuel"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class" className="text-base font-medium">
                Classe concernée *
              </Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(className => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Montant et catégorie */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-medium">
                Montant (FC) *
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Catégorie *</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <Card
                    key={cat.id}
                    className={`cursor-pointer border-2 transition-colors ${
                      category === cat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-lg">{cat.icon}</div>
                      <div className="text-xs font-medium">{cat.name}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Options de récurrence */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(!!checked)}
              />
              <Label htmlFor="isRecurring" className="text-base font-medium">
                Frais récurrent
              </Label>
            </div>

            {isRecurring && (
              <Card className="p-4 bg-blue-50">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Type de récurrence *</Label>
                    <div className="grid gap-2 md:grid-cols-2 mt-2">
                      {recurringOptions.map(option => (
                        <Card
                          key={option.id}
                          className={`cursor-pointer border-2 transition-colors ${
                            recurringType === option.id ? 'border-blue-500 bg-blue-100' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setRecurringType(option.id)}
                        >
                          <CardContent className="p-3">
                            <h4 className="font-medium">{option.name}</h4>
                            <p className="text-xs text-gray-600">{option.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {recurringType === 'MONTHLY' && (
                    <>
                      <div>
                        <Label htmlFor="dueDayOfMonth" className="text-base font-medium">
                          Jour d'échéance du mois
                        </Label>
                        <Input
                          id="dueDayOfMonth"
                          type="number"
                          value={dueDayOfMonth}
                          onChange={(e) => setDueDayOfMonth(e.target.value)}
                          min="1"
                          max="31"
                          className="w-32 mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium">Mois à exclure (optionnel)</Label>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {availableMonths.map(month => (
                            <div key={month} className="flex items-center space-x-2">
                              <Checkbox
                                id={`month-${month}`}
                                checked={excludedMonths.includes(month)}
                                onCheckedChange={() => toggleExcludedMonth(month)}
                              />
                              <Label htmlFor={`month-${month}`} className="text-sm capitalize">
                                {month}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}

            {!isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-base font-medium">
                  Date d'échéance *
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required={!isRecurring}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description (optionnel)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description détaillée du frais..."
              rows={3}
            />
          </div>

          {/* Avertissement pour les modifications */}
          {amount !== fee.amount.toString() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Modification du montant</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    La modification du montant affectera tous les paiements en attente pour ce frais.
                    Les paiements déjà effectués ne seront pas modifiés.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={resetForm}>
              <History className="h-4 w-4 mr-2" />
              Annuler les modifications
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Fermer
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                "Modification..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les modifications
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Dialog de confirmation de suppression */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce frais ? Cette action est irréversible et 
                affectera tous les {affectedStudents.length} élève(s) de la classe.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

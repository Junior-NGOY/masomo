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
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  X,
  Calculator,
  Calendar,
  Users,
  BookOpen,
  AlertCircle,
  GraduationCap,
  Bus,
  FileText,
  Shirt,
  CheckCircle
} from "lucide-react";
import { StudentMockDataService } from "@/services/studentMockDataService";

interface NewFeeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function NewFeeModal({ isOpen, onClose }: NewFeeModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [feeType, setFeeType] = useState<string>("");
  const [customFeeType, setCustomFeeType] = useState<string>("");
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

  const classes = ["6ème Primaire A", "5ème Primaire B", "4ème Primaire C", "3ème Primaire A", "2ème Primaire B"];

  const feeTypeOptions = [
    { 
      id: "scolarite", 
      name: "Frais de scolarité", 
      icon: GraduationCap,
      category: "Académique",
      description: "Frais mensuels ou trimestriels de scolarité"
    },
    { 
      id: "inscription", 
      name: "Frais d'inscription", 
      icon: FileText,
      category: "Administration",
      description: "Frais d'inscription pour l'année scolaire"
    },
    { 
      id: "uniform", 
      name: "Uniforme scolaire", 
      icon: Shirt,
      category: "Matériel",
      description: "Achat d'uniformes et accessoires"
    },
    { 
      id: "transport", 
      name: "Transport scolaire", 
      icon: Bus,
      category: "Service",
      description: "Frais de transport mensuel"
    },
    { 
      id: "cantine", 
      name: "Cantine", 
      icon: Users,
      category: "Service",
      description: "Repas et collations"
    },
    { 
      id: "books", 
      name: "Manuels scolaires", 
      icon: BookOpen,
      category: "Matériel",
      description: "Livres et supports pédagogiques"
    },
    { 
      id: "excursion", 
      name: "Sortie éducative", 
      icon: Users,
      category: "Activité",
      description: "Voyages et sorties pédagogiques"
    },
    { 
      id: "custom", 
      name: "Autre (personnalisé)", 
      icon: Plus,
      category: "Autre",
      description: "Frais personnalisé"
    }
  ];

  const categories = [
    "Académique",
    "Administration", 
    "Matériel",
    "Service",
    "Activité",
    "Autre"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de base
    if (!feeType || !selectedClass || !amount) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation pour frais non récurrents
    if (!isRecurring && !dueDate) {
      alert("Veuillez spécifier une date d'échéance");
      return;
    }

    // Validation pour frais récurrents
    if (isRecurring && !recurringType) {
      alert("Veuillez choisir un type de récurrence");
      return;
    }

    if (feeType === "custom" && !customFeeType) {
      alert("Veuillez spécifier le type de frais personnalisé");
      return;
    }

    setIsProcessing(true);

    const finalFeeType = feeType === "custom" ? customFeeType : 
                        feeTypeOptions.find(option => option.id === feeType)?.name || feeType;
    
    const finalCategory = category || 
                         feeTypeOptions.find(option => option.id === feeType)?.category || "Autre";

    const newClassFee = {
      className: selectedClass,
      feeType: finalFeeType,
      category: finalCategory,
      amount: parseFloat(amount),
      dueDate: !isRecurring ? dueDate : undefined,
      description,
      isRecurring,
      recurringType: isRecurring ? recurringType as any : undefined,
      dueDayOfMonth: recurringType === "MONTHLY" ? parseInt(dueDayOfMonth) : undefined,
      excludedMonths,
      academicYear: "2024-2025",
      status: 'ACTIVE'
    };

    // Simulation de l'enregistrement
    setTimeout(() => {
      let message = `Frais "${finalFeeType}" créé avec succès pour la classe ${selectedClass}!\n`;
      
      if (isRecurring) {
        message += `\n🔄 Frais récurrent (${recurringType}):\n`;
        if (recurringType === "MONTHLY") {
          message += `• Échéances générées pour septembre à juin\n`;
          message += `• Jour d'échéance: ${dueDayOfMonth} de chaque mois\n`;
        } else if (recurringType === "QUARTERLY") {
          message += `• 3 échéances trimestrielles générées\n`;
        } else if (recurringType === "SEMESTER") {
          message += `• 2 échéances semestrielles générées\n`;
        } else {
          message += `• 1 échéance annuelle générée\n`;
        }
      } else {
        message += `\n📅 Échéance unique: ${new Date(dueDate).toLocaleDateString('fr-FR')}\n`;
      }
      
      const studentsCount = StudentMockDataService.getStudentProfiles()
        .filter(s => s.className === selectedClass).length;
      message += `\n👥 ${studentsCount} élève(s) concerné(s)`;
      
      alert(message);
      console.log("Nouveau frais créé:", newClassFee);
      setIsProcessing(false);
      
      // Reset form
      setFeeType("");
      setCustomFeeType("");
      setSelectedClass("");
      setAmount("");
      setDueDate("");
      setDescription("");
      setCategory("");
      setIsRecurring(false);
      setRecurringType("");
      setDueDayOfMonth("15");
      setExcludedMonths([]);
      
      if (onClose) {
        onClose();
      } else {
        setInternalOpen(false);
      }
    }, 1500);
  };

  const selectedFeeOption = feeTypeOptions.find(option => option.id === feeType);
  
  // Utilise l'état externe si fourni, sinon l'état interne
  const modalOpen = isOpen !== undefined ? isOpen : internalOpen;
  const handleClose = onClose || (() => setInternalOpen(false));

  return (
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      {/* Si pas de props externes, afficher le trigger button */}
      {isOpen === undefined && (
        <Button 
          onClick={() => setInternalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Frais
        </Button>
      )}
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Créer un nouveau frais de classe
            </span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Créez un nouveau frais qui sera automatiquement assigné à tous les élèves de la classe sélectionnée.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Sélection du type de frais */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Type de frais *</Label>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {feeTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer border-2 transition-colors ${
                      feeType === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFeeType(option.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${
                        feeType === option.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <h3 className="font-medium text-sm">{option.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {option.category}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedFeeOption && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">{selectedFeeOption.description}</p>
              </div>
            )}

            {feeType === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customFeeType">Nom du frais personnalisé *</Label>
                <Input
                  id="customFeeType"
                  placeholder="Ex: Matériel de laboratoire"
                  value={customFeeType}
                  onChange={(e) => setCustomFeeType(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Sélection de la classe */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Classe concernée *</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {className}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Montant et date d'échéance */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-medium">
                Montant (FC) *
              </Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Ex: 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-base font-medium">
                {isRecurring ? "Date de début (optionnelle)" : "Date d'échéance *"}
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-10"
                  required={!isRecurring}
                />
              </div>
            </div>

            {/* Options de récurrence */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={isRecurring}
                  onChange={(e) => {
                    setIsRecurring(e.target.checked);
                    if (!e.target.checked) {
                      setRecurringType("");
                      setDueDayOfMonth("15");
                      setExcludedMonths([]);
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isRecurring" className="text-base font-medium">
                  Frais récurrent (se répète)
                </Label>
              </div>

              {isRecurring && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Type de récurrence *</Label>
                    <Select value={recurringType} onValueChange={setRecurringType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir la fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Mensuel (Sept-Juin)</SelectItem>
                        <SelectItem value="QUARTERLY">Trimestriel</SelectItem>
                        <SelectItem value="SEMESTER">Semestriel</SelectItem>
                        <SelectItem value="ANNUAL">Annuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {recurringType === "MONTHLY" && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Jour d'échéance du mois</Label>
                      <Select value={dueDayOfMonth} onValueChange={setDueDayOfMonth}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1er du mois</SelectItem>
                          <SelectItem value="5">5 du mois</SelectItem>
                          <SelectItem value="10">10 du mois</SelectItem>
                          <SelectItem value="15">15 du mois</SelectItem>
                          <SelectItem value="20">20 du mois</SelectItem>
                          <SelectItem value="25">25 du mois</SelectItem>
                          <SelectItem value="30">Fin du mois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {recurringType && (
                    <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      <strong>Aperçu:</strong> Ce frais générera automatiquement les échéances suivant le calendrier académique
                      {recurringType === "MONTHLY" && " (de septembre à juin)"}
                      {recurringType === "QUARTERLY" && " (3 trimestres)"}
                      {recurringType === "SEMESTER" && " (2 semestres)"}
                      {recurringType === "ANNUAL" && " (une fois par an)"}.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Catégorie (si frais personnalisé) */}
          {feeType === "custom" && (
            <div className="space-y-2">
              <Label className="text-base font-medium">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description (optionnel)
            </Label>
            <Textarea
              id="description"
              placeholder="Informations supplémentaires sur ce frais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Options avancées */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Options avancées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  id="isRecurring"
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="isRecurring" className="text-sm">
                  Frais récurrent (se répète chaque mois)
                </Label>
              </div>

              {isRecurring && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    Ce frais sera automatiquement recréé chaque mois pour cette classe.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Résumé avant création */}
          {selectedClass && amount && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Résumé de création</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Classe:</strong> {selectedClass}</p>
                  <p><strong>Type:</strong> {feeType === "custom" ? customFeeType : selectedFeeOption?.name}</p>
                  <p><strong>Montant:</strong> {StudentMockDataService.formatCurrency(parseFloat(amount) || 0)}</p>
                  <p><strong>Échéance:</strong> {dueDate && new Date(dueDate).toLocaleDateString('fr-FR')}</p>
                  <p className="text-xs mt-2">
                    Ce frais sera automatiquement assigné à tous les élèves de la classe {selectedClass}.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || !feeType || !selectedClass || !amount || !dueDate}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                "Création..."
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le frais
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

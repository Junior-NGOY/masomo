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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
  CheckCircle,
  Check,
  ChevronsUpDown
} from "lucide-react";
import { StudentMockDataService } from "@/services/studentMockDataService";
import { useClasses } from "@/hooks/useClasses";
import { createFee } from "@/actions/fees";
import { getActiveAcademicYear } from "@/actions/academicYears";
import useSchoolStore from "@/store/school";
import toast from "react-hot-toast";

interface NewFeeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function NewFeeModal({ isOpen, onClose }: NewFeeModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [feeType, setFeeType] = useState<string>("");
  const [customFeeType, setCustomFeeType] = useState<string>("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringType, setRecurringType] = useState<string>("");
  const [dueDayOfMonth, setDueDayOfMonth] = useState<string>("15");
  const [excludedMonths, setExcludedMonths] = useState<string[]>([]);
  const [activeYearId, setActiveYearId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [openCombobox, setOpenCombobox] = useState(false);

  const { school } = useSchoolStore();
  const { classes: classList, loading: classesLoading } = useClasses();

  React.useEffect(() => {
    const fetchYear = async () => {
      if (school?.id) {
        const year = await getActiveAcademicYear(school.id);
        if (year) {
          setActiveYearId(year.id);
        }
      }
    };
    fetchYear();
  }, [school?.id]);

  //const classes = ["6ème Primaire A", "5ème Primaire B", "4ème Primaire C", "3ème Primaire A", "2ème Primaire B"];

  const feeTypeOptions = [
    { 
      id: "scolarite", 
      name: "Frais de scolarité", 
      icon: GraduationCap,
      category: "Académique",
      description: "Frais mensuels ou trimestriels de scolarité",
      feeTypeEnum: "TUITION"
    },
    { 
      id: "inscription", 
      name: "Frais d'inscription", 
      icon: FileText,
      category: "Administration",
      description: "Frais d'inscription pour l'année scolaire",
      feeTypeEnum: "REGISTRATION"
    },
    { 
      id: "uniform", 
      name: "Uniforme scolaire", 
      icon: Shirt,
      category: "Matériel",
      description: "Achat d'uniformes et accessoires",
      feeTypeEnum: "UNIFORM"
    },
    { 
      id: "transport", 
      name: "Transport scolaire", 
      icon: Bus,
      category: "Service",
      description: "Frais de transport mensuel",
      feeTypeEnum: "TRANSPORT"
    },
    { 
      id: "cantine", 
      name: "Cantine", 
      icon: Users,
      category: "Service",
      description: "Repas et collations",
      feeTypeEnum: "OTHER"
    },
    { 
      id: "books", 
      name: "Manuels scolaires", 
      icon: BookOpen,
      category: "Matériel",
      description: "Livres et supports pédagogiques",
      feeTypeEnum: "BOOKS"
    },
    { 
      id: "excursion", 
      name: "Sortie éducative", 
      icon: Users,
      category: "Activité",
      description: "Voyages et sorties pédagogiques",
      feeTypeEnum: "TRIP"
    },
    { 
      id: "custom", 
      name: "Autre (personnalisé)", 
      icon: Plus,
      category: "Autre",
      description: "Frais personnalisé",
      feeTypeEnum: "OTHER"
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
    if (!feeType || selectedClasses.length === 0 || !amount) {
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

    try {
      if (!school?.id) {
        toast.error("École non trouvée");
        setIsProcessing(false);
        return;
      }

      if (!activeYearId) {
        toast.error("Aucune année académique active trouvée. Veuillez en configurer une.");
        setIsProcessing(false);
        return;
      }

      const finalFeeType = feeType === "custom" ? customFeeType : 
                          feeTypeOptions.find(option => option.id === feeType)?.name || feeType;
      
      const selectedOption = feeTypeOptions.find(option => option.id === feeType);
      const feeTypeEnum = selectedOption ? selectedOption.feeTypeEnum : "OTHER";

      // Iterate over each selected class title to create a fee
      const promises = selectedClasses.map(async (className) => {
        const selectedClassObj = classList.find(c => c.title === className);
        
        const newClassFee = {
          name: finalFeeType,
          amount: parseFloat(amount),
          type: feeTypeEnum as any,
          classLevel: "PRIMAIRE", // TODO: Déduire du selectedClassObj if possible or allow user selection
          classIds: selectedClassObj ? [selectedClassObj.id] : [],
          schoolId: school.id,
          academicYearId: activeYearId,
          dueDate: !isRecurring ? new Date(dueDate) : undefined,
          description,
          isRecurring,
          recurringType: isRecurring ? recurringType : undefined,
          dueDayOfMonth: (isRecurring && recurringType === "MONTHLY") ? parseInt(dueDayOfMonth) : undefined,
          excludedMonths: (isRecurring && recurringType === "MONTHLY") ? excludedMonths : undefined,
          isOptional: false 
        };

        return createFee(newClassFee);
      });

      await Promise.all(promises);
      
      toast.success(`${selectedClasses.length} frais créés avec succès!`);
      
      // Reset form
      setFeeType("");
      setCustomFeeType("");
      setSelectedClasses([]);
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
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création des frais");
    } finally {
      setIsProcessing(false);
    }
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

          {/* Sélection des classes */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Classes concernées ({selectedClasses.length}) *</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {selectedClasses.length > 0
                    ? ` ${selectedClasses.length} classe(s) sélectionnée(s)`
                    : "Choisir des classes..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Rechercher une classe..." />
                  <CommandList>
                    <CommandEmpty>Aucune classe trouvée.</CommandEmpty>
                    <CommandGroup>
                         {/* Option pour tout sélectionner (à implémenter si besoin) */}
                      {classList.map((cls) => (
                        <CommandItem
                          key={cls.id}
                          value={cls.title}
                          onSelect={(currentValue) => {
                            // Toggle selection
                            setSelectedClasses(prev => 
                              prev.includes(currentValue)
                                ? prev.filter(c => c !== currentValue)
                                : [...prev, currentValue]
                            );
                            // Keep open for multiple selection
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedClasses.includes(cls.title)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {cls.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Badges pour les classes sélectionnées */}
            {selectedClasses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedClasses.map((cls) => (
                  <Badge key={cls} variant="secondary" className="px-2 py-1">
                    {cls}
                    <button
                      type="button"
                      className="ml-2 hover:text-red-500 focus:outline-none"
                      onClick={() => setSelectedClasses(prev => prev.filter(c => c !== cls))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedClasses.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setSelectedClasses([])}
                  >
                    Tout effacer
                  </Button>
                )}
              </div>
            )}
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
          {selectedClasses.length > 0 && amount && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Résumé de création</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Classes:</strong> {selectedClasses.length} classe(s) sélectionnée(s)</p>
                  <p><strong>Type:</strong> {feeType === "custom" ? customFeeType : selectedFeeOption?.name}</p>
                  <p><strong>Montant:</strong> {StudentMockDataService.formatCurrency(parseFloat(amount) || 0)}</p>
                  <p><strong>Échéance:</strong> {dueDate && new Date(dueDate).toLocaleDateString('fr-FR')}</p>
                  <p className="text-xs mt-2">
                    Ce frais sera automatiquement assigné à tous les élèves des {selectedClasses.length} classes sélectionnées.
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
              disabled={isProcessing || !feeType || selectedClasses.length === 0 || !amount || !dueDate}
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

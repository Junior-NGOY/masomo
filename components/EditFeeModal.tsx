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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X,
  Calculator,
  Calendar,
  AlertCircle,
  CheckCircle,
  Check,
  ChevronsUpDown,
  Edit
} from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { updateFee } from "@/actions/fees";
import { Fee } from "@/types/types";
import toast from "react-hot-toast";

interface EditFeeModalProps {
  fee: Fee | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditFeeModal({ fee, isOpen, onClose }: EditFeeModalProps) {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringType, setRecurringType] = useState<string>("");
  const [dueDayOfMonth, setDueDayOfMonth] = useState<string>("15");
  const [excludedMonths, setExcludedMonths] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [openCombobox, setOpenCombobox] = useState(false);

  const { classes: classList } = useClasses();

  // Pre-fill form when fee changes
  useEffect(() => {
    if (fee && isOpen) {
      setAmount(fee.amount.toString());
      setDueDate(fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : "");
      setDescription(fee.description || "");
      setIsRecurring(fee.isRecurring || false);
      setRecurringType(fee.recurringType || "");
      setDueDayOfMonth(fee.dueDayOfMonth?.toString() || "15");
      
      // Parse excludedMonths from JSON string
      try {
        const parsedExcludedMonths = fee.excludedMonths 
          ? (typeof fee.excludedMonths === 'string' 
              ? JSON.parse(fee.excludedMonths) 
              : fee.excludedMonths)
          : [];
        setExcludedMonths(Array.isArray(parsedExcludedMonths) ? parsedExcludedMonths : []);
      } catch (e) {
        console.error('Error parsing excludedMonths:', e);
        setExcludedMonths([]);
      }
      
      // Parse classIds from JSON string and convert to class titles
      try {
        const parsedClassIds = fee.classIds 
          ? (typeof fee.classIds === 'string' 
              ? JSON.parse(fee.classIds) 
              : fee.classIds)
          : [];
        
        if (Array.isArray(parsedClassIds) && parsedClassIds.length > 0) {
          const classNames = parsedClassIds.map(id => {
            const cls = classList.find(c => c.id === id);
            return cls ? cls.title : "";
          }).filter(Boolean);
          setSelectedClasses(classNames);
        } else {
          setSelectedClasses([]);
        }
      } catch (e) {
        console.error('Error parsing classIds:', e);
        setSelectedClasses([]);
      }
    }
  }, [fee, isOpen, classList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fee) return;
    
    // Validation
    if (selectedClasses.length === 0 || !amount) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!isRecurring && !dueDate) {
      alert("Veuillez spécifier une date d'échéance");
      return;
    }

    if (isRecurring && !recurringType) {
      alert("Veuillez choisir un type de récurrence");
      return;
    }

    setIsProcessing(true);

    try {
      // Convert class titles back to IDs
      const classIds = selectedClasses.map(className => {
        const cls = classList.find(c => c.title === className);
        return cls?.id;
      }).filter(Boolean) as string[];

      const updateData = {
        amount: parseFloat(amount),
        classIds: classIds,
        dueDate: !isRecurring ? new Date(dueDate) : undefined,
        description,
        isRecurring,
        recurringType: isRecurring ? recurringType : undefined,
        dueDayOfMonth: (isRecurring && recurringType === "MONTHLY") ? parseInt(dueDayOfMonth) : undefined,
        excludedMonths: (isRecurring && recurringType === "MONTHLY") ? excludedMonths : undefined,
      };

      await updateFee(fee.id, updateData);
      
      toast.success("Frais modifié avec succès!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du frais");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!fee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Modifier le frais: {fee.name}
          </DialogTitle>
          <DialogDescription>
            Modifiez les détails du frais. Les changements seront appliqués immédiatement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Type de frais (read-only) */}
          <div className="space-y-2">
            <Label>Type de frais</Label>
            <Input value={fee.name} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-500">Le type de frais ne peut pas être modifié</p>
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
                    ? `${selectedClasses.length} classe(s) sélectionnée(s)`
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
                      {classList.map((cls) => (
                        <CommandItem
                          key={cls.id}
                          value={cls.title}
                          onSelect={(currentValue) => {
                            setSelectedClasses(prev => 
                              prev.includes(currentValue)
                                ? prev.filter(c => c !== currentValue)
                                : [...prev, currentValue]
                            );
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
              placeholder="Informations supplémentaires sur ce frais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || selectedClasses.length === 0 || !amount}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? "Modification..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

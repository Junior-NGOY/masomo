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
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { 
  Check,
  ChevronsUpDown,
  UserPlus,
  DollarSign,
  Calendar as CalendarIcon,
  AlertCircle
} from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { getFees } from "@/actions/fees";
import { createStudentFee } from "@/actions/studentFees";
import { getActiveAcademicYear } from "@/actions/academicYears";
import useSchoolStore from "@/store/school";
import { formatCurrency } from "@/utils/format";
import toast from "react-hot-toast";

interface AssignFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignFeesModal({ isOpen, onClose }: AssignFeesModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>([]);
  const [availableFees, setAvailableFees] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openStudentCombobox, setOpenStudentCombobox] = useState(false);
  const [activeYearId, setActiveYearId] = useState<string>("");

  const { school } = useSchoolStore();
  const { students } = useStudents();

  // Fetch active academic year
  useEffect(() => {
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

  // Fetch available fees when student is selected
  useEffect(() => {
    const fetchAvailableFees = async () => {
      if (!selectedStudentId || !school?.id) {
        setAvailableFees([]);
        return;
      }

      try {
        const student = students.find(s => s.id === selectedStudentId);
        if (!student || !student.classId) {
          setAvailableFees([]);
          return;
        }

        // Fetch all fees for the school
        const allFees = await getFees({ schoolId: school.id });
        
        // Filter fees applicable to this student's class
        const applicableFees = allFees.filter((fee: any) => {
          // Parse classIds if it's a JSON string
          let feeClassIds: string[] = [];
          try {
            feeClassIds = fee.classIds 
              ? (typeof fee.classIds === 'string' ? JSON.parse(fee.classIds) : fee.classIds)
              : [];
          } catch (e) {
            console.error('Error parsing classIds:', e);
          }

          // Check if fee applies to this student's class
          return feeClassIds.includes(student.classId);
        });

        setAvailableFees(applicableFees);
      } catch (error) {
        console.error('Error fetching fees:', error);
        toast.error("Erreur lors du chargement des frais");
      }
    };

    fetchAvailableFees();
  }, [selectedStudentId, school?.id, students]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudentId) {
      toast.error("Veuillez sélectionner un élève");
      return;
    }

    if (selectedFeeIds.length === 0) {
      toast.error("Veuillez sélectionner au moins un frais");
      return;
    }

    if (!activeYearId) {
      toast.error("Aucune année académique active trouvée");
      return;
    }

    setIsProcessing(true);

    try {
      // Create StudentFeeStructure for each selected fee
      const promises = selectedFeeIds.map(async (feeId) => {
        const fee = availableFees.find(f => f.id === feeId);
        if (!fee) {
          console.warn(`Fee not found: ${feeId}`);
          return null;
        }

        try {
          return await createStudentFee({
            studentId: selectedStudentId,
            feeId: feeId,
            academicYearId: activeYearId,
            totalAmount: fee.amount,
          });
        } catch (err: any) {
          console.error(`Error creating fee ${fee.name}:`, err);
          throw new Error(`Erreur pour "${fee.name}": ${err.message}`);
        }
      });

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r !== null).length;

      if (successCount > 0) {
        toast.success(`${successCount} frais assigné(s) avec succès!`);
        
        // Reset form
        setSelectedStudentId("");
        setSelectedFeeIds([]);
        setAvailableFees([]);
        
        onClose();
      } else {
        toast.error("Aucun frais n'a pu être assigné");
      }
    } catch (error: any) {
      console.error('Error assigning fees:', error);
      
      // Check if error is about duplicate
      if (error.message?.includes("already assigned")) {
        toast.error("Certains frais sont déjà assignés à cet élève");
      } else {
        toast.error(error.message || "Erreur lors de l'assignation des frais");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const totalAmount = selectedFeeIds.reduce((sum, feeId) => {
    const fee = availableFees.find(f => f.id === feeId);
    return sum + (fee?.amount || 0);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Assigner des frais à un élève
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un élève et les frais à lui assigner pour l'année académique en cours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Élève *</Label>
            <Popover open={openStudentCombobox} onOpenChange={setOpenStudentCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openStudentCombobox}
                  className="w-full justify-between"
                >
                  {selectedStudent 
                    ? `${selectedStudent.name} (${selectedStudent.classTitle || 'Sans classe'})`
                    : "Choisir un élève..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Rechercher un élève..." />
                  <CommandList>
                    <CommandEmpty>Aucun élève trouvé.</CommandEmpty>
                    <CommandGroup>
                      {students.map((student) => (
                        <CommandItem
                          key={student.id}
                          value={student.name}
                          onSelect={() => {
                            setSelectedStudentId(student.id);
                            setSelectedFeeIds([]); // Reset selected fees
                            setOpenStudentCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStudentId === student.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{student.name}</span>
                            <span className="text-xs text-gray-500">
                              {student.classTitle || 'Sans classe'}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Available Fees Selection */}
          {selectedStudentId && (
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Frais disponibles ({availableFees.length})
              </Label>
              
              {availableFees.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">
                      Aucun frais configuré pour la classe de cet élève.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-3">
                  {availableFees.map((fee) => {
                    const isSelected = selectedFeeIds.includes(fee.id);
                    
                    return (
                      <div
                        key={fee.id}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-colors",
                          isSelected 
                            ? "bg-blue-50 border-blue-300" 
                            : "bg-white hover:bg-gray-50"
                        )}
                        onClick={() => {
                          setSelectedFeeIds(prev =>
                            prev.includes(fee.id)
                              ? prev.filter(id => id !== fee.id)
                              : [...prev, fee.id]
                          );
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center",
                              isSelected 
                                ? "bg-blue-600 border-blue-600" 
                                : "border-gray-300"
                            )}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium">{fee.name}</p>
                              {fee.description && (
                                <p className="text-xs text-gray-500">{fee.description}</p>
                              )}
                              {fee.isRecurring && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  Récurrent
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">
                              {formatCurrency(fee.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {selectedFeeIds.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">
                    {selectedFeeIds.length} frais sélectionné(s)
                  </p>
                  <p className="text-sm text-green-600">
                    Pour {selectedStudent?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Total</p>
                  <p className="text-xl font-bold text-green-800">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isProcessing}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || !selectedStudentId || selectedFeeIds.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? "Assignation..." : "Assigner les frais"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

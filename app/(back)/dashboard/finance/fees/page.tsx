"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, FileDown, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import NewFeeModal from "@/components/NewFeeModal";
import { getFees, deleteFee } from "@/actions/fees";
import { Fee } from "@/types/types";
import toast from "react-hot-toast";
import useSchoolStore from "@/store/school";
import { useClasses } from "@/hooks/useClasses";
import DataTable from "@/components/DataTableComponents/DataTable";
import { getColumns, FeeDisplay } from "./columns";
import EditFeeModal from "@/components/EditFeeModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [feeToEdit, setFeeToEdit] = useState<Fee | null>(null);
  const { school } = useSchoolStore();
  const { classes: classList } = useClasses();

  // Filters state
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterClass, setFilterClass] = useState<string>("ALL");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");

  const fetchFees = React.useCallback(async () => {
    if (!school?.id) return;
    try {
      setLoading(true);
      const data = await getFees({ schoolId: school.id });
      setFees(data);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des frais");
    } finally {
      setLoading(false);
    }
  }, [school?.id]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const handleDelete = React.useCallback(async (id: string) => {
    try {
      await deleteFee(id);
      toast.success("Frais supprimé avec succès");
      fetchFees();
    } catch (error: any) {
      const message = error?.message || "Erreur lors de la suppression";
      toast.error(message);
    }
  }, [fetchFees]);

  const handleEdit = React.useCallback((fee: any) => {
    console.log("handleEdit called with fee:", fee);
    console.log("All fees:", fees);
    
    // Find the full fee object from the fees array
    const fullFee = fees.find(f => f.id === fee.id);
    console.log("Found fullFee:", fullFee);
    
    if (fullFee) {
      setFeeToEdit(fullFee);
      setIsEditModalOpen(true);
    } else {
      console.error("Fee not found in fees array!");
      toast.error("Impossible de charger les données du frais");
    }
  }, [fees]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Liste des Frais Scolaires", 14, 20);
    
    // Add school name if available
    if (school?.name) {
      doc.setFontSize(12);
      doc.text(school.name, 14, 28);
    }
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 35);
    
    // Prepare table data
    const tableData = filteredData.map(fee => [
      fee.name,
      fee.typeLabel,
      fee.amount.toLocaleString('fr-FR') + ' FC',
      fee.classNames,
      fee.isRecurring ? fee.recurringLabel : 'Unique'
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Nom', 'Type', 'Montant', 'Classes', 'Récurrence']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Save PDF
    doc.save(`frais-scolaires-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF généré avec succès!");
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const excelData = filteredData.map(fee => ({
      'Nom': fee.name,
      'Type': fee.typeLabel,
      'Montant (FC)': fee.amount,
      'Classes': fee.classNames,
      'Niveau': fee.classLevel,
      'Récurrence': fee.isRecurring ? fee.recurringLabel : 'Unique'
    }));
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Frais");
    
    // Save file
    XLSX.writeFile(wb, `frais-scolaires-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Fichier Excel généré avec succès!");
  };

  // Helper helpers
  const getRecurrenceLabel = (type?: string) => {
    switch (type) {
      case "MONTHLY": return "Mensuel";
      case "QUARTERLY": return "Trimestriel";
      case "SEMESTER": return "Semestriel";
      case "ANNUAL": return "Annuel";
      default: return type || "Récurrent";
    }
  };

  const getFeeTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      TUITION: "Scolarité",
      REGISTRATION: "Inscription",
      UNIFORM: "Uniforme",
      TRANSPORT: "Transport",
      BOOKS: "Manuels",
      TRIP: "Excursion",
      OTHER: "Autre"
    };
    return map[type] || type;
  };

  // Transform data for DataTable
  const tableData: FeeDisplay[] = useMemo(() => {
    return fees.map((fee) => {
      // Resolve class names
      let classNames = fee.classLevel || "N/A";
      if (fee.classIds && fee.classIds.length > 0) {
        const names = fee.classIds.map((id) => {
          const cls = classList.find((c) => c.id === id);
          return cls ? cls.title : id;
        });
        classNames = names.join(", ");
      }

      return {
        id: fee.id,
        name: fee.name,
        type: fee.type,
        typeLabel: getFeeTypeLabel(fee.type),
        amount: fee.amount,
        classNames: classNames,
        classLevel: fee.classLevel || "N/A",
        isRecurring: fee.isRecurring,
        recurringLabel: getRecurrenceLabel(fee.recurringType),
      };
    });
  }, [fees, classList]);

  // Apply filters
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchesType = filterType === "ALL" || item.type === filterType;
      const matchesLevel = filterLevel === "ALL" || (item.classLevel && item.classLevel.toUpperCase().includes(filterLevel));
      
      // For class filter, strictly creating logic based on classNames string matching is weak, 
      // but simplistic for now as we flattened the data.
      // Better would be to filter raw fees then transform.
      const matchesClass = filterClass === "ALL" || item.classNames.includes(filterClass);
      
      return matchesType && matchesClass && matchesLevel;
    });
  }, [tableData, filterType, filterClass, filterLevel]);

  const columns = useMemo(() => getColumns(handleDelete, handleEdit), [handleDelete, handleEdit]);

  const feeTypes = [
    { value: "TUITION", label: "Scolarité" },
    { value: "REGISTRATION", label: "Inscription" },
    { value: "UNIFORM", label: "Uniforme" },
    { value: "TRANSPORT", label: "Transport" },
    { value: "BOOKS", label: "Manuels" },
    { value: "TRIP", label: "Excursion" },
    { value: "OTHER", label: "Autre" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Frais</h1>
          <p className="text-gray-600 mt-1">Configuration des frais scolaires</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportToPDF}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToExcel}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Frais
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-[200px]">
              <label className="text-sm font-medium mb-1 block">Type de frais</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les types</SelectItem>
                  {feeTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[200px]">
              <label className="text-sm font-medium mb-1 block">Niveau</label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les niveaux</SelectItem>
                  <SelectItem value="MATERNELLE">Maternelle</SelectItem>
                  <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                  <SelectItem value="SECONDAIRE">Secondaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[200px]">
              <label className="text-sm font-medium mb-1 block">Classe</label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Toutes les classes</SelectItem>
                  {classList.map((cls) => (
                    <SelectItem key={cls.id} value={cls.title}>{cls.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Chargement...</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredData} 
              // IMPORTANT: Key forces re-render if we want to reset internal state of DataTable
              // but since we fixed DataTable to look at [data] prop, we might not strictly need it.
              // However, using key={filteredData.length} or similar can be a safety net if the fix wasn't enough.
              // For now, relying on the DataTable fix.
            />
          )}
        </CardContent>
      </Card>

      <NewFeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchFees();
        }}
      />

      <EditFeeModal
        fee={feeToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFeeToEdit(null);
          fetchFees();
        }}
      />
    </div>
  );
}

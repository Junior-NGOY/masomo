"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentFees, StudentFee } from "@/hooks/useStudentFees";
import { updateStudentFee, deleteStudentFee, createStudentFee } from "@/actions/studentFees";
import { useStudentStats, useStudents } from "@/hooks/useStudents";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import ReceiptModal from "@/components/ReceiptModal";
import NewFeeModal from "@/components/NewFeeModal";
import EditStudentFeeModal from "@/components/EditStudentFeeModal";
import AssignFeesModal from "@/components/AssignFeesModal";
import { ExportService } from "@/lib/exportUtils";
import {
  DollarSign,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Receipt,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Calendar,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";

export default function StudentFeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);
  const [newFeeModalOpen, setNewFeeModalOpen] = useState(false);
  const [editFeeModalOpen, setEditFeeModalOpen] = useState(false);
  const [selectedFeeForEdit, setSelectedFeeForEdit] = useState<StudentFee | null>(null);
  const [assignFeesModalOpen, setAssignFeesModalOpen] = useState(false);

  // États pour la pagination et la vue par élève
  const [studentsSearchTerm, setStudentsSearchTerm] = useState("");
  const [studentsStatusFilter, setStudentsStatusFilter] = useState("ALL");
  const [studentsClassFilter, setStudentsClassFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // États pour la pagination des frais
  const [feesCurrentPage, setFeesCurrentPage] = useState(1);
  const [feesItemsPerPage, setFeesItemsPerPage] = useState(10);

  const { fees, loading: feesLoading } = useStudentFees();
  const { students, loading: studentsLoading } = useStudents();
  const { stats, loading: statsLoading } = useStudentStats();

  // Compute profiles from students and fees
  const profiles = students.map(student => {
    const studentFees = fees.filter(f => f.studentId === student.id);
    const totalFees = studentFees.reduce((sum, f) => sum + f.amount, 0);
    const paidFees = studentFees.reduce((sum, f) => sum + (f.paidAmount ?? 0), 0);
    const pendingFees = studentFees.reduce((sum, f) => sum + (f.remainingAmount ?? 0), 0);

    return {
      ...student,
      className: student.classTitle || 'N/A',
      totalFees,
      paidFees,
      pendingFees
    };
  });

  const isLoading = feesLoading || studentsLoading || statsLoading;

  if (isLoading) {
    return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!stats) return null; // Handle error state appropriately in real app

  // Fonctions de gestion des frais
  const handlePrintReceipt = (fee: StudentFee) => {
    setSelectedFee(fee);
    setReceiptModalOpen(true);
  };

  const handleEditFee = (fee: StudentFee) => {
    setSelectedFeeForEdit(fee);
    setEditFeeModalOpen(true);
  };

  const handleUpdateFee = async (updatedFee: StudentFee) => {
    try {
      // Calculer le montant payé basé sur le statut et le montant restant
      let paidAmount = 0;
      if (updatedFee.status === 'PAID') {
        paidAmount = updatedFee.amount;
      } else if (updatedFee.status === 'PARTIAL') {
        paidAmount = updatedFee.amount - (updatedFee.remainingAmount || 0);
      }

      await updateStudentFee(updatedFee.id, {
        totalAmount: updatedFee.amount,
        status: updatedFee.status,
        notes: updatedFee.notes,
        paidAmount: paidAmount,
        dueDate: updatedFee.dueDate
      });
      setEditFeeModalOpen(false);
      setSelectedFeeForEdit(null);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update fee:", error);
      alert("Erreur lors de la mise à jour du frais");
    }
  };

  const handleDeleteFee = async (feeId: string) => {
    try {
      await deleteStudentFee(feeId);
      setEditFeeModalOpen(false);
      setSelectedFeeForEdit(null);
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to delete fee:", error);
      alert(error.message || "Erreur lors de la suppression du frais");
    }
  };

  const handleDuplicateFee = async (fee: StudentFee) => {
    if (!fee.feeId || !fee.academicYearId) {
      alert("Impossible de dupliquer ce frais : informations manquantes (feeId ou academicYearId)");
      return;
    }

    try {
      await createStudentFee({
        studentId: fee.studentId,
        feeId: fee.feeId,
        academicYearId: fee.academicYearId,
        totalAmount: fee.amount,
      });
      setEditFeeModalOpen(false);
      setSelectedFeeForEdit(null);
      window.location.reload();
    } catch (error) {
      console.error("Failed to duplicate fee:", error);
      alert("Erreur lors de la duplication du frais");
    }
  };

  // Filtrage des données
  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.feeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || fee.status === statusFilter;
    const matchesClass = classFilter === "ALL" || fee.className === classFilter;

    return matchesSearch && matchesStatus && matchesClass;
  });

  // Pagination pour les frais
  const totalFees = filteredFees.length;
  const totalFeesPages = Math.ceil(totalFees / feesItemsPerPage);
  const feesStartIndex = (feesCurrentPage - 1) * feesItemsPerPage;
  const feesEndIndex = feesStartIndex + feesItemsPerPage;
  const paginatedFees = filteredFees.slice(feesStartIndex, feesEndIndex);

  // Fonction pour changer de page des frais
  const handleFeesPageChange = (page: number) => {
    setFeesCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Obtenir les classes uniques
  const uniqueClasses = [...new Set(fees.map(fee => fee.className))];

  // Filtrage des élèves pour la vue "Par élève"
  const filteredStudents = profiles.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentsSearchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(studentsSearchTerm.toLowerCase());

    const matchesClass = studentsClassFilter === "ALL" || student.className === studentsClassFilter;

    let matchesStatus = true;
    if (studentsStatusFilter === "PAID") {
      matchesStatus = student.pendingFees === 0;
    } else if (studentsStatusFilter === "PENDING") {
      matchesStatus = student.pendingFees > 0;
    } else if (studentsStatusFilter === "PARTIAL") {
      matchesStatus = student.paidFees > 0 && student.pendingFees > 0;
    }

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Pagination pour les élèves
  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReceipt = (fee: StudentFee) => {
    setSelectedFee(fee);
    setReceiptModalOpen(true);
  };

  // Fonction pour exporter les données
  const handleExportData = () => {
    // Exporter les frais filtrés avec une mise en forme professionnelle
    ExportService.exportStudentFees(filteredFees, {
      title: 'RAPPORT DES FRAIS SCOLAIRES - ÉCOLE MASOMO PRO',
      subtitle: `Données filtrées - ${filteredFees.length} frais sur ${fees.length} total`,
    });
  };

  // Fonction pour exporter les données des élèves
  const handleExportStudents = () => {
    // Exporter les élèves filtrés avec leurs informations de frais
    ExportService.exportStudentProfiles(filteredStudents, {
      title: 'RAPPORT DES ÉLÈVES ET LEURS FRAIS - ÉCOLE MASOMO PRO',
      subtitle: `Données filtrées - ${filteredStudents.length} élèves sur ${profiles.length} total`,
    });
  };

  // Fonction pour exporter les statistiques
  const handleExportAnalytics = () => {
    const analyticsData = [
      {
        indicateur: 'Total des frais',
        valeur: stats.totalFees,
        pourcentage: 100,
        type: 'Revenus'
      },
      {
        indicateur: 'Frais payés',
        valeur: stats.paidFees,
        pourcentage: stats.totalFees > 0 ? Math.round((stats.paidFees / stats.totalFees) * 100) : 0,
        type: 'Revenus collectés'
      },
      {
        indicateur: 'Frais en attente',
        valeur: stats.pendingFees,
        pourcentage: stats.totalFees > 0 ? Math.round((stats.pendingFees / stats.totalFees) * 100) : 0,
        type: 'Revenus attendus'
      },
      {
        indicateur: 'Élèves en retard',
        valeur: stats.overdueFees,
        pourcentage: profiles.length > 0 ? Math.round((stats.overdueFees / profiles.length) * 100) : 0,
        type: 'Élèves'
      }
    ];

    ExportService.exportToExcel({
      filename: 'analyses_frais_scolaires',
      sheetName: 'Analyses Financières',
      title: 'ANALYSES FINANCIÈRES - ÉCOLE MASOMO PRO',
      subtitle: `Rapport de synthèse généré le ${new Date().toLocaleDateString('fr-FR')}`,
      columns: [
        { key: 'indicateur', label: 'Indicateur', width: 25 },
        { key: 'valeur', label: 'Valeur', width: 20, type: 'currency' },
        { key: 'pourcentage', label: 'Pourcentage', width: 15, type: 'percentage' },
        { key: 'type', label: 'Catégorie', width: 20 }
      ],
      data: analyticsData,
      includeTimestamp: true
    });
  };

  // Fonction pour créer un nouveau frais
  const handleNewFee = () => {
    setNewFeeModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string }> = {
      PAID: { color: "bg-green-100 text-green-800", text: "Payé" },
      PENDING: { color: "bg-yellow-100 text-yellow-800", text: "En attente" },
      OVERDUE: { color: "bg-red-100 text-red-800", text: "En retard" },
      PARTIAL: { color: "bg-blue-100 text-blue-800", text: "Partiel" }
    };
    const variant = variants[status] || variants.PENDING;
    return (
      <Badge className={variant.color}>
        {variant.text}
      </Badge>
    );
  };

  const StatsCard = ({ title, value, description, icon: Icon, color = "blue" }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Frais</h1>
          <p className="text-gray-600 mt-1">Suivi des paiements et des frais scolaires</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/students/fees/calendar">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Calendrier académique
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssignFeesModalOpen(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Assigner les frais
          </Button>
          <Button
            size="sm"
            onClick={handleNewFee}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau frais
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total des frais"
          value={formatCurrency(stats.totalFees)}
          description="Tous les frais"
          icon={DollarSign}
          color="blue"
        />
        <StatsCard
          title="Frais payés"
          value={formatCurrency(stats.paidFees)}
          description={`${stats.totalFees > 0 ? Math.round((stats.paidFees / stats.totalFees) * 100) : 0}% collecté`}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Frais en attente"
          value={formatCurrency(stats.pendingFees)}
          description="À collecter"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Frais en retard"
          value={stats.overdueFees}
          description="Élèves concernés"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des frais</TabsTrigger>
          <TabsTrigger value="students">Par élève</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Première ligne - Recherche et filtres */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Rechercher</label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Nom de l'élève ou type de frais..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setFeesCurrentPage(1); // Reset à la première page lors de la recherche
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Statut</label>
                    <Select value={statusFilter} onValueChange={(value) => {
                      setStatusFilter(value);
                      setFeesCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-40 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Tous les statuts</SelectItem>
                        <SelectItem value="PAID">Payés</SelectItem>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="OVERDUE">En retard</SelectItem>
                        <SelectItem value="PARTIAL">Partiels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Classe</label>
                    <Select value={classFilter} onValueChange={(value) => {
                      setClassFilter(value);
                      setFeesCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-48 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Toutes les classes</SelectItem>
                        {uniqueClasses.map(className => (
                          <SelectItem key={className} value={className}>{className}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Deuxième ligne - Options de pagination */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Par page:</label>
                      <Select value={feesItemsPerPage.toString()} onValueChange={(value) => {
                        setFeesItemsPerPage(parseInt(value));
                        setFeesCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportData}
                      className="ml-4"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter les frais
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    Affichage de {feesStartIndex + 1} à {Math.min(feesEndIndex, totalFees)} sur {totalFees} frais
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des frais */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des frais ({totalFees})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Élève</th>
                      <th className="text-left py-3">Classe</th>
                      <th className="text-left py-3">Type de frais</th>
                      <th className="text-right py-3">Montant</th>
                      <th className="text-left py-3">Échéance</th>
                      <th className="text-left py-3">Statut</th>
                      <th className="text-right py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFees.map((fee) => (
                      <tr key={fee.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{fee.studentName}</td>
                        <td className="py-3 text-gray-600">{fee.className}</td>
                        <td className="py-3">{fee.feeType}</td>
                        <td className="py-3 text-right font-medium">
                          {formatCurrency(fee.amount)}
                          {fee.remainingAmount && fee.remainingAmount > 0 && (
                            <div className="text-xs text-red-600">
                              Reste: {formatCurrency(fee.remainingAmount)}
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          {new Date(fee.dueDate).toLocaleDateString('fr-FR')}
                          {fee.paidDate && (
                            <div className="text-xs text-green-600">
                              Payé le {new Date(fee.paidDate).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </td>
                        <td className="py-3">{getStatusBadge(fee.status)}</td>
                        <td className="py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Link href={`/dashboard/students/fees/${fee.studentId}`}>
                              <Button variant="ghost" size="sm" title="Voir détails">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Modifier"
                              onClick={() => handleEditFee(fee)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {fee.receiptNo && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Télécharger reçu"
                                onClick={() => handlePrintReceipt(fee)}
                              >
                                <Receipt className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination pour les frais */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {feesCurrentPage} sur {totalFeesPages} (Total: {totalFees} frais)
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeesPageChange(feesCurrentPage - 1)}
                      disabled={feesCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalFeesPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalFeesPages <= 5) {
                          pageNum = i + 1;
                        } else if (feesCurrentPage <= 3) {
                          pageNum = i + 1;
                        } else if (feesCurrentPage >= totalFeesPages - 2) {
                          pageNum = totalFeesPages - 4 + i;
                        } else {
                          pageNum = feesCurrentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={feesCurrentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFeesPageChange(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      {totalFeesPages > 5 && feesCurrentPage < totalFeesPages - 2 && (
                        <>
                          <Button variant="ghost" size="sm" disabled>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeesPageChange(totalFeesPages)}
                            className="w-10"
                          >
                            {totalFeesPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeesPageChange(feesCurrentPage + 1)}
                      disabled={feesCurrentPage === totalFeesPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {/* Filtres et options pour la vue par élève */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Première ligne - Recherche et filtres */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Rechercher un élève</label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Nom de l'élève ou classe..."
                        value={studentsSearchTerm}
                        onChange={(e) => {
                          setStudentsSearchTerm(e.target.value);
                          setCurrentPage(1); // Reset à la première page lors de la recherche
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Statut des paiements</label>
                    <Select value={studentsStatusFilter} onValueChange={(value) => {
                      setStudentsStatusFilter(value);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-48 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Tous les élèves</SelectItem>
                        <SelectItem value="PAID">Frais payés</SelectItem>
                        <SelectItem value="PENDING">Frais en attente</SelectItem>
                        <SelectItem value="PARTIAL">Paiements partiels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Classe</label>
                    <Select value={studentsClassFilter} onValueChange={(value) => {
                      setStudentsClassFilter(value);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-48 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Toutes les classes</SelectItem>
                        {uniqueClasses.map(className => (
                          <SelectItem key={className} value={className}>{className}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Deuxième ligne - Options d'affichage et pagination */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Affichage:</label>
                      <div className="flex border rounded-md">
                        <Button
                          variant={viewMode === 'cards' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('cards')}
                          className="rounded-r-none"
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'table' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('table')}
                          className="rounded-l-none"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Par page:</label>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        setItemsPerPage(parseInt(value));
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="48">48</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportStudents}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter les élèves
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    Affichage de {startIndex + 1} à {Math.min(endIndex, totalStudents)} sur {totalStudents} élève(s)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affichage en cartes */}
          {viewMode === 'cards' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={student.imageUrl} alt={student.name} className="object-cover" />
                        <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{student.name}</CardTitle>
                        <p className="text-sm text-gray-600">{student.className}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total des frais:</span>
                        <span className="font-medium">
                          {formatCurrency(student.totalFees)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Payé:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(student.paidFees)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">En attente:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(student.pendingFees)}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progression des paiements</span>
                        <span>{student.totalFees > 0 ? Math.round((student.paidFees / student.totalFees) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.totalFees > 0 ? (student.paidFees / student.totalFees) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <Link href={`/dashboard/students/fees/${student.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Affichage en tableau */}
          {viewMode === 'table' && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Élève</th>
                        <th className="text-left py-3 px-4">Classe</th>
                        <th className="text-right py-3 px-4">Total frais</th>
                        <th className="text-right py-3 px-4">Payé</th>
                        <th className="text-right py-3 px-4">En attente</th>
                        <th className="text-center py-3 px-4">Progression</th>
                        <th className="text-center py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={student.imageUrl} alt={student.name} className="object-cover" />
                                <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-xs text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{student.className}</td>
                          <td className="py-3 px-4 text-right font-medium">
                            {formatCurrency(student.totalFees)}
                          </td>
                          <td className="py-3 px-4 text-right text-green-600 font-medium">
                            {formatCurrency(student.paidFees)}
                          </td>
                          <td className="py-3 px-4 text-right text-red-600 font-medium">
                            {formatCurrency(student.pendingFees)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${student.totalFees > 0 ? (student.paidFees / student.totalFees) * 100 : 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 min-w-[40px]">
                                {student.totalFees > 0 ? Math.round((student.paidFees / student.totalFees) * 100) : 0}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Link href={`/dashboard/students/fees/${student.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} sur {totalPages}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <Button variant="ghost" size="sm" disabled>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className="w-10"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Bouton d'exportation pour les analyses */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAnalytics}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter les analyses
            </Button>
          </div>

          {/* Analyses et graphiques */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Frais payés</span>
                    <span className="font-medium">{stats.totalFees > 0 ? Math.round((stats.paidFees / stats.totalFees) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${stats.totalFees > 0 ? (stats.paidFees / stats.totalFees) * 100 : 0}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-600">Frais en attente</span>
                    <span className="font-medium">{stats.totalFees > 0 ? Math.round((stats.pendingFees / stats.totalFees) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{ width: `${stats.totalFees > 0 ? (stats.pendingFees / stats.totalFees) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résumé financier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenus collectés:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(stats.paidFees)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenus attendus:</span>
                  <span className="font-medium">
                    {formatCurrency(stats.pendingFees)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total prévu:</span>
                  <span className="font-bold">
                    {formatCurrency(stats.totalFees)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Frais en retard:</span>
                  <span className="text-red-600">{stats.overdueFees} élève(s)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de reçu */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        fee={selectedFee}
      />

      {/* Modal de nouveau frais */}
      <NewFeeModal
        isOpen={newFeeModalOpen}
        onClose={() => setNewFeeModalOpen(false)}
      />

      {/* Modal de modification de frais */}
      <EditStudentFeeModal
        isOpen={editFeeModalOpen}
        onClose={() => setEditFeeModalOpen(false)}
        fee={selectedFeeForEdit}
        onUpdate={handleUpdateFee}
        onDelete={handleDeleteFee}
        onDuplicate={handleDuplicateFee}
      />

      {/* Modal d'assignation de frais */}
      <AssignFeesModal
        isOpen={assignFeesModalOpen}
        onClose={() => {
          setAssignFeesModalOpen(false);
          // Reload fees after assignment
          window.location.reload();
        }}
      />
    </div>
  );
}

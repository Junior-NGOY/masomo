"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentFees, StudentFee } from "@/hooks/useStudentFees";
import { useStudents } from "@/hooks/useStudents";
import { updateStudentFee, deleteStudentFee, createStudentFee } from "@/actions/studentFees";
import PaymentDetailsModal from "@/components/PaymentDetailsModal";
import ReceiptModal from "@/components/ReceiptModal";
import PaymentModal from "@/components/PaymentModal";
import PostponeModal from "@/components/PostponeModal";
import EditStudentFeeModal from "@/components/EditStudentFeeModal";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { 
  ArrowLeft,
  DollarSign,
  Calendar,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  Edit,
  Plus,
  Phone,
  Mail,
  User,
  FileText,
  Printer
} from "lucide-react";

export default function StudentFeeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  // États pour la modal de détails
  const [selectedPayment, setSelectedPayment] = useState<StudentFee | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedFeeForReceipt, setSelectedFeeForReceipt] = useState<StudentFee | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<StudentFee | null>(null);
  const [postponeModalOpen, setPostponeModalOpen] = useState(false);
  const [selectedFeeForPostpone, setSelectedFeeForPostpone] = useState<StudentFee | null>(null);
  const [editFeeModalOpen, setEditFeeModalOpen] = useState(false);
  const [selectedFeeForEdit, setSelectedFeeForEdit] = useState<StudentFee | null>(null);

  // Récupérer les données depuis les hooks
  const { fees, loading: feesLoading } = useStudentFees();
  const { students, loading: studentsLoading } = useStudents();
  
  const student = students.find(s => s.id === studentId);
  const studentFees = fees.filter(fee => fee.studentId === studentId);

  const isLoading = feesLoading || studentsLoading;

  if (isLoading) {
    return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!student) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Élève non trouvé</h1>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  // Calculs des statistiques
  const totalFees = studentFees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = studentFees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
  const pendingFees = studentFees.reduce((sum, fee) => sum + (fee.remainingAmount || 0), 0);
  const overdueFees = studentFees.filter(fee => fee.status === 'OVERDUE');

  // Fonction pour ouvrir la modal de détails
  const handleViewPaymentDetails = (payment: StudentFee) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  // Fonction pour fermer la modal
  const handleClosePaymentModal = () => {
    setSelectedPayment(null);
    setIsPaymentModalOpen(false);
  };

  // Fonctions pour gérer les reçus
  const handleOpenReceipt = (fee: StudentFee) => {
    setSelectedFeeForReceipt(fee);
    setReceiptModalOpen(true);
  };

  const handleCloseReceiptModal = () => {
    setSelectedFeeForReceipt(null);
    setReceiptModalOpen(false);
  };

  // Fonction pour gérer le paiement
  const handlePayment = (fee: StudentFee) => {
    setSelectedFeeForPayment(fee);
    setPaymentModalOpen(true);
  };

  // Fonction appelée après un paiement réussi
  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    setSelectedFeeForPayment(null);
    // Rafraîchir les données en rechargeant la page
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Fonction pour reporter un paiement
  const handlePostponePayment = (fee: StudentFee) => {
    setSelectedFeeForPostpone(fee);
    setPostponeModalOpen(true);
  };

  const handleConfirmPostpone = async (feeId: string, newDate: string | Date, reason: string) => {
    try {
      const fee = studentFees.find(f => f.id === feeId);
      if (!fee) return;

      const dateObj = new Date(newDate);

      await updateStudentFee(feeId, {
        dueDate: dateObj.toISOString(),
        notes: fee.notes ? `${fee.notes}\n[Reporté]: ${reason}` : `[Reporté]: ${reason}`
      });
      
      setPostponeModalOpen(false);
      setSelectedFeeForPostpone(null);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors du report:", error);
      alert("Erreur lors du report de la date d'échéance");
    }
  };



  // Fonction pour modifier un frais
  const handleEditFee = (fee: StudentFee) => {
    setSelectedFeeForEdit(fee);
    setEditFeeModalOpen(true);
  };

  // Fonction pour mettre à jour un frais
  const handleUpdateFee = async (updatedFee: StudentFee) => {
    try {
      // Appel API pour mettre à jour le frais (report d'échéance inclus)
      await updateStudentFee(updatedFee.id, {
        totalAmount: updatedFee.amount, // Ajout du montant total
        paidAmount: updatedFee.paidAmount ?? 0,
        dueDate: updatedFee.dueDate,
        status: updatedFee.status,
        notes: updatedFee.notes
      });
      setEditFeeModalOpen(false);
      setSelectedFeeForEdit(null);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert('Erreur lors de la mise à jour du frais');
    }
  };

  // Fonction pour dupliquer un frais
  const handleDuplicateFee = async (fee: StudentFee) => {
    if (!fee.feeId || !fee.academicYearId) {
      alert("Impossible de dupliquer ce frais : informations manquantes (ID du frais ou année académique)");
      return;
    }

    if (confirm(`Voulez-vous vraiment dupliquer le frais "${fee.feeType}" ?`)) {
      try {
        await createStudentFee({
          studentId: fee.studentId,
          feeId: fee.feeId,
          academicYearId: fee.academicYearId,
          totalAmount: fee.amount
        });
        setEditFeeModalOpen(false);
        setSelectedFeeForEdit(null);
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la duplication du frais');
      }
    }
  };

  // Fonction pour supprimer un frais
  const handleDeleteFee = async (feeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce frais ?')) {
      try {
        await deleteStudentFee(feeId);
        setEditFeeModalOpen(false);
        setSelectedFeeForEdit(null);
        window.location.reload();
      } catch (error) {
        alert('Erreur lors de la suppression du frais');
      }
    }
  };

  // Fonctions pour les boutons d'en-tête
  const handleExportData = () => {
    // Préparer les données pour l'exportation
    const exportData = studentFees.map(fee => ({
      'Type de frais': fee.feeType,
      'Montant': fee.amount,
      'Date d\'échéance': fee.dueDate,
      'Date de paiement': fee.paidDate || 'Non payé',
      'Statut': fee.status,
      'Méthode de paiement': fee.paymentMethod || 'N/A',
      'Numéro de reçu': fee.receiptNo || 'N/A',
      'Montant restant': fee.remainingAmount || 0,
      'Notes': fee.notes || ''
    }));

    // Créer un CSV
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `frais_${student?.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Fonction helper pour formater les montants dans le rapport
    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        minimumFractionDigits: 0
      }).format(amount);
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rapport des frais - ${student?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .student-info { margin-bottom: 20px; }
            .fees-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .fees-table th, .fees-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .fees-table th { background-color: #f2f2f2; }
            .status-paid { color: green; font-weight: bold; }
            .status-pending { color: orange; font-weight: bold; }
            .status-overdue { color: red; font-weight: bold; }
            .summary { margin-top: 30px; border-top: 2px solid #000; padding-top: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>École Masomo Pro</h1>
            <h2>Rapport détaillé des frais scolaires</h2>
            <p>Date d'impression: ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div class="student-info">
            <h3>Informations de l'élève</h3>
            <p><strong>Nom:</strong> ${student?.name}</p>
            <p><strong>Classe:</strong> ${student?.classTitle || 'Non définie'}</p>
            <p><strong>Email:</strong> ${student?.email}</p>
            <p><strong>Téléphone:</strong> ${student?.phone}</p>
          </div>

          <table class="fees-table">
            <thead>
              <tr>
                <th>Type de frais</th>
                <th>Montant</th>
                <th>Date d'échéance</th>
                <th>Statut</th>
                <th>Date de paiement</th>
                <th>Méthode</th>
                <th>Reçu N°</th>
              </tr>
            </thead>
            <tbody>
              ${studentFees.map(fee => `
                <tr>
                  <td>${fee.feeType}</td>
                  <td>${formatAmount(fee.amount)}</td>
                  <td>${new Date(fee.dueDate).toLocaleDateString('fr-FR')}</td>
                  <td class="status-${fee.status.toLowerCase()}">${
                    fee.status === 'PAID' ? 'Payé' :
                    fee.status === 'PENDING' ? 'En attente' :
                    fee.status === 'OVERDUE' ? 'En retard' : 'Partiel'
                  }</td>
                  <td>${fee.paidDate ? new Date(fee.paidDate).toLocaleDateString('fr-FR') : 'N/A'}</td>
                  <td>${fee.paymentMethod || 'N/A'}</td>
                  <td>${fee.receiptNo || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <h3>Résumé financier</h3>
            <p><strong>Total des frais:</strong> ${formatAmount(totalFees)}</p>
            <p><strong>Montant payé:</strong> ${formatAmount(paidFees)}</p>
            <p><strong>Solde restant:</strong> ${formatAmount(pendingFees)}</p>
            <p><strong>Taux de paiement:</strong> ${totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0}%</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Attendre que le contenu soit chargé avant d'imprimer
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleNewPayment = () => {
    // Trouver le premier frais non payé
    const unpaidFee = studentFees.find(fee => 
      fee.status === 'PENDING' || fee.status === 'OVERDUE' || fee.status === 'PARTIAL'
    );
    
    if (unpaidFee) {
      setSelectedFeeForPayment(unpaidFee);
      setPaymentModalOpen(true);
    } else {
      alert('Tous les frais de cet élève ont été payés !');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string; icon: any }> = {
      PAID: { color: "bg-green-100 text-green-800", text: "Payé", icon: CheckCircle },
      PENDING: { color: "bg-orange-100 text-orange-800", text: "En attente", icon: Clock },
      OVERDUE: { color: "bg-red-100 text-red-800", text: "En retard", icon: AlertTriangle },
      PARTIAL: { color: "bg-blue-100 text-blue-800", text: "Partiel", icon: Clock }
    };
    const variant = variants[status] || variants.PENDING;
    const Icon = variant.icon;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variant.color}`}>
        <Icon className="h-3 w-3" />
        {variant.text}
      </span>
    );
  };

  const StatsCard = ({ title, value, description, icon: Icon, color = "blue" }: any) => {
    const getColorClasses = (color: string) => {
      const colorClasses: Record<string, { bg: string; text: string }> = {
        blue: { bg: "bg-blue-100", text: "text-blue-600" },
        green: { bg: "bg-green-100", text: "text-green-600" },
        red: { bg: "bg-red-100", text: "text-red-600" },
        orange: { bg: "bg-orange-100", text: "text-orange-600" }
      };
      return colorClasses[color] || colorClasses.blue;
    };

    const colorClasses = getColorClasses(color);

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
              <Icon className={`h-6 w-6 ${colorClasses.text}`} />
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
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec info élève */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-gray-200">
              <AvatarImage src={student.imageUrl} alt={student.name} className="object-cover" />
              <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {student.classTitle}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {student.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrintReport}
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button 
            size="sm"
            onClick={handleNewPayment}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Statistiques financières */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total des frais"
          value={formatCurrency(totalFees)}
          description="Montant total"
          icon={DollarSign}
          color="blue"
        />
        <StatsCard
          title="Montant payé"
          value={formatCurrency(paidFees)}
          description={`${totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0}% du total`}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Solde restant"
          value={formatCurrency(pendingFees)}
          description="À payer"
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Frais en retard"
          value={overdueFees.length}
          description={overdueFees.length > 0 ? "Action requise" : "Aucun retard"}
          icon={AlertTriangle}
          color={overdueFees.length > 0 ? "red" : "green"}
        />
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Historique des paiements</TabsTrigger>
          <TabsTrigger value="pending">Frais en attente</TabsTrigger>
          <TabsTrigger value="receipts">Reçus</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique complet des paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentFees
                  .sort((a, b) => new Date(b.paidDate || b.dueDate).getTime() - new Date(a.paidDate || a.dueDate).getTime())
                  .map((fee) => (
                    <div key={fee.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{fee.feeType}</h3>
                            {getStatusBadge(fee.status)}
                          </div>
                          
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm">
                            <div>
                              <span className="text-gray-500">Montant:</span>
                              <p className="font-medium">{formatCurrency(fee.amount)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Date d'échéance:</span>
                              <p className="font-medium">{new Date(fee.dueDate).toLocaleDateString('fr-FR')}</p>
                            </div>
                            {fee.paidDate && (
                              <div>
                                <span className="text-gray-500">Date de paiement:</span>
                                <p className="font-medium text-green-600">
                                  {new Date(fee.paidDate).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            )}
                            {fee.paymentMethod && (
                              <div>
                                <span className="text-gray-500">Méthode:</span>
                                <p className="font-medium">{fee.paymentMethod}</p>
                              </div>
                            )}
                          </div>

                          {fee.remainingAmount && fee.remainingAmount > 0 && (
                            <div className="mt-2 p-2 bg-orange-50 rounded text-sm">
                              <span className="text-orange-800">
                                Solde restant: {formatCurrency(fee.remainingAmount)}
                              </span>
                            </div>
                          )}

                          {fee.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <span className="text-gray-600">Note: {fee.notes}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1 ml-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Voir détails"
                            onClick={() => handleViewPaymentDetails(fee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {fee.receiptNo && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Voir reçu"
                              onClick={() => handleOpenReceipt(fee)}
                            >
                              <Receipt className="h-4 w-4" />
                            </Button>
                          )}
                          {fee.status !== 'PAID' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Modifier"
                              onClick={() => handleEditFee(fee)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {studentFees.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>Aucun historique de paiement disponible</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Frais en attente de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentFees
                  .filter(fee => fee.status === 'PENDING' || fee.status === 'OVERDUE' || fee.status === 'PARTIAL')
                  .map((fee) => (
                    <div key={fee.id} className={`border rounded-lg p-4 ${
                      fee.status === 'OVERDUE' ? 'border-red-200 bg-red-50' : 
                      fee.status === 'PARTIAL' ? 'border-blue-200 bg-blue-50' : 
                      'border-orange-200 bg-orange-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{fee.feeType}</h3>
                            {getStatusBadge(fee.status)}
                            {fee.status === 'OVERDUE' && (
                              <span className="text-xs text-red-600">
                                En retard de {Math.floor((new Date('2025-02-15').getTime() - new Date(fee.dueDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                              </span>
                            )}
                          </div>
                          
                          <div className="grid gap-2 md:grid-cols-3 text-sm">
                            <div>
                              <span className="text-gray-500">Montant dû:</span>
                              <p className="font-medium text-lg">
                                {formatCurrency(fee.remainingAmount || fee.amount)}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Date d'échéance:</span>
                              <p className={`font-medium ${
                                fee.status === 'OVERDUE' ? 'text-red-600' : 'text-gray-900'
                              }`}>
                                {new Date(fee.dueDate).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            {fee.status === 'PARTIAL' && (
                              <div>
                                <span className="text-gray-500">Déjà payé:</span>
                                <p className="font-medium text-green-600">
                                  {formatCurrency(fee.amount - (fee.remainingAmount || 0))}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handlePayment(fee)}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Payer
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePostponePayment(fee)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Reporter
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditFee(fee)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                {studentFees.filter(fee => fee.status === 'PENDING' || fee.status === 'OVERDUE' || fee.status === 'PARTIAL').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>Tous les frais sont à jour !</p>
                    <p className="text-sm">Aucun paiement en attente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                Reçus de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentFees
                  .filter(fee => fee.receiptNo)
                  .map((fee) => (
                    <div key={fee.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Receipt className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Reçu N° {fee.receiptNo}</h3>
                            <p className="text-sm text-gray-600">{fee.feeType}</p>
                            <p className="text-sm text-gray-500">
                              Payé le {fee.paidDate && new Date(fee.paidDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(fee.amount)}
                          </p>
                          <p className="text-sm text-gray-500">{fee.paymentMethod}</p>
                          <div className="flex gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenReceipt(fee)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenReceipt(fee)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {studentFees.filter(fee => fee.receiptNo).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-2" />
                    <p>Aucun reçu disponible</p>
                    <p className="text-sm">Les reçus apparaîtront après les paiements</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de détails du paiement */}
      <PaymentDetailsModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        payment={selectedPayment}
        studentInfo={student ? {
          name: student.name,
          className: student.classTitle || "",
          imageUrl: student.imageUrl,
          phone: student.phone,
          email: student.email,
        } : undefined}
      />

      {/* Modal de reçu */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={handleCloseReceiptModal}
        fee={selectedFeeForReceipt}
      />

      {/* Modal de paiement */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        fee={selectedFeeForPayment}
        studentName={student?.name}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Modal de report */}
      <PostponeModal
        isOpen={postponeModalOpen}
        onClose={() => setPostponeModalOpen(false)}
        fee={selectedFeeForPostpone}
        studentName={student?.name}        onConfirm={handleConfirmPostpone}      />

      {/* Modal de modification de frais */}
      <EditStudentFeeModal
        isOpen={editFeeModalOpen}
        onClose={() => setEditFeeModalOpen(false)}
        fee={selectedFeeForEdit}
        onUpdate={handleUpdateFee}
        onDelete={handleDeleteFee}
        onDuplicate={handleDuplicateFee}
      />
    </div>
  );
}

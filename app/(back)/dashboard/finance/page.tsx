"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Receipt,
  Calendar,
  Users
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import NewFeeModal from "@/components/NewFeeModal";
import PaymentModal from "@/components/PaymentModal";
import { useFinancialSummary, useOutstandingFees, useRevenueByMonth } from "@/hooks/useFinance";
import { useStudentFees } from "@/hooks/useStudentFees";

export default function FinancePage() {
  const { summary, loading: summaryLoading } = useFinancialSummary();
  const { fees: outstandingFees, loading: feesLoading } = useOutstandingFees();
  const { revenue, loading: revenueLoading } = useRevenueByMonth();
  const { fees: allFees, loading: allFeesLoading } = useStudentFees();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [feeTypeFilter, setFeeTypeFilter] = React.useState("all");

  if (summaryLoading || feesLoading || revenueLoading || allFeesLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Filtrer les enregistrements financiers
  const filteredRecords = allFees.filter(fee => {
    const matchesSearch = fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fee.feeType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || fee.status === statusFilter;
    const matchesFeeType = feeTypeFilter === "all" || fee.feeType.includes(feeTypeFilter);
    
    return matchesSearch && matchesStatus && matchesFeeType;
  });

  // Obtenir les types de frais uniques pour le filtre
  const uniqueFeeTypes = Array.from(new Set(allFees.map(fee => fee.feeType)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "border-green-200 text-green-700";
      case "PENDING":
        return "border-blue-200 text-blue-700";
      case "OVERDUE":
        return "border-red-200 text-red-700";
      case "PARTIALLY_PAID":
        return "border-orange-200 text-orange-700";
      default:
        return "border-gray-200 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Payé";
      case "PENDING":
        return "En attente";
      case "OVERDUE":
        return "En retard";
      case "PARTIALLY_PAID":
        return "Partiellement payé";
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case "MOBILE_MONEY":
      case "Mobile Money":
        return <CreditCard className="h-3 w-3" />;
      case "CASH":
      case "Espèces":
        return <Receipt className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Calculer les statistiques
  const totalRevenue = summary?.totalCollected || 0;
  const pendingPayments = summary?.totalOutstanding || 0;
  const collectionRate = summary?.collectionRate || "0";
  const monthlyTarget = totalRevenue * 1.2; // Mock target

  // Paiements récents (frais payés)
  const recentPayments = allFees
    .filter(fee => fee.status === "PAID")
    .slice(0, 3);

  // Paiements en retard
  const overduePayments = allFees.filter(fee => fee.status === "OVERDUE");

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion Financière</h1>
          <p className="text-gray-600 mt-1">Suivi des frais, paiements et rapports financiers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Générer Facture
          </Button>
          <NewFeeModal />
          <PaymentModal />
        </div>
      </div>

      {/* Statistiques financières */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Revenus Totaux"
          value={formatCurrency(totalRevenue)}
          description="Total collecté"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          className="border-green-200"
        />
        <StatsCard
          title="Paiements en Attente"
          value={formatCurrency(pendingPayments)}
          description="À collecter"
          icon={AlertTriangle}
          className="border-orange-200"
        />
        <StatsCard
          title="Taux de Collection"
          value={`${collectionRate}%`}
          description="Performance de collection"
          icon={TrendingUp}
          trend={{ value: 5.2, isPositive: true }}
          className="border-blue-200"
        />
        <StatsCard
          title="Objectif Mensuel"
          value={formatCurrency(monthlyTarget)}
          description="Cible fixée"
          icon={Calendar}
          className="border-purple-200"
        />
      </div>

      {/* Aperçu des paiements récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiements Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPayments.length > 0 ? (
            <div className="space-y-3">
              {recentPayments.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                      {getPaymentMethodIcon(fee.paymentMethod || undefined)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{fee.studentName || 'N/A'}</p>
                      <p className="text-xs text-gray-600">{fee.feeType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">
                      {formatCurrency(fee.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fee.paidDate && formatDate(fee.paidDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Aucun paiement récent</p>
          )}
        </CardContent>
      </Card>

      {/* Alertes de paiements en retard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Paiements en Retard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overduePayments.length > 0 ? (
            <div className="space-y-3">
              {overduePayments.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-sm">{fee.studentName || 'N/A'}</p>
                    <p className="text-xs text-gray-600">{fee.className || 'N/A'} - {fee.feeType}</p>
                    <p className="text-xs text-red-600">
                      Échéance: {fee.dueDate ? formatDate(fee.dueDate) : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-700">
                      {formatCurrency(fee.amount)}
                    </p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Envoyer Rappel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Aucun paiement en retard</p>
          )}
        </CardContent>
      </Card>

      {/* Liste complète des transactions financières */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Toutes les Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par élève, classe ou type de frais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PAID">Payé</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="OVERDUE">En retard</SelectItem>
                <SelectItem value="PARTIALLY_PAID">Partiellement payé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={feeTypeFilter} onValueChange={setFeeTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type de frais" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {uniqueFeeTypes.slice(0, 5).map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des transactions */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Type de Frais</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date d'Échéance</TableHead>
                  <TableHead>Date de Paiement</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">
                      {fee.studentName || 'N/A'}
                    </TableCell>
                    <TableCell>{fee.className || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={fee.feeType}>
                        {fee.feeType}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(fee.amount)}
                    </TableCell>
                    <TableCell>
                      {fee.dueDate ? formatDate(fee.dueDate) : '-'}
                    </TableCell>
                    <TableCell>
                      {fee.paidDate ? formatDate(fee.paidDate) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getPaymentMethodIcon(fee.paymentMethod || undefined)}
                        <span className="text-sm">{fee.paymentMethod || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(fee.status)}>
                        {getStatusText(fee.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune transaction trouvée pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

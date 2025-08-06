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
import { MockDataService } from "@/services/mockServices";
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

export default function FinancePage() {
  // TODO: Remplacer par les vrais appels API une fois le backend terminé
  const financialRecords = MockDataService.finance.getFinancialRecords();
  const financeStats = MockDataService.finance.getFinanceStats();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [feeTypeFilter, setFeeTypeFilter] = React.useState("all");

  // Filtrer les enregistrements financiers
  const filteredRecords = financialRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.feeType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesFeeType = feeTypeFilter === "all" || record.feeType.includes(feeTypeFilter);
    
    return matchesSearch && matchesStatus && matchesFeeType;
  });

  // Obtenir les types de frais uniques pour le filtre
  const uniqueFeeTypes = Array.from(new Set(financialRecords.map(record => {
    // Extraire le type principal (ex: "Frais de scolarité" de "Frais de scolarité Trimestre 2")
    const mainType = record.feeType.split(' ')[0] + ' ' + record.feeType.split(' ')[1] + ' ' + record.feeType.split(' ')[2];
    return mainType;
  })));

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
      case "Mobile Money":
        return <CreditCard className="h-3 w-3" />;
      case "Espèces":
        return <Receipt className="h-3 w-3" />;
      default:
        return null;
    }
  };

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
          value={MockDataService.formatCurrency(financeStats.totalRevenue)}
          description="Ce mois"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          className="border-green-200"
        />
        <StatsCard
          title="Paiements en Attente"
          value={MockDataService.formatCurrency(financeStats.pendingPayments)}
          description="À collecter"
          icon={AlertTriangle}
          className="border-orange-200"
        />
        <StatsCard
          title="Taux de Collection"
          value={`${financeStats.collectionRate}%`}
          description="Performance de collection"
          icon={TrendingUp}
          trend={{ value: 5.2, isPositive: true }}
          className="border-blue-200"
        />
        <StatsCard
          title="Objectif Mensuel"
          value={MockDataService.formatCurrency(financeStats.monthlyTarget)}
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
          <div className="space-y-3">
            {financialRecords
              .filter(record => record.status === "PAID")
              .slice(0, 3)
              .map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    {getPaymentMethodIcon(record.paymentMethod)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{record.studentName}</p>
                    <p className="text-xs text-gray-600">{record.feeType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-700">
                    {MockDataService.formatCurrency(record.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {record.paidDate && MockDataService.formatDate(record.paidDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
          <div className="space-y-3">
            {financialRecords
              .filter(record => record.status === "OVERDUE")
              .map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-sm">{record.studentName}</p>
                  <p className="text-xs text-gray-600">{record.className} - {record.feeType}</p>
                  <p className="text-xs text-red-600">
                    Échéance: {MockDataService.formatDate(record.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-700">
                    {MockDataService.formatCurrency(record.amount)}
                  </p>
                  <Button size="sm" variant="outline" className="mt-1">
                    Envoyer Rappel
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
                <SelectItem value="scolarité">Frais de scolarité</SelectItem>
                <SelectItem value="transport">Frais de transport</SelectItem>
                <SelectItem value="activités">Frais d'activités</SelectItem>
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
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.studentName}
                    </TableCell>
                    <TableCell>{record.className}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={record.feeType}>
                        {record.feeType}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {MockDataService.formatCurrency(record.amount)}
                    </TableCell>
                    <TableCell>
                      {MockDataService.formatDate(record.dueDate)}
                    </TableCell>
                    <TableCell>
                      {record.paidDate ? MockDataService.formatDate(record.paidDate) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getPaymentMethodIcon(record.paymentMethod)}
                        <span className="text-sm">{record.paymentMethod || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(record.status)}>
                        {getStatusText(record.status)}
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

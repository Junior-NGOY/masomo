"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DollarSign,
  Calculator,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Download,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Percent,
  User
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { usePayrollRecords } from "@/hooks/useStaff";

export default function PayrollPage() {
  const { payrolls, loading } = usePayrollRecords();
  const [selectedMonth, setSelectedMonth] = React.useState("all");
  const [selectedYear, setSelectedYear] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("current");
  const [selectedRecord, setSelectedRecord] = React.useState<any | null>(null);
  const [isProcessPayrollOpen, setIsProcessPayrollOpen] = React.useState(false);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Filtrage des enregistrements
  const filteredRecords = payrolls.filter(record => {
    const matchesMonth = selectedMonth === "all" || record.month.toLowerCase() === selectedMonth.toLowerCase();
    const matchesYear = selectedYear === "all" || record.year.toString() === selectedYear;
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    const matchesSearch = record.teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (record.teacher.departmentName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesMonth && matchesYear && matchesStatus && matchesSearch;
  });

  // Statistiques
  const totalGrossPay = filteredRecords.reduce((sum, record) => sum + (record.basicSalary + record.allowances), 0);
  const totalNetPay = filteredRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const totalDeductions = filteredRecords.reduce((sum, record) => sum + record.deductions, 0);
  const paidRecords = filteredRecords.filter(r => r.status === 'PAID').length;
  const pendingRecords = filteredRecords.filter(r => r.status === 'PENDING').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En attente</Badge>;
      case 'APPROVED':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Approuvé</Badge>;
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Payé</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de la Paie</h1>
          <p className="text-gray-600 mt-1">Traitement et suivi des salaires du personnel</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport Paie
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsProcessPayrollOpen(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Traiter Paie
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Masse Salariale Brute"
          value={formatCurrency(totalGrossPay)}
          description="Total brut mensuel"
          icon={DollarSign}
          className="border-blue-200"
        />
        <StatsCard
          title="Salaires Nets"
          value={formatCurrency(totalNetPay)}
          description="Total net à payer"
          icon={CreditCard}
          className="border-green-200"
        />
        <StatsCard
          title="Charges Sociales"
          value={formatCurrency(totalDeductions)}
          description="Total des déductions"
          icon={Percent}
          className="border-orange-200"
        />
        <StatsCard
          title="Paies Traitées"
          value={`${paidRecords}/${filteredRecords.length}`}
          description="Paiements effectués"
          icon={CheckCircle}
          trend={{ value: 12.5, isPositive: true }}
          className="border-purple-200"
        />
        <StatsCard
          title="En Attente"
          value={pendingRecords.toString()}
          description="À traiter"
          icon={Clock}
          className="border-red-200"
        />
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Paie Courante</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
        </TabsList>

        {/* Paie courante */}
        <TabsContent value="current" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par nom, département, poste..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="janvier">Janvier</SelectItem>
                    <SelectItem value="fevrier">Février</SelectItem>
                    <SelectItem value="mars">Mars</SelectItem>
                    <SelectItem value="avril">Avril</SelectItem>
                    <SelectItem value="mai">Mai</SelectItem>
                    <SelectItem value="juin">Juin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="APPROVED">Approuvé</SelectItem>
                    <SelectItem value="PAID">Payé</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des paies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Liste des Paies ({filteredRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Salaire Brut</TableHead>
                      <TableHead>Déductions</TableHead>
                      <TableHead>Salaire Net</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold">{record.teacher.firstName} {record.teacher.lastName}</div>
                              <div className="text-sm text-gray-600">{record.teacher.designation}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{record.teacher.departmentName || 'N/A'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-600">
                            {formatCurrency(record.basicSalary + record.allowances)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Base: {formatCurrency(record.basicSalary)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-red-600">
                            {formatCurrency(record.deductions)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-blue-600">
                            {formatCurrency(record.netSalary)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewRecord(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historique des Paies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Historique non disponible pour le moment.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employés */}
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Configuration des employés non disponible pour le moment.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Détails Paie */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détail de Paie - {selectedRecord.teacher.firstName} {selectedRecord.teacher.lastName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Période</Label>
                  <p className="text-sm">{selectedRecord.month} {selectedRecord.year}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                </div>
                {selectedRecord.paidDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date de paiement</Label>
                    <p className="text-sm">{new Date(selectedRecord.paidDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
                {selectedRecord.paymentMethod && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Méthode de paiement</Label>
                    <p className="text-sm">{selectedRecord.paymentMethod}</p>
                  </div>
                )}
              </div>

              {/* Calcul du salaire */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Calcul du Salaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Salaire de base et primes */}
                  <div className="space-y-2">
                    <div className="font-semibold text-green-600">Rémunération</div>
                    <div className="flex justify-between">
                      <span className="text-sm">Salaire de base</span>
                      <span>{formatCurrency(selectedRecord.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Indemnités</span>
                      <span>{formatCurrency(selectedRecord.allowances)}</span>
                    </div>
                  </div>

                  <div className="border-t my-2"></div>

                  {/* Déductions */}
                  <div className="space-y-2">
                    <div className="font-semibold text-red-600">Retenues</div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Déductions</span>
                      <span>{formatCurrency(selectedRecord.deductions)}</span>
                    </div>
                  </div>

                  <div className="border-t my-2"></div>

                  {/* Net */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg">Net à Payer</span>
                    <span className="font-bold text-lg text-blue-600">{formatCurrency(selectedRecord.netSalary)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

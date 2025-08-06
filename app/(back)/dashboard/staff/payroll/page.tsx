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

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: {
    transport: number;
    housing: number;
    food: number;
    overtime: number;
    performance: number;
  };
  deductions: {
    tax: number;
    socialSecurity: number;
    pension: number;
    advance: number;
    other: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  paymentDate?: string;
  bankAccount: string;
  notes?: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hireDate: string;
  baseSalary: number;
  bankAccount: string;
  taxNumber: string;
  socialSecurityNumber: string;
  status: 'active' | 'inactive' | 'terminated';
}

const mockEmployees: Employee[] = [
  {
    id: 'e-001',
    name: 'Professeur Amadou Ba',
    position: 'Enseignant',
    department: 'Mathématiques',
    hireDate: '2020-09-01',
    baseSalary: 450000,
    bankAccount: '1234567890',
    taxNumber: 'TAX001234',
    socialSecurityNumber: 'SS001234',
    status: 'active'
  },
  {
    id: 'e-002',
    name: 'Madame Fatou Diagne',
    position: 'Enseignante',
    department: 'Français',
    hireDate: '2018-03-15',
    baseSalary: 425000,
    bankAccount: '0987654321',
    taxNumber: 'TAX005678',
    socialSecurityNumber: 'SS005678',
    status: 'active'
  },
  {
    id: 'e-003',
    name: 'Monsieur Ousmane Sow',
    position: 'Administrateur',
    department: 'Administration',
    hireDate: '2019-01-10',
    baseSalary: 380000,
    bankAccount: '1122334455',
    taxNumber: 'TAX009876',
    socialSecurityNumber: 'SS009876',
    status: 'active'
  },
  {
    id: 'e-004',
    name: 'Docteur Aissatou Fall',
    position: 'Directrice Pédagogique',
    department: 'Direction',
    hireDate: '2017-08-20',
    baseSalary: 650000,
    bankAccount: '5566778899',
    taxNumber: 'TAX001122',
    socialSecurityNumber: 'SS001122',
    status: 'active'
  }
];

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: 'p-001',
    employeeId: 'e-001',
    employeeName: 'Professeur Amadou Ba',
    position: 'Enseignant',
    department: 'Mathématiques',
    month: 'Mars',
    year: 2024,
    baseSalary: 450000,
    allowances: {
      transport: 25000,
      housing: 50000,
      food: 30000,
      overtime: 15000,
      performance: 20000
    },
    deductions: {
      tax: 65000,
      socialSecurity: 31500,
      pension: 22500,
      advance: 0,
      other: 5000
    },
    grossSalary: 590000,
    netSalary: 466000,
    status: 'paid',
    paymentDate: '2024-03-28',
    bankAccount: '1234567890',
    notes: 'Prime de performance incluse'
  },
  {
    id: 'p-002',
    employeeId: 'e-002',
    employeeName: 'Madame Fatou Diagne',
    position: 'Enseignante',
    department: 'Français',
    month: 'Mars',
    year: 2024,
    baseSalary: 425000,
    allowances: {
      transport: 25000,
      housing: 45000,
      food: 30000,
      overtime: 0,
      performance: 15000
    },
    deductions: {
      tax: 59500,
      socialSecurity: 29750,
      pension: 21250,
      advance: 10000,
      other: 0
    },
    grossSalary: 540000,
    netSalary: 419500,
    status: 'approved',
    bankAccount: '0987654321'
  },
  {
    id: 'p-003',
    employeeId: 'e-003',
    employeeName: 'Monsieur Ousmane Sow',
    position: 'Administrateur',
    department: 'Administration',
    month: 'Mars',
    year: 2024,
    baseSalary: 380000,
    allowances: {
      transport: 20000,
      housing: 35000,
      food: 25000,
      overtime: 8000,
      performance: 0
    },
    deductions: {
      tax: 46800,
      socialSecurity: 23400,
      pension: 19000,
      advance: 0,
      other: 2500
    },
    grossSalary: 468000,
    netSalary: 376300,
    status: 'pending',
    bankAccount: '1122334455'
  },
  {
    id: 'p-004',
    employeeId: 'e-004',
    employeeName: 'Docteur Aissatou Fall',
    position: 'Directrice Pédagogique',
    department: 'Direction',
    month: 'Mars',
    year: 2024,
    baseSalary: 650000,
    allowances: {
      transport: 35000,
      housing: 80000,
      food: 40000,
      overtime: 0,
      performance: 50000
    },
    deductions: {
      tax: 106250,
      socialSecurity: 42750,
      pension: 32500,
      advance: 0,
      other: 10000
    },
    grossSalary: 855000,
    netSalary: 663500,
    status: 'approved',
    bankAccount: '5566778899',
    notes: 'Prime de direction incluse'
  }
];

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = React.useState("mars");
  const [selectedYear, setSelectedYear] = React.useState("2024");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("current");
  const [selectedRecord, setSelectedRecord] = React.useState<PayrollRecord | null>(null);
  const [isProcessPayrollOpen, setIsProcessPayrollOpen] = React.useState(false);

  // Filtrage des enregistrements
  const filteredRecords = mockPayrollRecords.filter(record => {
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Statistiques
  const totalGrossPay = filteredRecords.reduce((sum, record) => sum + record.grossSalary, 0);
  const totalNetPay = filteredRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const totalDeductions = filteredRecords.reduce((sum, record) => 
    sum + Object.values(record.deductions).reduce((a, b) => a + b, 0), 0);
  const paidRecords = filteredRecords.filter(r => r.status === 'paid').length;
  const pendingRecords = filteredRecords.filter(r => r.status === 'pending').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Approuvé</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Payé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleViewRecord = (record: PayrollRecord) => {
    setSelectedRecord(record);
  };

  const handleApprovePayroll = (recordId: string) => {
    alert(`Paie approuvée pour l'enregistrement ${recordId}`);
  };

  const handleProcessPayment = (recordId: string) => {
    alert(`Paiement traité pour l'enregistrement ${recordId}`);
  };

  const handleGeneratePayslip = (recordId: string) => {
    alert(`Fiche de paie générée pour l'enregistrement ${recordId}`);
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
          <TabsTrigger value="reports">Rapports</TabsTrigger>
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
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="paid">Payé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
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
                Paie {selectedMonth} {selectedYear} ({filteredRecords.length})
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
                    {filteredRecords.map((record) => {
                      const totalDeductions = Object.values(record.deductions).reduce((a, b) => a + b, 0);
                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold">{record.employeeName}</div>
                                <div className="text-sm text-gray-600">{record.position}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{record.department}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-green-600">
                              {formatCurrency(record.grossSalary)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Base: {formatCurrency(record.baseSalary)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-red-600">
                              {formatCurrency(totalDeductions)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Impôts: {formatCurrency(record.deductions.tax)}
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
                              {record.status === 'pending' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleApprovePayroll(record.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {record.status === 'approved' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleProcessPayment(record.id)}
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleGeneratePayslip(record.id)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
              <div className="space-y-4">
                {[
                  { month: 'Février 2024', total: 1850000, employees: 4, status: 'completed' },
                  { month: 'Janvier 2024', total: 1820000, employees: 4, status: 'completed' },
                  { month: 'Décembre 2023', total: 1975000, employees: 4, status: 'completed' },
                  { month: 'Novembre 2023', total: 1835000, employees: 4, status: 'completed' }
                ].map((history, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{history.month}</div>
                        <div className="text-sm text-gray-600">
                          {history.employees} employés payés
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        {formatCurrency(history.total)}
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Terminé
                      </Badge>
                    </div>
                  </div>
                ))}
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
                Configuration Employés
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Salaire de Base</TableHead>
                      <TableHead>Compte Bancaire</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold">{employee.name}</div>
                              <div className="text-sm text-gray-600">{employee.department}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{employee.position}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-600">
                            {formatCurrency(employee.baseSalary)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">{employee.bankAccount}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            employee.status === 'active' 
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }>
                            {employee.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rapports */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Évolution des coûts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Évolution Masse Salariale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { period: 'T1 2024', amount: 5495000, growth: 3.2 },
                    { period: 'T4 2023', amount: 5325000, growth: 2.8 },
                    { period: 'T3 2023', amount: 5180000, growth: 1.9 },
                  ].map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{trend.period}</div>
                        <div className="text-sm text-gray-600">Trimestre</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(trend.amount)}</div>
                        <div className={`text-sm ${trend.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trend.growth >= 0 ? '+' : ''}{trend.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Répartition des charges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Répartition des Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Salaires bruts', amount: 2465000, percentage: 65 },
                    { label: 'Charges sociales', amount: 738000, percentage: 20 },
                    { label: 'Impôts sur salaires', amount: 369000, percentage: 10 },
                    { label: 'Avantages', amount: 184000, percentage: 5 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-gray-600">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Détails Paie */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détail de Paie - {selectedRecord.employeeName}
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">Compte bancaire</Label>
                  <p className="text-sm font-mono">{selectedRecord.bankAccount}</p>
                </div>
                {selectedRecord.paymentDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date de paiement</Label>
                    <p className="text-sm">{new Date(selectedRecord.paymentDate).toLocaleDateString('fr-FR')}</p>
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
                      <span className="text-sm font-medium">{formatCurrency(selectedRecord.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Prime transport</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedRecord.allowances.transport)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Prime logement</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedRecord.allowances.housing)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Prime repas</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedRecord.allowances.food)}</span>
                    </div>
                    {selectedRecord.allowances.overtime > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Heures supplémentaires</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedRecord.allowances.overtime)}</span>
                      </div>
                    )}
                    {selectedRecord.allowances.performance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Prime de performance</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedRecord.allowances.performance)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-semibold text-green-600">
                      <span>Salaire brut</span>
                      <span>{formatCurrency(selectedRecord.grossSalary)}</span>
                    </div>
                  </div>

                  {/* Déductions */}
                  <div className="space-y-2">
                    <div className="font-semibold text-red-600">Déductions</div>
                    <div className="flex justify-between">
                      <span className="text-sm">Impôt sur le revenu</span>
                      <span className="text-sm font-medium">-{formatCurrency(selectedRecord.deductions.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sécurité sociale</span>
                      <span className="text-sm font-medium">-{formatCurrency(selectedRecord.deductions.socialSecurity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Caisse de retraite</span>
                      <span className="text-sm font-medium">-{formatCurrency(selectedRecord.deductions.pension)}</span>
                    </div>
                    {selectedRecord.deductions.advance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Avance sur salaire</span>
                        <span className="text-sm font-medium">-{formatCurrency(selectedRecord.deductions.advance)}</span>
                      </div>
                    )}
                    {selectedRecord.deductions.other > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Autres déductions</span>
                        <span className="text-sm font-medium">-{formatCurrency(selectedRecord.deductions.other)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-semibold text-red-600">
                      <span>Total déductions</span>
                      <span>-{formatCurrency(Object.values(selectedRecord.deductions).reduce((a, b) => a + b, 0))}</span>
                    </div>
                  </div>

                  {/* Salaire net */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg text-blue-600">
                      <span>Salaire net à payer</span>
                      <span>{formatCurrency(selectedRecord.netSalary)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedRecord.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Traiter Paie */}
      <Dialog open={isProcessPayrollOpen} onOpenChange={setIsProcessPayrollOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Traiter Nouvelle Paie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="payroll-month">Mois</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avril">Avril</SelectItem>
                    <SelectItem value="mai">Mai</SelectItem>
                    <SelectItem value="juin">Juin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payroll-year">Année</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Employés concernés</span>
              </div>
              <div className="text-sm text-blue-700">
                {mockEmployees.filter(e => e.status === 'active').length} employés actifs seront inclus dans cette paie.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsProcessPayrollOpen(false)}>
                Annuler
              </Button>
              <Button>Générer la Paie</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

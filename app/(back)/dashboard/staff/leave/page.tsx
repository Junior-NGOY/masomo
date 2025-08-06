"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  FileText,
  Users,
  TrendingUp,
  Plane,
  Heart,
  Home,
  Briefcase
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

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  replacementEmployee?: string;
  urgency: 'low' | 'medium' | 'high';
  documents?: string[];
  notes?: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  totalLeaveDays: number;
  usedLeaveDays: number;
  remainingLeaveDays: number;
  sickLeaveDays: number;
  leaveBalance: {
    vacation: number;
    sick: number;
    personal: number;
  };
}

const mockEmployees: Employee[] = [
  {
    id: 'e-001',
    name: 'Professeur Amadou Ba',
    position: 'Enseignant',
    department: 'Mathématiques',
    totalLeaveDays: 30,
    usedLeaveDays: 12,
    remainingLeaveDays: 18,
    sickLeaveDays: 3,
    leaveBalance: {
      vacation: 18,
      sick: 12,
      personal: 5
    }
  },
  {
    id: 'e-002',
    name: 'Madame Fatou Diagne',
    position: 'Enseignante',
    department: 'Français',
    totalLeaveDays: 30,
    usedLeaveDays: 8,
    remainingLeaveDays: 22,
    sickLeaveDays: 1,
    leaveBalance: {
      vacation: 22,
      sick: 14,
      personal: 7
    }
  },
  {
    id: 'e-003',
    name: 'Monsieur Ousmane Sow',
    position: 'Administrateur',
    department: 'Administration',
    totalLeaveDays: 25,
    usedLeaveDays: 15,
    remainingLeaveDays: 10,
    sickLeaveDays: 5,
    leaveBalance: {
      vacation: 10,
      sick: 10,
      personal: 3
    }
  },
  {
    id: 'e-004',
    name: 'Docteur Aissatou Fall',
    position: 'Directrice Pédagogique',
    department: 'Direction',
    totalLeaveDays: 35,
    usedLeaveDays: 6,
    remainingLeaveDays: 29,
    sickLeaveDays: 0,
    leaveBalance: {
      vacation: 29,
      sick: 15,
      personal: 8
    }
  }
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'l-001',
    employeeId: 'e-001',
    employeeName: 'Professeur Amadou Ba',
    position: 'Enseignant',
    department: 'Mathématiques',
    leaveType: 'vacation',
    startDate: '2024-04-15',
    endDate: '2024-04-19',
    duration: 5,
    reason: 'Congés familiaux - voyage avec la famille',
    status: 'pending',
    appliedDate: '2024-03-20',
    urgency: 'medium',
    replacementEmployee: 'Professeur Modou Ndiaye'
  },
  {
    id: 'l-002',
    employeeId: 'e-002',
    employeeName: 'Madame Fatou Diagne',
    position: 'Enseignante',
    department: 'Français',
    leaveType: 'sick',
    startDate: '2024-03-28',
    endDate: '2024-03-29',
    duration: 2,
    reason: 'Consultation médicale et récupération',
    status: 'approved',
    appliedDate: '2024-03-27',
    approvedBy: 'Docteur Aissatou Fall',
    approvedDate: '2024-03-27',
    urgency: 'high',
    documents: ['certificat_medical.pdf']
  },
  {
    id: 'l-003',
    employeeId: 'e-003',
    employeeName: 'Monsieur Ousmane Sow',
    position: 'Administrateur',
    department: 'Administration',
    leaveType: 'personal',
    startDate: '2024-04-10',
    endDate: '2024-04-12',
    duration: 3,
    reason: 'Affaires personnelles urgentes',
    status: 'rejected',
    appliedDate: '2024-04-08',
    approvedBy: 'Docteur Aissatou Fall',
    approvedDate: '2024-04-09',
    urgency: 'low',
    notes: 'Période trop chargée, reporter à une date ultérieure'
  },
  {
    id: 'l-004',
    employeeId: 'e-004',
    employeeName: 'Docteur Aissatou Fall',
    position: 'Directrice Pédagogique',
    department: 'Direction',
    leaveType: 'vacation',
    startDate: '2024-05-20',
    endDate: '2024-05-31',
    duration: 10,
    reason: 'Congés annuels - formation internationale',
    status: 'approved',
    appliedDate: '2024-03-15',
    approvedBy: 'Conseil d\'Administration',
    approvedDate: '2024-03-18',
    urgency: 'low',
    replacementEmployee: 'Directeur Adjoint'
  }
];

export default function LeavePage() {
  const [selectedType, setSelectedType] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("requests");
  const [selectedRequest, setSelectedRequest] = React.useState<LeaveRequest | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = React.useState(false);

  // Filtrage des demandes
  const filteredRequests = mockLeaveRequests.filter(request => {
    const matchesType = selectedType === "all" || request.leaveType === selectedType;
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Statistiques
  const totalRequests = mockLeaveRequests.length;
  const pendingRequests = mockLeaveRequests.filter(r => r.status === 'pending').length;
  const approvedRequests = mockLeaveRequests.filter(r => r.status === 'approved').length;
  const totalLeaveDays = mockLeaveRequests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.duration, 0);

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case 'vacation':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Congés</Badge>;
      case 'sick':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Maladie</Badge>;
      case 'personal':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Personnel</Badge>;
      case 'maternity':
        return <Badge className="bg-pink-100 text-pink-800 border-pink-200">Maternité</Badge>;
      case 'emergency':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Urgence</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Moyen</Badge>;
      case 'low':
        return <Badge variant="outline">Faible</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'vacation':
        return <Plane className="h-4 w-4" />;
      case 'sick':
        return <Heart className="h-4 w-4" />;
      case 'personal':
        return <Home className="h-4 w-4" />;
      case 'maternity':
        return <User className="h-4 w-4" />;
      case 'emergency':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const handleViewRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };

  const handleApproveRequest = (requestId: string) => {
    alert(`Demande ${requestId} approuvée`);
  };

  const handleRejectRequest = (requestId: string) => {
    alert(`Demande ${requestId} rejetée`);
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Congés</h1>
          <p className="text-gray-600 mt-1">Demandes et planning des congés du personnel</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Planning Congés
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsNewRequestOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Demande
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Demandes Totales"
          value={totalRequests.toString()}
          description="Ce mois"
          icon={FileText}
          className="border-blue-200"
        />
        <StatsCard
          title="En Attente"
          value={pendingRequests.toString()}
          description="À traiter"
          icon={Clock}
          className="border-orange-200"
        />
        <StatsCard
          title="Approuvées"
          value={approvedRequests.toString()}
          description="Congés accordés"
          icon={CheckCircle}
          trend={{ value: 15.3, isPositive: true }}
          className="border-green-200"
        />
        <StatsCard
          title="Jours d'Absence"
          value={totalLeaveDays.toString()}
          description="Total approuvé"
          icon={Calendar}
          className="border-purple-200"
        />
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="balances">Soldes</TabsTrigger>
          <TabsTrigger value="calendar">Planning</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        {/* Demandes de congés */}
        <TabsContent value="requests" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par nom, département, motif..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type de congé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="vacation">Congés</SelectItem>
                    <SelectItem value="sick">Maladie</SelectItem>
                    <SelectItem value="personal">Personnel</SelectItem>
                    <SelectItem value="maternity">Maternité</SelectItem>
                    <SelectItem value="emergency">Urgence</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des demandes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Demandes de Congés ({filteredRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type / Urgence</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold">{request.employeeName}</div>
                              <div className="text-sm text-gray-600">{request.department}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              {getLeaveTypeIcon(request.leaveType)}
                              {getLeaveTypeBadge(request.leaveType)}
                            </div>
                            {getUrgencyBadge(request.urgency)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Demandé le {formatDate(request.appliedDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{request.duration} jour(s)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium text-sm truncate">{request.reason}</div>
                            {request.replacementEmployee && (
                              <div className="text-xs text-gray-600">
                                Remplaçant: {request.replacementEmployee}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === 'pending' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleApproveRequest(request.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRejectRequest(request.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
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

        {/* Soldes de congés */}
        <TabsContent value="balances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Soldes de Congés par Employé
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Congés Annuels</TableHead>
                      <TableHead>Congés Maladie</TableHead>
                      <TableHead>Congés Personnel</TableHead>
                      <TableHead>Total Utilisé</TableHead>
                      <TableHead>Solde Restant</TableHead>
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
                          <div className="text-center">
                            <div className="font-bold text-blue-600">{employee.leaveBalance.vacation}</div>
                            <div className="text-xs text-gray-500">jours</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-bold text-red-600">{employee.leaveBalance.sick}</div>
                            <div className="text-xs text-gray-500">jours</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-bold text-purple-600">{employee.leaveBalance.personal}</div>
                            <div className="text-xs text-gray-500">jours</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-bold text-orange-600">{employee.usedLeaveDays}</div>
                            <div className="text-xs text-gray-500">sur {employee.totalLeaveDays}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className={`font-bold ${employee.remainingLeaveDays > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                              {employee.remainingLeaveDays}
                            </div>
                            <div className="text-xs text-gray-500">jours</div>
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

        {/* Planning des congés */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Planning des Congés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Calendrier des Congés</p>
                  <p className="text-sm">Vue d'ensemble des absences planifiées</p>
                  <p className="text-xs mt-2">• Planning mensuel et annuel</p>
                  <p className="text-xs">• Conflits de planification</p>
                  <p className="text-xs">• Disponibilité des équipes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Congés à venir */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Congés à Venir (30 prochains jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeaveRequests
                  .filter(request => 
                    request.status === 'approved' && 
                    new Date(request.startDate) > new Date()
                  )
                  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getLeaveTypeIcon(request.leaveType)}
                        </div>
                        <div>
                          <div className="font-semibold">{request.employeeName}</div>
                          <div className="text-sm text-gray-600">{request.department}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getLeaveTypeBadge(request.leaveType)}
                        <div className="text-sm text-gray-600 mt-1">
                          {request.duration} jour(s)
                        </div>
                        {request.replacementEmployee && (
                          <div className="text-xs text-gray-500">
                            Remplaçant: {request.replacementEmployee}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyses */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Statistiques par type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Répartition par Type de Congé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Congés annuels', count: 8, percentage: 50, color: 'bg-blue-500' },
                    { type: 'Congés maladie', count: 4, percentage: 25, color: 'bg-red-500' },
                    { type: 'Congés personnels', count: 3, percentage: 19, color: 'bg-purple-500' },
                    { type: 'Urgences', count: 1, percentage: 6, color: 'bg-orange-500' }
                  ].map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.type}</span>
                        <span className="text-gray-600">{item.count} demandes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tendances mensuelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tendances Mensuelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: 'Janvier', requests: 6, days: 28 },
                    { month: 'Février', requests: 4, days: 18 },
                    { month: 'Mars', requests: 8, days: 35 }
                  ].map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{trend.month}</div>
                        <div className="text-sm text-gray-600">{trend.requests} demandes</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{trend.days} jours</div>
                        <div className="text-sm text-gray-600">d'absence</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analyses d'équipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Impact sur les Équipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {['Mathématiques', 'Français', 'Administration'].map((dept) => {
                  const deptRequests = mockLeaveRequests.filter(r => r.department === dept);
                  const totalDays = deptRequests.reduce((sum, r) => sum + r.duration, 0);
                  return (
                    <div key={dept} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{dept}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Demandes</span>
                          <span className="font-medium">{deptRequests.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Jours d'absence</span>
                          <span className="font-medium">{totalDays}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Impact</span>
                          <span className={`font-medium ${
                            totalDays > 20 ? 'text-red-600' :
                            totalDays > 10 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {totalDays > 20 ? 'Élevé' :
                             totalDays > 10 ? 'Moyen' : 'Faible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Détails Demande */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détails de la Demande de Congé
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Employé</Label>
                  <p className="text-sm">{selectedRequest.employeeName}</p>
                  <p className="text-xs text-gray-600">{selectedRequest.position} - {selectedRequest.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Type de congé</Label>
                  <div className="mt-1">{getLeaveTypeBadge(selectedRequest.leaveType)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Période</Label>
                  <p className="text-sm">
                    Du {formatDate(selectedRequest.startDate)} au {formatDate(selectedRequest.endDate)}
                  </p>
                  <p className="text-xs text-gray-600">{selectedRequest.duration} jour(s)</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              {/* Motif */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Motif</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedRequest.reason}</p>
              </div>

              {/* Dates importantes */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date de demande</Label>
                  <p className="text-sm">{formatDate(selectedRequest.appliedDate)}</p>
                </div>
                {selectedRequest.approvedDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date d'approbation</Label>
                    <p className="text-sm">{formatDate(selectedRequest.approvedDate)}</p>
                    {selectedRequest.approvedBy && (
                      <p className="text-xs text-gray-600">Par: {selectedRequest.approvedBy}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Informations supplémentaires */}
              {(selectedRequest.replacementEmployee || selectedRequest.urgency || selectedRequest.documents) && (
                <div className="space-y-3">
                  {selectedRequest.replacementEmployee && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Employé de remplacement</Label>
                      <p className="text-sm">{selectedRequest.replacementEmployee}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Urgence</Label>
                    <div className="mt-1">{getUrgencyBadge(selectedRequest.urgency)}</div>
                  </div>

                  {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Documents joints</Label>
                      <div className="mt-1">
                        {selectedRequest.documents.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-blue-600">
                            <FileText className="h-4 w-4" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedRequest.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedRequest.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => handleRejectRequest(selectedRequest.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button 
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Nouvelle Demande */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nouvelle Demande de Congé
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="employee">Employé</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="leaveType">Type de congé</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Congés annuels</SelectItem>
                    <SelectItem value="sick">Congé maladie</SelectItem>
                    <SelectItem value="personal">Congé personnel</SelectItem>
                    <SelectItem value="maternity">Congé maternité</SelectItem>
                    <SelectItem value="emergency">Urgence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input type="date" id="startDate" />
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input type="date" id="endDate" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Motif</Label>
              <Textarea id="reason" placeholder="Expliquez le motif de votre demande..." />
            </div>

            <div>
              <Label htmlFor="replacement">Employé de remplacement (optionnel)</Label>
              <Input id="replacement" placeholder="Nom de l'employé de remplacement" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                Annuler
              </Button>
              <Button>Soumettre la Demande</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

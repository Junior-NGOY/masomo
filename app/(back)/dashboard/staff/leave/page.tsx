"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Plane,
  Heart,
  Home,
  AlertTriangle,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useLeaveRequests } from "@/hooks/useStaff";

export default function LeavePage() {
  const { leaves, loading } = useLeaveRequests();
  const [selectedType, setSelectedType] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("requests");

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Filtrage des demandes
  const filteredRequests = leaves.filter(request => {
    const matchesType = selectedType === "all" || request.type === selectedType;
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    const matchesSearch = request.teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (request.teacher.departmentName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Statistiques
  const totalRequests = leaves.length;
  const pendingRequests = leaves.filter(r => r.status === 'PENDING').length;
  const approvedRequests = leaves.filter(r => r.status === 'APPROVED').length;
  const totalLeaveDays = leaves
    .filter(r => r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.days, 0);

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case 'VACATION':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Congés</Badge>;
      case 'SICK':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Maladie</Badge>;
      case 'PERSONAL':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Personnel</Badge>;
      case 'MATERNITY':
        return <Badge className="bg-pink-100 text-pink-800 border-pink-200">Maternité</Badge>;
      case 'EMERGENCY':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Urgence</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approuvé</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejeté</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'VACATION':
        return <Plane className="h-4 w-4" />;
      case 'SICK':
        return <Heart className="h-4 w-4" />;
      case 'PERSONAL':
        return <Home className="h-4 w-4" />;
      case 'MATERNITY':
        return <User className="h-4 w-4" />;
      case 'EMERGENCY':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
          <Button className="bg-blue-600 hover:bg-blue-700">
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
        <TabsList>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
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
                    <SelectItem value="VACATION">Congés</SelectItem>
                    <SelectItem value="SICK">Maladie</SelectItem>
                    <SelectItem value="PERSONAL">Personnel</SelectItem>
                    <SelectItem value="MATERNITY">Maternité</SelectItem>
                    <SelectItem value="EMERGENCY">Urgence</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="APPROVED">Approuvé</SelectItem>
                    <SelectItem value="REJECTED">Rejeté</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
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
                      <TableHead>Type</TableHead>
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
                              <div className="font-semibold">{request.teacher.firstName} {request.teacher.lastName}</div>
                              <div className="text-sm text-gray-600">{request.teacher.departmentName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getLeaveTypeIcon(request.type)}
                            {getLeaveTypeBadge(request.type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{request.days} jour(s)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium text-sm truncate">{request.reason}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wrench,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Settings,
  FileText,
  Car
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMaintenanceRecords, useVehicles } from "@/hooks/useTransport";

export default function TransportMaintenancePage() {
  const { records, loading: recordsLoading } = useMaintenanceRecords();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("schedule");
  const [isNewMaintenanceOpen, setIsNewMaintenanceOpen] = React.useState(false);

  if (recordsLoading || vehiclesLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Statistiques
  const stats = {
    totalVehicles: vehicles.length,
    operational: vehicles.filter(v => v.status === 'ACTIVE').length,
    inMaintenance: vehicles.filter(v => v.status === 'MAINTENANCE').length,
    totalCost: records.reduce((sum, r) => sum + r.cost, 0),
    completedMaintenance: records.filter(r => r.status === 'COMPLETED').length
  };

  // Filtrage
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.vehicle.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesType = typeFilter === "all" || record.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Planifiée';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'IN_PROGRESS': return <Settings className="h-4 w-4 text-yellow-600" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PREVENTIVE': return 'bg-green-100 text-green-800';
      case 'CORRECTIVE': return 'bg-yellow-100 text-yellow-800';
      case 'EMERGENCY': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'PREVENTIVE': return 'Préventive';
      case 'CORRECTIVE': return 'Corrective';
      case 'EMERGENCY': return 'Urgence';
      default: return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleNewMaintenance = () => {
    setIsNewMaintenanceOpen(true);
  };

  const handleViewDetails = (recordId: string) => {
    alert(`Détails de la maintenance ${recordId}`);
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Transport</h1>
          <p className="text-gray-600 mt-1">Gestion et planification de la maintenance des véhicules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Dialog open={isNewMaintenanceOpen} onOpenChange={setIsNewMaintenanceOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Planifier une maintenance</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Véhicule</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un véhicule" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.registrationNo} - {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de maintenance</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PREVENTIVE">Préventive</SelectItem>
                        <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                        <SelectItem value="EMERGENCY">Urgence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date prévue</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea placeholder="Décrire les travaux à effectuer..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Coût estimé (CDF)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewMaintenanceOpen(false)}>
                  Annuler
                </Button>
                <Button>Planifier</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Véhicules total"
          value={stats.totalVehicles.toString()}
          description="Dans la flotte"
          icon={Car}
          className="border-blue-200"
        />
        <StatsCard
          title="Opérationnels"
          value={stats.operational.toString()}
          description="En service"
          icon={CheckCircle}
          className="border-green-200"
        />
        <StatsCard
          title="En maintenance"
          value={stats.inMaintenance.toString()}
          description="Hors service"
          icon={Wrench}
          className="border-yellow-200"
        />
        <StatsCard
          title="Coût Total"
          value={formatCurrency(stats.totalCost)}
          description="Dépenses maintenance"
          icon={DollarSign}
          className="border-purple-200"
        />
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par véhicule, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="SCHEDULED">Planifiées</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="COMPLETED">Terminées</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="PREVENTIVE">Préventive</SelectItem>
                <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                <SelectItem value="EMERGENCY">Urgence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Planning</TabsTrigger>
          <TabsTrigger value="fleet">État de la flotte</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning de maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Coût</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.vehicle.registrationNo}</div>
                            <div className="text-sm text-gray-600">{record.vehicle.model}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTypeColor(record.type)}>
                            {getTypeText(record.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{record.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            <Badge variant="outline" className={getStatusColor(record.status)}>
                              {getStatusText(record.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(record.date).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(record.cost)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(record.id)}
                            >
                              <FileText className="h-4 w-4" />
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

        <TabsContent value="fleet" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{vehicle.registrationNo}</span>
                    <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                      {getStatusText(vehicle.status)}
                    </Badge>
                  </CardTitle>
                  <div className="text-sm text-gray-600">
                    {vehicle.model} ({vehicle.year})
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {vehicle.capacity}
                      </div>
                      <div className="text-sm text-gray-600">Places</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dernière révision:</span>
                      <span>{vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance).toLocaleDateString('fr-FR') : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prochaine révision:</span>
                      <span>
                        {vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance).toLocaleDateString('fr-FR') : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Wrench className="h-4 w-4 mr-2" />
                      Planifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

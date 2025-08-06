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

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  plateNumber: string;
  type: 'preventive' | 'corrective' | 'emergency';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  mechanicName: string;
  workshopName: string;
  cost: number;
  estimatedCost?: number;
  mileage: number;
  nextServiceMileage: number;
  partsUsed: string[];
  notes: string;
  driverReported: boolean;
  inspectionDate: string;
  warrantyExpiry?: string;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  mileage: number;
  lastService: string;
  nextService: string;
  maintenanceScore: number;
  status: 'operational' | 'maintenance' | 'repair' | 'out-of-service';
}

export default function TransportMaintenancePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("schedule");
  const [isNewMaintenanceOpen, setIsNewMaintenanceOpen] = React.useState(false);

  // Données simulées des véhicules
  const vehicles: Vehicle[] = [
    {
      id: "VEH-001",
      plateNumber: "DK-2024-AA",
      model: "Mercedes Sprinter",
      year: 2022,
      mileage: 45000,
      lastService: "2024-02-15",
      nextService: "2024-04-15",
      maintenanceScore: 92,
      status: "operational"
    },
    {
      id: "VEH-002",
      plateNumber: "DK-2024-BB",
      model: "Ford Transit",
      year: 2021,
      mileage: 67000,
      lastService: "2024-03-20",
      nextService: "2024-05-20",
      maintenanceScore: 87,
      status: "operational"
    },
    {
      id: "VEH-003",
      plateNumber: "DK-2024-CC",
      model: "Iveco Daily",
      year: 2020,
      mileage: 89000,
      lastService: "2024-01-10",
      nextService: "2024-04-10",
      maintenanceScore: 78,
      status: "maintenance"
    },
    {
      id: "VEH-004",
      plateNumber: "DK-2024-DD",
      model: "Mercedes Vito",
      year: 2019,
      mileage: 112000,
      lastService: "2024-03-25",
      nextService: "2024-06-25",
      maintenanceScore: 65,
      status: "repair"
    }
  ];

  // Données simulées de maintenance
  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: "MAINT-001",
      vehicleId: "VEH-001",
      plateNumber: "DK-2024-AA",
      type: "preventive",
      status: "scheduled",
      priority: "medium",
      description: "Révision périodique 45 000 km",
      scheduledDate: "2024-04-15T09:00:00",
      mechanicName: "Ibrahima Sarr",
      workshopName: "Garage Central",
      cost: 0,
      estimatedCost: 75000,
      mileage: 45000,
      nextServiceMileage: 50000,
      partsUsed: [],
      notes: "Révision programmée selon le planning",
      driverReported: false,
      inspectionDate: "2024-04-10T10:00:00"
    },
    {
      id: "MAINT-002",
      vehicleId: "VEH-002",
      plateNumber: "DK-2024-BB",
      type: "corrective",
      status: "in-progress",
      priority: "high",
      description: "Remplacement plaquettes de frein avant",
      scheduledDate: "2024-03-30T08:00:00",
      mechanicName: "Cheikh Diop",
      workshopName: "Auto Service Plus",
      cost: 0,
      estimatedCost: 45000,
      mileage: 67000,
      nextServiceMileage: 67000,
      partsUsed: ["Plaquettes frein avant", "Liquide de frein"],
      notes: "Usure importante détectée lors de l'inspection",
      driverReported: true,
      inspectionDate: "2024-03-28T14:00:00"
    },
    {
      id: "MAINT-003",
      vehicleId: "VEH-003",
      plateNumber: "DK-2024-CC",
      type: "emergency",
      status: "completed",
      priority: "critical",
      description: "Réparation système de refroidissement",
      scheduledDate: "2024-03-25T07:00:00",
      completedDate: "2024-03-26T16:00:00",
      mechanicName: "Moussa Ba",
      workshopName: "Garage Express",
      cost: 125000,
      mileage: 89000,
      nextServiceMileage: 89000,
      partsUsed: ["Radiateur", "Thermostat", "Liquide de refroidissement"],
      notes: "Surchauffe moteur, intervention d'urgence",
      driverReported: true,
      inspectionDate: "2024-03-25T07:30:00"
    },
    {
      id: "MAINT-004",
      vehicleId: "VEH-004",
      plateNumber: "DK-2024-DD",
      type: "preventive",
      status: "overdue",
      priority: "high",
      description: "Vidange et filtres",
      scheduledDate: "2024-03-20T10:00:00",
      mechanicName: "Amadou Ndiaye",
      workshopName: "Garage Central",
      cost: 0,
      estimatedCost: 35000,
      mileage: 112000,
      nextServiceMileage: 115000,
      partsUsed: [],
      notes: "Maintenance en retard, à programmer d'urgence",
      driverReported: false,
      inspectionDate: "2024-03-15T09:00:00"
    },
    {
      id: "MAINT-005",
      vehicleId: "VEH-001",
      plateNumber: "DK-2024-AA",
      type: "corrective",
      status: "completed",
      priority: "medium",
      description: "Remplacement pneus arrière",
      scheduledDate: "2024-03-10T11:00:00",
      completedDate: "2024-03-10T15:00:00",
      mechanicName: "Pape Sow",
      workshopName: "Pneu Service",
      cost: 180000,
      mileage: 44500,
      nextServiceMileage: 44500,
      partsUsed: ["2 pneus arrière 225/75R16"],
      notes: "Usure inégale, réalignement effectué",
      driverReported: true,
      inspectionDate: "2024-03-08T13:00:00"
    }
  ];

  // Statistiques
  const stats = {
    totalVehicles: vehicles.length,
    operational: vehicles.filter(v => v.status === 'operational').length,
    inMaintenance: vehicles.filter(v => v.status === 'maintenance' || v.status === 'repair').length,
    overdueMaintenance: maintenanceRecords.filter(m => m.status === 'overdue').length,
    monthlyBudget: maintenanceRecords
      .filter(m => new Date(m.scheduledDate).getMonth() === new Date().getMonth())
      .reduce((sum, m) => sum + (m.cost || m.estimatedCost || 0), 0),
    averageScore: Math.round(vehicles.reduce((sum, v) => sum + v.maintenanceScore, 0) / vehicles.length)
  };

  // Filtrage
  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.mechanicName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesType = typeFilter === "all" || record.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || record.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planifiée';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'overdue': return 'En retard';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'in-progress': return <Settings className="h-4 w-4 text-yellow-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyenne';
      case 'high': return 'Élevée';
      case 'critical': return 'Critique';
      default: return priority;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preventive': return 'bg-green-100 text-green-800';
      case 'corrective': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'preventive': return 'Préventive';
      case 'corrective': return 'Corrective';
      case 'emergency': return 'Urgence';
      default: return type;
    }
  };

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'out-of-service': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Opérationnel';
      case 'maintenance': return 'Maintenance';
      case 'repair': return 'Réparation';
      case 'out-of-service': return 'Hors service';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isServiceDue = (nextServiceDate: string) => {
    const nextService = new Date(nextServiceDate);
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    return nextService <= oneWeekFromNow;
  };

  const handleNewMaintenance = () => {
    setIsNewMaintenanceOpen(true);
  };

  const handleViewDetails = (recordId: string) => {
    alert(`Détails de la maintenance ${recordId}`);
  };

  const handleReschedule = (recordId: string) => {
    alert(`Reprogrammer la maintenance ${recordId}`);
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
                            {vehicle.plateNumber} - {vehicle.model}
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
                        <SelectItem value="preventive">Préventive</SelectItem>
                        <SelectItem value="corrective">Corrective</SelectItem>
                        <SelectItem value="emergency">Urgence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date prévue</Label>
                    <Input type="datetime-local" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea placeholder="Décrire les travaux à effectuer..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mechanic">Mécanicien</Label>
                    <Input placeholder="Nom du mécanicien" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workshop">Atelier</Label>
                    <Input placeholder="Nom de l'atelier" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Coût estimé (FCFA)</Label>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
          title="Maintenance en retard"
          value={stats.overdueMaintenance.toString()}
          description="À traiter"
          icon={AlertTriangle}
          className="border-red-200"
        />
        <StatsCard
          title="Budget mensuel"
          value={formatCurrency(stats.monthlyBudget)}
          description="Dépenses prévues"
          icon={DollarSign}
          className="border-purple-200"
        />
        <StatsCard
          title="Score moyen"
          value={`${stats.averageScore}%`}
          description="État de la flotte"
          icon={Settings}
          className="border-orange-200"
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
                  placeholder="Rechercher par véhicule, description ou mécanicien..."
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
                <SelectItem value="scheduled">Planifiées</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="preventive">Préventive</SelectItem>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="emergency">Urgence</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
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
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="costs">Coûts</TabsTrigger>
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
                      <TableHead>Priorité</TableHead>
                      <TableHead>Date prévue</TableHead>
                      <TableHead>Mécanicien</TableHead>
                      <TableHead>Coût estimé</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.plateNumber}</div>
                            <div className="text-sm text-gray-600">{record.mileage.toLocaleString()} km</div>
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
                            {record.driverReported && (
                              <div className="text-sm text-blue-600">Signalé par le chauffeur</div>
                            )}
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
                          <Badge variant="outline" className={getPriorityColor(record.priority)}>
                            {getPriorityText(record.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(record.scheduledDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(record.scheduledDate).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.mechanicName}</div>
                            <div className="text-sm text-gray-600">{record.workshopName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(record.estimatedCost || record.cost)}
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
                            {record.status === 'scheduled' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReschedule(record.id)}
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
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

        <TabsContent value="fleet" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{vehicle.plateNumber}</span>
                    <Badge variant="outline" className={getVehicleStatusColor(vehicle.status)}>
                      {getVehicleStatusText(vehicle.status)}
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
                        {vehicle.mileage.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Kilomètres</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {vehicle.maintenanceScore}%
                      </div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>État de maintenance</span>
                      <span>{vehicle.maintenanceScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          vehicle.maintenanceScore >= 80 ? 'bg-green-500' :
                          vehicle.maintenanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${vehicle.maintenanceScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dernière révision:</span>
                      <span>{new Date(vehicle.lastService).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prochaine révision:</span>
                      <span className={isServiceDue(vehicle.nextService) ? 'text-red-600 font-medium' : ''}>
                        {new Date(vehicle.nextService).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  
                  {isServiceDue(vehicle.nextService) && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">Révision due</span>
                    </div>
                  )}
                  
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

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des maintenances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Pièces utilisées</TableHead>
                      <TableHead>Coût</TableHead>
                      <TableHead>Durée</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRecords
                      .filter(r => r.status === 'completed')
                      .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
                      .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(record.completedDate!).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.plateNumber}</div>
                            <div className="text-sm text-gray-600">{record.mileage.toLocaleString()} km</div>
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
                            <div className="text-sm text-gray-600">{record.mechanicName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {record.partsUsed.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {record.partsUsed.slice(0, 2).map((part, index) => (
                                  <li key={index} className="truncate">{part}</li>
                                ))}
                                {record.partsUsed.length > 2 && (
                                  <li>+{record.partsUsed.length - 2} autres</li>
                                )}
                              </ul>
                            ) : (
                              <span className="text-gray-500">Aucune pièce</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(record.cost)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {Math.round(
                              (new Date(record.completedDate!).getTime() - 
                               new Date(record.scheduledDate).getTime()) / (1000 * 60 * 60)
                            )}h
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

        <TabsContent value="costs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Coûts par véhicule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.map((vehicle) => {
                    const vehicleCosts = maintenanceRecords
                      .filter(r => r.vehicleId === vehicle.id && r.status === 'completed')
                      .reduce((sum, r) => sum + r.cost, 0);
                    
                    return (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{vehicle.plateNumber}</div>
                          <div className="text-sm text-gray-600">{vehicle.model}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(vehicleCosts)}</div>
                          <div className="text-sm text-gray-600">Total dépensé</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coûts par type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['preventive', 'corrective', 'emergency'].map((type) => {
                    const typeCosts = maintenanceRecords
                      .filter(r => r.type === type && r.status === 'completed')
                      .reduce((sum, r) => sum + r.cost, 0);
                    const typeCount = maintenanceRecords
                      .filter(r => r.type === type && r.status === 'completed').length;
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{getTypeText(type)}</div>
                          <div className="text-sm text-gray-600">{typeCount} interventions</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(typeCosts)}</div>
                          <div className="text-sm text-gray-600">
                            Moy. {typeCount > 0 ? formatCurrency(typeCosts / typeCount) : formatCurrency(0)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin,
  Navigation,
  Search,
  Filter,
  Download,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Fuel,
  Route
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

interface Vehicle {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  route: string;
  currentLocation: string;
  status: 'active' | 'stopped' | 'maintenance' | 'emergency';
  studentCount: number;
  maxCapacity: number;
  fuelLevel: number;
  speed: number;
  lastUpdate: string;
  estimatedArrival: string;
  nextStop: string;
  totalDistance: number;
  distanceToday: number;
}

export default function TransportTrackingPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [routeFilter, setRouteFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("realtime");

  // Données simulées des véhicules
  const vehicles: Vehicle[] = [
    {
      id: "VEH-001",
      plateNumber: "DK-2024-AA",
      driverName: "Mamadou Diouf",
      driverPhone: "+221 77 123 4567",
      route: "Route A - Centre-ville",
      currentLocation: "Avenue Bourguiba",
      status: "active",
      studentCount: 28,
      maxCapacity: 35,
      fuelLevel: 75,
      speed: 45,
      lastUpdate: "2024-03-31T08:15:00",
      estimatedArrival: "2024-03-31T08:25:00",
      nextStop: "Arrêt Liberté",
      totalDistance: 142.5,
      distanceToday: 18.3
    },
    {
      id: "VEH-002",
      plateNumber: "DK-2024-BB",
      driverName: "Fatou Kane",
      driverPhone: "+221 76 987 6543",
      route: "Route B - Banlieue Nord",
      currentLocation: "Rond-point Colobane",
      status: "active",
      studentCount: 32,
      maxCapacity: 40,
      fuelLevel: 60,
      speed: 35,
      lastUpdate: "2024-03-31T08:12:00",
      estimatedArrival: "2024-03-31T08:30:00",
      nextStop: "Arrêt HLM",
      totalDistance: 167.2,
      distanceToday: 22.1
    },
    {
      id: "VEH-003",
      plateNumber: "DK-2024-CC",
      driverName: "Ousmane Sow",
      driverPhone: "+221 78 456 7890",
      route: "Route C - Banlieue Sud",
      currentLocation: "École Primaire Sud",
      status: "stopped",
      studentCount: 25,
      maxCapacity: 30,
      fuelLevel: 45,
      speed: 0,
      lastUpdate: "2024-03-31T08:10:00",
      estimatedArrival: "2024-03-31T08:35:00",
      nextStop: "Arrêt Pikine",
      totalDistance: 134.8,
      distanceToday: 15.7
    },
    {
      id: "VEH-004",
      plateNumber: "DK-2024-DD",
      driverName: "Alpha Ba",
      driverPhone: "+221 77 234 5678",
      route: "Route D - Corniche",
      currentLocation: "Garage Central",
      status: "maintenance",
      studentCount: 0,
      maxCapacity: 25,
      fuelLevel: 30,
      speed: 0,
      lastUpdate: "2024-03-31T07:45:00",
      estimatedArrival: "-",
      nextStop: "En maintenance",
      totalDistance: 98.4,
      distanceToday: 0
    }
  ];

  // Statistiques
  const stats = {
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    totalStudents: vehicles.reduce((sum, v) => sum + v.studentCount, 0),
    averageFuel: Math.round(vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length),
    maintenanceCount: vehicles.filter(v => v.status === 'maintenance').length,
    totalDistance: vehicles.reduce((sum, v) => sum + v.distanceToday, 0)
  };

  // Filtrage
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesRoute = routeFilter === "all" || vehicle.route.includes(routeFilter);
    
    return matchesSearch && matchesStatus && matchesRoute;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'stopped': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'En route';
      case 'stopped': return 'Arrêté';
      case 'maintenance': return 'Maintenance';
      case 'emergency': return 'Urgence';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'stopped': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getFuelColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCallDriver = (phone: string) => {
    alert(`Appel vers ${phone}`);
  };

  const handleViewOnMap = (vehicleId: string) => {
    alert(`Ouverture de la carte pour le véhicule ${vehicleId}`);
  };

  const handleEmergencyAlert = (vehicleId: string) => {
    alert(`Alerte d'urgence envoyée pour le véhicule ${vehicleId}`);
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suivi Transport</h1>
          <p className="text-gray-600 mt-1">Surveillance en temps réel des véhicules scolaires</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <MapPin className="h-4 w-4 mr-2" />
            Vue Carte
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Véhicules actifs"
          value={stats.activeVehicles.toString()}
          description={`sur ${vehicles.length} véhicules`}
          icon={Navigation}
          className="border-green-200"
        />
        <StatsCard
          title="Élèves transportés"
          value={stats.totalStudents.toString()}
          description="Actuellement à bord"
          icon={Users}
          className="border-blue-200"
        />
        <StatsCard
          title="Niveau carburant"
          value={`${stats.averageFuel}%`}
          description="Moyenne de la flotte"
          icon={Fuel}
          className="border-orange-200"
        />
        <StatsCard
          title="En maintenance"
          value={stats.maintenanceCount.toString()}
          description="Véhicules hors service"
          icon={AlertTriangle}
          className="border-red-200"
        />
        <StatsCard
          title="Distance parcourue"
          value={`${stats.totalDistance.toFixed(1)} km`}
          description="Aujourd'hui"
          icon={Route}
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
                  placeholder="Rechercher par plaque, chauffeur ou route..."
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
                <SelectItem value="active">En route</SelectItem>
                <SelectItem value="stopped">Arrêtés</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="emergency">Urgence</SelectItem>
              </SelectContent>
            </Select>
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                <SelectItem value="Centre-ville">Centre-ville</SelectItem>
                <SelectItem value="Nord">Banlieue Nord</SelectItem>
                <SelectItem value="Sud">Banlieue Sud</SelectItem>
                <SelectItem value="Corniche">Corniche</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Temps réel</TabsTrigger>
          <TabsTrigger value="routes">Itinéraires</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>État des véhicules en temps réel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Chauffeur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Élèves</TableHead>
                      <TableHead>Carburant</TableHead>
                      <TableHead>Prochaine arrivée</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vehicle.plateNumber}</div>
                            <div className="text-sm text-gray-600">{vehicle.route}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vehicle.driverName}</div>
                            <div className="text-sm text-gray-600">{vehicle.driverPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(vehicle.status)}
                            <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                              {getStatusText(vehicle.status)}
                            </Badge>
                          </div>
                          {vehicle.speed > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {vehicle.speed} km/h
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vehicle.currentLocation}</div>
                            <div className="text-sm text-gray-600">
                              Prochain: {vehicle.nextStop}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{vehicle.studentCount}/{vehicle.maxCapacity}</span>
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full" 
                              style={{ width: `${(vehicle.studentCount / vehicle.maxCapacity) * 100}%` }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Fuel className="h-4 w-4 text-gray-500" />
                            <span className={getFuelColor(vehicle.fuelLevel)}>
                              {vehicle.fuelLevel}%
                            </span>
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className={`h-1 rounded-full ${
                                vehicle.fuelLevel > 50 ? 'bg-green-500' :
                                vehicle.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${vehicle.fuelLevel}%` }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {vehicle.estimatedArrival !== '-' ? (
                            <div className="text-sm">
                              {new Date(vehicle.estimatedArrival).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewOnMap(vehicle.id)}
                            >
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCallDriver(vehicle.driverPhone)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEmergencyAlert(vehicle.id)}
                            >
                              <AlertTriangle className="h-4 w-4" />
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

        <TabsContent value="routes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {['Route A - Centre-ville', 'Route B - Banlieue Nord', 'Route C - Banlieue Sud', 'Route D - Corniche'].map((route) => {
              const routeVehicles = vehicles.filter(v => v.route.includes(route.split(' - ')[1]));
              const totalStudents = routeVehicles.reduce((sum, v) => sum + v.studentCount, 0);
              const avgFuel = Math.round(routeVehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / routeVehicles.length);
              
              return (
                <Card key={route}>
                  <CardHeader>
                    <CardTitle className="text-lg">{route}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{routeVehicles.length}</div>
                        <div className="text-sm text-gray-600">Véhicules</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
                        <div className="text-sm text-gray-600">Élèves</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{avgFuel}%</div>
                        <div className="text-sm text-gray-600">Carburant</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {routeVehicles.map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(vehicle.status)}
                            <span className="font-medium">{vehicle.plateNumber}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {vehicle.currentLocation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Alertes critiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vehicles.filter(v => v.fuelLevel < 30 || v.status === 'maintenance').map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <div className="font-medium">{vehicle.plateNumber}</div>
                        <div className="text-sm text-gray-600">
                          {vehicle.fuelLevel < 30 ? `Carburant faible: ${vehicle.fuelLevel}%` : 'En maintenance'}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">Alertes mineures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vehicles.filter(v => v.status === 'stopped').map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div className="flex-1">
                        <div className="font-medium">{vehicle.plateNumber}</div>
                        <div className="text-sm text-gray-600">
                          Arrêté depuis {Math.floor((Date.now() - new Date(vehicle.lastUpdate).getTime()) / 60000)} min
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

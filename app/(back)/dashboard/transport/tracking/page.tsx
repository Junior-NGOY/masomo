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
import { useVehicles } from "@/hooks/useTransport";

export default function TransportTrackingPage() {
  const { vehicles, loading } = useVehicles();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("realtime");

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Statistiques calculées à partir des données réelles
  const stats = {
    activeVehicles: vehicles.filter(v => v.status === 'ACTIVE').length,
    totalCapacity: vehicles.reduce((sum, v) => sum + v.capacity, 0),
    maintenanceCount: vehicles.filter(v => v.status === 'MAINTENANCE').length,
    totalVehicles: vehicles.length
  };

  // Filtrage
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'STOPPED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MAINTENANCE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'En route';
      case 'STOPPED': return 'Arrêté';
      case 'MAINTENANCE': return 'Maintenance';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'STOPPED': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'MAINTENANCE': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleViewOnMap = (vehicleId: string) => {
    alert(`Ouverture de la carte pour le véhicule ${vehicleId} (Simulation)`);
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Véhicules actifs"
          value={stats.activeVehicles.toString()}
          description={`sur ${stats.totalVehicles} véhicules`}
          icon={Navigation}
          className="border-green-200"
        />
        <StatsCard
          title="Capacité Totale"
          value={stats.totalCapacity.toString()}
          description="Places disponibles"
          icon={Users}
          className="border-blue-200"
        />
        <StatsCard
          title="En maintenance"
          value={stats.maintenanceCount.toString()}
          description="Véhicules hors service"
          icon={AlertTriangle}
          className="border-red-200"
        />
        <StatsCard
          title="Taux de Service"
          value={`${Math.round((stats.activeVehicles / (stats.totalVehicles || 1)) * 100)}%`}
          description="Disponibilité flotte"
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
                  placeholder="Rechercher par plaque ou modèle..."
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
                <SelectItem value="ACTIVE">En route</SelectItem>
                <SelectItem value="STOPPED">Arrêtés</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Temps réel</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>État des véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Modèle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Dernière Maintenance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div className="font-medium">{vehicle.registrationNo}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vehicle.model}</div>
                            <div className="text-sm text-gray-600">{vehicle.manufacturer}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(vehicle.status)}
                            <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                              {getStatusText(vehicle.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{vehicle.capacity} places</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {vehicle.lastMaintenance ? (
                            <div className="text-sm">
                              {new Date(vehicle.lastMaintenance).toLocaleDateString('fr-FR')}
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

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Alertes Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vehicles.filter(v => v.status === 'MAINTENANCE').map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <div className="font-medium">{vehicle.registrationNo}</div>
                      <div className="text-sm text-gray-600">
                        Véhicule en maintenance
                      </div>
                    </div>
                  </div>
                ))}
                {vehicles.filter(v => v.status === 'MAINTENANCE').length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Aucune alerte de maintenance.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

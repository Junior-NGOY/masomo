"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bus,
  MapPin,
  Users,
  Clock,
  Route,
  AlertTriangle,
  Search,
  Plus,
  Settings,
  Navigation
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
import { useTransportRoutes, useTransportStats } from "@/hooks/useTransport";

export default function TransportPage() {
  const { routes, loading: routesLoading } = useTransportRoutes();
  const { stats, loading: statsLoading } = useTransportStats();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  if (routesLoading || statsLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Filtrer les routes
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (route.driver?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (route.vehicle?.registrationNo || '').toLowerCase().includes(searchQuery.toLowerCase());
    // Note: The API route object might not have a status field directly, assuming active for now or checking vehicle status
    const status = route.vehicle?.status || 'ACTIVE';
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "border-green-200 text-green-700";
      case "INACTIVE":
        return "border-gray-200 text-gray-700";
      case "MAINTENANCE":
        return "border-orange-200 text-orange-700";
      default:
        return "border-gray-200 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Actif";
      case "INACTIVE":
        return "Inactif";
      case "MAINTENANCE":
        return "Maintenance";
      default:
        return status;
    }
  };

  // Helper to parse stops if they are JSON string
  const getStops = (stops: string | any[]): string[] => {
    if (Array.isArray(stops)) return stops;
    try {
      return JSON.parse(stops);
    } catch {
      return [stops];
    }
  };

  // Helper to parse schedule
  const getSchedule = (schedule: string | any): any => {
    if (typeof schedule === 'object') return schedule;
    try {
      return JSON.parse(schedule);
    } catch {
      return { morning: '07:00', evening: '15:00' };
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Transport</h1>
          <p className="text-gray-600 mt-1">Suivi en temps réel et gestion des routes scolaires</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Navigation className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Route
          </Button>
        </div>
      </div>

      {/* Statistiques du transport */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Véhicules Total"
          value={stats?.totalVehicles.toString() || "0"}
          description="Flotte disponible"
          icon={Bus}
        />
        <StatsCard
          title="Routes Actives"
          value={stats?.totalRoutes.toString() || "0"}
          description="En service"
          icon={Route}
          className="border-green-200"
        />
        <StatsCard
          title="Chauffeurs"
          value={stats?.totalDrivers.toString() || "0"}
          description="Total chauffeurs"
          icon={Users}
          className="border-blue-200"
        />
        <StatsCard
          title="Véhicules Actifs"
          value={stats?.activeVehicles.toString() || "0"}
          description="Sur la route"
          icon={AlertTriangle}
          className="border-purple-200"
        />
      </div>

      {/* Carte en temps réel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Suivi en Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Carte interactive du suivi des véhicules</p>
              <p className="text-xs text-gray-400">
                Integration Google Maps / OpenStreetMap à prévoir
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes actives avec état en temps réel */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routes
          .slice(0, 3) // Show only first 3 as "Active Routes" for now
          .map((route) => {
            const stops = getStops(route.stops);
            const schedule = getSchedule(route.schedule);
            const status = route.vehicle?.status || 'ACTIVE';
            
            return (
              <Card key={route.id} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{route.name}</CardTitle>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      {getStatusText(status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Bus className="h-4 w-4 text-gray-500" />
                    <span>{route.vehicle?.registrationNo || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      Capacité: {route.vehicle?.capacity || 0} places
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Départ: {schedule.morning || '07:00'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Chauffeur: {route.driver?.name || 'N/A'}</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-xs text-gray-600 mb-1">Arrêts principaux:</div>
                    <div className="flex flex-wrap gap-1">
                      {stops.slice(0, 3).map((stop, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {stop}
                        </Badge>
                      ))}
                      {stops.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{stops.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Liste complète des routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Toutes les Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par route, chauffeur ou véhicule..."
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
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="INACTIVE">Inactif</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des routes */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Horaire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.map((route) => {
                  const stops = getStops(route.stops);
                  const schedule = getSchedule(route.schedule);
                  const status = route.vehicle?.status || 'ACTIVE';

                  return (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{route.name}</div>
                          <div className="text-xs text-gray-500">
                            {stops.length} arrêts
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{route.vehicle?.registrationNo || 'N/A'}</TableCell>
                      <TableCell>{route.driver?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {route.vehicle?.capacity || 0} places
                      </TableCell>
                      <TableCell>{schedule.morning || '07:00'} - {schedule.evening || '15:00'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(status)}>
                          {getStatusText(status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Gérer
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredRoutes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune route trouvée pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

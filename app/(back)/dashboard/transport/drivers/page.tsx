"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User,
  Phone,
  Search,
  Filter,
  Download,
  Edit,
  MoreHorizontal,
  Star,
  Award,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDrivers } from "@/hooks/useTransport";

export default function TransportDriversPage() {
  const { drivers, loading } = useDrivers();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("overview");

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Statistiques
  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'ACTIVE').length,
    averageExperience: Math.round(drivers.reduce((sum, d) => sum + d.experience, 0) / (drivers.length || 1)),
    onLeave: drivers.filter(d => d.status === 'ON_LEAVE').length,
  };

  // Filtrage
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         driver.phone.includes(searchQuery) ||
                         (driver.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SUSPENDED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'INACTIVE': return 'Inactif';
      case 'ON_LEAVE': return 'En congé';
      case 'SUSPENDED': return 'Suspendu';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'INACTIVE': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'ON_LEAVE': return <Calendar className="h-4 w-4 text-yellow-600" />;
      case 'SUSPENDED': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleEditDriver = (driverId: string) => {
    alert(`Édition du chauffeur ${driverId}`);
  };

  const handleViewProfile = (driverId: string) => {
    alert(`Profil détaillé du chauffeur ${driverId}`);
  };

  const handleCallDriver = (phone: string) => {
    alert(`Appel vers ${phone}`);
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Chauffeurs</h1>
          <p className="text-gray-600 mt-1">Supervision et performance des chauffeurs scolaires</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <User className="h-4 w-4 mr-2" />
            Nouveau chauffeur
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total chauffeurs"
          value={stats.totalDrivers.toString()}
          description="Dans la flotte"
          icon={User}
          className="border-blue-200"
        />
        <StatsCard
          title="Actifs"
          value={stats.activeDrivers.toString()}
          description="En service"
          icon={CheckCircle}
          className="border-green-200"
        />
        <StatsCard
          title="En congé"
          value={stats.onLeave.toString()}
          description="Temporairement"
          icon={Calendar}
          className="border-orange-200"
        />
        <StatsCard
          title="Expérience moyenne"
          value={`${stats.averageExperience} ans`}
          description="De conduite"
          icon={Award}
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
                  placeholder="Rechercher par nom, téléphone..."
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
                <SelectItem value="ACTIVE">Actifs</SelectItem>
                <SelectItem value="INACTIVE">Inactifs</SelectItem>
                <SelectItem value="ON_LEAVE">En congé</SelectItem>
                <SelectItem value="SUSPENDED">Suspendus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des chauffeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chauffeur</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Permis</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Expérience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{driver.name}</div>
                              <div className="text-sm text-gray-600">{driver.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{driver.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">{driver.licenseNo}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(driver.status)}
                            <Badge variant="outline" className={getStatusColor(driver.status)}>
                              {getStatusText(driver.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{driver.experience} ans</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProfile(driver.id)}>
                                <User className="h-4 w-4 mr-2" />
                                Voir profil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditDriver(driver.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCallDriver(driver.phone)}>
                                <Phone className="h-4 w-4 mr-2" />
                                Appeler
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Données de performance non disponibles pour le moment.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

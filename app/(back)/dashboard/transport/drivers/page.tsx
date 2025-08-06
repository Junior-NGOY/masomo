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

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  vehicleAssigned: string;
  route: string;
  status: 'active' | 'inactive' | 'on-leave' | 'suspended';
  rating: number;
  totalTrips: number;
  experienceYears: number;
  joinDate: string;
  lastTrip: string;
  safetyScore: number;
  fuelEfficiency: number;
  punctualityScore: number;
  studentRating: number;
  emergencyContact: string;
  address: string;
  birthDate: string;
  medicalCertificate: string;
  trainingStatus: 'completed' | 'pending' | 'expired';
}

export default function TransportDriversPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [routeFilter, setRouteFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("overview");

  // Données simulées des chauffeurs
  const drivers: Driver[] = [
    {
      id: "DRV-001",
      name: "Mamadou Diouf",
      phone: "+221 77 123 4567",
      email: "mamadou.diouf@school.sn",
      licenseNumber: "SN123456789",
      licenseExpiryDate: "2025-06-15",
      vehicleAssigned: "DK-2024-AA",
      route: "Route A - Centre-ville",
      status: "active",
      rating: 4.8,
      totalTrips: 1247,
      experienceYears: 8,
      joinDate: "2020-03-15",
      lastTrip: "2024-03-31T08:15:00",
      safetyScore: 95,
      fuelEfficiency: 87,
      punctualityScore: 92,
      studentRating: 4.7,
      emergencyContact: "+221 77 987 6543",
      address: "Dakar, Plateau",
      birthDate: "1985-05-20",
      medicalCertificate: "2024-12-31",
      trainingStatus: "completed"
    },
    {
      id: "DRV-002",
      name: "Fatou Kane",
      phone: "+221 76 987 6543",
      email: "fatou.kane@school.sn",
      licenseNumber: "SN987654321",
      licenseExpiryDate: "2024-12-10",
      vehicleAssigned: "DK-2024-BB",
      route: "Route B - Banlieue Nord",
      status: "active",
      rating: 4.6,
      totalTrips: 892,
      experienceYears: 5,
      joinDate: "2021-09-01",
      lastTrip: "2024-03-31T08:12:00",
      safetyScore: 91,
      fuelEfficiency: 82,
      punctualityScore: 88,
      studentRating: 4.5,
      emergencyContact: "+221 78 456 7890",
      address: "Pikine, Zone A",
      birthDate: "1990-08-12",
      medicalCertificate: "2024-10-15",
      trainingStatus: "completed"
    },
    {
      id: "DRV-003",
      name: "Ousmane Sow",
      phone: "+221 78 456 7890",
      email: "ousmane.sow@school.sn",
      licenseNumber: "SN456789123",
      licenseExpiryDate: "2025-03-22",
      vehicleAssigned: "DK-2024-CC",
      route: "Route C - Banlieue Sud",
      status: "on-leave",
      rating: 4.4,
      totalTrips: 634,
      experienceYears: 4,
      joinDate: "2022-01-15",
      lastTrip: "2024-03-25T07:45:00",
      safetyScore: 89,
      fuelEfficiency: 85,
      punctualityScore: 86,
      studentRating: 4.3,
      emergencyContact: "+221 77 234 5678",
      address: "Guédiawaye, Nord",
      birthDate: "1988-12-03",
      medicalCertificate: "2024-08-20",
      trainingStatus: "completed"
    },
    {
      id: "DRV-004",
      name: "Alpha Ba",
      phone: "+221 77 234 5678",
      email: "alpha.ba@school.sn",
      licenseNumber: "SN789123456",
      licenseExpiryDate: "2024-08-05",
      vehicleAssigned: "DK-2024-DD",
      route: "Route D - Corniche",
      status: "inactive",
      rating: 4.2,
      totalTrips: 445,
      experienceYears: 3,
      joinDate: "2022-08-01",
      lastTrip: "2024-03-20T16:30:00",
      safetyScore: 84,
      fuelEfficiency: 79,
      punctualityScore: 81,
      studentRating: 4.1,
      emergencyContact: "+221 76 345 6789",
      address: "Dakar, Médina",
      birthDate: "1992-04-18",
      medicalCertificate: "2024-06-30",
      trainingStatus: "pending"
    },
    {
      id: "DRV-005",
      name: "Aminata Diallo",
      phone: "+221 78 567 8901",
      email: "aminata.diallo@school.sn",
      licenseNumber: "SN234567890",
      licenseExpiryDate: "2025-11-30",
      vehicleAssigned: "DK-2024-EE",
      route: "Route E - Périphérie",
      status: "active",
      rating: 4.9,
      totalTrips: 723,
      experienceYears: 6,
      joinDate: "2021-02-10",
      lastTrip: "2024-03-31T07:30:00",
      safetyScore: 97,
      fuelEfficiency: 91,
      punctualityScore: 95,
      studentRating: 4.8,
      emergencyContact: "+221 77 890 1234",
      address: "Rufisque, Centre",
      birthDate: "1987-09-25",
      medicalCertificate: "2025-01-15",
      trainingStatus: "completed"
    }
  ];

  // Statistiques
  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'active').length,
    averageRating: (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1),
    onLeave: drivers.filter(d => d.status === 'on-leave').length,
    averageExperience: Math.round(drivers.reduce((sum, d) => sum + d.experienceYears, 0) / drivers.length),
    pendingTraining: drivers.filter(d => d.trainingStatus === 'pending').length
  };

  // Filtrage
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         driver.phone.includes(searchQuery) ||
                         driver.vehicleAssigned.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    const matchesRoute = routeFilter === "all" || driver.route.includes(routeFilter);
    
    return matchesSearch && matchesStatus && matchesRoute;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'on-leave': return 'En congé';
      case 'suspended': return 'Suspendu';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'on-leave': return <Calendar className="h-4 w-4 text-yellow-600" />;
      case 'suspended': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrainingStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
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

  const handleTraining = (driverId: string) => {
    alert(`Planification de formation pour ${driverId}`);
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow;
  };

  const isMedicalExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return expiry <= oneMonthFromNow;
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
          title="Note moyenne"
          value={stats.averageRating}
          description="Sur 5 étoiles"
          icon={Star}
          className="border-yellow-200"
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
        <StatsCard
          title="Formation en attente"
          value={stats.pendingTraining.toString()}
          description="À planifier"
          icon={AlertTriangle}
          className="border-red-200"
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
                  placeholder="Rechercher par nom, téléphone ou véhicule..."
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
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
                <SelectItem value="on-leave">En congé</SelectItem>
                <SelectItem value="suspended">Suspendus</SelectItem>
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
                <SelectItem value="Périphérie">Périphérie</SelectItem>
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
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
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
                      <TableHead>Véhicule/Route</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Évaluation</TableHead>
                      <TableHead>Expérience</TableHead>
                      <TableHead>Dernière course</TableHead>
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
                              <div className="text-sm text-gray-600">{driver.licenseNumber}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{driver.phone}</div>
                            <div className="text-sm text-gray-600">{driver.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{driver.vehicleAssigned}</div>
                            <div className="text-sm text-gray-600">{driver.route}</div>
                          </div>
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
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(driver.rating)}</div>
                            <span className="text-sm font-medium">{driver.rating}</span>
                          </div>
                          <div className="text-sm text-gray-600">{driver.totalTrips} courses</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{driver.experienceYears} ans</div>
                            <div className="text-sm text-gray-600">
                              Depuis {new Date(driver.joinDate).getFullYear()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(driver.lastTrip).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(driver.lastTrip).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
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
                              <DropdownMenuItem onClick={() => handleTraining(driver.id)}>
                                <Award className="h-4 w-4 mr-2" />
                                Formation
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {driver.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {renderStars(driver.rating)}
                    <span className="text-sm">{driver.rating}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{driver.safetyScore}</div>
                      <div className="text-sm text-gray-600">Sécurité</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{driver.punctualityScore}</div>
                      <div className="text-sm text-gray-600">Ponctualité</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Efficacité carburant</span>
                      <span>{driver.fuelEfficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${driver.fuelEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Note élèves</span>
                      <span>{driver.studentRating}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(driver.studentRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    {driver.totalTrips} courses totales
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>État des documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chauffeur</TableHead>
                      <TableHead>Permis de conduire</TableHead>
                      <TableHead>Certificat médical</TableHead>
                      <TableHead>Formation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm text-gray-600">{driver.licenseNumber}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              Expire le {new Date(driver.licenseExpiryDate).toLocaleDateString('fr-FR')}
                            </div>
                            {isLicenseExpiringSoon(driver.licenseExpiryDate) && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                Expire bientôt
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              Expire le {new Date(driver.medicalCertificate).toLocaleDateString('fr-FR')}
                            </div>
                            {isMedicalExpiringSoon(driver.medicalCertificate) && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                À renouveler
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTrainingStatusColor(driver.trainingStatus)}>
                            {driver.trainingStatus === 'completed' && 'Complétée'}
                            {driver.trainingStatus === 'pending' && 'En attente'}
                            {driver.trainingStatus === 'expired' && 'Expirée'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Mettre à jour
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

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Alertes critiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drivers.filter(d => 
                    isLicenseExpiringSoon(d.licenseExpiryDate) || 
                    d.trainingStatus === 'pending' ||
                    d.status === 'suspended'
                  ).map((driver) => (
                    <div key={driver.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-gray-600">
                          {isLicenseExpiringSoon(driver.licenseExpiryDate) && 'Permis expire bientôt'}
                          {driver.trainingStatus === 'pending' && 'Formation en attente'}
                          {driver.status === 'suspended' && 'Chauffeur suspendu'}
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
                  {drivers.filter(d => 
                    isMedicalExpiringSoon(d.medicalCertificate) ||
                    d.status === 'on-leave' ||
                    d.rating < 4.5
                  ).map((driver) => (
                    <div key={driver.id} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <div className="flex-1">
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-gray-600">
                          {isMedicalExpiringSoon(driver.medicalCertificate) && 'Certificat médical à renouveler'}
                          {driver.status === 'on-leave' && 'En congé'}
                          {driver.rating < 4.5 && `Note faible: ${driver.rating}/5`}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4" />
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

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserCog,
  Users,
  GraduationCap,
  Building,
  Mail,
  Phone,
  Calendar,
  Search,
  Plus,
  Filter,
  Download
} from "lucide-react";
import { MockDataService } from "@/services/mockServices";
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

export default function StaffPage() {
  // TODO: Remplacer par les vrais appels API une fois le backend terminé
  const staffRecords = MockDataService.staff.getStaffRecords();
  const staffStats = MockDataService.staff.getStaffStats();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Filtrer les enregistrements du personnel
  const filteredStaff = staffRecords.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesDepartment = departmentFilter === "all" || staff.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  // Obtenir les rôles et départements uniques pour les filtres
  const uniqueRoles = Array.from(new Set(staffRecords.map(staff => staff.role)));
  const uniqueDepartments = Array.from(new Set(staffRecords.map(staff => staff.department)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "border-green-200 text-green-700";
      case "INACTIVE":
        return "border-gray-200 text-gray-700";
      case "ON_LEAVE":
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
      case "ON_LEAVE":
        return "En congé";
      default:
        return status;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "enseignant":
        return <GraduationCap className="h-4 w-4" />;
      case "directeur adjoint":
      case "surveillant général":
        return <Building className="h-4 w-4" />;
      default:
        return <UserCog className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Personnel</h1>
          <p className="text-gray-600 mt-1">Annuaire et gestion des ressources humaines</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Personnel
          </Button>
        </div>
      </div>

      {/* Statistiques du personnel */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Personnel Total"
          value={staffStats.totalStaff}
          description="Tous départements"
          icon={Users}
        />
        <StatsCard
          title="Personnel Actif"
          value={staffStats.activeStaff}
          description="En service"
          icon={UserCog}
          className="border-green-200"
        />
        <StatsCard
          title="En Congé"
          value={staffStats.onLeave}
          description="Temporairement absent"
          icon={Calendar}
          className="border-orange-200"
        />
        <StatsCard
          title="Personnel Enseignant"
          value={staffStats.teachingStaff}
          description="Corps professoral"
          icon={GraduationCap}
          className="border-blue-200"
        />
        <StatsCard
          title="Personnel Administratif"
          value={staffStats.administrativeStaff}
          description="Administration"
          icon={Building}
          className="border-purple-200"
        />
      </div>

      {/* Cartes du personnel par département */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {uniqueDepartments.map((department) => {
          const departmentStaff = staffRecords.filter(staff => staff.department === department);
          const activeCount = departmentStaff.filter(staff => staff.status === "ACTIVE").length;
          
          return (
            <Card key={department} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {department}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Personnel total</span>
                  <span className="font-semibold">{departmentStaff.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Personnel actif</span>
                  <span className="font-semibold text-green-600">{activeCount}</span>
                </div>
                <div className="space-y-2">
                  {departmentStaff.slice(0, 3).map((staff) => (
                    <div key={staff.id} className="flex items-center gap-2 text-sm">
                      {getRoleIcon(staff.role)}
                      <span className="truncate">{staff.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(staff.status)}`}
                      >
                        {getStatusText(staff.status)}
                      </Badge>
                    </div>
                  ))}
                  {departmentStaff.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{departmentStaff.length - 3} autres membres
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Liste complète du personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Annuaire du Personnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email ou département..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {uniqueDepartments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="INACTIVE">Inactif</SelectItem>
                <SelectItem value="ON_LEAVE">En congé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau du personnel */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date d'Embauche</TableHead>
                  <TableHead>Matières/Classes</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(staff.role)}
                        {staff.name}
                      </div>
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-[150px]" title={staff.email}>
                            {staff.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{staff.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {MockDataService.formatDate(staff.joiningDate)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {staff.subjects && (
                          <div className="flex flex-wrap gap-1">
                            {staff.subjects.slice(0, 2).map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {staff.subjects.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{staff.subjects.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        {staff.classes && (
                          <div className="flex flex-wrap gap-1">
                            {staff.classes.slice(0, 2).map((className, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {className}
                              </Badge>
                            ))}
                            {staff.classes.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{staff.classes.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(staff.status)}>
                        {getStatusText(staff.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun membre du personnel trouvé pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

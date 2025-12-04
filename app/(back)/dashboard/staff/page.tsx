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
import { useTeachers } from "@/hooks/useTeachers";

export default function StaffPage() {
  const { teachers, loading } = useTeachers();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Calculate stats
  const staffStats = {
    totalStaff: teachers.length,
    activeStaff: teachers.length, // All fetched teachers are active
    onLeave: 0, // Would need separate API
    teachingStaff: teachers.length,
    administrativeStaff: 0 // Would need separate API
  };

  // Filtrer les enregistrements du personnel
  const filteredStaff = teachers.filter(teacher => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (teacher.departmentName && teacher.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDepartment = departmentFilter === "all" || teacher.departmentId === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Obtenir les départements uniques pour les filtres
  const uniqueDepartments = Array.from(new Set(teachers.map(t => ({
    id: t.departmentId,
    name: t.departmentName
  })).filter(d => d.name)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
          value={staffStats.totalStaff.toString()}
          description="Tous départements"
          icon={Users}
        />
        <StatsCard
          title="Personnel Actif"
          value={staffStats.activeStaff.toString()}
          description="En service"
          icon={UserCog}
          className="border-green-200"
        />
        <StatsCard
          title="En Congé"
          value={staffStats.onLeave.toString()}
          description="Temporairement absent"
          icon={Calendar}
          className="border-orange-200"
        />
        <StatsCard
          title="Personnel Enseignant"
          value={staffStats.teachingStaff.toString()}
          description="Corps professoral"
          icon={GraduationCap}
          className="border-blue-200"
        />
        <StatsCard
          title="Personnel Administratif"
          value={staffStats.administrativeStaff.toString()}
          description="Administration"
          icon={Building}
          className="border-purple-200"
        />
      </div>

      {/* Cartes du personnel par département */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {uniqueDepartments.map((department) => {
          const departmentStaff = teachers.filter(t => t.departmentId === department.id);
          
          return (
            <Card key={department.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {department.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Personnel total</span>
                  <span className="font-semibold">{departmentStaff.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Personnel actif</span>
                  <span className="font-semibold text-green-600">{departmentStaff.length}</span>
                </div>
                <div className="space-y-2">
                  {departmentStaff.slice(0, 3).map((teacher) => (
                    <div key={teacher.id} className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4" />
                      <span className="truncate">{teacher.firstName} {teacher.lastName}</span>
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
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {uniqueDepartments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {teacher.firstName} {teacher.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.designation}</TableCell>
                    <TableCell>{teacher.departmentName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-[150px]" title={teacher.email}>
                            {teacher.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{teacher.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(teacher.dateOfJoining)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {teacher.subjects && teacher.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.slice(0, 2).map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {teacher.subjects.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{teacher.subjects.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        {teacher.classes && teacher.classes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {teacher.classes.slice(0, 2).map((className, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {className}
                              </Badge>
                            ))}
                            {teacher.classes.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{teacher.classes.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
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

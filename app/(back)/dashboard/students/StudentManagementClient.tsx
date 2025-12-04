"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { columns } from "./columns";
import { Student } from "@/types/types";
import { StudentMockDataService } from "@/services/studentMockDataService";
import { 
  Users, 
  DollarSign, 
  UserCheck, 
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Eye,
  BarChart3,
  Clock,
} from "lucide-react";

interface StudentManagementClientProps {
  students: Student[];
}

export default function StudentManagementClient({ students }: StudentManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("overview");

  // Données du service (Mock pour les stats pour l'instant)
  const stats = StudentMockDataService.getStudentStats();
  // Update total students count with real data
  stats.totalStudents = students.length;
  
  const profiles = StudentMockDataService.getStudentProfiles();

  // Filtrage des étudiants
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.classTitle && student.classTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const StatsCard = ({ title, value, description, icon: Icon, color = "blue", href }: any) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <Link href={href}>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg bg-${color}-100`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, href, color = "blue" }: any) => (
    <Card className="hover:shadow-md transition-shadow">
      <Link href={href}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-${color}-100`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
              <Button variant="outline" size="sm" className="mt-3">
                Accéder <Eye className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Élèves</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble et gestion complète des élèves</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Rapports
          </Button>
          <Link href="/dashboard/students/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel élève
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="directory">Annuaire</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Élèves"
              value={stats.totalStudents}
              description="Élèves actifs"
              icon={Users}
              color="blue"
              href="/dashboard/students"
            />
            <StatsCard
              title="Frais Collectés"
              value={StudentMockDataService.formatCurrency(stats.paidFees)}
              description={`${Math.round((stats.paidFees / stats.totalFees) * 100)}% du total`}
              icon={DollarSign}
              color="green"
              href="/dashboard/students/fees"
            />
            <StatsCard
              title="Taux de Présence"
              value={`${stats.attendanceRate}%`}
              description="Moyenne générale"
              icon={UserCheck}
              color="orange"
              href="/dashboard/students/attendance"
            />
            <StatsCard
              title="Cartes Actives"
              value={stats.activeIDs}
              description={`${stats.lostOrDamagedIDs} à remplacer`}
              icon={CreditCard}
              color="purple"
              href="/dashboard/students/ids"
            />
          </div>

          {/* Actions rapides */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <QuickActionCard
                title="Gestion des Frais"
                description="Suivi des paiements, historique et facturation"
                icon={DollarSign}
                href="/dashboard/students/fees"
                color="green"
              />
              <QuickActionCard
                title="Suivi des Présences"
                description="Marquer et consulter les présences quotidiennes"
                icon={UserCheck}
                href="/dashboard/students/attendance"
                color="blue"
              />
              <QuickActionCard
                title="Cartes d'Identité"
                description="Gestion et impression des cartes scolaires"
                icon={CreditCard}
                href="/dashboard/students/ids"
                color="purple"
              />
              <QuickActionCard
                title="Ajouter un Élève"
                description="Inscrire un nouvel élève dans l'établissement"
                icon={Plus}
                href="/dashboard/students/new"
                color="orange"
              />
            </div>
          </div>

          {/* Alertes et notifications */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Alertes Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Frais en retard
                    </p>
                    <p className="text-xs text-red-600">
                      {stats.overdueFees} élève(s) ont des frais en souffrance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <CreditCard className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Cartes à renouveler
                    </p>
                    <p className="text-xs text-orange-600">
                      {stats.lostOrDamagedIDs} carte(s) nécessitent un remplacement
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Présences à améliorer
                    </p>
                    <p className="text-xs text-yellow-600">
                      {profiles.filter(p => p.attendanceRate < 80).length} élève(s) avec faible assiduité
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Performances du Mois
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Collecte des frais</span>
                  <span className="font-medium text-green-600">
                    {Math.round((stats.paidFees / stats.totalFees) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.paidFees / stats.totalFees) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taux de présence</span>
                  <span className="font-medium text-blue-600">{stats.attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.attendanceRate}%` }}
                  />
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cartes actives:</span>
                    <span className="font-medium">{stats.activeIDs}/{stats.totalStudents}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Élèves les plus performants */}
          <Card>
            <CardHeader>
              <CardTitle>Élèves Exemplaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {profiles
                  .filter(student => student.attendanceRate >= 95 && student.pendingFees === 0)
                  .slice(0, 3)
                  .map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={student.imageUrl} alt={student.name} className="object-cover" />
                        <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-green-800">{student.name}</p>
                        <p className="text-sm text-green-600">{student.className}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {student.attendanceRate}% présence
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {student.averageGrade}% notes
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="directory" className="space-y-4">
          {/* Recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Rechercher un élève</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nom de l'élève ou classe..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Annuaire des élèves */}
          <div className="space-y-4">
            <TableHeader
              title="Annuaire des Élèves"
              linkTitle="Ajouter un élève"
              href="/dashboard/students/new"
              data={filteredStudents}
              model="student"
            />
            <Card>
              <CardContent className="p-0">
                <DataTable data={filteredStudents} columns={columns} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

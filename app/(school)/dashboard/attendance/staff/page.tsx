"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users,
  ArrowLeft,
  Search,
  UserCheck,
  UserX,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  UserCog
} from "lucide-react";

// Interface pour les données du personnel
interface StaffInfo {
  id: string;
  name: string;
  position: string;
  department: string;
  isPresent?: boolean;
  checkInTime?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
}

export default function StaffAttendancePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Données mockées du personnel - À remplacer par des données réelles
  const [staff] = useState<StaffInfo[]>([
    {
      id: "staff001",
      name: "Prof. Jean Mukendi",
      position: "Professeur de Mathématiques",
      department: "Enseignement",
      status: "PRESENT",
      checkInTime: "07:45",
      isPresent: true
    },
    {
      id: "staff002", 
      name: "Marie Kasongo",
      position: "Secrétaire Académique",
      department: "Administration",
      status: "PRESENT",
      checkInTime: "08:00",
      isPresent: true
    },
    {
      id: "staff003",
      name: "Prof. David Mbayo",
      position: "Professeur de Sciences",
      department: "Enseignement", 
      status: "LATE",
      checkInTime: "08:15",
      isPresent: true
    },
    {
      id: "staff004",
      name: "Grace Tshiombe",
      position: "Comptable",
      department: "Finance",
      status: "ABSENT",
      isPresent: false
    },
    {
      id: "staff005",
      name: "Prof. Paul Kalume",
      position: "Directeur Adjoint",
      department: "Direction",
      status: "LEAVE",
      isPresent: false
    }
  ]);

  const today = new Date().toLocaleDateString('fr-FR');
  
  const filteredStaff = staff.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalStaff: staff.length,
    present: staff.filter(s => s.status === 'PRESENT').length,
    late: staff.filter(s => s.status === 'LATE').length,
    absent: staff.filter(s => s.status === 'ABSENT').length,
    onLeave: staff.filter(s => s.status === 'LEAVE').length,
    attendanceRate: (staff.filter(s => s.status === 'PRESENT' || s.status === 'LATE').length / staff.length) * 100
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PRESENT: (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <UserCheck className="h-3 w-3 mr-1" />
          Présent
        </Badge>
      ),
      LATE: (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          En retard
        </Badge>
      ),
      ABSENT: (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <UserX className="h-3 w-3 mr-1" />
          Absent
        </Badge>
      ),
      LEAVE: (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Calendar className="h-3 w-3 mr-1" />
          Congé
        </Badge>
      )
    };
    return badges[status as keyof typeof badges] || badges.ABSENT;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PRESENT: "border-l-green-500",
      LATE: "border-l-orange-500", 
      ABSENT: "border-l-red-500",
      LEAVE: "border-l-blue-500"
    };
    return colors[status as keyof typeof colors] || "border-l-gray-500";
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Présence du Personnel</h1>
            <p className="text-gray-600 mt-1">
              Gestion de la présence quotidienne du personnel - {today}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">Aujourd'hui</span>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">{stats.totalStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Présents</p>
                <p className="text-xl font-bold text-green-600">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Retards</p>
                <p className="text-xl font-bold text-orange-600">{stats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Absents</p>
                <p className="text-xl font-bold text-red-600">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux</p>
                <p className="text-xl font-bold text-purple-600">
                  {stats.attendanceRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, poste ou département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredStaff.length} personne(s) trouvée(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste du personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Personnel de l'établissement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStaff.map((person) => (
              <div 
                key={person.id}
                className={`border-l-4 ${getStatusColor(person.status)} bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserCog className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{person.name}</h4>
                      <p className="text-sm text-gray-600">{person.position}</p>
                      <p className="text-xs text-gray-500">{person.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {person.checkInTime && (
                      <div className="text-right">
                        <p className="text-sm font-medium">Arrivée: {person.checkInTime}</p>
                      </div>
                    )}
                    {getStatusBadge(person.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredStaff.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun personnel trouvé</h3>
            <p className="text-gray-600">
              Essayez de modifier votre recherche ou vérifiez l'orthographe.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Marquer présence
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Rapport mensuel
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Gérer congés
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

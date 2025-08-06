"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  Calendar,
  Search,
  UserCheck,
  UserX,
  Clock,
  ArrowRight,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { DailyAttendanceService } from "@/services/dailyAttendanceService";

// Interface pour les données de classe
interface ClassInfo {
  id: string;
  name: string;
  studentCount: number;
  teacher: string;
  hasAttendanceToday: boolean;
  isCompleted: boolean;
  attendanceStats?: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    percentage: number;
  };
}

export default function AttendanceOverviewPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Données mockées des classes - À remplacer par des données réelles
  const [classes] = useState<ClassInfo[]>([
    {
      id: "6eme-a",
      name: "6ème A",
      studentCount: 28,
      teacher: "Prof. Mukendi",
      hasAttendanceToday: true,
      isCompleted: true,
      attendanceStats: {
        present: 25,
        absent: 2,
        late: 1,
        excused: 0,
        percentage: 89.3
      }
    },
    {
      id: "6eme-b",
      name: "6ème B",
      studentCount: 30,
      teacher: "Prof. Kasongo",
      hasAttendanceToday: true,
      isCompleted: false,
      attendanceStats: {
        present: 22,
        absent: 3,
        late: 2,
        excused: 1,
        percentage: 83.3
      }
    },
    {
      id: "5eme-a",
      name: "5ème A",
      studentCount: 26,
      teacher: "Prof. Mbayo",
      hasAttendanceToday: false,
      isCompleted: false
    },
    {
      id: "5eme-b",
      name: "5ème B",
      studentCount: 29,
      teacher: "Prof. Tshiombe",
      hasAttendanceToday: false,
      isCompleted: false
    },
    {
      id: "4eme-a",
      name: "4ème A",
      studentCount: 24,
      teacher: "Prof. Kalume",
      hasAttendanceToday: true,
      isCompleted: true,
      attendanceStats: {
        present: 22,
        absent: 1,
        late: 1,
        excused: 0,
        percentage: 95.8
      }
    },
    {
      id: "4eme-b",
      name: "4ème B",
      studentCount: 27,
      teacher: "Prof. Ngoy",
      hasAttendanceToday: false,
      isCompleted: false
    }
  ]);

  const today = new Date().toLocaleDateString('fr-FR');
  
  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalClasses: classes.length,
    completedToday: classes.filter(c => c.isCompleted).length,
    inProgress: classes.filter(c => c.hasAttendanceToday && !c.isCompleted).length,
    notStarted: classes.filter(c => !c.hasAttendanceToday).length,
    averageAttendance: classes
      .filter(c => c.attendanceStats)
      .reduce((acc, c) => acc + (c.attendanceStats?.percentage || 0), 0) / 
      classes.filter(c => c.attendanceStats).length || 0
  };

  const handleClassClick = (className: string) => {
    router.push(`/dashboard/attendance/${encodeURIComponent(className)}`);
  };

  const getStatusBadge = (classInfo: ClassInfo) => {
    if (classInfo.isCompleted) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Finalisée
        </Badge>
      );
    } else if (classInfo.hasAttendanceToday) {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          En cours
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Non démarré
        </Badge>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Présence Quotidienne</h1>
          <p className="text-gray-600 mt-1">
            Gérer la présence pour toutes les classes - {today}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">Aujourd'hui</span>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold">{stats.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Finalisées</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux moyen</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.averageAttendance.toFixed(1)}%
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
                placeholder="Rechercher une classe ou un professeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredClasses.length} classe(s) trouvée(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des classes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classInfo) => (
          <Card 
            key={classInfo.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleClassClick(classInfo.name)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{classInfo.name}</CardTitle>
                {getStatusBadge(classInfo)}
              </div>
              <p className="text-sm text-gray-600">{classInfo.teacher}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{classInfo.studentCount} élèves</span>
                  </div>
                  
                  {classInfo.attendanceStats && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-green-600">
                        {classInfo.attendanceStats.percentage.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>

                {classInfo.attendanceStats && (
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-green-600 font-medium">
                        {classInfo.attendanceStats.present}
                      </div>
                      <div className="text-gray-500">Présents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-600 font-medium">
                        {classInfo.attendanceStats.late}
                      </div>
                      <div className="text-gray-500">Retards</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-medium">
                        {classInfo.attendanceStats.absent}
                      </div>
                      <div className="text-gray-500">Absents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-medium">
                        {classInfo.attendanceStats.excused}
                      </div>
                      <div className="text-gray-500">Excusés</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">
                    {classInfo.hasAttendanceToday ? 
                      (classInfo.isCompleted ? "Voir les détails" : "Continuer") : 
                      "Commencer la présence"
                    }
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune classe trouvée</h3>
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
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Voir historique
            </Button>
            <Button variant="outline" className="flex-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              Rapports mensuels
            </Button>
            <Button variant="outline" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Élèves absents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

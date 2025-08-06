"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  UserCheck,
  UserX,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp
} from "lucide-react";
import { getTodayAttendanceOverview } from "@/actions/attendance";

interface AttendanceOverview {
  id: string;
  name: string;
  teacher: string;
  studentCount: number;
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

export default function QuickAttendanceWidget() {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<AttendanceOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAttendanceOverview();
  }, []);

  const loadAttendanceOverview = async () => {
    try {
      const result = await getTodayAttendanceOverview();
      if (result.success && result.data) {
        setAttendanceData(result.data);
      } else {
        setAttendanceData([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la vue d'ensemble:", error);
      setAttendanceData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalClasses: attendanceData.length,
    completed: attendanceData.filter(c => c.isCompleted).length,
    inProgress: attendanceData.filter(c => c.hasAttendanceToday && !c.isCompleted).length,
    notStarted: attendanceData.filter(c => !c.hasAttendanceToday).length,
    averageAttendance: attendanceData
      .filter(c => c.attendanceStats)
      .reduce((acc, c) => acc + (c.attendanceStats?.percentage || 0), 0) / 
      (attendanceData.filter(c => c.attendanceStats).length || 1)
  };

  const urgentClasses = attendanceData
    .filter(c => !c.hasAttendanceToday)
    .slice(0, 3);

  const recentlyCompleted = attendanceData
    .filter(c => c.isCompleted)
    .slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Présence du jour</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard/attendance')}
          >
            Voir tout
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{stats.totalClasses}</div>
            <div className="text-xs text-gray-600">Classes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-600">Finalisées</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{stats.inProgress}</div>
            <div className="text-xs text-gray-600">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {stats.averageAttendance.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Taux moyen</div>
          </div>
        </div>

        {/* Classes nécessitant attention */}
        {urgentClasses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">À traiter en priorité</span>
            </div>
            <div className="space-y-2">
              {urgentClasses.map((cls) => (
                <div 
                  key={cls.id}
                  className="flex items-center justify-between p-2 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => router.push(`/dashboard/attendance/${encodeURIComponent(cls.name)}`)}
                >
                  <div>
                    <div className="font-medium text-sm">{cls.name}</div>
                    <div className="text-xs text-gray-600">{cls.teacher}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      {cls.studentCount} élèves
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classes récemment finalisées */}
        {recentlyCompleted.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Récemment finalisées</span>
            </div>
            <div className="space-y-2">
              {recentlyCompleted.map((cls) => (
                <div 
                  key={cls.id}
                  className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm">{cls.name}</div>
                    <div className="text-xs text-gray-600">{cls.teacher}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cls.attendanceStats && (
                      <>
                        <div className="text-xs text-green-600 font-medium">
                          {cls.attendanceStats.percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          ({cls.attendanceStats.present + cls.attendanceStats.late}/{cls.studentCount})
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => router.push('/dashboard/attendance')}
            >
              <Users className="h-3 w-3 mr-1" />
              Toutes les classes
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => router.push('/dashboard/attendance/reports')}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Rapports
            </Button>
          </div>
        </div>

        {/* État vide */}
        {attendanceData.length === 0 && (
          <div className="text-center py-6">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Aucune classe configurée</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => router.push('/dashboard/academics/classes')}
            >
              Configurer les classes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

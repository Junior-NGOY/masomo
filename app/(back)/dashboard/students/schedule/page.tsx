"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  CalendarDays,
  Timer,
  Award
} from "lucide-react";
import { useTimetable } from "@/hooks/useTimetable";
import { useRouter } from "next/navigation";

export default function StudentScheduleRoute() {
  const router = useRouter();
  const { timetables, loading } = useTimetable();
  const [selectedDay, setSelectedDay] = useState<string>("today");

  // Pour la démo, on prend le premier emploi du temps actif
  const activeTimetable = timetables.find(t => t.status === 'ACTIVE') || timetables[0];

  // Days of the week
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  // Get current day
  const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayIndex = currentDay === 0 ? 0 : currentDay; // Convert Sunday to 0 or keep as is
  const todayName = currentDay === 0 ? 'Dimanche' : days[currentDay - 1];

  // Helper function to get schedule for a specific day
  const getScheduleForDay = (dayOfWeek: number) => {
    if (!activeTimetable) return [];
    return activeTimetable.schedule.filter(s => s.day === dayOfWeek);
  };

  // Get today's schedule
  const todaySchedule = getScheduleForDay(todayIndex);



  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!activeTimetable) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Mon Horaire</h1>
        <p className="text-gray-600">Aucun emploi du temps disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Mon Horaire
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span>Classe: {activeTimetable.className}</span>
              <span>•</span>
              <span>Année: {activeTimetable.academicYear}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Heures/Semaine</p>
                <p className="text-xl font-bold">{activeTimetable.totalHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Matières</p>
                <p className="text-xl font-bold">
                  {new Set(activeTimetable.schedule.map(s => s.subjectId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <CalendarDays className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cours Aujourd'hui</p>
                <p className="text-xl font-bold">{todaySchedule.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="week" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="week">Semaine</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Cours d'Aujourd'hui ({todayName})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaySchedule.length > 0 ? (
                <div className="space-y-3">
                  {todaySchedule.map((slot, index) => (
                    <div key={`${slot.id}-${index}`} className="p-4 rounded-lg border border-gray-200 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{slot.subject}</h3>
                            <Badge variant="outline">{slot.type || 'Cours'}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {slot.teacher || 'Non assigné'}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Salle {slot.roomId || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucun cours prévu pour aujourd'hui.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <div className="grid gap-4">
            {days.map((day, index) => {
              const dayIndex = index + 1;
              const daySchedule = getScheduleForDay(dayIndex);
              
              if (daySchedule.length === 0) return null;

              return (
                <Card key={day}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {day}
                      <Badge variant="secondary" className="text-xs">
                        {daySchedule.length} cours
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {daySchedule.map((slot, idx) => (
                        <div key={`${slot.id}-${idx}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-mono min-w-[100px]">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{slot.subject}</div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{slot.teacher || 'Non assigné'}</span>
                              <span>•</span>
                              <span>Salle {slot.roomId || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

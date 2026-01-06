"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, BookOpen } from "lucide-react";
import { Timetable, TimetableSlot } from "@/hooks/useTimetable";

interface TimetableGridProps {
  selectedClass: string | null;
  timetables: Timetable[];
  onSlotClick?: (slot: TimetableSlot) => void;
  editable?: boolean;
}

const timeSlots = [
  '08:00-09:00',
  '09:15-10:15',
  '10:30-11:30',
  '11:45-12:45',
  '14:00-15:00',
  '15:15-16:15',
  '16:30-17:30'
];
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function TimetableGrid({ selectedClass, timetables, onSlotClick, editable = false }: TimetableGridProps) {
  
  // Récupérer les emplois du temps pour la classe sélectionnée
  const filteredTimetables = selectedClass 
    ? timetables.filter(t => t.classId === selectedClass)
    : timetables;
    
  const activeTimetable = filteredTimetables.find(tt => tt.status === 'ACTIVE');
  
  // Organiser les créneaux par jour et heure
  const scheduleGrid = React.useMemo(() => {
    const grid: { [key: string]: TimetableSlot | null } = {};
    
    days.forEach(day => {
      timeSlots.forEach(timeSlot => {
        const key = `${day}-${timeSlot}`;
        grid[key] = null;
      });
    });
    
    if (activeTimetable) {
      activeTimetable.schedule.forEach(slot => {
        // Convertir le numéro du jour en nom français (1 = Lundi, etc.)
        // Note: Ajuster selon la convention de la DB (0=Dimanche ou 1=Lundi)
        // Ici on suppose 1=Lundi pour correspondre à l'index 0 du tableau days
        const dayIndex = slot.day - 1;
        if (dayIndex >= 0 && dayIndex < days.length) {
          const dayFr = days[dayIndex];
          const timeSlotKey = `${slot.startTime}-${slot.endTime}`;
          const key = `${dayFr}-${timeSlotKey}`;
          // On vérifie si le créneau existe dans nos timeSlots prédéfinis
          // Sinon on essaie de trouver le créneau le plus proche ou on l'ajoute
          if (grid.hasOwnProperty(key)) {
             grid[key] = slot;
          } else {
             // Fallback: si le créneau exact n'existe pas, on essaie de le mapper
             // Pour l'instant on log juste
             console.warn(`Slot time ${timeSlotKey} not matching predefined slots`);
          }
        }
      });
    }
    
    return grid;
  }, [activeTimetable]);

  function getSubjectColor(subjectName: string): string {
    const colors = {
      'Mathématiques': 'bg-blue-100 border-blue-300 text-blue-800',
      'Français': 'bg-green-100 border-green-300 text-green-800',
      'Sciences': 'bg-purple-100 border-purple-300 text-purple-800',
      'Histoire-Géographie': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'Anglais': 'bg-red-100 border-red-300 text-red-800',
      'Education Physique': 'bg-orange-100 border-orange-300 text-orange-800',
      'Arts Plastiques': 'bg-pink-100 border-pink-300 text-pink-800',
      'Musique': 'bg-indigo-100 border-indigo-300 text-indigo-800'
    };
    return colors[subjectName as keyof typeof colors] || 'bg-gray-100 border-gray-300 text-gray-800';
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'LECTURE':
        return <BookOpen className="h-3 w-3" />;
      case 'LAB':
        return <BookOpen className="h-3 w-3" />; // Ou une icône de laboratoire
      case 'TUTORIAL':
        return <User className="h-3 w-3" />;
      case 'EXAM':
        return <Clock className="h-3 w-3" />;
      default:
        return <BookOpen className="h-3 w-3" />;
    }
  }

  function handleSlotClick(slot: TimetableSlot | null) {
    if (onSlotClick && slot) {
      onSlotClick(slot);
    } else if (editable && !slot) {
      // Permettre d'ajouter un nouveau créneau
      console.log("Add new slot");
    }
  }

  if (!selectedClass && timetables.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Sélectionnez une classe pour voir l'emploi du temps</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedClass && activeTimetable && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{activeTimetable.className}</h3>
            <p className="text-sm text-gray-600">
              {activeTimetable.academicYear} - {activeTimetable.term.replace('_', ' ')}
            </p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {activeTimetable.totalHours}h/semaine
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-6 gap-2 text-sm">
        {/* En-tête des colonnes */}
        <div className="font-semibold text-center p-2 bg-gray-50 rounded">
          Horaires
        </div>
        {days.slice(0, 5).map(day => (
          <div key={day} className="font-semibold text-center p-2 bg-gray-50 rounded">
            {day}
          </div>
        ))}

        {/* Grille des créneaux */}
        {timeSlots.map(timeSlot => (
          <React.Fragment key={timeSlot}>
            {/* Colonne des horaires */}
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded text-xs font-medium">
              {timeSlot}
            </div>
            
            {/* Créneaux pour chaque jour */}
            {days.slice(0, 5).map(day => {
              const key = `${day}-${timeSlot}`;
              const slot = scheduleGrid[key];
              
              return (
                <div key={key} className="aspect-square">
                  {slot ? (
                    <Card 
                      className={`h-full cursor-pointer transition-all hover:shadow-md ${getSubjectColor(slot.subject)}`}
                      onClick={() => handleSlotClick(slot)}
                    >
                      <CardContent className="p-2 h-full flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate">
                              {slot.subject}
                            </span>
                            {getTypeIcon(slot.type || '')}
                          </div>
                          
                          <div className="space-y-0.5 text-xs">
                            <div className="flex items-center gap-1 truncate">
                              <User className="h-2.5 w-2.5" />
                              <span className="truncate">{slot.teacher}</span>
                            </div>
                            
                            {slot.roomId && (
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="h-2.5 w-2.5" />
                                <span className="truncate">{slot.roomId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs opacity-75">
                          {slot.startTime}-{slot.endTime}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div 
                      className={`h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center ${
                        editable ? 'cursor-pointer hover:border-gray-300 hover:bg-gray-50' : ''
                      }`}
                      onClick={() => handleSlotClick(null)}
                    >
                      {editable && (
                        <Button variant="ghost" size="sm" className="h-full w-full text-gray-400">
                          <Clock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Légende */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Légende des Types de Cours</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span>Cours magistral</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-600" />
            <span>Travaux pratiques</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-600" />
            <span>Tutorat</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-600" />
            <span>Examen</span>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      {selectedClass && activeTimetable && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card className="p-3">
            <div className="text-2xl font-bold text-blue-600">
              {activeTimetable.schedule.length}
            </div>
            <div className="text-xs text-gray-600">Créneaux planifiés</div>
          </Card>
          
          <Card className="p-3">
            <div className="text-2xl font-bold text-green-600">
              {new Set(activeTimetable.schedule.map(s => s.subjectId)).size}
            </div>
            <div className="text-xs text-gray-600">Matières enseignées</div>
          </Card>
          
          <Card className="p-3">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(activeTimetable.schedule.map(s => s.teacherId)).size}
            </div>
            <div className="text-xs text-gray-600">Enseignants impliqués</div>
          </Card>
          
          <Card className="p-3">
            <div className="text-2xl font-bold text-orange-600">
              {activeTimetable.totalHours}h
            </div>
            <div className="text-xs text-gray-600">Total par semaine</div>
          </Card>
        </div>
      )}
    </div>
  );
}

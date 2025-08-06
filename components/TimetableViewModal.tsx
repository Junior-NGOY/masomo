"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  BookOpen,
  Download,
  Printer,
  Share,
  X,
  Eye
} from "lucide-react";
import { TimetableMockService, Timetable } from "@/services/timetableMockService";

interface TimetableViewModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  timetableId?: string | null;
}

export default function TimetableViewModal({ 
  isOpen, 
  onClose, 
  timetableId 
}: TimetableViewModalProps = {}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const modalOpen = isOpen ?? internalOpen;
  const handleClose = onClose || (() => setInternalOpen(false));

  const [timetable, setTimetable] = React.useState<Timetable | null>(null);

  // Charger l'emploi du temps
  React.useEffect(() => {
    if (timetableId && modalOpen) {
      const tt = TimetableMockService.getTimetableById(timetableId);
      setTimetable(tt);
    }
  }, [timetableId, modalOpen]);

  const days = React.useMemo(() => [
    { value: 'MONDAY', label: 'Lundi' },
    { value: 'TUESDAY', label: 'Mardi' },
    { value: 'WEDNESDAY', label: 'Mercredi' },
    { value: 'THURSDAY', label: 'Jeudi' },
    { value: 'FRIDAY', label: 'Vendredi' },
    { value: 'SATURDAY', label: 'Samedi' }
  ], []);

  const timeSlots = TimetableMockService.getAvailableTimeSlots();

  // Organiser les créneaux par jour et heure
  const scheduleGrid = React.useMemo(() => {
    if (!timetable) return {};
    
    const grid: { [key: string]: typeof timetable.schedule[0] | null } = {};
    
    days.forEach(day => {
      timeSlots.forEach(timeSlot => {
        const key = `${day.value}-${timeSlot}`;
        grid[key] = null;
      });
    });
    
    timetable.schedule.forEach(slot => {
      const timeSlotKey = `${slot.startTime}-${slot.endTime}`;
      const key = `${slot.day}-${timeSlotKey}`;
      grid[key] = slot;
    });
    
    return grid;
  }, [timetable, days, timeSlots]);

  const getSubjectColor = (subjectName: string) => {
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Actif";
      case "DRAFT":
        return "Brouillon";
      case "ARCHIVED":
        return "Archivé";
      default:
        return status;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulation du téléchargement PDF
    alert("Téléchargement de l'emploi du temps en cours...");
  };

  const handleShare = () => {
    // Simulation du partage
    alert("Lien de partage copié dans le presse-papier!");
  };

  if (!timetable) {
    return (
      <Dialog open={modalOpen} onOpenChange={handleClose}>
        {/* Si pas de props externes, afficher le trigger button */}
        {isOpen === undefined && (
          <Button 
            onClick={() => setInternalOpen(true)}
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir Emploi du Temps
          </Button>
        )}
        
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Emploi du temps non trouvé</DialogTitle>
            <DialogDescription>
              L'emploi du temps demandé n'existe pas ou a été supprimé.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      {/* Si pas de props externes, afficher le trigger button */}
      {isOpen === undefined && (
        <Button 
          onClick={() => setInternalOpen(true)}
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          Voir Emploi du Temps
        </Button>
      )}
      
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Emploi du Temps - {timetable.className}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            {timetable.academicYear} - {timetable.term.replace('_', ' ')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Classe</Label>
                <div className="text-lg font-bold text-blue-600">{timetable.className}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Année Académique</Label>
                <div className="text-lg font-semibold">{timetable.academicYear}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Trimestre</Label>
                <div className="text-lg font-semibold">{timetable.term.replace('_', ' ')}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Statut</Label>
                <Badge variant="outline" className={getStatusColor(timetable.status)}>
                  {getStatusText(timetable.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {timetable.schedule.length}
                </div>
                <div className="text-sm text-gray-600">Créneaux planifiés</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(timetable.schedule.map(s => s.subjectId)).size}
                </div>
                <div className="text-sm text-gray-600">Matières enseignées</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(timetable.schedule.map(s => s.teacherId)).size}
                </div>
                <div className="text-sm text-gray-600">Enseignants impliqués</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {timetable.totalHours}h
                </div>
                <div className="text-sm text-gray-600">Total par semaine</div>
              </CardContent>
            </Card>
          </div>

          {/* Grille de l'emploi du temps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emploi du Temps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2 text-sm">
                {/* En-tête des colonnes */}
                <div className="font-semibold text-center p-3 bg-gray-50 rounded">
                  Horaires
                </div>
                {days.slice(0, 5).map(day => (
                  <div key={day.value} className="font-semibold text-center p-3 bg-gray-50 rounded">
                    {day.label}
                  </div>
                ))}

                {/* Grille des créneaux */}
                {timeSlots.map(timeSlot => (
                  <React.Fragment key={timeSlot}>
                    {/* Colonne des horaires */}
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded text-xs font-medium">
                      {timeSlot}
                    </div>
                    
                    {/* Créneaux pour chaque jour */}
                    {days.slice(0, 5).map(day => {
                      const key = `${day.value}-${timeSlot}`;
                      const slot = scheduleGrid[key];
                      
                      return (
                        <div key={key} className="min-h-[100px]">
                          {slot ? (
                            <Card className={`h-full ${getSubjectColor(slot.subjectName)}`}>
                              <CardContent className="p-3 h-full flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="font-semibold text-sm truncate">
                                    {slot.subjectName}
                                  </div>
                                  
                                  <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-1 truncate">
                                      <User className="h-3 w-3" />
                                      <span className="truncate">{slot.teacherName}</span>
                                    </div>
                                    
                                    {slot.room && (
                                      <div className="flex items-center gap-1 truncate">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">{slot.room}</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="h-3 w-3" />
                                      <span className="capitalize">{slot.type.toLowerCase()}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-xs opacity-75 mt-2">
                                  {slot.startTime}-{slot.endTime}
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <div className="h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Libre</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Résumé par matière */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Répartition par Matière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(
                  timetable.schedule.reduce((acc, slot) => {
                    if (!acc[slot.subjectName]) {
                      acc[slot.subjectName] = {
                        hours: 0,
                        teacher: slot.teacherName,
                        sessions: 0
                      };
                    }
                    const start = parseFloat(slot.startTime.replace(':', '.'));
                    const end = parseFloat(slot.endTime.replace(':', '.'));
                    acc[slot.subjectName].hours += (end - start);
                    acc[slot.subjectName].sessions += 1;
                    return acc;
                  }, {} as Record<string, {hours: number, teacher: string, sessions: number}>)
                ).map(([subject, data]) => (
                  <div key={subject} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getSubjectColor(subject)}>
                        {subject}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        <User className="h-4 w-4 inline mr-1" />
                        {data.teacher}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{Math.round(data.hours)}h/semaine</div>
                      <div className="text-xs text-gray-500">{data.sessions} séances</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informations de version */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  Version {timetable.version} - Créé par {timetable.createdBy}
                </div>
                <div>
                  Dernière modification: {TimetableMockService.formatDate(timetable.lastModified)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

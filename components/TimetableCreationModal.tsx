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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  X,
  BookOpen,
  User,
  MapPin
} from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
import { useTeachers } from "@/hooks/useTeachers";
import { Timetable, TimetableSlot } from "@/hooks/useTimetable";

interface TimetableCreationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  timetableId?: string | null;
}

export default function TimetableCreationModal({ 
  isOpen, 
  onClose, 
  timetableId 
}: TimetableCreationModalProps = {}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const modalOpen = isOpen ?? internalOpen;
  const handleClose = onClose || (() => setInternalOpen(false));

  // Hooks pour les données
  const { classes } = useClasses();
  const { subjects } = useSubjects();
  const { teachers } = useTeachers();

  // États du formulaire
  const [formData, setFormData] = React.useState({
    classId: '',
    academicYear: '2024-2025',
    term: 'TRIMESTRE_1',
    status: 'DRAFT'
  });
  
  const [schedule, setSchedule] = React.useState<any[]>([]);
  const [currentSlot, setCurrentSlot] = React.useState<any>({
    day: 1, // 1 = Lundi
    startTime: '08:00',
    endTime: '09:00',
    subjectId: '',
    teacherId: '',
    room: '',
    type: 'LECTURE'
  });
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});

  const timeSlots = [
    '08:00-09:00',
    '09:15-10:15',
    '10:30-11:30',
    '11:45-12:45',
    '14:00-15:00',
    '15:15-16:15',
    '16:30-17:30'
  ];
  
  const days = [
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' }
  ];

  // Charger les données si on édite un emploi du temps existant
  React.useEffect(() => {
    const fetchTimetable = async () => {
      if (timetableId && modalOpen) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/timetables/${timetableId}`);
          if (response.ok) {
            const result = await response.json();
            const timetable = result.data;
            setFormData({
              classId: timetable.classId,
              academicYear: timetable.academicYear,
              term: timetable.term,
              status: timetable.status
            });
            setSchedule(timetable.schedule || []);
          }
        } catch (error) {
          console.error("Failed to fetch timetable", error);
        }
      } else {
        // Réinitialiser pour un nouvel emploi du temps
        setFormData({
          classId: '',
          academicYear: '2024-2025',
          term: 'TRIMESTRE_1',
          status: 'DRAFT'
        });
        setSchedule([]);
      }
    };

    fetchTimetable();
  }, [timetableId, modalOpen]);

  const validateSlot = (slot: any): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!slot.subjectId) newErrors.subject = "Sélectionnez une matière";
    if (!slot.teacherId) newErrors.teacher = "Sélectionnez un enseignant";
    if (!slot.startTime || !slot.endTime) newErrors.time = "Définissez les horaires";
    
    // Vérifier les conflits
    const hasConflict = schedule.some(existing => 
      existing.day === slot.day &&
      existing.startTime === slot.startTime &&
      existing.endTime === slot.endTime &&
      existing.id !== slot.id
    );
    
    if (hasConflict) {
      newErrors.conflict = "Un cours existe déjà à ce créneau";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTimeSlot = () => {
    if (!validateSlot(currentSlot)) return;
    
    const selectedSubject = subjects.find((s: any) => s.id === currentSlot.subjectId);
    const selectedTeacher = teachers.find((t: any) => t.id === currentSlot.teacherId);
    
    const newSlot = {
      id: `slot-${Date.now()}`,
      day: currentSlot.day,
      startTime: currentSlot.startTime!,
      endTime: currentSlot.endTime!,
      subjectId: currentSlot.subjectId!,
      subject: selectedSubject?.name || '',
      teacherId: currentSlot.teacherId!,
      teacher: selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : '',
      roomId: currentSlot.room || '',
      type: currentSlot.type
    };
    
    setSchedule([...schedule, newSlot]);
    
    // Réinitialiser le formulaire de créneau
    setCurrentSlot({
      day: 1,
      startTime: '08:00',
      endTime: '09:00',
      subjectId: '',
      teacherId: '',
      room: '',
      type: 'LECTURE'
    });
    setErrors({});
  };

  const removeTimeSlot = (id: string) => {
    setSchedule(schedule.filter(slot => slot.id !== id));
  };

  const calculateTotalHours = () => {
    return schedule.reduce((total, slot) => {
      const start = parseFloat(slot.startTime.replace(':', '.'));
      const end = parseFloat(slot.endTime.replace(':', '.'));
      return total + (end - start);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId) {
      setErrors({ form: "Sélectionnez une classe" });
      return;
    }
    
    if (schedule.length === 0) {
      setErrors({ form: "Ajoutez au moins un créneau" });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const selectedClass = classes.find((c: any) => c.id === formData.classId);
      const timetableData = {
        ...formData,
        className: selectedClass?.title || '',
        schedule,
        totalHours: Math.round(calculateTotalHours())
      };
      
      const url = timetableId 
        ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/timetables/${timetableId}`
        : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/timetables`;
        
      const method = timetableId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetableData)
      });

      if (!response.ok) throw new Error('Failed to save timetable');
      
      alert(timetableId ? "Emploi du temps mis à jour avec succès!" : "Emploi du temps créé avec succès!");
      handleClose();
      // Idéalement, rafraîchir la liste des emplois du temps ici
      window.location.reload(); 
    } catch (error) {
      setErrors({ form: "Erreur lors de la sauvegarde" });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseTimeSlot = (timeSlotStr: string) => {
    const [start, end] = timeSlotStr.split('-');
    return { startTime: start, endTime: end };
  };

  const getDayLabel = (day: number) => {
    return days.find(d => d.value === day)?.label || day;
  };

  const getSubjectColor = (subjectName: string) => {
    const colors = {
      'Mathématiques': 'bg-blue-100 text-blue-800',
      'Français': 'bg-green-100 text-green-800',
      'Sciences': 'bg-purple-100 text-purple-800',
      'Histoire-Géographie': 'bg-yellow-100 text-yellow-800',
      'Anglais': 'bg-red-100 text-red-800',
      'Education Physique': 'bg-orange-100 text-orange-800'
    };
    return colors[subjectName as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      {/* Si pas de props externes, afficher le trigger button */}
      {isOpen === undefined && (
        <Button 
          onClick={() => setInternalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Emploi du Temps
        </Button>
      )}
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {timetableId ? 'Modifier l\'emploi du temps' : 'Créer un nouvel emploi du temps'}
            </span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {timetableId ? 'Modifiez les informations et créneaux' : 'Configurez les informations générales et ajoutez les créneaux de cours'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="class">Classe *</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => setFormData({...formData, classId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classe: any) => (
                      <SelectItem key={classe.id} value={classe.id}>
                        {classe.title || classe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYear">Année Académique</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  placeholder="2024-2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Trimestre</Label>
                <Select
                  value={formData.term}
                  onValueChange={(value) => setFormData({...formData, term: value as Timetable['term']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRIMESTRE_1">Trimestre 1</SelectItem>
                    <SelectItem value="TRIMESTRE_2">Trimestre 2</SelectItem>
                    <SelectItem value="TRIMESTRE_3">Trimestre 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value as Timetable['status']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="ARCHIVED">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ajout de créneaux */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ajouter un Créneau</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="space-y-2">
                  <Label>Jour</Label>
                  <Select
                    value={currentSlot.day.toString()}
                    onValueChange={(value) => setCurrentSlot({...currentSlot, day: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Horaire</Label>
                  <Select
                    value={`${currentSlot.startTime}-${currentSlot.endTime}`}
                    onValueChange={(value) => {
                      const { startTime, endTime } = parseTimeSlot(value);
                      setCurrentSlot({...currentSlot, startTime, endTime});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Matière</Label>
                  <Select
                    value={currentSlot.subjectId}
                    onValueChange={(value) => setCurrentSlot({...currentSlot, subjectId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Enseignant</Label>
                  <Select
                    value={currentSlot.teacherId}
                    onValueChange={(value) => setCurrentSlot({...currentSlot, teacherId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Enseignant" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher: any) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Salle</Label>
                  <Input
                    value={currentSlot.room}
                    onChange={(e) => setCurrentSlot({...currentSlot, room: e.target.value})}
                    placeholder="Salle 101"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={currentSlot.type}
                    onValueChange={(value) => setCurrentSlot({...currentSlot, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LECTURE">Cours</SelectItem>
                      <SelectItem value="LAB">TP</SelectItem>
                      <SelectItem value="TUTORIAL">Tutorat</SelectItem>
                      <SelectItem value="EXAM">Examen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="text-red-600 text-sm">
                  {Object.values(errors).map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}

              <Button type="button" onClick={addTimeSlot} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le Créneau
              </Button>
            </CardContent>
          </Card>

          {/* Liste des créneaux ajoutés */}
          {schedule.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Créneaux Planifiés ({schedule.length})
                  <Badge variant="outline">
                    {Math.round(calculateTotalHours())}h/semaine
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {schedule.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge variant="outline" className="min-w-fit">
                          {getDayLabel(slot.day)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{slot.startTime}-{slot.endTime}</span>
                        </div>
                        <Badge className={getSubjectColor(slot.subject)}>
                          {slot.subject}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{slot.teacher}</span>
                        </div>
                        {slot.roomId && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{slot.roomId}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(slot.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || !formData.classId}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                "Sauvegarde..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {timetableId ? 'Mettre à jour' : 'Créer l\'emploi du temps'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Service de gestion des horaires de cours
import { randomUUID } from 'crypto';

export interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
}

export interface ClassScheduleItem {
  id: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI';
  timeSlot: TimeSlot;
  location: string;
  roomNumber?: string;
  courseType: 'COURS_MAGISTRAL' | 'TRAVAUX_PRATIQUES' | 'EXERCICES' | 'EVALUATION';
  isRecurring: boolean;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySchedule {
  className: string;
  academicYear: string;
  weekStartDate: string;
  schedule: {
    [day: string]: ClassScheduleItem[];
  };
  totalHoursPerWeek: number;
  subjectsCount: number;
}

export interface ScheduleConflict {
  type: 'TEACHER_CONFLICT' | 'ROOM_CONFLICT' | 'STUDENT_CONFLICT';
  message: string;
  conflictingItems: ClassScheduleItem[];
}

export interface TeacherSchedule {
  teacherId: string;
  teacherName: string;
  weeklyHours: number;
  classes: {
    className: string;
    subject: string;
    hoursPerWeek: number;
  }[];
  schedule: ClassScheduleItem[];
}

class ScheduleServiceClass {
  private schedules: ClassScheduleItem[] = [];
  private timeSlots: TimeSlot[] = [
    { startTime: '07:30', endTime: '08:20' },
    { startTime: '08:25', endTime: '09:15' },
    { startTime: '09:20', endTime: '10:10' },
    { startTime: '10:30', endTime: '11:20' }, // Après récréation
    { startTime: '11:25', endTime: '12:15' },
    { startTime: '12:20', endTime: '13:10' },
    { startTime: '14:00', endTime: '14:50' }, // Après pause déjeuner
    { startTime: '14:55', endTime: '15:45' },
    { startTime: '15:50', endTime: '16:40' }
  ];

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    // Données d'exemple pour l'horaire de la 6ème Scientifique
    this.schedules = [
      // LUNDI
      {
        id: '1',
        className: '6ème Scientifique',
        subjectId: 'math-001',
        subjectName: 'Mathématiques',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Kabamba',
        dayOfWeek: 'LUNDI',
        timeSlot: { startTime: '07:30', endTime: '08:20' },
        location: 'Salle A-101',
        roomNumber: 'A-101',
        courseType: 'COURS_MAGISTRAL',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        className: '6ème Scientifique',
        subjectId: 'physics-001',
        subjectName: 'Physique',
        teacherId: 'teacher-2',
        teacherName: 'Prof. Mbuyi',
        dayOfWeek: 'LUNDI',
        timeSlot: { startTime: '08:25', endTime: '09:15' },
        location: 'Laboratoire de Physique',
        roomNumber: 'LAB-01',
        courseType: 'TRAVAUX_PRATIQUES',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        className: '6ème Scientifique',
        subjectId: 'french-001',
        subjectName: 'Français',
        teacherId: 'teacher-3',
        teacherName: 'Prof. Tshimanga',
        dayOfWeek: 'LUNDI',
        timeSlot: { startTime: '09:20', endTime: '10:10' },
        location: 'Salle B-203',
        roomNumber: 'B-203',
        courseType: 'COURS_MAGISTRAL',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        className: '6ème Scientifique',
        subjectId: 'chemistry-001',
        subjectName: 'Chimie',
        teacherId: 'teacher-4',
        teacherName: 'Prof. Kasongo',
        dayOfWeek: 'LUNDI',
        timeSlot: { startTime: '10:30', endTime: '11:20' },
        location: 'Laboratoire de Chimie',
        roomNumber: 'LAB-02',
        courseType: 'TRAVAUX_PRATIQUES',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        className: '6ème Scientifique',
        subjectId: 'english-001',
        subjectName: 'Anglais',
        teacherId: 'teacher-5',
        teacherName: 'Prof. Nguza',
        dayOfWeek: 'LUNDI',
        timeSlot: { startTime: '11:25', endTime: '12:15' },
        location: 'Salle C-301',
        roomNumber: 'C-301',
        courseType: 'COURS_MAGISTRAL',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // MARDI
      {
        id: '6',
        className: '6ème Scientifique',
        subjectId: 'biology-001',
        subjectName: 'Biologie',
        teacherId: 'teacher-6',
        teacherName: 'Prof. Mulamba',
        dayOfWeek: 'MARDI',
        timeSlot: { startTime: '07:30', endTime: '08:20' },
        location: 'Laboratoire de Biologie',
        roomNumber: 'LAB-03',
        courseType: 'COURS_MAGISTRAL',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        className: '6ème Scientifique',
        subjectId: 'math-001',
        subjectName: 'Mathématiques',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Kabamba',
        dayOfWeek: 'MARDI',
        timeSlot: { startTime: '08:25', endTime: '09:15' },
        location: 'Salle A-101',
        roomNumber: 'A-101',
        courseType: 'EXERCICES',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '8',
        className: '6ème Scientifique',
        subjectId: 'history-001',
        subjectName: 'Histoire',
        teacherId: 'teacher-7',
        teacherName: 'Prof. Tshilobo',
        dayOfWeek: 'MARDI',
        timeSlot: { startTime: '09:20', endTime: '10:10' },
        location: 'Salle D-401',
        roomNumber: 'D-401',
        courseType: 'COURS_MAGISTRAL',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // MERCREDI
      {
        id: '9',
        className: '6ème Scientifique',
        subjectId: 'physics-001',
        subjectName: 'Physique',
        teacherId: 'teacher-2',
        teacherName: 'Prof. Mbuyi',
        dayOfWeek: 'MERCREDI',
        timeSlot: { startTime: '07:30', endTime: '08:20' },
        location: 'Salle A-102',
        roomNumber: 'A-102',
        courseType: 'COURS_MAGISTRAL',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '10',
        className: '6ème Scientifique',
        subjectId: 'geography-001',
        subjectName: 'Géographie',
        teacherId: 'teacher-8',
        teacherName: 'Prof. Katumba',
        dayOfWeek: 'MERCREDI',
        timeSlot: { startTime: '08:25', endTime: '09:15' },
        location: 'Salle D-402',
        roomNumber: 'D-402',
        courseType: 'COURS_MAGISTRAL',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // JEUDI
      {
        id: '11',
        className: '6ème Scientifique',
        subjectId: 'chemistry-001',
        subjectName: 'Chimie',
        teacherId: 'teacher-4',
        teacherName: 'Prof. Kasongo',
        dayOfWeek: 'JEUDI',
        timeSlot: { startTime: '07:30', endTime: '08:20' },
        location: 'Salle A-103',
        roomNumber: 'A-103',
        courseType: 'COURS_MAGISTRAL',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '12',
        className: '6ème Scientifique',
        subjectId: 'french-001',
        subjectName: 'Français',
        teacherId: 'teacher-3',
        teacherName: 'Prof. Tshimanga',
        dayOfWeek: 'JEUDI',
        timeSlot: { startTime: '08:25', endTime: '09:15' },
        location: 'Salle B-203',
        roomNumber: 'B-203',
        courseType: 'EXERCICES',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // VENDREDI
      {
        id: '13',
        className: '6ème Scientifique',
        subjectId: 'math-001',
        subjectName: 'Mathématiques',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Kabamba',
        dayOfWeek: 'VENDREDI',
        timeSlot: { startTime: '07:30', endTime: '08:20' },
        location: 'Salle A-101',
        roomNumber: 'A-101',
        courseType: 'EVALUATION',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        notes: 'Contrôle hebdomadaire',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '14',
        className: '6ème Scientifique',
        subjectId: 'biology-001',
        subjectName: 'Biologie',
        teacherId: 'teacher-6',
        teacherName: 'Prof. Mulamba',
        dayOfWeek: 'VENDREDI',
        timeSlot: { startTime: '08:25', endTime: '09:15' },
        location: 'Laboratoire de Biologie',
        roomNumber: 'LAB-03',
        courseType: 'TRAVAUX_PRATIQUES',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '15',
        className: '6ème Scientifique',
        subjectId: 'sports-001',
        subjectName: 'Éducation Physique',
        teacherId: 'teacher-9',
        teacherName: 'Prof. Mwamba',
        dayOfWeek: 'VENDREDI',
        timeSlot: { startTime: '14:00', endTime: '15:45' },
        location: 'Terrain de Sport',
        roomNumber: 'TERRAIN',
        courseType: 'TRAVAUX_PRATIQUES',
        isRecurring: true,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        notes: 'Double période',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Récupérer l'horaire d'une classe pour une semaine donnée
  getClassWeeklySchedule(className: string, weekStartDate: string = new Date().toISOString().split('T')[0]): WeeklySchedule {
    const classSchedules = this.schedules.filter(schedule => 
      schedule.className === className &&
      this.isDateInRange(weekStartDate, schedule.startDate, schedule.endDate)
    );

    // Organiser par jour de la semaine
    const scheduleByDay: { [day: string]: ClassScheduleItem[] } = {
      'LUNDI': [],
      'MARDI': [],
      'MERCREDI': [],
      'JEUDI': [],
      'VENDREDI': [],
      'SAMEDI': []
    };

    classSchedules.forEach(schedule => {
      scheduleByDay[schedule.dayOfWeek].push(schedule);
    });

    // Trier chaque jour par heure de début
    Object.keys(scheduleByDay).forEach(day => {
      scheduleByDay[day].sort((a, b) => a.timeSlot.startTime.localeCompare(b.timeSlot.startTime));
    });

    // Calculer le total d'heures par semaine
    const totalHoursPerWeek = classSchedules.reduce((total, schedule) => {
      const start = new Date(`2000-01-01T${schedule.timeSlot.startTime}:00`);
      const end = new Date(`2000-01-01T${schedule.timeSlot.endTime}:00`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // en heures
      return total + duration;
    }, 0);

    // Compter les matières uniques
    const uniqueSubjects = new Set(classSchedules.map(s => s.subjectId));

    return {
      className,
      academicYear: '2024-2025',
      weekStartDate,
      schedule: scheduleByDay,
      totalHoursPerWeek: Math.round(totalHoursPerWeek * 10) / 10,
      subjectsCount: uniqueSubjects.size
    };
  }

  // Récupérer l'horaire d'un professeur
  getTeacherSchedule(teacherId: string): TeacherSchedule {
    const teacherSchedules = this.schedules.filter(schedule => schedule.teacherId === teacherId);
    
    if (teacherSchedules.length === 0) {
      throw new Error('Aucun horaire trouvé pour ce professeur');
    }

    const teacherName = teacherSchedules[0].teacherName;

    // Calculer les heures par semaine
    const weeklyHours = teacherSchedules.reduce((total, schedule) => {
      const start = new Date(`2000-01-01T${schedule.timeSlot.startTime}:00`);
      const end = new Date(`2000-01-01T${schedule.timeSlot.endTime}:00`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + duration;
    }, 0);

    // Grouper par classe et matière
    const classSubjectMap = new Map<string, Map<string, number>>();
    
    teacherSchedules.forEach(schedule => {
      if (!classSubjectMap.has(schedule.className)) {
        classSubjectMap.set(schedule.className, new Map());
      }
      
      const subjectMap = classSubjectMap.get(schedule.className)!;
      const start = new Date(`2000-01-01T${schedule.timeSlot.startTime}:00`);
      const end = new Date(`2000-01-01T${schedule.timeSlot.endTime}:00`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      const currentHours = subjectMap.get(schedule.subjectName) || 0;
      subjectMap.set(schedule.subjectName, currentHours + duration);
    });

    // Créer la liste des classes
    const classes: TeacherSchedule['classes'] = [];
    classSubjectMap.forEach((subjectMap, className) => {
      subjectMap.forEach((hours, subject) => {
        classes.push({
          className,
          subject,
          hoursPerWeek: Math.round(hours * 10) / 10
        });
      });
    });

    return {
      teacherId,
      teacherName,
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      classes: classes.sort((a, b) => a.className.localeCompare(b.className)),
      schedule: teacherSchedules.sort((a, b) => {
        const dayOrder = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
        const dayComparison = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
        if (dayComparison !== 0) return dayComparison;
        return a.timeSlot.startTime.localeCompare(b.timeSlot.startTime);
      })
    };
  }

  // Récupérer l'horaire du jour
  getTodaySchedule(className: string): ClassScheduleItem[] {
    const today = new Date();
    const dayNames = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const todayName = dayNames[today.getDay()] as ClassScheduleItem['dayOfWeek'];
    const todayDate = today.toISOString().split('T')[0];

    return this.schedules.filter(schedule => 
      schedule.className === className &&
      schedule.dayOfWeek === todayName &&
      this.isDateInRange(todayDate, schedule.startDate, schedule.endDate)
    ).sort((a, b) => a.timeSlot.startTime.localeCompare(b.timeSlot.startTime));
  }

  // Récupérer les cours à venir (prochains cours)
  getUpcomingClasses(className: string, limit: number = 5): ClassScheduleItem[] {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDate = now.toISOString().split('T')[0];
    
    const allUpcoming: ClassScheduleItem[] = [];
    
    // Vérifier les cours d'aujourd'hui qui n'ont pas encore commencé
    const todaySchedule = this.getTodaySchedule(className);
    const remainingToday = todaySchedule.filter(schedule => 
      schedule.timeSlot.startTime > currentTime
    );
    
    allUpcoming.push(...remainingToday);
    
    // Ajouter les cours des prochains jours si nécessaire
    if (allUpcoming.length < limit) {
      const nextDays = this.getNextWeekSchedule(className, currentDate);
      allUpcoming.push(...nextDays.slice(0, limit - allUpcoming.length));
    }
    
    return allUpcoming.slice(0, limit);
  }

  // Créer un nouvel élément d'horaire
  addScheduleItem(scheduleData: Omit<ClassScheduleItem, 'id' | 'createdAt' | 'updatedAt'>): ClassScheduleItem {
    const newItem: ClassScheduleItem = {
      ...scheduleData,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Vérifier les conflits
    const conflicts = this.checkConflicts(newItem);
    if (conflicts.length > 0) {
      throw new Error(`Conflit détecté: ${conflicts[0].message}`);
    }

    this.schedules.push(newItem);
    return newItem;
  }

  // Vérifier les conflits d'horaire
  checkConflicts(newItem: ClassScheduleItem): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    
    const overlappingSchedules = this.schedules.filter(schedule => 
      schedule.dayOfWeek === newItem.dayOfWeek &&
      schedule.id !== newItem.id &&
      this.timeSlotOverlaps(schedule.timeSlot, newItem.timeSlot)
    );

    overlappingSchedules.forEach(schedule => {
      // Conflit de professeur
      if (schedule.teacherId === newItem.teacherId) {
        conflicts.push({
          type: 'TEACHER_CONFLICT',
          message: `Le professeur ${schedule.teacherName} a déjà cours à cette heure`,
          conflictingItems: [schedule, newItem]
        });
      }

      // Conflit de salle
      if (schedule.location === newItem.location && schedule.roomNumber === newItem.roomNumber) {
        conflicts.push({
          type: 'ROOM_CONFLICT',
          message: `La salle ${schedule.location} est déjà occupée à cette heure`,
          conflictingItems: [schedule, newItem]
        });
      }

      // Conflit de classe
      if (schedule.className === newItem.className) {
        conflicts.push({
          type: 'STUDENT_CONFLICT',
          message: `La classe ${schedule.className} a déjà cours à cette heure`,
          conflictingItems: [schedule, newItem]
        });
      }
    });

    return conflicts;
  }

  // Fonctions utilitaires privées
  private isDateInRange(date: string, startDate: string, endDate?: string): boolean {
    if (endDate) {
      return date >= startDate && date <= endDate;
    }
    return date >= startDate;
  }

  private timeSlotOverlaps(slot1: TimeSlot, slot2: TimeSlot): boolean {
    const start1 = slot1.startTime;
    const end1 = slot1.endTime;
    const start2 = slot2.startTime;
    const end2 = slot2.endTime;

    return start1 < end2 && start2 < end1;
  }

  private getNextWeekSchedule(className: string, fromDate: string): ClassScheduleItem[] {
    // Implémentation simplifiée - retourne les cours de la semaine suivante
    return this.schedules.filter(schedule => 
      schedule.className === className
    ).sort((a, b) => {
      const dayOrder = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
      const dayComparison = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
      if (dayComparison !== 0) return dayComparison;
      return a.timeSlot.startTime.localeCompare(b.timeSlot.startTime);
    });
  }

  // Obtenir les créneaux horaires disponibles
  getAvailableTimeSlots(): TimeSlot[] {
    return [...this.timeSlots];
  }

  // Exporter l'horaire pour Excel
  exportScheduleData(className: string, weekStartDate: string) {
    const schedule = this.getClassWeeklySchedule(className, weekStartDate);
    
    const exportData: any[] = [];
    
    Object.entries(schedule.schedule).forEach(([day, daySchedule]) => {
      daySchedule.forEach(item => {
        exportData.push({
          'Jour': day,
          'Heure': `${item.timeSlot.startTime} - ${item.timeSlot.endTime}`,
          'Matière': item.subjectName,
          'Professeur': item.teacherName,
          'Salle': item.location,
          'Type': this.getCourseTypeLabel(item.courseType),
          'Notes': item.notes || ''
        });
      });
    });

    return exportData;
  }

  private getCourseTypeLabel(type: ClassScheduleItem['courseType']): string {
    const labels = {
      'COURS_MAGISTRAL': 'Cours Magistral',
      'TRAVAUX_PRATIQUES': 'Travaux Pratiques',
      'EXERCICES': 'Exercices',
      'EVALUATION': 'Évaluation'
    };
    return labels[type] || type;
  }
}

export const ScheduleService = new ScheduleServiceClass();

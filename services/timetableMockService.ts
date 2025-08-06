// Service mock pour la gestion des emplois du temps
import { MockDataService } from './mockServices';

export interface TimeSlot {
  id: string;
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  startTime: string; // Format HH:MM
  endTime: string;   // Format HH:MM
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room?: string;
  type: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'EXAM';
}

export interface Timetable {
  id: string;
  classId: string;
  className: string;
  academicYear: string;
  term: 'TRIMESTRE_1' | 'TRIMESTRE_2' | 'TRIMESTRE_3';
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  schedule: TimeSlot[];
  totalHours: number;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  version: number;
}

export interface TimetableStats {
  totalActive: number;
  totalDraft: number;
  totalArchived: number;
  classesCovered: number;
  totalClasses: number;
  totalHours: number;
  conflicts: number;
}

export interface TimetableConflict {
  type: 'TEACHER_OVERLAP' | 'ROOM_OVERLAP' | 'CLASS_OVERLOAD';
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedSlots: {
    day: string;
    time: string;
    subject: string;
    class: string;
    teacher?: string;
    room?: string;
  }[];
}

export class TimetableMockService {
  private static timeSlots: TimeSlot[] = [
    // Lundi - CP1
    {
      id: 'ts-001',
      day: 'MONDAY',
      startTime: '08:00',
      endTime: '09:00',
      subjectId: 'sub-001',
      subjectName: 'Mathématiques',
      teacherId: 'teacher-001',
      teacherName: 'Mme Diallo',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-002',
      day: 'MONDAY',
      startTime: '09:15',
      endTime: '10:15',
      subjectId: 'sub-002',
      subjectName: 'Français',
      teacherId: 'teacher-002',
      teacherName: 'M. Kouassi',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-003',
      day: 'MONDAY',
      startTime: '10:30',
      endTime: '11:30',
      subjectId: 'sub-003',
      subjectName: 'Sciences',
      teacherId: 'teacher-003',
      teacherName: 'Dr Traore',
      room: 'Labo 1',
      type: 'LAB'
    },
    {
      id: 'ts-004',
      day: 'MONDAY',
      startTime: '14:00',
      endTime: '15:00',
      subjectId: 'sub-004',
      subjectName: 'Histoire-Géographie',
      teacherId: 'teacher-004',
      teacherName: 'Mme Keita',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-005',
      day: 'MONDAY',
      startTime: '15:15',
      endTime: '16:15',
      subjectId: 'sub-005',
      subjectName: 'Education Physique',
      teacherId: 'teacher-005',
      teacherName: 'M. Fofana',
      room: 'Terrain de sport',
      type: 'LECTURE'
    },

    // Mardi - CP1
    {
      id: 'ts-006',
      day: 'TUESDAY',
      startTime: '08:00',
      endTime: '09:00',
      subjectId: 'sub-002',
      subjectName: 'Français',
      teacherId: 'teacher-002',
      teacherName: 'M. Kouassi',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-007',
      day: 'TUESDAY',
      startTime: '09:15',
      endTime: '10:15',
      subjectId: 'sub-001',
      subjectName: 'Mathématiques',
      teacherId: 'teacher-001',
      teacherName: 'Mme Diallo',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-008',
      day: 'TUESDAY',
      startTime: '10:30',
      endTime: '11:30',
      subjectId: 'sub-006',
      subjectName: 'Anglais',
      teacherId: 'teacher-006',
      teacherName: 'Miss Johnson',
      room: 'Salle 102',
      type: 'LECTURE'
    },
    {
      id: 'ts-009',
      day: 'TUESDAY',
      startTime: '14:00',
      endTime: '15:00',
      subjectId: 'sub-007',
      subjectName: 'Arts Plastiques',
      teacherId: 'teacher-007',
      teacherName: 'Mme Bamba',
      room: 'Atelier Art',
      type: 'TUTORIAL'
    },

    // Mercredi - CP1
    {
      id: 'ts-010',
      day: 'WEDNESDAY',
      startTime: '08:00',
      endTime: '09:00',
      subjectId: 'sub-001',
      subjectName: 'Mathématiques',
      teacherId: 'teacher-001',
      teacherName: 'Mme Diallo',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-011',
      day: 'WEDNESDAY',
      startTime: '09:15',
      endTime: '10:15',
      subjectId: 'sub-003',
      subjectName: 'Sciences',
      teacherId: 'teacher-003',
      teacherName: 'Dr Traore',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-012',
      day: 'WEDNESDAY',
      startTime: '10:30',
      endTime: '11:30',
      subjectId: 'sub-002',
      subjectName: 'Français',
      teacherId: 'teacher-002',
      teacherName: 'M. Kouassi',
      room: 'Salle 101',
      type: 'LECTURE'
    },

    // Jeudi - CP1
    {
      id: 'ts-013',
      day: 'THURSDAY',
      startTime: '08:00',
      endTime: '09:00',
      subjectId: 'sub-002',
      subjectName: 'Français',
      teacherId: 'teacher-002',
      teacherName: 'M. Kouassi',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-014',
      day: 'THURSDAY',
      startTime: '09:15',
      endTime: '10:15',
      subjectId: 'sub-001',
      subjectName: 'Mathématiques',
      teacherId: 'teacher-001',
      teacherName: 'Mme Diallo',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-015',
      day: 'THURSDAY',
      startTime: '10:30',
      endTime: '11:30',
      subjectId: 'sub-008',
      subjectName: 'Musique',
      teacherId: 'teacher-008',
      teacherName: 'M. Sanogo',
      room: 'Salle de musique',
      type: 'TUTORIAL'
    },
    {
      id: 'ts-016',
      day: 'THURSDAY',
      startTime: '14:00',
      endTime: '15:00',
      subjectId: 'sub-006',
      subjectName: 'Anglais',
      teacherId: 'teacher-006',
      teacherName: 'Miss Johnson',
      room: 'Salle 102',
      type: 'LECTURE'
    },

    // Vendredi - CP1
    {
      id: 'ts-017',
      day: 'FRIDAY',
      startTime: '08:00',
      endTime: '09:00',
      subjectId: 'sub-001',
      subjectName: 'Mathématiques',
      teacherId: 'teacher-001',
      teacherName: 'Mme Diallo',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-018',
      day: 'FRIDAY',
      startTime: '09:15',
      endTime: '10:15',
      subjectId: 'sub-004',
      subjectName: 'Histoire-Géographie',
      teacherId: 'teacher-004',
      teacherName: 'Mme Keita',
      room: 'Salle 101',
      type: 'LECTURE'
    },
    {
      id: 'ts-019',
      day: 'FRIDAY',
      startTime: '10:30',
      endTime: '11:30',
      subjectId: 'sub-005',
      subjectName: 'Education Physique',
      teacherId: 'teacher-005',
      teacherName: 'M. Fofana',
      room: 'Gymnase',
      type: 'LECTURE'
    }
  ];

  private static timetables: Timetable[] = [
    {
      id: 'tt-001',
      classId: 'class-001',
      className: 'CP1 A',
      academicYear: '2024-2025',
      term: 'TRIMESTRE_1',
      status: 'ACTIVE',
      schedule: this.timeSlots.slice(0, 15), // Les 15 premiers créneaux pour CP1
      totalHours: 20,
      createdBy: 'admin-001',
      createdAt: '2024-09-01T00:00:00Z',
      lastModified: '2024-11-15T10:30:00Z',
      version: 3
    },
    {
      id: 'tt-002',
      classId: 'class-002',
      className: 'CP2 B',
      academicYear: '2024-2025',
      term: 'TRIMESTRE_1',
      status: 'ACTIVE',
      schedule: this.generateCP2Schedule(),
      totalHours: 22,
      createdBy: 'admin-001',
      createdAt: '2024-09-01T00:00:00Z',
      lastModified: '2024-11-10T14:20:00Z',
      version: 2
    },
    {
      id: 'tt-003',
      classId: 'class-003',
      className: 'CE1 C',
      academicYear: '2024-2025',
      term: 'TRIMESTRE_1',
      status: 'DRAFT',
      schedule: this.generateCE1Schedule(),
      totalHours: 24,
      createdBy: 'admin-002',
      createdAt: '2024-11-01T00:00:00Z',
      lastModified: '2024-11-20T09:15:00Z',
      version: 1
    },
    {
      id: 'tt-004',
      classId: 'class-004',
      className: 'CE2 A',
      academicYear: '2024-2025',
      term: 'TRIMESTRE_1',
      status: 'ACTIVE',
      schedule: this.generateCE2Schedule(),
      totalHours: 25,
      createdBy: 'admin-001',
      createdAt: '2024-09-01T00:00:00Z',
      lastModified: '2024-11-18T16:45:00Z',
      version: 4
    },
    {
      id: 'tt-005',
      classId: 'class-001',
      className: 'CP1 A',
      academicYear: '2023-2024',
      term: 'TRIMESTRE_3',
      status: 'ARCHIVED',
      schedule: this.timeSlots.slice(0, 15),
      totalHours: 20,
      createdBy: 'admin-001',
      createdAt: '2024-04-01T00:00:00Z',
      lastModified: '2024-06-30T12:00:00Z',
      version: 5
    }
  ];

  // Génération d'emplois du temps pour différentes classes
  private static generateCP2Schedule(): TimeSlot[] {
    return [
      {
        id: 'ts-cp2-001',
        day: 'MONDAY',
        startTime: '08:00',
        endTime: '09:00',
        subjectId: 'sub-001',
        subjectName: 'Mathématiques',
        teacherId: 'teacher-009',
        teacherName: 'M. Coulibaly',
        room: 'Salle 201',
        type: 'LECTURE'
      },
      {
        id: 'ts-cp2-002',
        day: 'MONDAY',
        startTime: '09:15',
        endTime: '10:15',
        subjectId: 'sub-002',
        subjectName: 'Français',
        teacherId: 'teacher-010',
        teacherName: 'Mme Ouattara',
        room: 'Salle 201',
        type: 'LECTURE'
      },
      // Ajoutez plus de créneaux selon le besoin...
    ];
  }

  private static generateCE1Schedule(): TimeSlot[] {
    return [
      {
        id: 'ts-ce1-001',
        day: 'MONDAY',
        startTime: '08:00',
        endTime: '09:00',
        subjectId: 'sub-001',
        subjectName: 'Mathématiques',
        teacherId: 'teacher-011',
        teacherName: 'Mme Sidibe',
        room: 'Salle 301',
        type: 'LECTURE'
      },
      // Ajoutez plus de créneaux selon le besoin...
    ];
  }

  private static generateCE2Schedule(): TimeSlot[] {
    return [
      {
        id: 'ts-ce2-001',
        day: 'MONDAY',
        startTime: '08:00',
        endTime: '09:00',
        subjectId: 'sub-001',
        subjectName: 'Mathématiques',
        teacherId: 'teacher-012',
        teacherName: 'M. Kone',
        room: 'Salle 302',
        type: 'LECTURE'
      },
      // Ajoutez plus de créneaux selon le besoin...
    ];
  }

  // Méthodes publiques
  static getAllTimetables(): Timetable[] {
    return [...this.timetables];
  }

  static getTimetableById(id: string): Timetable | null {
    return this.timetables.find(tt => tt.id === id) || null;
  }

  static getTimetablesByClass(classId: string): Timetable[] {
    return this.timetables.filter(tt => tt.classId === classId);
  }

  static getTimetablesByStatus(status: Timetable['status']): Timetable[] {
    return this.timetables.filter(tt => tt.status === status);
  }

  static getTimetableStats(): TimetableStats {
    const totalActive = this.timetables.filter(tt => tt.status === 'ACTIVE').length;
    const totalDraft = this.timetables.filter(tt => tt.status === 'DRAFT').length;
    const totalArchived = this.timetables.filter(tt => tt.status === 'ARCHIVED').length;
    
    const activeTimetables = this.timetables.filter(tt => tt.status === 'ACTIVE');
    const classesCovered = new Set(activeTimetables.map(tt => tt.classId)).size;
    const totalClasses = MockDataService.classes.getAll().length;
    
    const totalHours = activeTimetables.reduce((sum, tt) => sum + tt.totalHours, 0);
    
    return {
      totalActive,
      totalDraft,
      totalArchived,
      classesCovered,
      totalClasses,
      totalHours,
      conflicts: this.getConflicts().length
    };
  }

  static createTimetable(timetableData: Omit<Timetable, 'id' | 'createdAt' | 'lastModified' | 'version'>): Timetable {
    const newTimetable: Timetable = {
      ...timetableData,
      id: `tt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 1
    };
    
    this.timetables.push(newTimetable);
    return newTimetable;
  }

  static updateTimetable(id: string, updates: Partial<Timetable>): Timetable | null {
    const index = this.timetables.findIndex(tt => tt.id === id);
    if (index === -1) return null;
    
    this.timetables[index] = {
      ...this.timetables[index],
      ...updates,
      lastModified: new Date().toISOString(),
      version: this.timetables[index].version + 1
    };
    
    return this.timetables[index];
  }

  static deleteTimetable(id: string): boolean {
    const index = this.timetables.findIndex(tt => tt.id === id);
    if (index === -1) return false;
    
    this.timetables.splice(index, 1);
    return true;
  }

  static duplicateTimetable(id: string): Timetable | null {
    const original = this.getTimetableById(id);
    if (!original) return null;
    
    const duplicate = this.createTimetable({
      ...original,
      className: `${original.className} (Copie)`,
      status: 'DRAFT',
      createdBy: 'current-user'
    });
    
    return duplicate;
  }

  static getConflicts(): TimetableConflict[] {
    const conflicts: TimetableConflict[] = [];
    const activeTimetables = this.timetables.filter(tt => tt.status === 'ACTIVE');
    
    // Détecter les conflits de professeurs
    const teacherSchedule = new Map<string, { day: string; time: string; class: string; subject: string }[]>();
    
    activeTimetables.forEach(timetable => {
      timetable.schedule.forEach(slot => {
        if (!teacherSchedule.has(slot.teacherId)) {
          teacherSchedule.set(slot.teacherId, []);
        }
        teacherSchedule.get(slot.teacherId)!.push({
          day: slot.day,
          time: `${slot.startTime}-${slot.endTime}`,
          class: timetable.className,
          subject: slot.subjectName
        });
      });
    });
    
    // Vérifier les conflits de professeurs
    teacherSchedule.forEach((schedule, teacherId) => {
      const timeSlots = new Map<string, typeof schedule>();
      
      schedule.forEach(slot => {
        const timeKey = `${slot.day}-${slot.time}`;
        if (!timeSlots.has(timeKey)) {
          timeSlots.set(timeKey, []);
        }
        timeSlots.get(timeKey)!.push(slot);
      });
      
      timeSlots.forEach((slots, timeKey) => {
        if (slots.length > 1) {
          const teacherName = this.timeSlots.find(ts => ts.teacherId === teacherId)?.teacherName || 'Enseignant inconnu';
          conflicts.push({
            type: 'TEACHER_OVERLAP',
            description: `${teacherName} a des cours simultanés`,
            severity: 'HIGH',
            affectedSlots: slots.map(slot => ({
              day: this.translateDay(slot.day),
              time: slot.time,
              subject: slot.subject,
              class: slot.class,
              teacher: teacherName
            }))
          });
        }
      });
    });
    
    // Détecter les conflits de salles
    const roomSchedule = new Map<string, { day: string; time: string; class: string; subject: string }[]>();
    
    activeTimetables.forEach(timetable => {
      timetable.schedule.forEach(slot => {
        if (slot.room) {
          if (!roomSchedule.has(slot.room)) {
            roomSchedule.set(slot.room, []);
          }
          roomSchedule.get(slot.room)!.push({
            day: slot.day,
            time: `${slot.startTime}-${slot.endTime}`,
            class: timetable.className,
            subject: slot.subjectName
          });
        }
      });
    });
    
    roomSchedule.forEach((schedule, room) => {
      const timeSlots = new Map<string, typeof schedule>();
      
      schedule.forEach(slot => {
        const timeKey = `${slot.day}-${slot.time}`;
        if (!timeSlots.has(timeKey)) {
          timeSlots.set(timeKey, []);
        }
        timeSlots.get(timeKey)!.push(slot);
      });
      
      timeSlots.forEach((slots, timeKey) => {
        if (slots.length > 1) {
          conflicts.push({
            type: 'ROOM_OVERLAP',
            description: `La salle ${room} est occupée par plusieurs classes`,
            severity: 'MEDIUM',
            affectedSlots: slots.map(slot => ({
              day: this.translateDay(slot.day),
              time: slot.time,
              subject: slot.subject,
              class: slot.class,
              room: room
            }))
          });
        }
      });
    });
    
    return conflicts;
  }

  private static translateDay(day: string): string {
    const translations = {
      'MONDAY': 'Lundi',
      'TUESDAY': 'Mardi',
      'WEDNESDAY': 'Mercredi',
      'THURSDAY': 'Jeudi',
      'FRIDAY': 'Vendredi',
      'SATURDAY': 'Samedi'
    };
    return translations[day as keyof typeof translations] || day;
  }

  static getAvailableTimeSlots(): string[] {
    return [
      '08:00-09:00',
      '09:15-10:15',
      '10:30-11:30',
      '11:45-12:45',
      '14:00-15:00',
      '15:15-16:15',
      '16:30-17:30'
    ];
  }

  static getDays(): string[] {
    return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  }

  // Formater les données pour l'affichage
  static formatTimeSlot(slot: TimeSlot): string {
    return `${slot.startTime} - ${slot.endTime}`;
  }

  static formatCurrency(amount: number): string {
    return MockDataService.formatCurrency(amount);
  }

  static formatDate(date: string): string {
    return MockDataService.formatDate(date);
  }
}

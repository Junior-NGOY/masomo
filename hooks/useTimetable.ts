import { useState, useEffect } from 'react';

export interface TimetableSlot {
    id: string;
    day: number;
    startTime: string;
    endTime: string;
    subjectId: string;
    subject: string;
    teacherId: string | null;
    teacher: string;
    roomId: string | null;
    type: string | null;
}

export interface Timetable {
    id: string;
    classId: string;
    className: string;
    academicYear: string;
    term: string;
    status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
    lastModified: string;
    totalHours: number;
    schedule: TimetableSlot[];
}

export interface TimetableStats {
    totalActive: number;
    classesCovered: number;
    totalClasses: number;
    totalHours: number;
    conflicts: number;
}

export function useTimetable() {
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [stats, setStats] = useState<TimetableStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimetables = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/timetables`);
                if (!response.ok) {
                    throw new Error('Failed to fetch timetables');
                }
                const result = await response.json();
                const data: Timetable[] = result.data;

                setTimetables(data);

                // Calculate stats
                const activeTimetables = data.filter(t => t.status === 'ACTIVE');
                const uniqueClasses = new Set(activeTimetables.map(t => t.classId));
                const totalHours = activeTimetables.reduce((sum, t) => sum + t.totalHours, 0);

                setStats({
                    totalActive: activeTimetables.length,
                    classesCovered: uniqueClasses.size,
                    totalClasses: 12, // Placeholder or fetch from classes API
                    totalHours,
                    conflicts: 0 // Placeholder
                });

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Timetable fetch error:', err);
                // Set empty data on error to prevent UI crashes
                setTimetables([]);
                setStats({
                    totalActive: 0,
                    classesCovered: 0,
                    totalClasses: 0,
                    totalHours: 0,
                    conflicts: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTimetables();
    }, []);

    const deleteTimetable = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/timetables/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete timetable');
            
            setTimetables(prev => prev.filter(t => t.id !== id));
            return true;
        } catch (err) {
            console.error('Delete error:', err);
            return false;
        }
    };

    const duplicateTimetable = async (id: string) => {
        // Since backend might not support duplicate yet, we'll implement a client-side duplicate then create
        try {
            const original = timetables.find(t => t.id === id);
            if (!original) return null;

            const { id: _, ...rest } = original;
            const newTimetable = {
                ...rest,
                className: `${original.className} (Copie)`,
                status: 'DRAFT',
                academicYear: original.academicYear // Ensure required fields are present
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/timetables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTimetable)
            });

            if (!response.ok) throw new Error('Failed to duplicate timetable');
            
            const created = await response.json();
            setTimetables(prev => [...prev, created.data]);
            return created.data;
        } catch (err) {
            console.error('Duplicate error:', err);
            return null;
        }
    };

    return { timetables, stats, loading, error, deleteTimetable, duplicateTimetable };
}

export interface TimetableConflict {
    id: string;
    type: 'TEACHER' | 'ROOM' | 'CLASS';
    description: string;
    details: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    affectedClass?: string;
    affectedTeacher?: string;
    day: number;
    time: string;
}

export function useTimetableConflicts() {
    const [conflicts, setConflicts] = useState<TimetableConflict[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConflicts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/timetables/conflicts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch conflicts');
                }
                const result = await response.json();
                setConflicts(result.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Conflicts fetch error:', err);
                setConflicts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchConflicts();
    }, []);

    return { conflicts, loading, error };
}

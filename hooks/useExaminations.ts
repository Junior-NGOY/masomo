import { useState, useEffect } from 'react';
import { useClasses } from './useClasses';
import { useSubjects } from './useSubjects';
import { useUserSession } from "@/store/auth";

export interface Exam {
    id: string;
    name: string;
    description: string | null;
    type: string;
    startDate: string;
    endDate: string;
    classIds: string[];
    subjectIds: string[];
    totalMarks: number;
    passingMarks: number;
    status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    className?: string; // Derived from classIds
    subject?: string; // Derived from subjectIds
    location?: string; // Not in schema, maybe use description or add field
    time?: string; // Derived from startDate
    duration?: number; // Derived from start/end
}

export function useExaminations() {
    const [examinations, setExaminations] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useUserSession((state) => state.user);
    const schoolId = user?.schoolId;

    const { classes, loading: classesLoading } = useClasses();
    const { subjects, loading: subjectsLoading } = useSubjects();

    useEffect(() => {
        const fetchExaminations = async () => {
            if (!schoolId) return;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/exams?schoolId=${schoolId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch examinations');
                }
                const result = await response.json();
                const data = result.data;

                // Transform data to match UI needs
                const formattedExams = data.map((exam: any) => {
                    const start = new Date(exam.startDate);
                    const end = new Date(exam.endDate);
                    const now = new Date();
                    
                    let status = 'SCHEDULED';
                    if (now > end) status = 'COMPLETED';
                    else if (now >= start && now <= end) status = 'ONGOING';
                    else if (now < start) status = 'SCHEDULED';

                    // Calculate duration in minutes
                    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

                    // Map class IDs to names
                    const classNames = exam.classIds?.map((id: string) => {
                        // Try to find in classes (Levels)
                        const cls = classes.find(c => c.id === id);
                        if (cls) return cls.title;

                        // Try to find in streams (Sections)
                        for (const c of classes) {
                            // Ensure streams exists and is an array
                            if (Array.isArray(c.streams)) {
                                const stream = c.streams.find(s => s.id === id);
                                if (stream) {
                                    return `${c.title} ${stream.title}`;
                                }
                            }
                        }
                        
                        return id;
                    }) || [];
                    
                    // Map subject IDs to names
                    const subjectNames = exam.subjectIds?.map((id: string) => {
                        const sub = subjects.find(s => s.id === id);
                        return sub ? sub.name : id;
                    }) || [];

                    return {
                        ...exam,
                        status,
                        className: classNames.length > 0 ? classNames.join(', ') : 'N/A',
                        subject: subjectNames.length > 0 ? subjectNames.join(', ') : 'General',
                        location: 'Main Hall', // Placeholder
                        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        duration
                    };
                });

                setExaminations(formattedExams);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (!classesLoading && !subjectsLoading) {
            fetchExaminations();
        }
    }, [classesLoading, subjectsLoading, classes, subjects, schoolId]);

    return { examinations, loading: loading || classesLoading || subjectsLoading, error };
}

import { useState, useEffect } from 'react';

export interface StudentAttendance {
    id: string;
    studentId: string;
    studentName: string;
    className: string;
    date: string;
    status: string;
    subject: string;
    timeIn: string | null;
    timeOut: string | null;
    notes: string | null;
}

export function useStudentAttendance() {
    const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/students/attendance`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student attendance');
                }
                const data = await response.json();
                setAttendance(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    return { attendance, loading, error };
}

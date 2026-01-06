import { useState, useEffect } from 'react';
import { Teacher } from '@/types/types';
import { useUserSession } from "@/store/auth";

export function useTeachers() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useUserSession((state) => state.user);
    const schoolId = user?.schoolId;

    useEffect(() => {
        const fetchTeachers = async () => {
            if (!schoolId) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/teachers?schoolId=${schoolId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();
                
                // Deduplicate teachers by ID
                const uniqueTeachers = Array.from(
                    new Map(data.map((item: Teacher) => [item.id, item])).values()
                ) as Teacher[];
                
                setTeachers(uniqueTeachers);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [schoolId]);

    return { teachers, loading, error };
}

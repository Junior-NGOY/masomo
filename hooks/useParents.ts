import { useState, useEffect } from 'react';
import { Parent } from '@/types/types';
import useSchoolStore from '@/store/school';

export function useParents() {
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { school } = useSchoolStore();

    useEffect(() => {
        const fetchParents = async () => {
            if (!school?.id) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/parents?schoolId=${school.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch parents');
                }
                const result = await response.json();
                setParents(result.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchParents();
    }, [school?.id]);

    return { parents, loading, error };
}

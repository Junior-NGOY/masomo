import { useState, useEffect } from 'react';
import { Parent } from '@/types/types';

export function useParents() {
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/parents`);
                if (!response.ok) {
                    throw new Error('Failed to fetch parents');
                }
                const data = await response.json();
                setParents(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchParents();
    }, []);

    return { parents, loading, error };
}

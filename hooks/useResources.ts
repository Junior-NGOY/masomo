import { useState, useEffect } from 'react';
import { useUserSession } from "@/store/auth";

export interface Resource {
  id: string;
  name: string;
  type: string;
  category: string | null;
  quantity: number;
  available: number;
  location: string | null;
  condition: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceStats {
  totalResources: number;
  totalQuantity: number;
  totalAvailable: number;
  byType: Array<{ type: string; count: number }>;
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchResources = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/resources?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const result = await response.json();
        const data = result.data || [];
        
        // Deduplicate resources by ID
        const uniqueResources = Array.from(
          new Map(data.map((item: Resource) => [item.id, item])).values()
        ) as Resource[];
        
        setResources(uniqueResources);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Resources fetch error:', err);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [schoolId]);

  return { resources, loading, error };
}

export function useResourceStats() {
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchStats = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/resources/stats?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resource stats');
        }
        const result = await response.json();
        setStats(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Resource stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [schoolId]);

  return { stats, loading, error };
}

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/resources`);
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
  }, []);

  return { resources, loading, error };
}

export function useResourceStats() {
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/resources/stats`);
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
  }, []);

  return { stats, loading, error };
}

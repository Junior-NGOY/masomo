import { useState, useEffect } from 'react';
import { useUserSession } from "@/store/auth";

export interface Department {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  // Add other fields as needed based on API response
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/departments?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [schoolId]);

  return { departments, loading, error };
}

export function useBriefDepartments() {
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/departments/brief?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch brief departments');
        }
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [schoolId]);

  return { departments, loading, error };
}

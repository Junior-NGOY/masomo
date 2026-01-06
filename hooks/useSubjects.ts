import { useState, useEffect } from 'react';
import { SubjectCategory, SubjectType } from "@/types/types";
import { useUserSession } from "@/store/auth";

export interface Subject {
  id: string;
  name: string;
  slug: string;
  code: string;
  shortName?: string;
  description?: string;
  category: SubjectCategory;
  type: SubjectType;
  passingMarks: number;
  totalMarks: number;
  departmentId: string;
  departmentName: string;
  isActive: boolean;
  isOptional: boolean;
  hasTheory: boolean;
  hasPractical: boolean;
  labRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/subjects?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await response.json();
        setSubjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [schoolId]);

  return { subjects, loading, error };
}

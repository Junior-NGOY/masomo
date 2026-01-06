import { useState, useEffect } from 'react';
import { useUserSession } from "@/store/auth";

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  subjectId: string;
  subjectName: string;
  examId: string;
  examName: string;
  examType: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  academicYearId: string;
  academicYearName: string;
  gradedBy?: string;
  gradedAt?: string;
  createdAt: string;
}

export interface GradeStats {
  totalGrades: number;
  averagePercentage: number;
  gradeDistribution: Array<{ grade: string; count: number }>;
  topPerformersCount: number;
}

export function useStudentGrades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchGrades = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/grades?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch grades');
        }
        const result = await response.json();
        
        // Map the API response to match the Grade interface
        const mappedGrades = (result.data || []).map((grade: any) => ({
          id: grade.id,
          studentId: grade.studentId,
          studentName: grade.student ? `${grade.student.firstName} ${grade.student.lastName}` : '',
          className: grade.student?.classTitle || '',
          subjectId: grade.subjectId,
          subjectName: grade.subject?.name || '',
          examId: grade.examId,
          examName: grade.exam?.name || '',
          examType: grade.exam?.type || '',
          marks: grade.marks,
          totalMarks: grade.totalMarks,
          percentage: grade.percentage,
          grade: grade.grade,
          remarks: grade.remarks,
          academicYearId: grade.academicYearId,
          academicYearName: grade.academicYear?.name || '',
          gradedBy: grade.gradedBy,
          gradedAt: grade.gradedAt,
          createdAt: grade.createdAt,
        }));
        
        setGrades(mappedGrades);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [schoolId]);

  return { grades, loading, error };
}

export function useGradeStats() {
  const [stats, setStats] = useState<GradeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchStats = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/grades/stats?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch grade stats');
        }
        const result = await response.json();
        setStats(result.data || result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [schoolId]);

  return { stats, loading, error };
}

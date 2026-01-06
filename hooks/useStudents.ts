import { useState, useEffect } from "react";
import { Student } from "@/types/types";
import { useUserSession } from "@/store/auth";

export interface StudentStats {
  totalStudents: number;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  overdueFees: number;
  attendanceRate: number;
  activeIDs: number;
  lostOrDamagedIDs: number;
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchStudents = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
          }/api/v1/students?schoolId=${schoolId}`
        );
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || "Failed to fetch students");
        }
        try {
          const data = JSON.parse(text);
          setStudents(data);
        } catch (e) {
          console.error("Failed to parse JSON:", text);
          throw new Error("Invalid JSON response from server");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      setLoading(true);
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [schoolId]);

  return { students, loading, error };
}

export function useStudentStats() {
  const [stats, setStats] = useState<StudentStats | null>({
    totalStudents: 0,
    totalFees: 0,
    paidFees: 0,
    pendingFees: 0,
    overdueFees: 0,
    attendanceRate: 0,
    activeIDs: 0,
    lostOrDamagedIDs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchStats = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
          }/api/v1/students/stats?schoolId=${schoolId}`
        );
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || "Failed to fetch student stats");
        }
        try {
          const data = JSON.parse(text);
          // Ensure all numeric fields are numbers, not undefined
          setStats({
            totalStudents: data.totalStudents ?? 0,
            totalFees: data.totalFees ?? 0,
            paidFees: data.paidFees ?? 0,
            pendingFees: data.pendingFees ?? 0,
            overdueFees: data.overdueFees ?? 0,
            attendanceRate: data.attendanceRate ?? 0,
            activeIDs: data.activeIDs ?? 0,
            lostOrDamagedIDs: data.lostOrDamagedIDs ?? 0,
          });
        } catch (e) {
          console.error("Failed to parse JSON:", text);
          throw new Error("Invalid JSON response from server");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [schoolId]);

  return { stats, loading, error };
}

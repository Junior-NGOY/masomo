import { useState, useEffect } from 'react';
import { useUserSession } from "@/store/auth";

export interface Leave {
  id: string;
  teacherId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  teacher: {
    firstName: string;
    lastName: string;
    email: string;
    departmentName: string | null;
  };
}

export interface Payroll {
  id: string;
  teacherId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
  paidDate: string | null;
  paymentMethod: string | null;
  teacher: {
    firstName: string;
    lastName: string;
    email: string;
    departmentName: string | null;
    designation: string;
  };
}

export interface Performance {
  id: string;
  teacherId: string;
  period: string;
  year: number;
  rating: number;
  strengths: string | null;
  improvements: string | null;
  goals: string | null;
  comments: string | null;
  reviewedBy: string;
  reviewDate: string;
  teacher: {
    firstName: string;
    lastName: string;
    email: string;
    departmentName: string | null;
    designation: string;
  };
}

export interface StaffStats {
  totalTeachers: number;
  activeTeachers: number;
  pendingLeaves: number;
  processedPayrolls: number;
}

export function useLeaveRequests() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchLeaves = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/staff/leaves?schoolId=${schoolId}`);
        if (!response.ok) throw new Error('Failed to fetch leave requests');
        const result = await response.json();
        setLeaves(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Leave requests fetch error:', err);
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [schoolId]);

  return { leaves, loading, error };
}

export function usePayrollRecords() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchPayrolls = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/staff/payroll?schoolId=${schoolId}`);
        if (!response.ok) throw new Error('Failed to fetch payroll records');
        const result = await response.json();
        setPayrolls(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Payroll records fetch error:', err);
        setPayrolls([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayrolls();
  }, [schoolId]);

  return { payrolls, loading, error };
}

export function usePerformanceReviews() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchPerformances = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/staff/performance?schoolId=${schoolId}`);
        if (!response.ok) throw new Error('Failed to fetch performance reviews');
        const result = await response.json();
        setPerformances(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Performance reviews fetch error:', err);
        setPerformances([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformances();
  }, [schoolId]);

  return { performances, loading, error };
}

export function useStaffStats() {
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchStats = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/staff/stats?schoolId=${schoolId}`);
        if (!response.ok) throw new Error('Failed to fetch staff stats');
        const result = await response.json();
        setStats(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Staff stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [schoolId]);

  return { stats, loading, error };
}

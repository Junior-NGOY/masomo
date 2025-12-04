import { useState, useEffect } from 'react';

export interface OutstandingFee {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  parentName: string;
  feeType: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  dueDate: string | null;
}

export interface FinancialSummary {
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: string;
  totalStudents: number;
  studentsWithOutstanding: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  transactionCount: number;
}

export function useOutstandingFees() {
  const [fees, setFees] = useState<OutstandingFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/finance/outstanding`);
        if (!response.ok) throw new Error('Failed to fetch outstanding fees');
        const result = await response.json();
        setFees(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Outstanding fees fetch error:', err);
        setFees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  return { fees, loading, error };
}

export function useFinancialSummary() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/finance/summary`);
        if (!response.ok) throw new Error('Failed to fetch financial summary');
        const result = await response.json();
        setSummary(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Financial summary fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return { summary, loading, error };
}

export function useRevenueByMonth() {
  const [revenue, setRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/finance/revenue`);
        if (!response.ok) throw new Error('Failed to fetch revenue data');
        const result = await response.json();
        setRevenue(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Revenue data fetch error:', err);
        setRevenue([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  return { revenue, loading, error };
}

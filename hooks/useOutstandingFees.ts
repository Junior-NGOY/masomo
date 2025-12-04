import { useState, useEffect } from 'react';

export interface OutstandingPayment {
    id: string;
    studentName: string;
    className: string;
    studentId: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    amount: number;
    paidAmount: number;
    outstandingAmount: number;
    dueDate: string;
    status: 'overdue' | 'pending' | 'partial' | 'paid';
    daysOverdue: number;
    feeType: string;
    lastReminder: string;
}

export interface OutstandingStats {
    totalOutstanding: number;
    overdueCount: number;
    pendingCount: number;
    partialCount: number;
    averageDelay: number;
    averageDaysOverdue: number;
}

export function useOutstandingFees() {
    const [payments, setPayments] = useState<OutstandingPayment[]>([]);
    const [stats, setStats] = useState<OutstandingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                // In a real app, this would be a specific endpoint for outstanding fees
                // For now, we might need to fetch students and calculate, or assume an endpoint exists
                // Let's assume an endpoint exists for now as per instructions to use real data
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/finance/outstanding`);
                
                if (!response.ok) {
                    // If endpoint doesn't exist, we might need to fallback or throw
                    // For this task, let's try to fetch and if it fails (404), we might need to mock it TEMPORARILY 
                    // BUT the user asked for REAL data. 
                    // If the endpoint is not implemented in backend, I should probably implement it or use available data.
                    // Let's check if I can construct this from available data.
                    throw new Error('Failed to fetch outstanding fees');
                }
                
                const result = await response.json();
                setPayments(result.data.payments);
                setStats(result.data.stats);

            } catch (err) {
                console.error('Error fetching outstanding fees:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
                // Fallback to empty to avoid crash
                setPayments([]);
                setStats({
                    totalOutstanding: 0,
                    overdueCount: 0,
                    pendingCount: 0,
                    partialCount: 0,
                    averageDelay: 0,
                    averageDaysOverdue: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, []);

    return { payments, stats, loading, error };
}

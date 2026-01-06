import { useState, useEffect } from 'react';
import { useUserSession } from "@/store/auth";

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
    const user = useUserSession((state) => state.user);
    const schoolId = user?.schoolId;

    useEffect(() => {
        const fetchFees = async () => {
            if (!schoolId) return;
            
            try {
                const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/finance/outstanding?schoolId=${schoolId}`;
                console.log('Fetching outstanding fees from:', url);
                const response = await fetch(url);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Fetch failed: ${response.status} ${response.statusText}`, errorText);
                    throw new Error(`Failed to fetch outstanding fees: ${response.status} ${response.statusText}`);
                }
                
                const result = await response.json();
                setPayments(result.data.payments || []);
                setStats(result.data.stats || null);

            } catch (err) {
                console.error('Error fetching outstanding fees:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
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
    }, [schoolId]);

    return { payments, stats, loading, error };
}

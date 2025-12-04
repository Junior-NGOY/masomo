import { useState, useEffect } from 'react';

export interface StudentFee {
    id: string;
    studentId: string;
    studentName: string;
    className: string;
    feeType: string;
    amount: number;
    paidAmount?: number;
    remainingAmount?: number;
    dueDate: string;
    paidDate?: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
    receiptNo?: string;
    paymentMethod?: string;
    notes?: string;
}

export function useStudentFees() {
    const [fees, setFees] = useState<StudentFee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/students/fees`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student fees');
                }
                const data = await response.json();
                setFees(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, []);

    return { fees, loading, error };
}

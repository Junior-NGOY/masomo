import { useState, useEffect } from 'react';

export interface StudentIDCard {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  idNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'LOST' | 'DAMAGED';
  photoUrl: string;
  qrCode?: string;
  notes?: string;
  parentContact: string;
  emergencyContact: string;
}

export function useStudentIDCards() {
  const [idCards, setIDCards] = useState<StudentIDCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIDCards = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/students/id-cards`);
        if (!response.ok) {
          throw new Error('Failed to fetch ID cards');
        }
        const data = await response.json();
        setIDCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIDCards();
  }, []);

  return { idCards, loading, error };
}

import { useState, useEffect } from 'react';
import { useUserSession } from "@/store/auth";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  targetAudience: string;
  publishedBy: string;
  publishDate: string;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/announcements?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const result = await response.json();
        setAnnouncements(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Announcements fetch error:', err);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [schoolId]);

  return { announcements, loading, error };
}

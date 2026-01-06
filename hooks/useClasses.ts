import { useState, useEffect } from "react";
import { useUserSession } from "@/store/auth";

export interface Stream {
  id: string;
  title: string;
  slug: string;
  classId: string;
  _count: {
    students: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  title: string;
  slug: string;
  streams: Stream[];
  _count: {
    students: number;
  };
  createdAt: string;
  updatedAt: string;
}

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchClasses = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
          }/api/v1/classes?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [schoolId]);

  return { classes, loading, error };
}

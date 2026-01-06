import { useState, useEffect } from 'react';
import { useUserSession } from "@/store/auth";
import { getDashboardStats, DashboardStats } from "@/actions/dashboard";

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const user = useUserSession((state) => state.user);
    const schoolId = user?.schoolId;

    const emptyStats: DashboardStats = {
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalSubjects: 0,
        totalParents: 0,
        activeClasses: 0,
        pendingFees: 0,
        monthlyRevenue: 0,
        monthlyData: [],
        classPerformance: [],
        academicPerformance: {
            averageGrade: 0,
            passRate: 0,
            attendanceRate: 0,
        },
        upcomingClasses: [],
    };

    useEffect(() => {
        const fetchStats = async () => {
            if (!schoolId) {
                setStats(emptyStats);
                setError(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const data = await getDashboardStats(schoolId);
                setStats(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
                setStats(emptyStats);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [schoolId]);

    return { stats, loading, error };
}

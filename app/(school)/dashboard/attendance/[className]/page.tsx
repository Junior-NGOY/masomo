import DailyAttendancePageSimple from "@/components/DailyAttendancePageSimple";

interface AttendancePageProps {
  params: Promise<{
    className: string;
  }>;
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function AttendancePage({ params, searchParams }: AttendancePageProps) {
  const { className } = await params;
  const { date } = await searchParams;

  return (
    <DailyAttendancePageSimple 
      className={decodeURIComponent(className)} 
      date={date}
    />
  );
}

export async function generateMetadata({ params }: AttendancePageProps) {
  const { className } = await params;
  
  return {
    title: `Présence - ${decodeURIComponent(className)} | Masomo Pro`,
    description: `Gérer la présence quotidienne pour la classe ${decodeURIComponent(className)}`,
  };
}

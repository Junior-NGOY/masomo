"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Award,
  Calendar 
} from "lucide-react";
import { ClassPerformance, DashboardMockDataService } from "@/services/dashboardMockData";

// Composant Progress simple intégré
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

interface ClassPerformanceCardProps {
  classes?: ClassPerformance[];
}

export default function ClassPerformanceCard({ classes }: ClassPerformanceCardProps) {
  const classData = classes || DashboardMockDataService.getClassPerformance();

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return "text-green-600";
    if (grade >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return "bg-green-500";
    if (attendance >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance des Classes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {classData.map((classItem, index) => (
          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{classItem.className}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {classItem.students} élèves
                  </span>
                </div>
              </div>
              <Badge variant="outline" className={getGradeColor(classItem.averageGrade)}>
                <Award className="h-3 w-3 mr-1" />
                {classItem.averageGrade}%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Présence</span>
                <span className="font-medium">{classItem.attendance}%</span>
              </div>
              <Progress 
                value={classItem.attendance} 
                className="h-2"
                // className={`h-2 ${getAttendanceColor(classItem.attendance)}`}
              />
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Voir toutes les classes →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

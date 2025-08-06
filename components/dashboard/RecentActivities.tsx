"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  CreditCard, 
  GraduationCap, 
  Calendar,
  Clock 
} from "lucide-react";
import { RecentActivity, DashboardMockDataService } from "@/services/dashboardMockData";
import { getInitials } from "@/lib/getInitials";

const activityIcons = {
  enrollment: UserPlus,
  payment: CreditCard,
  grade: GraduationCap,
  attendance: Calendar
};

const activityColors = {
  enrollment: "bg-blue-100 text-blue-800",
  payment: "bg-green-100 text-green-800",
  grade: "bg-purple-100 text-purple-800",
  attendance: "bg-orange-100 text-orange-800"
};

interface RecentActivitiesProps {
  activities?: RecentActivity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const recentActivities = activities || DashboardMockDataService.getRecentActivities();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activités Récentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.message}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Par {activity.user}
                  </p>
                  <p className="text-xs text-gray-400">
                    {DashboardMockDataService.getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="pt-4 border-t">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Voir toutes les activités →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

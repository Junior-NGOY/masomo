import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Trophy } from "lucide-react";
import { TopPerformer, DashboardMockDataService } from "@/services/dashboardMockData";
import { getInitials } from "@/lib/getInitials";

interface TopPerformersProps {
  performers?: TopPerformer[];
}

export default function TopPerformers({ performers }: TopPerformersProps) {
  const topPerformers = performers || DashboardMockDataService.getTopPerformers();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 1:
        return <Trophy className="h-4 w-4 text-gray-400" />;
      case 2:
        return <Star className="h-4 w-4 text-orange-500" />;
      default:
        return <span className="text-sm font-bold text-gray-600">#{index + 1}</span>;
    }
  };

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 1:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Performances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPerformers.map((performer, index) => (
          <div key={performer.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-center w-8 h-8">
              {getRankIcon(index)}
            </div>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={performer.avatar} alt={performer.name} />
              <AvatarFallback>{getInitials(performer.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {performer.name}
              </p>
              <p className="text-xs text-gray-500">
                {performer.className}
              </p>
            </div>
            
            <Badge 
              variant="outline" 
              className={getRankBadgeColor(index)}
            >
              {performer.grade}%
            </Badge>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Voir le classement complet →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

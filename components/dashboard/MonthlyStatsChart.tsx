import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { MonthlyData, DashboardMockDataService } from "@/services/dashboardMockData";

interface MonthlyStatsChartProps {
  data?: MonthlyData[];
}

export default function MonthlyStatsChart({ data }: MonthlyStatsChartProps) {
  const monthlyData = (data || DashboardMockDataService.getMonthlyData()) || [];
  
  // Calculer les valeurs max pour la normalisation
  const maxStudents = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d?.students || 0)) : 1;
  const maxRevenue = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d?.revenue || 0)) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Évolution Mensuelle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Graphique simple avec des barres CSS */}
          <div className="grid grid-cols-6 gap-2 h-32">
            {monthlyData.map((month, index) => {
              if (!month) return null;
              const studentHeight = (month.students / maxStudents) * 100;
              const revenueHeight = (month.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="flex-1 flex items-end justify-center gap-1 w-full">
                    <div
                      className="bg-blue-500 w-3 rounded-t"
                      style={{ height: `${studentHeight}%` }}
                      title={`${month.students} étudiants`}
                    />
                    <div
                      className="bg-green-500 w-3 rounded-t"
                      style={{ height: `${revenueHeight}%` }}
                      title={DashboardMockDataService.formatCurrency(month.revenue)}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{month.month}</span>
                </div>
              );
            })}
          </div>
          
          {/* Légende */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Étudiants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600">Revenus</span>
            </div>
          </div>
          
          {/* Statistiques rapides */}
          {monthlyData.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  +{monthlyData[monthlyData.length - 1].students - monthlyData[0].students}
                </div>
                <div className="text-xs text-gray-600">Nouveaux étudiants</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  +{monthlyData[0].revenue > 0 ? Math.round(((monthlyData[monthlyData.length - 1].revenue - monthlyData[0].revenue) / monthlyData[0].revenue) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-600">Croissance revenus</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

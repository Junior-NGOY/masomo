"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User,
  TrendingUp,
  Search,
  Filter,
  Download,
  Star,
  Award,
  Calendar,
  Target,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  Eye,
  PieChart,
  LineChart,
  FileText
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { usePerformanceReviews } from "@/hooks/useStaff";

export default function PerformancePage() {
  const { performances, loading } = usePerformanceReviews();
  const [selectedDepartment, setSelectedDepartment] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedPerformance, setSelectedPerformance] = React.useState<any | null>(null);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Filtrage
  const filteredPerformances = performances.filter(p => {
    const matchesDepartment = selectedDepartment === "all" || (p.teacher.departmentName || '') === selectedDepartment;
    const matchesSearch = p.teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.teacher.departmentName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesSearch;
  });

  // Statistiques globales
  const averageScore = filteredPerformances.reduce((sum, p) => sum + p.rating, 0) / (filteredPerformances.length || 1);
  const highPerformers = filteredPerformances.filter(p => p.rating >= 4.5).length;

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance du Personnel</h1>
          <p className="text-gray-600 mt-1">Évaluation et suivi des performances</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Score Moyen"
          value={`${averageScore.toFixed(1)}/5`}
          description="Performance globale"
          icon={TrendingUp}
          className="border-blue-200"
        />
        <StatsCard
          title="Excellents Performeurs"
          value={`${highPerformers}`}
          description="Note ≥ 4.5"
          icon={Award}
          className="border-green-200"
        />
        <StatsCard
          title="Total Évaluations"
          value={filteredPerformances.length.toString()}
          description="Cette période"
          icon={FileText}
          className="border-purple-200"
        />
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="individual">Performance Individuelle</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meilleures Performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPerformances
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map((p, index) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-100 text-blue-800`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{p.teacher.firstName} {p.teacher.lastName}</div>
                          <div className="text-sm text-gray-600">{p.teacher.departmentName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(p.rating)}`}>{p.rating}/5</span>
                        {getRatingStars(p.rating)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance individuelle */}
        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Évaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Points Forts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPerformances.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium">{p.teacher.firstName} {p.teacher.lastName}</div>
                        <div className="text-sm text-gray-500">{p.teacher.designation}</div>
                      </TableCell>
                      <TableCell>{p.teacher.departmentName || 'N/A'}</TableCell>
                      <TableCell>{p.period} {p.year}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={`font-bold ${getScoreColor(p.rating)}`}>{p.rating}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{p.strengths}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPerformance(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Détails */}
      {selectedPerformance && (
        <Dialog open={!!selectedPerformance} onOpenChange={() => setSelectedPerformance(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'évaluation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Enseignant</h4>
                  <p>{selectedPerformance.teacher.firstName} {selectedPerformance.teacher.lastName}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Période</h4>
                  <p>{selectedPerformance.period} {selectedPerformance.year}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Note</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{selectedPerformance.rating}/5</span>
                    <div className="flex">{getRatingStars(selectedPerformance.rating)}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Évaluateur</h4>
                  <p>{selectedPerformance.reviewedBy}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">Points Forts</h4>
                <p className="bg-green-50 p-3 rounded-md text-sm">{selectedPerformance.strengths}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">Points à Améliorer</h4>
                <p className="bg-orange-50 p-3 rounded-md text-sm">{selectedPerformance.improvements}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">Objectifs</h4>
                <p className="bg-blue-50 p-3 rounded-md text-sm">{selectedPerformance.goals}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

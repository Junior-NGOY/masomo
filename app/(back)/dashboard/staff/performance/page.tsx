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
  LineChart
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  hireDate: string;
  overallScore: number;
  teachingScore?: number;
  punctualityScore: number;
  collaborationScore: number;
  innovationScore: number;
  studentSatisfaction?: number;
  classesAssigned?: number;
  attendanceRate: number;
  goals: {
    title: string;
    progress: number;
    target: number;
    status: 'on-track' | 'at-risk' | 'completed';
  }[];
  recentAchievements: string[];
  areasForImprovement: string[];
}

const mockStaffMembers: StaffMember[] = [
  {
    id: 's-001',
    name: 'Professeur Amadou Ba',
    position: 'Enseignant',
    department: 'Mathématiques',
    hireDate: '2020-09-01',
    overallScore: 92,
    teachingScore: 95,
    punctualityScore: 88,
    collaborationScore: 90,
    innovationScore: 85,
    studentSatisfaction: 4.6,
    classesAssigned: 8,
    attendanceRate: 96,
    goals: [
      {
        title: 'Améliorer le taux de réussite en algèbre',
        progress: 85,
        target: 90,
        status: 'on-track'
      },
      {
        title: 'Intégrer plus de technologie en classe',
        progress: 60,
        target: 80,
        status: 'at-risk'
      }
    ],
    recentAchievements: [
      'Certification en pédagogie numérique',
      'Meilleur taux de réussite en Terminal S',
      'Animation formation continue collègues'
    ],
    areasForImprovement: [
      'Utilisation des outils numériques',
      'Communication avec les parents'
    ]
  },
  {
    id: 's-002',
    name: 'Madame Fatou Diagne',
    position: 'Enseignante',
    department: 'Français',
    hireDate: '2018-03-15',
    overallScore: 89,
    teachingScore: 92,
    punctualityScore: 85,
    collaborationScore: 88,
    innovationScore: 90,
    studentSatisfaction: 4.4,
    classesAssigned: 6,
    attendanceRate: 94,
    goals: [
      {
        title: 'Développer un club de lecture',
        progress: 100,
        target: 100,
        status: 'completed'
      },
      {
        title: 'Améliorer l\'expression écrite',
        progress: 70,
        target: 85,
        status: 'on-track'
      }
    ],
    recentAchievements: [
      'Prix du meilleur projet pédagogique',
      'Publication d\'articles éducatifs',
      'Création du club de débat'
    ],
    areasForImprovement: [
      'Gestion du temps en classe',
      'Évaluation différenciée'
    ]
  },
  {
    id: 's-003',
    name: 'Monsieur Ousmane Sow',
    position: 'Administrateur',
    department: 'Administration',
    hireDate: '2019-01-10',
    overallScore: 87,
    punctualityScore: 95,
    collaborationScore: 85,
    innovationScore: 80,
    attendanceRate: 98,
    goals: [
      {
        title: 'Digitaliser les processus administratifs',
        progress: 75,
        target: 100,
        status: 'on-track'
      },
      {
        title: 'Réduire les délais de traitement',
        progress: 40,
        target: 70,
        status: 'at-risk'
      }
    ],
    recentAchievements: [
      'Mise en place du système de gestion',
      'Formation équipe administrative',
      'Optimisation des procédures'
    ],
    areasForImprovement: [
      'Communication inter-services',
      'Gestion des priorités'
    ]
  },
  {
    id: 's-004',
    name: 'Docteur Aissatou Fall',
    position: 'Directrice Pédagogique',
    department: 'Direction',
    hireDate: '2017-08-20',
    overallScore: 94,
    teachingScore: 88,
    punctualityScore: 92,
    collaborationScore: 95,
    innovationScore: 96,
    studentSatisfaction: 4.8,
    classesAssigned: 3,
    attendanceRate: 97,
    goals: [
      {
        title: 'Améliorer la qualité pédagogique globale',
        progress: 88,
        target: 90,
        status: 'on-track'
      },
      {
        title: 'Développer le mentorat enseignant',
        progress: 65,
        target: 80,
        status: 'on-track'
      }
    ],
    recentAchievements: [
      'Certification ISO en éducation',
      'Programme d\'échange international',
      'Réforme curriculaire réussie'
    ],
    areasForImprovement: [
      'Délégation des tâches',
      'Équilibre vie professionnelle'
    ]
  }
];

export default function PerformancePage() {
  const [selectedDepartment, setSelectedDepartment] = React.useState("all");
  const [selectedPosition, setSelectedPosition] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | null>(null);

  // Filtrage du personnel
  const filteredStaff = mockStaffMembers.filter(staff => {
    const matchesDepartment = selectedDepartment === "all" || staff.department === selectedDepartment;
    const matchesPosition = selectedPosition === "all" || staff.position === selectedPosition;
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesPosition && matchesSearch;
  });

  // Statistiques globales
  const averageScore = filteredStaff.reduce((sum, staff) => sum + staff.overallScore, 0) / filteredStaff.length;
  const averageAttendance = filteredStaff.reduce((sum, staff) => sum + staff.attendanceRate, 0) / filteredStaff.length;
  const highPerformers = filteredStaff.filter(staff => staff.overallScore >= 90).length;
  const totalGoals = filteredStaff.reduce((sum, staff) => sum + staff.goals.length, 0);
  const completedGoals = filteredStaff.reduce((sum, staff) => 
    sum + staff.goals.filter(goal => goal.status === 'completed').length, 0);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Bien</Badge>;
    if (score >= 70) return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Satisfaisant</Badge>;
    return <Badge variant="destructive">À améliorer</Badge>;
  };

  const getGoalStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Atteint</Badge>;
      case 'on-track':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En cours</Badge>;
      case 'at-risk':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">À risque</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleViewDetails = (staff: StaffMember) => {
    setSelectedStaff(staff);
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance du Personnel</h1>
          <p className="text-gray-600 mt-1">Évaluation et suivi des performances</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport Performance
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Target className="h-4 w-4 mr-2" />
            Définir Objectifs
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Score Moyen"
          value={`${averageScore.toFixed(1)}/100`}
          description="Performance globale"
          icon={TrendingUp}
          trend={{ value: 3.2, isPositive: true }}
          className="border-blue-200"
        />
        <StatsCard
          title="Excellents Performeurs"
          value={`${highPerformers}/${filteredStaff.length}`}
          description="Score ≥ 90"
          icon={Award}
          className="border-green-200"
        />
        <StatsCard
          title="Assiduité Moyenne"
          value={`${averageAttendance.toFixed(1)}%`}
          description="Taux de présence"
          icon={Clock}
          trend={{ value: 1.8, isPositive: true }}
          className="border-purple-200"
        />
        <StatsCard
          title="Objectifs Atteints"
          value={`${completedGoals}/${totalGoals}`}
          description="Taux de réalisation"
          icon={Target}
          className="border-orange-200"
        />
        <StatsCard
          title="Total Personnel"
          value={filteredStaff.length.toString()}
          description="Membres évalués"
          icon={Users}
          className="border-gray-200"
        />
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="individual">Performance Individuelle</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Meilleurs Performances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStaffMembers
                    .sort((a, b) => b.overallScore - a.overallScore)
                    .slice(0, 5)
                    .map((staff, index) => (
                      <div key={staff.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{staff.name}</div>
                            <div className="text-sm text-gray-600">{staff.department}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getScoreColor(staff.overallScore)}`}>
                            {staff.overallScore}/100
                          </div>
                          <div className="text-sm text-gray-600">{staff.position}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Répartition par département */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Performance par Département
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Mathématiques', 'Français', 'Administration', 'Direction'].map((dept) => {
                    const deptStaff = mockStaffMembers.filter(s => s.department === dept);
                    const avgScore = deptStaff.reduce((sum, s) => sum + s.overallScore, 0) / deptStaff.length;
                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{dept}</span>
                          <span className={getScoreColor(avgScore)}>
                            {avgScore.toFixed(1)}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              avgScore >= 90 ? 'bg-green-500' :
                              avgScore >= 80 ? 'bg-yellow-500' :
                              avgScore >= 70 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${avgScore}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique des tendances */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Évolution des Performances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Graphique des Tendances</p>
                  <p className="text-sm">Évolution mensuelle des scores de performance</p>
                  <p className="text-xs mt-2">• Performance individuelle et collective</p>
                  <p className="text-xs">• Tendances par département</p>
                  <p className="text-xs">• Objectifs vs réalisations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance individuelle */}
        <TabsContent value="individual" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par nom, département, poste..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous départements</SelectItem>
                    <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Direction">Direction</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Poste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous postes</SelectItem>
                    <SelectItem value="Enseignant">Enseignant</SelectItem>
                    <SelectItem value="Enseignante">Enseignante</SelectItem>
                    <SelectItem value="Administrateur">Administrateur</SelectItem>
                    <SelectItem value="Directrice Pédagogique">Direction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste du personnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personnel ({filteredStaff.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom / Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Score Global</TableHead>
                      <TableHead>Assiduité</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Objectifs</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => {
                      const completedGoalsCount = staff.goals.filter(g => g.status === 'completed').length;
                      return (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold">{staff.name}</div>
                                <div className="text-sm text-gray-600">{staff.position}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{staff.department}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${getScoreColor(staff.overallScore)}`}>
                                {staff.overallScore}
                              </span>
                              {getScoreBadge(staff.overallScore)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className={staff.attendanceRate >= 95 ? 'text-green-600' : 
                                             staff.attendanceRate >= 90 ? 'text-orange-600' : 'text-red-600'}>
                                {staff.attendanceRate}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {staff.studentSatisfaction ? (
                              <div className="flex items-center gap-1">
                                {getRatingStars(staff.studentSatisfaction)}
                                <span className="text-sm ml-2">{staff.studentSatisfaction}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="font-medium">{completedGoalsCount}/{staff.goals.length}</span>
                              <span className="text-gray-600"> atteints</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(staff)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectifs */}
        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Objectifs en cours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectifs en Cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStaffMembers
                    .flatMap(staff => staff.goals.map(goal => ({ ...goal, staffName: staff.name })))
                    .filter(goal => goal.status !== 'completed')
                    .slice(0, 5)
                    .map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{goal.title}</div>
                            <div className="text-xs text-gray-600">{goal.staffName}</div>
                          </div>
                          {getGoalStatusBadge(goal.status)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progression</span>
                            <span>{goal.progress}% / {goal.target}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                goal.status === 'on-track' ? 'bg-blue-500' :
                                goal.status === 'at-risk' ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Objectifs récemment atteints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Objectifs Atteints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStaffMembers
                    .flatMap(staff => staff.goals.map(goal => ({ ...goal, staffName: staff.name })))
                    .filter(goal => goal.status === 'completed')
                    .map((goal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium text-sm">{goal.title}</div>
                            <div className="text-xs text-gray-600">{goal.staffName}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Atteint
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analyses */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Corrélations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analyses de Corrélation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Assiduité vs Performance</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Corrélation positive forte (r=0.78)
                    </p>
                    <div className="text-xs text-gray-500">
                      Les employés avec une meilleure assiduité ont tendance à avoir de meilleures performances globales.
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Ancienneté vs Innovation</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Corrélation modérée (r=0.45)
                    </p>
                    <div className="text-xs text-gray-500">
                      L'expérience contribue positivement à l'innovation pédagogique.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tendances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendances Trimestrielles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Score moyen global', q1: 85, q2: 87, q3: 89, trend: '+4.7%' },
                    { metric: 'Satisfaction étudiants', q1: 4.2, q2: 4.4, q3: 4.5, trend: '+7.1%' },
                    { metric: 'Taux d\'assiduité', q1: 92, q2: 94, q3: 95, trend: '+3.3%' }
                  ].map((trend, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{trend.metric}</span>
                        <span className="text-green-600">{trend.trend}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>T1: {trend.q1}</span>
                        <span>T2: {trend.q2}</span>
                        <span>T3: {trend.q3}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Détails Performance */}
      {selectedStaff && (
        <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil de Performance - {selectedStaff.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Scores détaillés */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Scores de Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Score Global</span>
                      <span className={`font-bold ${getScoreColor(selectedStaff.overallScore)}`}>
                        {selectedStaff.overallScore}/100
                      </span>
                    </div>
                    {selectedStaff.teachingScore && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Enseignement</span>
                        <span className={`font-bold ${getScoreColor(selectedStaff.teachingScore)}`}>
                          {selectedStaff.teachingScore}/100
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ponctualité</span>
                      <span className={`font-bold ${getScoreColor(selectedStaff.punctualityScore)}`}>
                        {selectedStaff.punctualityScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Collaboration</span>
                      <span className={`font-bold ${getScoreColor(selectedStaff.collaborationScore)}`}>
                        {selectedStaff.collaborationScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Innovation</span>
                      <span className={`font-bold ${getScoreColor(selectedStaff.innovationScore)}`}>
                        {selectedStaff.innovationScore}/100
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Informations Générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Poste</span>
                      <span className="text-sm font-medium">{selectedStaff.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Département</span>
                      <span className="text-sm font-medium">{selectedStaff.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ancienneté</span>
                      <span className="text-sm font-medium">
                        {Math.round((new Date().getTime() - new Date(selectedStaff.hireDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} ans
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Assiduité</span>
                      <span className="text-sm font-medium">{selectedStaff.attendanceRate}%</span>
                    </div>
                    {selectedStaff.studentSatisfaction && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Satisfaction</span>
                        <div className="flex items-center gap-1">
                          {getRatingStars(selectedStaff.studentSatisfaction)}
                          <span className="text-sm ml-1">{selectedStaff.studentSatisfaction}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Objectifs */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Objectifs Actuels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedStaff.goals.map((goal, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{goal.title}</div>
                          {getGoalStatusBadge(goal.status)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span>{goal.progress}% / {goal.target}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                goal.status === 'completed' ? 'bg-green-500' :
                                goal.status === 'on-track' ? 'bg-blue-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Réalisations et améliorations */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Réalisations Récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedStaff.recentAchievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Axes d'Amélioration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedStaff.areasForImprovement.map((area, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  CreditCard,
  TrendingDown,
  Clock
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

import { useOutstandingFees } from "@/hooks/useOutstandingFees";

export default function OutstandingFeesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [classFilter, setClassFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("overview");

  const { payments: outstandingPayments, stats, loading } = useOutstandingFees();

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!stats) return null;

  const filteredPayments = outstandingPayments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || payment.className === classFilter;
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'partial': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  const getStatusText = (status: string) => {
    switch (status) {
      case 'overdue': return 'En retard';
      case 'pending': return 'En attente';
      case 'partial': return 'Partiel';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSendReminder = (paymentId: string, method: 'email' | 'sms') => {
    alert(`Rappel envoyé via ${method === 'email' ? 'email' : 'SMS'} pour le paiement ${paymentId}`);
  };

  const handleExportData = () => {
    alert('Export des données d\'impayés en cours...');
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Impayés</h1>
          <p className="text-gray-600 mt-1">Gestion des paiements en retard et en attente</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Mail className="h-4 w-4 mr-2" />
            Rappel groupé
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total impayé"
          value={formatCurrency(stats.totalOutstanding)}
          description="Montant total des impayés"
          icon={DollarSign}
          className="border-red-200"
        />
        <StatsCard
          title="En retard"
          value={stats.overdueCount.toString()}
          description="Paiements en retard"
          icon={AlertTriangle}
          className="border-red-200"
        />
        <StatsCard
          title="En attente"
          value={stats.pendingCount.toString()}
          description="Paiements dus"
          icon={Clock}
          className="border-yellow-200"
        />
        <StatsCard
          title="Partiels"
          value={stats.partialCount.toString()}
          description="Paiements partiels"
          icon={CreditCard}
          className="border-orange-200"
        />
        <StatsCard
          title="Retard moyen"
          value={`${stats.averageDaysOverdue} jours`}
          description="Durée moyenne"
          icon={TrendingDown}
          className="border-gray-200"
        />
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom d'élève, parent ou classe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                <SelectItem value="6ème A">6ème A</SelectItem>
                <SelectItem value="5ème B">5ème B</SelectItem>
                <SelectItem value="4ème C">4ème C</SelectItem>
                <SelectItem value="3ème A">3ème A</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="partial">Partiel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="reminders">Rappels</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des impayés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Type de frais</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Retard</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{payment.studentName}</div>
                              <div className="text-sm text-gray-600">{payment.studentId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{payment.className}</TableCell>
                        <TableCell>{payment.feeType}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-red-600">
                              {formatCurrency(payment.amount - payment.paidAmount)}
                            </div>
                            {payment.paidAmount > 0 && (
                              <div className="text-xs text-gray-500">
                                Payé: {formatCurrency(payment.paidAmount)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(payment.status)}>
                            {getStatusText(payment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-red-500" />
                            <span className="text-red-600 font-medium">
                              {payment.daysOverdue} jours
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.parentName}</div>
                            <div className="text-sm text-gray-600">{payment.parentPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendReminder(payment.id, 'email')}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendReminder(payment.id, 'sms')}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Programmation des rappels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fréquence des rappels</label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jours de retard avant rappel</label>
                  <Input type="number" defaultValue="7" />
                </div>
                <Button className="w-full">
                  Configurer les rappels automatiques
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique des rappels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredPayments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{payment.studentName}</div>
                        <div className="text-sm text-gray-600">
                          Dernier rappel: {new Date(payment.lastReminder).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Analyse par classe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['6ème A', '5ème B', '4ème C', '3ème A'].map((className) => {
                    const classPayments = outstandingPayments.filter(p => p.className === className);
                    const classTotal = classPayments.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);
                    
                    return (
                      <div key={className} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{className}</span>
                          <span className="font-semibold">{formatCurrency(classTotal)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(classTotal / stats.totalOutstanding) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendances mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-gray-500">
                    <TrendingDown className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Graphique des tendances</p>
                    <p className="text-sm">Évolution des impayés</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-red-600">+15%</div>
                      <div className="text-xs text-gray-600">Ce mois</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-orange-600">-8%</div>
                      <div className="text-xs text-gray-600">Mois dernier</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-blue-600">12j</div>
                      <div className="text-xs text-gray-600">Retard moyen</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

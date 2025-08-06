"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentMockDataService } from "@/services/studentMockDataService";
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Download,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function AcademicFeesCalendarPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const allFees = StudentMockDataService.getStudentFees();

  // Mois académiques de septembre à juin
  const academicMonths = [
    { name: "Septembre", key: "2024-09", dueDate: "15" },
    { name: "Octobre", key: "2024-10", dueDate: "15" },
    { name: "Novembre", key: "2024-11", dueDate: "15" },
    { name: "Décembre", key: "2024-12", dueDate: "15" },
    { name: "Janvier", key: "2025-01", dueDate: "15" },
    { name: "Février", key: "2025-02", dueDate: "15" },
    { name: "Mars", key: "2025-03", dueDate: "15" },
    { name: "Avril", key: "2025-04", dueDate: "15" },
    { name: "Mai", key: "2025-05", dueDate: "15" },
    { name: "Juin", key: "2025-06", dueDate: "15" }
  ];

  // Calculer les statistiques par mois
  const getMonthStats = (monthKey: string) => {
    const monthFees = allFees.filter(fee => 
      fee.dueDate.startsWith(monthKey) && 
      fee.feeType.includes("Frais de scolarité")
    );
    
    const totalFees = monthFees.length;
    const paidFees = monthFees.filter(fee => fee.status === 'PAID').length;
    const partialFees = monthFees.filter(fee => fee.status === 'PARTIAL').length;
    const overdueFees = monthFees.filter(fee => fee.status === 'OVERDUE').length;
    const pendingFees = monthFees.filter(fee => fee.status === 'PENDING').length;
    
    const totalAmount = monthFees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = monthFees
      .filter(fee => fee.status === 'PAID')
      .reduce((sum, fee) => sum + fee.amount, 0);
    const partialAmount = monthFees
      .filter(fee => fee.status === 'PARTIAL')
      .reduce((sum, fee) => sum + (fee.amount - (fee.remainingAmount || 0)), 0);

    const collectedAmount = paidAmount + partialAmount;
    const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0;

    return {
      totalFees,
      paidFees,
      partialFees,
      overdueFees,
      pendingFees,
      totalAmount,
      collectedAmount,
      collectionRate,
      fees: monthFees
    };
  };

  const getMonthStatusColor = (monthKey: string) => {
    const stats = getMonthStats(monthKey);
    const currentDate = new Date();
    const monthDate = new Date(monthKey + "-15");
    
    if (monthDate > currentDate) {
      return "bg-gray-100 border-gray-200"; // Futur
    } else if (stats.collectionRate >= 90) {
      return "bg-green-100 border-green-200"; // Excellent
    } else if (stats.collectionRate >= 70) {
      return "bg-orange-100 border-orange-200"; // Correct
    } else {
      return "bg-red-100 border-red-200"; // Problématique
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string }> = {
      PAID: { color: "bg-green-100 text-green-800", text: "Payé" },
      PENDING: { color: "bg-orange-100 text-orange-800", text: "En attente" },
      OVERDUE: { color: "bg-red-100 text-red-800", text: "En retard" },
      PARTIAL: { color: "bg-blue-100 text-blue-800", text: "Partiel" }
    };
    const variant = variants[status] || variants.PENDING;
    return (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${variant.color}`}>
        {variant.text}
      </span>
    );
  };

  // Statistiques globales de l'année
  const yearStats = academicMonths.reduce((acc, month) => {
    const monthStats = getMonthStats(month.key);
    acc.totalAmount += monthStats.totalAmount;
    acc.collectedAmount += monthStats.collectedAmount;
    acc.totalStudents = Math.max(acc.totalStudents, monthStats.totalFees);
    return acc;
  }, { totalAmount: 0, collectedAmount: 0, totalStudents: 0 });

  const yearCollectionRate = yearStats.totalAmount > 0 ? 
    Math.round((yearStats.collectedAmount / yearStats.totalAmount) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/students/fees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendrier Académique des Frais</h1>
            <p className="text-gray-600 mt-1">Année scolaire {selectedYear} - Paiements mensuels</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Statistiques de l'année */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Annuel</p>
                <p className="text-2xl font-bold text-gray-900">
                  {StudentMockDataService.formatCurrency(yearStats.totalAmount)}
                </p>
                <p className="text-sm text-gray-500">10 mois académiques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collecté</p>
                <p className="text-2xl font-bold text-gray-900">
                  {StudentMockDataService.formatCurrency(yearStats.collectedAmount)}
                </p>
                <p className="text-sm text-green-600">{yearCollectionRate}% du total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Élèves</p>
                <p className="text-2xl font-bold text-gray-900">{yearStats.totalStudents}</p>
                <p className="text-sm text-gray-500">Élèves inscrits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Frais Mensuel</p>
                <p className="text-2xl font-bold text-gray-900">
                  {StudentMockDataService.formatCurrency(50000)}
                </p>
                <p className="text-sm text-gray-500">Par élève</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendrier des mois */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendrier de Paiement - Année {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {academicMonths.map((month) => {
              const stats = getMonthStats(month.key);
              const isCurrentMonth = month.key === new Date().toISOString().slice(0, 7);
              
              return (
                <Card 
                  key={month.key} 
                  className={`cursor-pointer transition-all hover:shadow-md ${getMonthStatusColor(month.key)} ${
                    isCurrentMonth ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedMonth(selectedMonth === month.key ? null : month.key)}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900">{month.name}</h3>
                      <p className="text-sm text-gray-600">Échéance: {month.dueDate}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Taux:</span>
                          <span className="font-medium">{stats.collectionRate}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stats.collectionRate}%` }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="text-green-600">✓ {stats.paidFees}</div>
                          <div className="text-red-600">✗ {stats.overdueFees}</div>
                          <div className="text-blue-600">◐ {stats.partialFees}</div>
                          <div className="text-orange-600">○ {stats.pendingFees}</div>
                        </div>
                      </div>
                      
                      {isCurrentMonth && (
                        <Badge className="mt-2 bg-blue-100 text-blue-800">
                          Mois actuel
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Détails du mois sélectionné */}
      {selectedMonth && (
        <Card>
          <CardHeader>
            <CardTitle>
              Détails - {academicMonths.find(m => m.key === selectedMonth)?.name} {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getMonthStats(selectedMonth).fees.map((fee) => (
                <div key={fee.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{fee.studentName}</h4>
                        <span className="text-sm text-gray-600">{fee.className}</span>
                        {getStatusBadge(fee.status)}
                      </div>
                      
                      <div className="grid gap-2 md:grid-cols-3 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Montant:</span>
                          <p className="font-medium">{StudentMockDataService.formatCurrency(fee.amount)}</p>
                        </div>
                        {fee.paidDate && (
                          <div>
                            <span className="text-gray-500">Payé le:</span>
                            <p className="font-medium text-green-600">
                              {new Date(fee.paidDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        )}
                        {fee.remainingAmount && fee.remainingAmount > 0 && (
                          <div>
                            <span className="text-gray-500">Restant:</span>
                            <p className="font-medium text-red-600">
                              {StudentMockDataService.formatCurrency(fee.remainingAmount)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/dashboard/students/fees/${fee.studentId}`}>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Légende */}
      <Card>
        <CardHeader>
          <CardTitle>Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm">Collecte excellente (≥90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
              <span className="text-sm">Collecte correcte (70-89%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm">Collecte problématique (&lt;70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span className="text-sm">Mois à venir</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

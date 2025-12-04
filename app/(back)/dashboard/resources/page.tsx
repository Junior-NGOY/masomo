"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen,
  Package,
  Building2,
  Monitor,
  Search,
  Plus,
  Filter,
  Download,
  MapPin,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useResources, useResourceStats } from "@/hooks/useResources";
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

export default function ResourcesPage() {
  const { resources, loading: resourcesLoading } = useResources();
  const { stats, loading: statsLoading } = useResourceStats();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [conditionFilter, setConditionFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  if (resourcesLoading || statsLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Filtrer les ressources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (resource.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (resource.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    const matchesCondition = conditionFilter === "all" || resource.condition === conditionFilter;
    const matchesCategory = categoryFilter === "all" || resource.category?.includes(categoryFilter);
    
    return matchesSearch && matchesType && matchesCondition && matchesCategory;
  });

  // Obtenir les types et catégories uniques pour les filtres
  const uniqueTypes = Array.from(new Set(resources.map(resource => resource.type)));
  const uniqueCategories = Array.from(new Set(resources.map(resource => resource.category).filter(Boolean))) as string[];

  const getStatusColor = (condition: string | null) => {
    switch (condition) {
      case "GOOD":
        return "border-green-200 text-green-700";
      case "FAIR":
        return "border-blue-200 text-blue-700";
      case "POOR":
        return "border-orange-200 text-orange-700";
      case "DAMAGED":
        return "border-red-200 text-red-700";
      default:
        return "border-gray-200 text-gray-700";
    }
  };

  const getStatusText = (condition: string | null) => {
    switch (condition) {
      case "GOOD":
        return "Bon état";
      case "FAIR":
        return "État moyen";
      case "POOR":
        return "Mauvais état";
      case "DAMAGED":
        return "Endommagé";
      default:
        return condition || "Inconnu";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "BOOK":
        return <BookOpen className="h-4 w-4" />;
      case "EQUIPMENT":
        return <Monitor className="h-4 w-4" />;
      case "FACILITY":
        return <Building2 className="h-4 w-4" />;
      case "DIGITAL":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "BOOK":
        return "Livre";
      case "EQUIPMENT":
        return "Équipement";
      case "FACILITY":
        return "Installation";
      case "DIGITAL":
        return "Numérique";
      default:
        return type;
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return "text-red-600";
    if (percentage < 30) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Ressources</h1>
          <p className="text-gray-600 mt-1">Bibliothèque, inventaire et réservation d'installations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Ressource
          </Button>
        </div>
      </div>

      {/* Statistiques des ressources */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ressources Totales"
          value={stats?.totalResources || 0}
          description="Tous types confondus"
          icon={Package}
        />
        <StatsCard
          title="Ressources Disponibles"
          value={stats?.totalAvailable || 0}
          description="Prêtes à l'utilisation"
          icon={BookOpen}
          className="border-green-200"
        />
        <StatsCard
          title="Ressources Empruntées"
          value={resources.length - (stats?.totalAvailable || 0)}
          description="Actuellement utilisées"
          icon={Calendar}
          className="border-blue-200"
        />
        <StatsCard
          title="Taux d'Utilisation"
          value={stats?.totalAvailable && stats?.totalQuantity ? `${Math.round((stats.totalAvailable / stats.totalQuantity) * 100)}%` : '0%'}
          description="Efficacité d'usage"
          icon={AlertTriangle}
          trend={{ value: 8.2, isPositive: true }}
          className="border-purple-200"
        />
      </div>

      {/* Ressources par type */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {uniqueTypes.map((type) => {
          const typeResources = resources.filter(resource => resource.type === type);
          const availableCount = typeResources.reduce((sum, resource) => sum + resource.available, 0);
          const totalCount = typeResources.reduce((sum, resource) => sum + resource.quantity, 0);
          
          return (
            <Card key={type} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {getTypeIcon(type)}
                  {getTypeText(type)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-semibold">{totalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disponible</span>
                  <span className={`font-semibold ${getAvailabilityColor(availableCount, totalCount)}`}>
                    {availableCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taux disponibilité</span>
                  <span className={`text-sm font-medium ${getAvailabilityColor(availableCount, totalCount)}`}>
                    {Math.round((availableCount / totalCount) * 100)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {typeResources.length} {typeResources.length > 1 ? 'éléments' : 'élément'}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertes de maintenance */}
      {resources.filter(r => r.condition === "POOR" || r.condition === "DAMAGED").length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Ressources Nécessitant une Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources
                .filter(resource => resource.condition === "POOR" || resource.condition === "DAMAGED")
                .map((resource) => (
                <div key={resource.id} className="p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(resource.type)}
                      <div>
                        <h4 className="font-semibold text-orange-900">{resource.name}</h4>
                        <p className="text-sm text-orange-700">
                          {resource.category || 'N/A'} - {resource.location || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getStatusColor(resource.condition)}>
                        {getStatusText(resource.condition)}
                      </Badge>
                      <p className="text-xs text-orange-600 mt-1">
                        {resource.quantity - resource.available} en panne
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste complète des ressources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventaire des Ressources
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, catégorie ou emplacement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getTypeText(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes conditions</SelectItem>
                <SelectItem value="GOOD">Bon état</SelectItem>
                <SelectItem value="FAIR">État moyen</SelectItem>
                <SelectItem value="POOR">Mauvais état</SelectItem>
                <SelectItem value="DAMAGED">Endommagé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des ressources */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ressource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        {resource.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTypeText(resource.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{resource.category || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {resource.location || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {resource.quantity}
                    </TableCell>
                    <TableCell>
                      <span className={getAvailabilityColor(resource.available, resource.quantity)}>
                        {resource.available}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">
                        ({Math.round((resource.available / resource.quantity) * 100)}%)
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(resource.condition)}>
                        {getStatusText(resource.condition)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune ressource trouvée pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

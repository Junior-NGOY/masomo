"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell,
  Megaphone,
  Users,
  Eye,
  AlertTriangle,
  Search,
  Plus,
  Filter,
  Calendar,
  Clock
} from "lucide-react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
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

export default function AnnouncementsPage() {
  const { announcements, loading } = useAnnouncements();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Format date helper function
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate stats from real data
  const announcementStats = {
    totalAnnouncements: announcements.length,
    activeAnnouncements: announcements.filter(a => a.isActive).length,
    urgentAnnouncements: announcements.filter(a => a.type === 'URGENT' && a.isActive).length,
    viewRate: 85 // Placeholder - would need view tracking
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  // Filtrer les annonces
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.publishedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "all" || announcement.type === priorityFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" ? announcement.isActive : !announcement.isActive);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "border-red-200 text-red-700 bg-red-50";
      case "HIGH":
        return "border-orange-200 text-orange-700 bg-orange-50";
      case "MEDIUM":
        return "border-blue-200 text-blue-700 bg-blue-50";
      case "LOW":
        return "border-gray-200 text-gray-700 bg-gray-50";
      default:
        return "border-gray-200 text-gray-700 bg-gray-50";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "Urgent";
      case "HIGH":
        return "Élevée";
      case "MEDIUM":
        return "Moyenne";
      case "LOW":
        return "Faible";
      default:
        return priority;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <AlertTriangle className="h-4 w-4" />;
      case "HIGH":
        return <Bell className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau d'Annonces</h1>
          <p className="text-gray-600 mt-1">Communication numérique pour l'école</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Annonce
          </Button>
        </div>
      </div>

      {/* Statistiques des annonces */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Annonces"
          value={announcementStats.totalAnnouncements}
          description="Depuis le début"
          icon={Megaphone}
        />
        <StatsCard
          title="Annonces Actives"
          value={announcementStats.activeAnnouncements}
          description="Actuellement visibles"
          icon={Bell}
          className="border-green-200"
        />
        <StatsCard
          title="Annonces Urgentes"
          value={announcementStats.urgentAnnouncements}
          description="Nécessitent attention"
          icon={AlertTriangle}
          className="border-red-200"
        />
        <StatsCard
          title="Taux de Vue"
          value={`${announcementStats.viewRate}%`}
          description="Consultation moyenne"
          icon={Eye}
          trend={{ value: 4.5, isPositive: true }}
          className="border-blue-200"
        />
      </div>

      {/* Annonces urgentes en évidence */}
      {announcements.filter(a => a.type === "URGENT" && a.isActive).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Annonces Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements
                .filter(announcement => announcement.type === "URGENT" && announcement.isActive)
                .map((announcement, index) => (
                <div key={`${announcement.id}-${index}`} className="p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900">{announcement.title}</h4>
                      <p className="text-sm text-red-700 mt-1 line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-red-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(announcement.publishDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {announcement.targetAudience} público
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                      Voir Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annonces récentes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {announcements
          .filter(announcement => announcement.isActive)
          .slice(0, 6)
          .map((announcement, index) => (
          <Card key={`${announcement.id}-${index}`} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getPriorityColor(announcement.type)}>
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(announcement.type)}
                    {getPriorityText(announcement.type)}
                  </div>
                </Badge>
                <div className="text-xs text-gray-500">
                  {formatDate(announcement.publishDate)}
                </div>
              </div>
              <CardTitle className="text-base line-clamp-2">
                {announcement.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-3">
                {announcement.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Par {announcement.publishedBy}</span>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {announcement.targetAudience}
                  </Badge>
                </div>
              </div>
              {announcement.expiryDate && (
                <div className="text-xs text-orange-600">
                  Expire le {formatDate(announcement.expiryDate)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Liste complète des annonces */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Toutes les Annonces
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par titre, contenu ou auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">Élevée</SelectItem>
                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                <SelectItem value="LOW">Faible</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="inactive">Inactives</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des annonces */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Public Cible</TableHead>
                  <TableHead>Date Publication</TableHead>
                  <TableHead>Date Expiration</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.map((announcement, index) => (
                  <TableRow key={`${announcement.id}-${index}`}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={announcement.title}>
                        {announcement.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(announcement.type)}>
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(announcement.type)}
                          {getPriorityText(announcement.type)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{announcement.publishedBy}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {announcement.targetAudience}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(announcement.publishDate)}
                    </TableCell>
                    <TableCell>
                      {announcement.expiryDate ? formatDate(announcement.expiryDate) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={announcement.isActive ? "text-green-700 border-green-200" : "text-gray-700 border-gray-200"}>
                        {announcement.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune annonce trouvée pour les critères sélectionnés.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

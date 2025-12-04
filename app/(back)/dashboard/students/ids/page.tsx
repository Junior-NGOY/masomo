"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentIDCards, StudentIDCard as StudentIDCardType } from "@/hooks/useStudentIDCards";
import { useStudentStats } from "@/hooks/useStudents";
import { Skeleton } from "@/components/ui/skeleton";
import StudentIDCard from "@/components/StudentIDCard";
import PrintStudentCards from "@/components/PrintStudentCards";
import QRCodeViewer from "@/components/QRCodeViewer";
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download,
  Search,
  Eye,
  Edit,
  Plus,
  Phone,
  User,
  Calendar,
  Printer,
  Camera,
  QrCode
} from "lucide-react";

export default function StudentIDsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedCards, setSelectedCards] = useState<StudentIDCardType[]>([]);
  const [showQRViewer, setShowQRViewer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentIDCardType | null>(null);

  const { idCards: studentIDs, loading: idsLoading, error: idsError } = useStudentIDCards();
  const { stats, loading: statsLoading, error: statsError } = useStudentStats();

  const isLoading = idsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (idsError || statsError || !stats) {
    return (
      <div className="p-6 flex items-center justify-center text-red-500">
        Erreur lors du chargement des données.
      </div>
    );
  }

  // Filtrage des données
  const filteredIDs = studentIDs.filter(id => {
    const matchesSearch = id.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         id.idNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || id.status === statusFilter;
    const matchesClass = classFilter === "ALL" || id.className === classFilter;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  // Obtenir les classes uniques
  const uniqueClasses = [...new Set(studentIDs.map(id => id.className))];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string; icon: any }> = {
      ACTIVE: { color: "bg-green-100 text-green-800", text: "Active", icon: CheckCircle },
      EXPIRED: { color: "bg-orange-100 text-orange-800", text: "Expirée", icon: AlertTriangle },
      LOST: { color: "bg-red-100 text-red-800", text: "Perdue", icon: XCircle },
      DAMAGED: { color: "bg-yellow-100 text-yellow-800", text: "Endommagée", icon: RefreshCw }
    };
    const variant = variants[status] || variants.ACTIVE;
    const Icon = variant.icon;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variant.color}`}>
        <Icon className="h-3 w-3" />
        {variant.text}
      </span>
    );
  };

  const StatsCard = ({ title, value, description, icon: Icon, color = "blue" }: any) => {
    const getColorClasses = (color: string) => {
      const colorClasses: Record<string, { bg: string; text: string }> = {
        blue: { bg: "bg-blue-100", text: "text-blue-600" },
        green: { bg: "bg-green-100", text: "text-green-600" },
        red: { bg: "bg-red-100", text: "text-red-600" },
        orange: { bg: "bg-orange-100", text: "text-orange-600" },
        yellow: { bg: "bg-yellow-100", text: "text-yellow-600" }
      };
      return colorClasses[color] || colorClasses.blue;
    };

    const colorClasses = getColorClasses(color);

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
              <Icon className={`h-6 w-6 ${colorClasses.text}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Vérifier si une carte expire bientôt (dans les 30 prochains jours)
  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return expiry <= thirtyDaysFromNow && expiry > today;
  };

  const expiringSoonCount = studentIDs.filter(id => isExpiringSoon(id.expiryDate)).length;

  // Fonctions pour l'impression
  const handlePrintAll = () => {
    setSelectedCards(filteredIDs);
    setShowPrintModal(true);
  };

  const handlePrintSelected = (cards: StudentIDCardType[]) => {
    setSelectedCards(cards);
    setShowPrintModal(true);
  };

  const handlePrintSingle = (card: StudentIDCardType) => {
    setSelectedCards([card]);
    setShowPrintModal(true);
  };

  const handleShowQRCode = (student: StudentIDCardType) => {
    setSelectedStudent(student);
    setShowQRViewer(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cartes d'Identité Étudiants</h1>
          <p className="text-gray-600 mt-1">Gestion des cartes d'identité scolaires</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintAll}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer lot ({filteredIDs.length})
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle carte
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Cartes actives"
          value={stats.activeIDs}
          description={`${Math.round((stats.activeIDs / studentIDs.length) * 100)}% du total`}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Cartes à problème"
          value={stats.lostOrDamagedIDs}
          description="Perdues ou endommagées"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Expirent bientôt"
          value={expiringSoonCount}
          description="Dans les 30 prochains jours"
          icon={RefreshCw}
          color="orange"
        />
        <StatsCard
          title="Total des cartes"
          value={studentIDs.length}
          description="Toutes les cartes"
          icon={CreditCard}
          color="blue"
        />
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des cartes</TabsTrigger>
          <TabsTrigger value="preview">Aperçu des cartes</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Rechercher</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nom de l'élève ou numéro de carte..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les statuts</SelectItem>
                      <SelectItem value="ACTIVE">Actives</SelectItem>
                      <SelectItem value="EXPIRED">Expirées</SelectItem>
                      <SelectItem value="LOST">Perdues</SelectItem>
                      <SelectItem value="DAMAGED">Endommagées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Classe</label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-48 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Toutes les classes</SelectItem>
                      {uniqueClasses.map(className => (
                        <SelectItem key={className} value={className}>{className}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des cartes */}
          <Card>
            <CardHeader>
              <CardTitle>Cartes d'identité ({filteredIDs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Photo</th>
                      <th className="text-left py-3">Élève</th>
                      <th className="text-left py-3">Classe</th>
                      <th className="text-left py-3">N° Carte</th>
                      <th className="text-left py-3">Date d'émission</th>
                      <th className="text-left py-3">Expiration</th>
                      <th className="text-left py-3">Statut</th>
                      <th className="text-right py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIDs.map((id) => (
                      <tr key={id.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={id.photoUrl} alt={id.studentName} className="object-cover" />
                            <AvatarFallback>{id.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </td>
                        <td className="py-3 font-medium">{id.studentName}</td>
                        <td className="py-3 text-gray-600">{id.className}</td>
                        <td className="py-3 font-mono">{id.idNumber}</td>
                        <td className="py-3">
                          {new Date(id.issueDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3">
                          <div>
                            {new Date(id.expiryDate).toLocaleDateString('fr-FR')}
                            {isExpiringSoon(id.expiryDate) && (
                              <div className="text-xs text-orange-600">
                                Expire bientôt
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3">{getStatusBadge(id.status)}</td>
                        <td className="py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm" title="Voir détails">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Imprimer cette carte"
                              onClick={() => handlePrintSingle(id)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Voir QR Code"
                              onClick={() => handleShowQRCode(id)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {/* Aperçu des cartes avec QR codes */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Aperçu des cartes avec QR Code</h3>
            <Button 
              variant="outline" 
              onClick={() => handlePrintSelected(filteredIDs.slice(0, 6))}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimer ces cartes
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredIDs.slice(0, 6).map((id) => (
              <div key={id.id} className="border rounded-lg p-4">
                <StudentIDCard student={id} showQRCode={true} isPrintMode={false} />
                <div className="mt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePrintSingle(id)}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredIDs.length > 6 && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Affichage de 6 cartes sur {filteredIDs.length}
              </p>
              <Button 
                variant="outline"
                onClick={() => handlePrintSelected(filteredIDs)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimer toutes les cartes ({filteredIDs.length})
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Alertes */}
          <div className="grid gap-4">
            {/* Cartes expirant bientôt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Cartes expirant dans les 30 prochains jours ({expiringSoonCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentIDs.filter(id => isExpiringSoon(id.expiryDate)).length > 0 ? (
                  <div className="space-y-3">
                    {studentIDs
                      .filter(id => isExpiringSoon(id.expiryDate))
                      .map((id) => (
                        <div key={id.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={id.photoUrl} alt={id.studentName} className="object-cover" />
                              <AvatarFallback>{id.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-orange-800">{id.studentName}</p>
                              <p className="text-sm text-orange-600">{id.className} - {id.idNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-orange-800">
                              Expire le {new Date(id.expiryDate).toLocaleDateString('fr-FR')}
                            </p>
                            <Button variant="outline" size="sm" className="mt-1">
                              Renouveler
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>Aucune carte n'expire dans les 30 prochains jours</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cartes perdues ou endommagées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Cartes perdues ou endommagées ({stats.lostOrDamagedIDs})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentIDs.filter(id => id.status === 'LOST' || id.status === 'DAMAGED').length > 0 ? (
                  <div className="space-y-3">
                    {studentIDs
                      .filter(id => id.status === 'LOST' || id.status === 'DAMAGED')
                      .map((id) => (
                        <div key={id.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={id.photoUrl} alt={id.studentName} className="object-cover" />
                              <AvatarFallback>{id.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-red-800">{id.studentName}</p>
                              <p className="text-sm text-red-600">{id.className} - {id.idNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(id.status)}
                            <Button variant="outline" size="sm" className="mt-1 ml-2">
                              Remplacer
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>Aucune carte perdue ou endommagée</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal d'impression */}
      <PrintStudentCards
        students={selectedCards}
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
      />

      {/* Modal QR Code */}
      <QRCodeViewer
        student={selectedStudent}
        isOpen={showQRViewer}
        onClose={() => {
          setShowQRViewer(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}

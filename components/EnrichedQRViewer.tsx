"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  User, 
  GraduationCap, 
  TrendingUp, 
  Calendar, 
  Phone, 
  DollarSign,
  Bell,
  Shield,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { EnrichedQRData } from '@/services/enrichedQRService';

interface EnrichedQRViewerProps {
  qrData: EnrichedQRData;
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrichedQRViewer({ qrData, isOpen, onClose }: EnrichedQRViewerProps) {
  const [activeTab, setActiveTab] = useState('basic');

  if (!isOpen) return null;

  const getQRTypeInfo = (type: string) => {
    switch (type) {
      case 'basic':
        return { label: 'Standard', color: 'bg-blue-100 text-blue-700', icon: User };
      case 'results':
        return { label: 'Résultats', color: 'bg-green-100 text-green-700', icon: GraduationCap };
      case 'announcement':
        return { label: 'Annonces', color: 'bg-orange-100 text-orange-700', icon: Bell };
      case 'complete':
        return { label: 'Complet', color: 'bg-purple-100 text-purple-700', icon: Shield };
      default:
        return { label: 'Inconnu', color: 'bg-gray-100 text-gray-700', icon: QrCode };
    }
  };

  const qrTypeInfo = getQRTypeInfo(qrData.metadata.qrType);
  const IconComponent = qrTypeInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold">Contenu QR Code Enrichi</h2>
            </div>
            <Badge className={qrTypeInfo.color}>
              <IconComponent className="h-3 w-3 mr-1" />
              {qrTypeInfo.label}
            </Badge>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenu */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="basic">Infos de Base</TabsTrigger>
              {qrData.results && <TabsTrigger value="results">Résultats</TabsTrigger>}
              {qrData.academic && <TabsTrigger value="academic">Académique</TabsTrigger>}
              {qrData.announcements && <TabsTrigger value="announcements">Annonces</TabsTrigger>}
              {qrData.financial && <TabsTrigger value="financial">Financier</TabsTrigger>}
              {qrData.contacts && <TabsTrigger value="contacts">Contacts</TabsTrigger>}
            </TabsList>

            {/* Onglet Informations de Base */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations de l'Élève
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-lg font-semibold">{qrData.basic.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Classe</label>
                      <p className="text-lg">{qrData.basic.class}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Numéro d'admission</label>
                      <p className="font-mono">{qrData.basic.admissionNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Année académique</label>
                      <p>{qrData.basic.academicYear}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">École</label>
                      <p>{qrData.basic.school}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date d'émission</label>
                      <p>{new Date(qrData.basic.issueDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métadonnées de sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Informations de Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type de QR Code:</span>
                    <Badge className={qrTypeInfo.color}>
                      <IconComponent className="h-3 w-3 mr-1" />
                      {qrTypeInfo.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Généré le:</span>
                    <span className="text-sm">{new Date(qrData.metadata.generatedAt).toLocaleString('fr-FR')}</span>
                  </div>
                  
                  {qrData.metadata.validUntil && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Valide jusqu'au:</span>
                      <span className="text-sm">{new Date(qrData.metadata.validUntil).toLocaleString('fr-FR')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Hash de sécurité:</span>
                    <span className="text-xs font-mono text-gray-600">{qrData.metadata.securityHash}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Résultats */}
            {qrData.results && (
              <TabsContent value="results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Résultats Scolaires - {qrData.results.term}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Moyennes et rang */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Moyenne du trimestre</p>
                        <p className="text-2xl font-bold text-blue-600">{qrData.results.termAverage.toFixed(1)}/20</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Moyenne générale</p>
                        <p className="text-2xl font-bold text-green-600">{qrData.results.yearAverage.toFixed(1)}/20</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Rang</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {qrData.results.rank.termRank}/{qrData.results.rank.totalStudents}
                        </p>
                      </div>
                    </div>

                    {/* Matières */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Détail par matière</h4>
                      {qrData.results.subjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-gray-600">{subject.teacher}</p>
                            {subject.comment && (
                              <p className="text-xs text-gray-500 italic">{subject.comment}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{subject.grade.toFixed(1)}/20</p>
                            <p className="text-xs text-gray-500">Coef. {subject.coefficient}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mentions */}
                    {qrData.results.mentions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Mentions et Félicitations</h4>
                        <div className="flex flex-wrap gap-2">
                          {qrData.results.mentions.map((mention, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {mention}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Commentaire général */}
                    {qrData.results.generalComment && (
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium mb-2">Commentaire du Conseil de Classe</h4>
                        <p className="text-sm">{qrData.results.generalComment}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Onglet Académique */}
            {qrData.academic && (
              <TabsContent value="academic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Informations Académiques - {qrData.academic.currentTerm}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Assiduité */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-3">Assiduité</h4>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-green-600">{qrData.academic.attendance.present}</p>
                          <p className="text-xs text-gray-600">Présent</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-red-600">{qrData.academic.attendance.absent}</p>
                          <p className="text-xs text-gray-600">Absent</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-orange-600">{qrData.academic.attendance.late}</p>
                          <p className="text-xs text-gray-600">Retard</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-600">{qrData.academic.attendance.percentage}%</p>
                          <p className="text-xs text-gray-600">Taux</p>
                        </div>
                      </div>
                    </div>

                    {/* Matières */}
                    <div>
                      <h4 className="font-medium mb-2">Matières Suivies</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {qrData.academic.subjects.map((subject, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium text-sm">{subject.name}</p>
                              <p className="text-xs text-gray-600">{subject.teacher}</p>
                            </div>
                            <Badge variant="outline">Coef. {subject.coefficient}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Comportement */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-3">Comportement et Discipline</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Conduite générale:</span>
                          <Badge className={
                            qrData.academic.behavior.conduct === 'Excellent' ? 'bg-green-100 text-green-700' :
                            qrData.academic.behavior.conduct === 'Bien' ? 'bg-blue-100 text-blue-700' :
                            qrData.academic.behavior.conduct === 'Satisfaisant' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {qrData.academic.behavior.conduct}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Points de discipline:</span>
                          <span className="font-medium">{qrData.academic.behavior.disciplinePoints}/100</span>
                        </div>
                        {qrData.academic.behavior.observations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Observations:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {qrData.academic.behavior.observations.map((obs, index) => (
                                <li key={index}>{obs}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Onglet Annonces */}
            {qrData.announcements && (
              <TabsContent value="announcements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Annonces et Communiqués ({qrData.announcements.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {qrData.announcements.map((announcement) => {
                      const getPriorityColor = (priority: string) => {
                        switch (priority) {
                          case 'high': return 'bg-red-100 text-red-700';
                          case 'medium': return 'bg-yellow-100 text-yellow-700';
                          default: return 'bg-blue-100 text-blue-700';
                        }
                      };

                      const getTypeIcon = (type: string) => {
                        switch (type) {
                          case 'urgent': return <AlertTriangle className="h-4 w-4" />;
                          case 'exam': return <GraduationCap className="h-4 w-4" />;
                          case 'event': return <Calendar className="h-4 w-4" />;
                          default: return <Bell className="h-4 w-4" />;
                        }
                      };

                      return (
                        <div key={announcement.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(announcement.type)}
                              <h4 className="font-medium">{announcement.title}</h4>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(announcement.priority)}>
                                {announcement.priority}
                              </Badge>
                              <Badge variant="outline">{announcement.type}</Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Publié le: {new Date(announcement.publishDate).toLocaleDateString('fr-FR')}</span>
                            {announcement.validUntil && (
                              <span>Valide jusqu'au: {new Date(announcement.validUntil).toLocaleDateString('fr-FR')}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Onglet Financier */}
            {qrData.financial && (
              <TabsContent value="financial" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Situation Financière
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Résumé des frais */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total annuel</p>
                        <p className="text-lg font-bold">{qrData.financial.fees.totalAnnual.toLocaleString()} FC</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Payé</p>
                        <p className="text-lg font-bold text-green-600">{qrData.financial.fees.paid.toLocaleString()} FC</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Restant</p>
                        <p className="text-lg font-bold text-orange-600">{qrData.financial.fees.pending.toLocaleString()} FC</p>
                      </div>
                    </div>

                    {/* Échéance */}
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium">Prochaine échéance:</span>
                        <span>{new Date(qrData.financial.fees.dueDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Historique des paiements */}
                    <div>
                      <h4 className="font-medium mb-2">Historique des Paiements</h4>
                      {qrData.financial.paymentHistory.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                          <div>
                            <p className="font-medium">{payment.amount.toLocaleString()} FC</p>
                            <p className="text-sm text-gray-600">{payment.method} - {payment.reference}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bourses */}
                    {qrData.financial.scholarships && qrData.financial.scholarships.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Bourses et Aides</h4>
                        {qrData.financial.scholarships.map((scholarship, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{scholarship.name}</span>
                              <span className="text-green-600 font-bold">{scholarship.amount.toLocaleString()} FC</span>
                            </div>
                            <p className="text-sm text-gray-600">Période: {scholarship.period}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Onglet Contacts */}
            {qrData.contacts && (
              <TabsContent value="contacts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Coordonnées de Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact élève */}
                    {(qrData.contacts.student.phone || qrData.contacts.student.email) && (
                      <div>
                        <h4 className="font-medium mb-2">Contact Élève</h4>
                        <div className="p-3 bg-blue-50 rounded-lg space-y-1">
                          {qrData.contacts.student.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {qrData.contacts.student.phone}
                            </p>
                          )}
                          {qrData.contacts.student.email && (
                            <p className="text-sm text-gray-600">{qrData.contacts.student.email}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Parents */}
                    <div>
                      <h4 className="font-medium mb-2">Parents/Tuteurs</h4>
                      {qrData.contacts.parents.map((parent, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{parent.name}</span>
                            <Badge variant="outline">{parent.relationship}</Badge>
                          </div>
                          <p className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            {parent.phone}
                          </p>
                          {parent.email && (
                            <p className="text-sm text-gray-600">{parent.email}</p>
                          )}
                          {parent.profession && (
                            <p className="text-sm text-gray-600">Profession: {parent.profession}</p>
                          )}
                          {parent.address && (
                            <p className="text-sm text-gray-600">Adresse: {parent.address}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Contacts d'urgence */}
                    <div>
                      <h4 className="font-medium mb-2">Contacts d'Urgence</h4>
                      {qrData.contacts.emergencyContacts.map((contact, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg mb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-sm text-gray-600">{contact.relationship}</span>
                          </div>
                          <p className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

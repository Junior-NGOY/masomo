"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  FileText,
  Download,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Printer,
  Share,
  MessageSquare,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { MockDataService } from "@/services/mockServices";
import { 
  AssignmentMockService, 
  Assignment, 
  AssignmentSubmission 
} from "@/services/assignmentMockService";

interface AssignmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onEdit?: (assignment: Assignment) => void;
}

interface ClassType {
  id: string;
  name: string;
  level: string;
  section: string;
  capacity: number;
  currentStudents: number;
}

interface SubjectType {
  id: string;
  name: string;
  code: string;
  category: string;
}

interface TeacherType {
  id: string;
  name: string;
  email: string;
  subject: string;
}

export default function AssignmentViewModal({
  isOpen,
  onClose,
  assignment,
  onEdit
}: AssignmentViewModalProps) {
  const [activeTab, setActiveTab] = React.useState("details");
  const [submissions, setSubmissions] = React.useState<AssignmentSubmission[]>([]);

  // Récupération des données
  const classes: ClassType[] = MockDataService.classes.getAll();
  const subjects: SubjectType[] = MockDataService.subjects.getAll();
  const teachers: TeacherType[] = MockDataService.teachers.getAll();

  React.useEffect(() => {
    if (assignment) {
      const assignmentSubmissions = AssignmentMockService.getSubmissionsByAssignment(assignment.id);
      setSubmissions(assignmentSubmissions);
    }
  }, [assignment]);

  if (!assignment) return null;

  const subject = subjects.find(s => s.id === assignment.subjectId);
  const classe = classes.find(c => c.id === assignment.classId);
  const teacher = teachers.find(t => t.id === assignment.teacherId);

  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date() && assignment.status === 'ACTIVE';
  const timeUntilDue = dueDate.getTime() - new Date().getTime();
  const daysUntilDue = Math.ceil(timeUntilDue / (1000 * 60 * 60 * 24));

  // Statistiques des soumissions
  const submissionStats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'SUBMITTED').length,
    graded: submissions.filter(s => s.status === 'GRADED').length,
    late: submissions.filter(s => s.status === 'LATE').length,
    pending: submissions.filter(s => s.status === 'MISSING').length
  };

  const submissionRate = classe ? (submissionStats.submitted / classe.currentStudents) * 100 : 0;
  const gradingProgress = submissionStats.total > 0 ? (submissionStats.graded / submissionStats.total) * 100 : 0;

  const averageScore = submissions
    .filter(s => s.score !== null)
    .reduce((sum, s) => sum + (s.score || 0), 0) / submissionStats.graded || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubmissionStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'GRADED': return <Award className="h-4 w-4 text-blue-600" />;
      case 'LATE': return <Clock className="h-4 w-4 text-red-600" />;
      case 'MISSING': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getGradeColor = (score: number, maxPoints: number) => {
    const percentage = (score / maxPoints) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Lien copié dans le presse-papiers !');
  };

  const handleDownloadSubmissions = () => {
    alert('Téléchargement des soumissions en cours...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6" />
                {assignment.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {subject && (
                  <Badge variant="outline">{subject.name}</Badge>
                )}
                {classe && (
                  <Badge variant="outline">{classe.name}</Badge>
                )}
                <Badge variant="outline" className={getStatusColor(assignment.status)}>
                  {assignment.status === 'ACTIVE' ? 'Actif' : 
                   assignment.status === 'COMPLETED' ? 'Terminé' : 
                   assignment.status === 'OVERDUE' ? 'En retard' : 'Brouillon'}
                </Badge>
                {isOverdue && (
                  <Badge variant="destructive">En retard</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(assignment)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="submissions">
              Soumissions ({submissionStats.total})
            </TabsTrigger>
            <TabsTrigger value="grading">Notation</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          {/* Détails de l'assignement */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Informations principales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Description</div>
                      <div className="mt-1">{assignment.description}</div>
                    </div>

                    {assignment.instructions && (
                      <div>
                        <div className="text-sm font-medium text-gray-600">Instructions</div>
                        <div className="mt-1 whitespace-pre-wrap">{assignment.instructions}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600">Type</div>
                        <div className="mt-1 capitalize">
                          {assignment.type === 'HOMEWORK' ? 'Devoir à la maison' :
                           assignment.type === 'PROJECT' ? 'Projet' :
                           assignment.type === 'QUIZ' ? 'Quiz' : 'Examen'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Points maximum</div>
                        <div className="mt-1 font-semibold">{assignment.maxPoints} points</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-600">Difficulté</div>
                      <div className="mt-1">
                        <span className="capitalize">
                          {assignment.difficulty === 'EASY' ? 'Facile' :
                           assignment.difficulty === 'MEDIUM' ? 'Moyenne' : 'Difficile'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Échéance et progression */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Échéance et Progression</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Date d'échéance</div>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                          {dueDate.toLocaleString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {!isOverdue && daysUntilDue >= 0 && (
                        <div className="text-sm text-gray-600 mt-1">
                          {daysUntilDue === 0 ? 'Aujourd\'hui' : 
                           daysUntilDue === 1 ? 'Demain' : 
                           `Dans ${daysUntilDue} jours`}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-600">Taux de soumission</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{submissionStats.submitted} / {classe?.currentStudents || 0} élèves</span>
                          <span>{Math.round(submissionRate)}%</span>
                        </div>
                        <Progress value={submissionRate} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-600">Progression de la notation</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{submissionStats.graded} / {submissionStats.total} notées</span>
                          <span>{Math.round(gradingProgress)}%</span>
                        </div>
                        <Progress value={gradingProgress} className="h-2" />
                      </div>
                    </div>

                    {teacher && (
                      <div>
                        <div className="text-sm font-medium text-gray-600">Enseignant</div>
                        <div className="mt-1 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{teacher.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pièces jointes */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pièces jointes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignment.attachments.map((attachmentName, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium">{attachmentName}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Soumissions */}
          <TabsContent value="submissions" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{submissionStats.submitted}</div>
                  <div className="text-sm text-gray-600">Soumises</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{submissionStats.pending}</div>
                  <div className="text-sm text-gray-600">En attente</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{submissionStats.graded}</div>
                  <div className="text-sm text-gray-600">Notées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{submissionStats.late}</div>
                  <div className="text-sm text-gray-600">En retard</div>
                </div>
              </div>
              <Button onClick={handleDownloadSubmissions}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger tout
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Élève</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date de soumission</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Commentaires</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {submission.studentName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{submission.studentName}</div>
                                {submission.status === 'LATE' && (
                                  <Badge variant="destructive" className="text-xs">En retard</Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getSubmissionStatusIcon(submission.status)}
                              <span className="capitalize">
                                {submission.status === 'SUBMITTED' ? 'Soumise' :
                                 submission.status === 'GRADED' ? 'Notée' : 
                                 submission.status === 'LATE' ? 'En retard' : 'Manquante'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {submission.submittedAt ? 
                              new Date(submission.submittedAt).toLocaleString('fr-FR') : 
                              '-'}
                          </TableCell>
                          <TableCell>
                            {submission.score !== null ? (
                              <span className={`font-semibold ${getGradeColor(submission.score!, assignment.maxPoints)}`}>
                                {submission.score}/{assignment.maxPoints}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {submission.feedback ? (
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">Commentaire</span>
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notation */}
          <TabsContent value="grading" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Moyenne de la classe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore.toFixed(1)}/{assignment.maxPoints}</div>
                  <div className="text-sm text-gray-600">
                    {((averageScore / assignment.maxPoints) * 100).toFixed(0)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Taux de réussite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {submissions.filter(s => s.score && (s.score / assignment.maxPoints) >= 0.5).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Sur {submissionStats.graded} notées
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Notation restante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {submissionStats.submitted - submissionStats.graded}
                  </div>
                  <div className="text-sm text-gray-600">Soumissions à noter</div>
                </CardContent>
              </Card>
            </div>

            {/* Distribution des notes */}
            <Card>
              <CardHeader>
                <CardTitle>Distribution des notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {['0-4', '5-8', '9-12', '13-16', '17-20'].map((range, index) => {
                      const count = Math.floor(Math.random() * 10);
                      const maxCount = 10;
                      const height = (count / maxCount) * 100;
                      
                      return (
                        <div key={range} className="space-y-2">
                          <div className="text-xs text-gray-600">{range}</div>
                          <div className="h-20 bg-gray-100 rounded flex items-end justify-center">
                            <div 
                              className="bg-blue-500 rounded-b w-full flex items-end justify-center text-white text-xs font-semibold"
                              style={{ height: `${height}%`, minHeight: count > 0 ? '16px' : '0' }}
                            >
                              {count > 0 && count}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyses */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendances
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Soumissions à temps</span>
                      <span className="font-semibold text-green-600">
                        {submissionStats.submitted - submissionStats.late}/{submissionStats.submitted}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taux de participation</span>
                      <span className="font-semibold">{Math.round(submissionRate)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Temps moyen de soumission</span>
                      <span className="font-semibold">2.3 jours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Comparaisons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">vs moyenne de la matière</span>
                      <span className="font-semibold text-blue-600">+1.2 points</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">vs assignements précédents</span>
                      <span className="font-semibold text-green-600">+0.8 points</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Difficulté perçue</span>
                      <span className="font-semibold">Moyenne</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommandations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Considérer un rappel pour les élèves n'ayant pas encore soumis",
                    "Les résultats sont conformes aux attentes de la classe", 
                    "Prévoir un soutien pour les élèves en difficulté identifiés"
                  ].map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Upload,
  X,
  Plus,
  FileText,
  AlertCircle,
  BookOpen,
  Users,
  Award
} from "lucide-react";
import { MockDataService } from "@/services/mockServices";
import { AssignmentMockService, Assignment } from "@/services/assignmentMockService";

interface AssignmentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: Assignment | null;
  onSave: (assignment: Assignment) => void;
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

export default function AssignmentCreationModal({
  isOpen,
  onClose,
  assignment,
  onSave
}: AssignmentCreationModalProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    instructions: '',
    subjectId: '',
    classId: '',
    teacherId: '',
    dueDate: '',
    dueTime: '',
    type: 'HOMEWORK' as 'HOMEWORK' | 'PROJECT' | 'QUIZ' | 'EXAM',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    maxPoints: 20,
    allowLateSubmission: true,
    lateSubmissionPenalty: 10,
    attachments: [] as File[]
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Récupération des données
  const classes: ClassType[] = MockDataService.classes.getAll();
  const subjects: SubjectType[] = MockDataService.subjects.getAll();
  const teachers: TeacherType[] = MockDataService.teachers.getAll();

  // Réinitialisation du formulaire quand le modal s'ouvre/ferme
  React.useEffect(() => {
    if (isOpen) {
      if (assignment) {
        // Mode édition
        const dueDateTime = new Date(assignment.dueDate);
        setFormData({
          title: assignment.title,
          description: assignment.description,
          instructions: assignment.instructions || '',
          subjectId: assignment.subjectId,
          classId: assignment.classId,
          teacherId: assignment.teacherId,
          dueDate: dueDateTime.toISOString().split('T')[0],
          dueTime: dueDateTime.toTimeString().slice(0, 5),
          type: assignment.type,
          priority: 'MEDIUM', // valeur par défaut car pas dans l'interface
          maxPoints: assignment.maxPoints,
          allowLateSubmission: true, // valeur par défaut
          lateSubmissionPenalty: 10, // valeur par défaut
          attachments: []
        });
      } else {
        // Mode création - réinitialiser
        setFormData({
          title: '',
          description: '',
          instructions: '',
          subjectId: '',
          classId: '',
          teacherId: '',
          dueDate: '',
          dueTime: '23:59',
          type: 'HOMEWORK',
          priority: 'MEDIUM',
          maxPoints: 20,
          allowLateSubmission: true,
          lateSubmissionPenalty: 10,
          attachments: []
        });
      }
      setErrors({});
    }
  }, [isOpen, assignment]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Veuillez sélectionner une matière';
    }

    if (!formData.classId) {
      newErrors.classId = 'Veuillez sélectionner une classe';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Veuillez sélectionner un enseignant';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est obligatoire';
    } else {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      if (dueDateTime <= new Date()) {
        newErrors.dueDate = 'La date d\'échéance doit être dans le futur';
      }
    }

    if (formData.maxPoints <= 0) {
      newErrors.maxPoints = 'Le nombre de points doit être supérieur à 0';
    }

    if (formData.allowLateSubmission && (formData.lateSubmissionPenalty < 0 || formData.lateSubmissionPenalty > 100)) {
      newErrors.lateSubmissionPenalty = 'La pénalité doit être entre 0 et 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      
      const assignmentData: Omit<Assignment, 'id' | 'createdDate' | 'updatedDate'> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructions: formData.instructions.trim(),
        subjectId: formData.subjectId,
        subject: getSubjectName(formData.subjectId),
        classId: formData.classId,
        className: getClassName(formData.classId),
        teacherId: formData.teacherId,
        teacherName: getTeacherName(formData.teacherId),
        assignedDate: new Date().toISOString(),
        dueDate: dueDateTime.toISOString(),
        type: formData.type,
        status: 'ACTIVE',
        maxPoints: formData.maxPoints,
        submissionCount: 0,
        totalStudents: classes.find(c => c.id === formData.classId)?.currentStudents || 0,
        estimatedDuration: 60, // valeur par défaut
        difficulty: 'MEDIUM',
        tags: [],
        createdBy: formData.teacherId,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        attachments: formData.attachments.map(file => file.name)
      };

      let savedAssignment: Assignment;
      
      if (assignment) {
        // Mode édition
        savedAssignment = AssignmentMockService.updateAssignment(assignment.id, assignmentData)!;
      } else {
        // Mode création
        savedAssignment = AssignmentMockService.createAssignment(assignmentData);
      }

      onSave(savedAssignment);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectName = (id: string) => {
    return subjects.find(s => s.id === id)?.name || '';
  };

  const getClassName = (id: string) => {
    return classes.find(c => c.id === id)?.name || '';
  };

  const getTeacherName = (id: string) => {
    return teachers.find(t => t.id === id)?.name || '';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HOMEWORK': return BookOpen;
      case 'PROJECT': return FileText;
      case 'QUIZ': return AlertCircle;
      case 'EXAM': return Users;
      default: return FileText;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {assignment ? 'Modifier l\'assignement' : 'Nouvel Assignement'}
          </DialogTitle>
          <DialogDescription>
            {assignment 
              ? 'Modifiez les détails de cet assignement'
              : 'Créez un nouvel assignement pour vos élèves'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Exercices de mathématiques"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOMEWORK">Devoir à la maison</SelectItem>
                      <SelectItem value="PROJECT">Projet</SelectItem>
                      <SelectItem value="QUIZ">Quiz</SelectItem>
                      <SelectItem value="EXAM">Examen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description courte de l'assignement"
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions détaillées</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Instructions détaillées pour les élèves..."
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  Détaillez ce que les élèves doivent faire, les ressources nécessaires, etc.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attribution */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h4 className="font-medium text-lg mb-4">Attribution</h4>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="subject">Matière *</Label>
                  <Select 
                    value={formData.subjectId} 
                    onValueChange={(value) => handleInputChange('subjectId', value)}
                  >
                    <SelectTrigger className={errors.subjectId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectId && (
                    <p className="text-sm text-red-600">{errors.subjectId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Classe *</Label>
                  <Select 
                    value={formData.classId} 
                    onValueChange={(value) => handleInputChange('classId', value)}
                  >
                    <SelectTrigger className={errors.classId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classe) => (
                        <SelectItem key={classe.id} value={classe.id}>
                          {classe.name} ({classe.currentStudents} élèves)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.classId && (
                    <p className="text-sm text-red-600">{errors.classId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacher">Enseignant *</Label>
                  <Select 
                    value={formData.teacherId} 
                    onValueChange={(value) => handleInputChange('teacherId', value)}
                  >
                    <SelectTrigger className={errors.teacherId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner un enseignant" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.teacherId && (
                    <p className="text-sm text-red-600">{errors.teacherId}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h4 className="font-medium text-lg mb-4">Paramètres</h4>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Date d'échéance *</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className={errors.dueDate ? 'border-red-500' : ''}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="time"
                        value={formData.dueTime}
                        onChange={(e) => handleInputChange('dueTime', e.target.value)}
                      />
                    </div>
                  </div>
                  {errors.dueDate && (
                    <p className="text-sm text-red-600">{errors.dueDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Faible</SelectItem>
                      <SelectItem value="MEDIUM">Moyenne</SelectItem>
                      <SelectItem value="HIGH">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPoints">Points maximum</Label>
                  <Input
                    id="maxPoints"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxPoints}
                    onChange={(e) => handleInputChange('maxPoints', parseInt(e.target.value) || 20)}
                    className={errors.maxPoints ? 'border-red-500' : ''}
                  />
                  {errors.maxPoints && (
                    <p className="text-sm text-red-600">{errors.maxPoints}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Remise tardive autorisée</Label>
                    <p className="text-sm text-gray-600">
                      Permettre aux élèves de rendre après la date limite
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={formData.allowLateSubmission ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('allowLateSubmission', !formData.allowLateSubmission)}
                  >
                    {formData.allowLateSubmission ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>

                {formData.allowLateSubmission && (
                  <div className="space-y-2">
                    <Label htmlFor="lateSubmissionPenalty">Pénalité pour retard (%)</Label>
                    <Input
                      id="lateSubmissionPenalty"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.lateSubmissionPenalty}
                      onChange={(e) => handleInputChange('lateSubmissionPenalty', parseInt(e.target.value) || 0)}
                      className={errors.lateSubmissionPenalty ? 'border-red-500' : ''}
                    />
                    {errors.lateSubmissionPenalty && (
                      <p className="text-sm text-red-600">{errors.lateSubmissionPenalty}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pièces jointes */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-lg">Pièces jointes</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter des fichiers
                </Button>
              </div>
              
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">
                Formats acceptés: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG • Taille max: 10MB par fichier
              </p>
            </CardContent>
          </Card>

          {/* Aperçu */}
          {(formData.title || formData.subjectId || formData.classId) && (
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium text-lg mb-4">Aperçu</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {React.createElement(getTypeIcon(formData.type), { 
                        className: "h-5 w-5 text-blue-600" 
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">
                        {formData.title || 'Titre de l\'assignement'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {formData.subjectId && (
                          <Badge variant="outline">
                            {getSubjectName(formData.subjectId)}
                          </Badge>
                        )}
                        {formData.classId && (
                          <Badge variant="outline">
                            {getClassName(formData.classId)}
                          </Badge>
                        )}
                        <Badge variant="outline" className={getPriorityColor(formData.priority)}>
                          {formData.priority === 'HIGH' ? 'Priorité élevée' : 
                           formData.priority === 'MEDIUM' ? 'Priorité moyenne' : 'Priorité faible'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {formData.description && (
                    <p className="text-gray-700 ml-14">{formData.description}</p>
                  )}

                  <div className="flex items-center gap-4 ml-14 text-sm text-gray-600">
                    {formData.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(`${formData.dueDate}T${formData.dueTime}`).toLocaleString('fr-FR')}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {formData.maxPoints} points
                    </div>
                    {formData.teacherId && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {getTeacherName(formData.teacherId)}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {assignment ? 'Modification...' : 'Création...'}
              </>
            ) : (
              <>
                {assignment ? 'Modifier' : 'Créer'} l'assignement
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

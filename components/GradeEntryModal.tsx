"use client";

import React, { useState } from "react";
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { BookOpen, Users, Calculator, FileText, Trophy, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

// Types (à synchroniser avec shared-types.md plus tard)
interface GradeFormData {
  examId: string;
  studentGrades: {
    studentId: string;
    marks: number;
  }[];
}

interface Student {
  id: string;
  name: string;
  rollNo: string;
  imageUrl?: string;
}

interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  totalMarks: number;
  type: string;
  className: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
}

// Mock data - remplacer par des appels API réels
const mockExams: Exam[] = [
  {
    id: "exam_001",
    name: "Contrôle Mathématiques Q1",
    subject: "Mathématiques",
    date: "2025-01-20",
    totalMarks: 100,
    type: "MIDTERM",
    className: "6ème Primaire A"
  },
  {
    id: "exam_002", 
    name: "Interrogation Français",
    subject: "Français",
    date: "2025-01-22",
    totalMarks: 50,
    type: "QUIZ",
    className: "6ème Primaire A"
  }
];

const mockStudents: Student[] = [
  {
    id: "std_001",
    name: "Mukendi Jean",
    rollNo: "001",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "std_002",
    name: "Kasongo Marie", 
    rollNo: "002",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "std_003",
    name: "Mbuyi Pierre",
    rollNo: "003",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "std_004",
    name: "Tshiala Grace",
    rollNo: "004", 
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

const examTypes = [
  { value: "QUIZ", label: "Interrogation", color: "bg-blue-100 text-blue-800" },
  { value: "MIDTERM", label: "Contrôle", color: "bg-green-100 text-green-800" },
  { value: "FINAL", label: "Examen Final", color: "bg-purple-100 text-purple-800" },
  { value: "PROJECT", label: "Projet", color: "bg-orange-100 text-orange-800" }
];

export default function GradeEntryModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [studentMarks, setStudentMarks] = useState<{[key: string]: number}>({});
  const [entryProgress, setEntryProgress] = useState(0);
  
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<GradeFormData>();

  const onSubmit = async (data: GradeFormData) => {
    try {
      setLoading(true);
      
      // Préparer les données des notes
      const gradesData = Object.entries(studentMarks).map(([studentId, marks]) => ({
        studentId,
        marks: marks || 0
      })).filter(grade => grade.marks > 0);

      const submissionData = {
        examId: selectedExam?.id,
        studentGrades: gradesData
      };
      
      // TODO: Remplacer par l'appel API réel
      console.log("Enregistrement des notes:", submissionData);
      
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${gradesData.length} notes enregistrées avec succès!`);
      setOpen(false);
      reset();
      setSelectedExam(null);
      setStudentMarks({});
      setEntryProgress(0);
      
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des notes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamSelect = (examId: string) => {
    const exam = mockExams.find(e => e.id === examId);
    setSelectedExam(exam || null);
    setStudentMarks({});
    setEntryProgress(0);
    setValue("examId", examId);
  };

  const handleMarkChange = (studentId: string, marks: number) => {
    if (selectedExam && marks >= 0 && marks <= selectedExam.totalMarks) {
      setStudentMarks(prev => ({
        ...prev,
        [studentId]: marks
      }));
      
      // Calculer le progrès de saisie
      const filledMarks = Object.values({...studentMarks, [studentId]: marks}).filter(mark => mark > 0).length;
      const progress = (filledMarks / mockStudents.length) * 100;
      setEntryProgress(progress);
    }
  };

  const calculateGrade = (marks: number, totalMarks: number): string => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-green-600 bg-green-100";
      case "B":
        return "text-blue-600 bg-blue-100";
      case "C":
        return "text-yellow-600 bg-yellow-100";
      case "D":
        return "text-orange-600 bg-orange-100";
      case "F":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getExamTypeDetails = (type: string) => {
    return examTypes.find(t => t.value === type);
  };

  const enteredGradesCount = Object.values(studentMarks).filter(mark => mark > 0).length;
  const averageMarks = enteredGradesCount > 0 
    ? Object.values(studentMarks).reduce((sum, mark) => sum + mark, 0) / enteredGradesCount
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <BookOpen className="h-4 w-4 mr-2" />
          Saisir des Notes
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-600" />
            Saisie des Notes d'Examen
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un examen et saisissez les notes pour chaque élève
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sélection de l'examen */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Examen *
            </Label>
            <Select onValueChange={handleExamSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un examen" />
              </SelectTrigger>
              <SelectContent>
                {mockExams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-medium">{exam.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({exam.subject})</span>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getExamTypeDetails(exam.type)?.color}>
                          {getExamTypeDetails(exam.type)?.label}
                        </Badge>
                        <span className="text-sm text-gray-500">/{exam.totalMarks}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Détails de l'examen sélectionné */}
          {selectedExam && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Détails de l'examen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Matière</p>
                    <p className="font-medium">{selectedExam.subject}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(selectedExam.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total des points</p>
                    <p className="font-medium">{selectedExam.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Classe</p>
                    <p className="font-medium">{selectedExam.className}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progrès de saisie */}
          {selectedExam && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progrès de saisie</span>
                  <span className="text-sm text-gray-600">
                    {enteredGradesCount}/{mockStudents.length} élèves
                  </span>
                </div>
                <Progress value={entryProgress} className="mb-2" />
                {enteredGradesCount > 0 && (
                  <div className="text-sm text-gray-600">
                    Moyenne actuelle: {averageMarks.toFixed(1)}/{selectedExam.totalMarks}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Saisie des notes par élève */}
          {selectedExam && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Notes des élèves
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStudents.map((student) => {
                    const marks = studentMarks[student.id] || 0;
                    const grade = marks > 0 ? calculateGrade(marks, selectedExam.totalMarks) : "";
                    const percentage = marks > 0 ? ((marks / selectedExam.totalMarks) * 100).toFixed(1) : "";

                    return (
                      <div
                        key={student.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        {/* Photo et infos élève */}
                        <div className="flex items-center gap-3 flex-1">
                          <Image
                            src={student.imageUrl || "/images/student.png"}
                            alt={student.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">N° {student.rollNo}</p>
                          </div>
                        </div>

                        {/* Saisie de la note */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max={selectedExam.totalMarks}
                              step="0.5"
                              placeholder="0"
                              value={marks || ""}
                              onChange={(e) => handleMarkChange(student.id, parseFloat(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-gray-500">/{selectedExam.totalMarks}</span>
                          </div>

                          {/* Pourcentage et note */}
                          {marks > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{percentage}%</span>
                              <Badge className={`${getGradeColor(grade)} text-xs px-2`}>
                                {grade}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Astuce:</strong> Vous pouvez utiliser des décimales (ex: 15.5) pour plus de précision.
                    Appuyez sur Tab pour passer à l'élève suivant.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Résumé avant sauvegarde */}
          {selectedExam && enteredGradesCount > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-green-900 mb-3">Résumé des notes</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-800">
                  <div>
                    <p className="text-green-600">Notes saisies</p>
                    <p className="font-medium">{enteredGradesCount}/{mockStudents.length}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Moyenne de classe</p>
                    <p className="font-medium">{averageMarks.toFixed(1)}/{selectedExam.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Pourcentage moyen</p>
                    <p className="font-medium">{((averageMarks / selectedExam.totalMarks) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-green-600">Note moyenne</p>
                    <p className="font-medium">
                      {averageMarks > 0 ? calculateGrade(averageMarks, selectedExam.totalMarks) : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedExam || enteredGradesCount === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Enregistrement..." : `Enregistrer ${enteredGradesCount} note(s)`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

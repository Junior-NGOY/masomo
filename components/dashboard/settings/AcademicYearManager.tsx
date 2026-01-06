"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, Plus, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useSchoolStore from "@/store/school";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  _count?: {
    fees: number;
    payments: number;
    grades: number;
    studentAttendance: number;
  };
}

export default function AcademicYearManager() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { school } = useSchoolStore();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isActive: false
  });

  const fetchYears = useCallback(async () => {
    if (!school?.id) return;
    try {
      const response = await api.get(`/academic-years?schoolId=${school.id}`);
      setYears(response.data.data);
    } catch (error) {
      console.error("Failed to fetch academic years", error);
    } finally {
      setLoading(false);
    }
  }, [school?.id]);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school?.id) return;

    try {
      await api.post("/academic-years", {
        ...formData,
        schoolId: school.id
      });
      toast.success("Année académique créée avec succès");
      setIsDialogOpen(false);
      fetchYears();
      setFormData({ name: "", startDate: "", endDate: "", isActive: false });
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await api.put(`/academic-years/${id}`, { isActive: true });
      toast.success("Année académique activée");
      fetchYears();
    } catch (error) {
      toast.error("Erreur lors de l'activation");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Années Académiques</CardTitle>
          <CardDescription>
            Gérez les années scolaires de votre établissement.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Année
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une année académique</DialogTitle>
              <DialogDescription>
                Définissez les dates de début et de fin pour la nouvelle année scolaire.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom (ex: 2025-2026)</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input 
                    id="endDate" 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Définir comme année active</Label>
              </div>
              <Button type="submit" className="w-full">Créer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {years.map((year) => (
            <div
              key={year.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{year.name}</p>
                    {year.isActive && (
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!year.isActive && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetActive(year.id)}
                  >
                    Activer
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {years.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune année académique trouvée.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

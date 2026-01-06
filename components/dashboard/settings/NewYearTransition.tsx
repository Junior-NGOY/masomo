"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSchoolStore from "@/store/school";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function NewYearTransition() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { school } = useSchoolStore();

  const [newYearData, setNewYearData] = useState({
    name: "",
    startDate: "",
    endDate: ""
  });

  const handleTransition = async () => {
    if (!school?.id) return;
    setLoading(true);
    try {
      // 1. Create new academic year and set as active
      // This implicitly "archives" the old data because the system filters by active year
      await api.post("/academic-years", {
        ...newYearData,
        schoolId: school.id,
        isActive: true
      });

      setStep(3); // Success step
      toast.success("Nouvelle année scolaire configurée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la transition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/10">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-orange-600" />
          <CardTitle className="text-orange-700 dark:text-orange-400">Transition Annuelle</CardTitle>
        </div>
        <CardDescription className="text-orange-600/80 dark:text-orange-400/80">
          Préparez votre établissement pour une nouvelle année scolaire.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cette action permet de clôturer l'année en cours et d'en démarrer une nouvelle. 
            Vos données historiques (notes, paiements, présences) seront conservées mais archivées.
            Les classes, enseignants et élèves resteront disponibles pour la nouvelle année.
          </p>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-orange-600 hover:bg-orange-700 text-white">
                Démarrer une nouvelle année
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              {step === 1 && (
                <>
                  <DialogHeader>
                    <DialogTitle>Configuration de la nouvelle année</DialogTitle>
                    <DialogDescription>
                      Définissez les paramètres pour la prochaine rentrée scolaire.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nom de la nouvelle année</Label>
                      <Input 
                        placeholder="ex: 2026-2027" 
                        value={newYearData.name}
                        onChange={(e) => setNewYearData({...newYearData, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date de début</Label>
                        <Input 
                          type="date" 
                          value={newYearData.startDate}
                          onChange={(e) => setNewYearData({...newYearData, startDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date de fin</Label>
                        <Input 
                          type="date" 
                          value={newYearData.endDate}
                          onChange={(e) => setNewYearData({...newYearData, endDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Attention</AlertTitle>
                      <AlertDescription>
                        L'année en cours sera marquée comme terminée. Les nouvelles données seront associées à cette nouvelle année.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button onClick={() => setStep(2)} disabled={!newYearData.name || !newYearData.startDate}>
                      Continuer
                    </Button>
                  </DialogFooter>
                </>
              )}

              {step === 2 && (
                <>
                  <DialogHeader>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogDescription>
                      Veuillez confirmer le passage à la nouvelle année scolaire.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 space-y-4">
                    <div className="flex items-center p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">Nouvelle Année : {newYearData.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Du {newYearData.startDate} au {newYearData.endDate}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      En cliquant sur "Confirmer", le système basculera automatiquement sur cette nouvelle année.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700" 
                      onClick={handleTransition}
                      disabled={loading}
                    >
                      {loading ? "Traitement..." : "Confirmer la transition"}
                    </Button>
                  </DialogFooter>
                </>
              )}

              {step === 3 && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6" />
                      Transition réussie !
                    </DialogTitle>
                    <DialogDescription>
                      La nouvelle année scolaire a été configurée avec succès.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm">
                      Vous pouvez maintenant commencer à inscrire des élèves, configurer les frais et gérer les emplois du temps pour l'année {newYearData.name}.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => { setIsOpen(false); setStep(1); window.location.reload(); }}>
                      Terminer
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

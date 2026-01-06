import React from "react";
import AcademicYearManager from "@/components/dashboard/settings/AcademicYearManager";
import NewYearTransition from "@/components/dashboard/settings/NewYearTransition";
import { Separator } from "@/components/ui/separator";

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres Généraux</h3>
        <p className="text-sm text-muted-foreground">
          Gérez les configurations générales de votre école.
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-8">
        <AcademicYearManager />
        <Separator />
        <NewYearTransition />
      </div>
    </div>
  );
}

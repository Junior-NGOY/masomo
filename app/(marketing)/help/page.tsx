import HelpPage from "@/components/frontend/help-page";
import SectionHeader from "@/components/frontend/section-header";
import React from "react";

export default function page() {
  return (
    <div className="py-12">
      <SectionHeader
        title=""
        heading="Centre d'Aide Masomo Pro"
        description="Trouvez des réponses, apprenez les meilleures pratiques et découvrez comment tirer le meilleur parti de votre système de gestion scolaire Masomo Pro. Parcourez notre foire aux questions ou explorez nos guides détaillés."
      />
      <HelpPage />
    </div>
  );
}

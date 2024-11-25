import HelpPage from "@/components/frontend/help-page";
import SectionHeader from "@/components/frontend/section-header";
import React from "react";

export default function page() {
  return (
    <div className="py-12">
      <SectionHeader
        title=""
        heading="Help Center and Ressources"
        description="Trouvez des réponses, apprenez les meilleures pratiques et découvrez comment tirer la meilleure partie de votre système MasomoPro. Parcourez notre foire aux questions ou explorez nos articles utiles pour améliorer votre expérience."
      />
      <HelpPage />
    </div>
  );
}

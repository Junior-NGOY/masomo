import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import SectionHeader from "./section-header";

export default function GridFeatures() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <SectionHeader
          title="Features"
          heading="Student information system"
          description="Centralized student data management"
        />
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* AI Video Editing Card */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Montage vidéo avec IA
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Automatisez les tâches d&apos;édition complexes avec des outils
                basés sur l&apos;IA qui améliorent la qualité vidéo, découpent
                des clips et appliquent des effets sans effort.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative bg-muted rounded-lg overflow-hidden m-6">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-background/95 backdrop-blur-sm border-r z-10">
                  <div className="flex flex-col gap-4 p-3">
                    <div className="w-full aspect-square rounded bg-primary/10 flex items-center justify-center">
                      <RefreshCcw className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-full aspect-square rounded bg-primary/10" />
                    <div className="w-full aspect-square rounded bg-primary/10" />
                    <div className="w-full aspect-square rounded bg-primary/10" />
                  </div>
                </div>
                <Image
                  src="/placeholder.svg?height=400&width=800"
                  width={800}
                  height={400}
                  alt="Interface de montage vidéo"
                  className="w-full object-cover aspect-[2/1]"
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Video Generation Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Génération de vidéos par l&apos;IA
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Créez instantanément des vidéos à partir de scripts, de textes
                ou d&apos;invites visuelles à l&apos;aide de l&apos;IA pour
                générer du contenu de qualité professionnelle avec un minimum
                d&apos;intervention.
              </p>
            </CardHeader>
            <CardContent>
              {
                //images
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import { Wand2, Music, Settings2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabbedFeatures() {
  const voices = [
    { id: "male1", name: "Male Voice 1", type: "male" },
    { id: "male2", name: "Male Voice 2", type: "male" },
    { id: "female1", name: "Female Voice 1", type: "female" },
    { id: "female2", name: "Female Voice 2", type: "female" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid grid-cols-4 gap-4 bg-background p-1">
          <TabsTrigger
            value="voice"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-rose-500" />
              <span>Voix off IA</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="filters"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-orange-500" />
              <span>Bibliothèque de filtres</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-blue-500" />
              <span>Rendu avancé</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="music"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-violet-500" />
              <span>Génération de musique par IA</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="voice" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">
                  Générez une voix off IA pour vos vidéos
                </h2>
                <p className="text-muted-foreground">
                  Générez automatiquement des voix off de haute qualité à
                  l&apos;aide de la technologie de synthèse vocale basée sur
                  l&apos;IA, adaptée au ton et au style de votre vidéo.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span>Voix personnalisables.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span>Contrôle des émotions et de l&apos;intonation.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span>Synchroniser avec le script.</span>
                  </li>
                </ul>
              </div>
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-medium">Choose a Voice</h3>
                <div className="space-y-3">
                  {voices.map((voice) => (
                    <Button
                      key={voice.id}
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        <span>{voice.name}</span>
                      </div>
                      <div className="h-4 w-4 rounded-full border" />
                    </Button>
                  ))}
                  <div className="relative">
                    <input
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Type here..."
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="filters">
            <div className="h-32 rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
              Bibliothèque de filtres content
            </div>
          </TabsContent>
          <TabsContent value="advanced">
            <div className="h-32 rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
              Rendu avancé content
            </div>
          </TabsContent>
          <TabsContent value="music">
            <div className="h-32 rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
              Génération de musique content
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

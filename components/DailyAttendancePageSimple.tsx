"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DailyAttendancePageProps {
  className: string;
  date?: string;
}

export default function DailyAttendancePage({ className, date }: DailyAttendancePageProps): JSX.Element {
  const router = useRouter();
  const targetDate = date || new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Présence - {className}
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {new Date(targetDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Prise de Présence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Composant en cours de reconstruction
            </h3>
            <p className="text-gray-600 mb-4">
              Le système de présence est en cours de mise à jour avec l'intégration biométrique.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p><strong>Classe :</strong> {className}</p>
              <p><strong>Date :</strong> {new Date(targetDate).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={() => router.push(`/dashboard/attendance/students/${encodeURIComponent(className)}`)}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Accéder à la prise de présence
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message d'information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Nouvelle Interface</h4>
              <p className="text-sm text-blue-700 mt-1">
                Utilisez le bouton ci-dessus pour accéder à la nouvelle interface de prise de présence 
                avec support biométrique intégré.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

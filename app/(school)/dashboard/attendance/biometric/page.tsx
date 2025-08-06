import BiometricManagement from "@/components/BiometricManagement";
import { BiometricNotificationCenter } from '@/components/BiometricNotificationCenter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fingerprint, Bell, Settings, Activity } from 'lucide-react';

export default function BiometricPage() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Fingerprint className="w-6 h-6" />
          Système Biométrique
        </h1>
        <p className="text-gray-600 mt-1">
          Gestion complète de l'authentification biométrique
        </p>
      </div>

      {/* Interface à onglets */}
      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Gestion
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activités
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <BiometricManagement />
        </TabsContent>

        <TabsContent value="notifications">
          <BiometricNotificationCenter />
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Journal d'Activités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Journal d'activités détaillé</p>
                <p className="text-sm mt-1">Fonctionnalité en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: "Gestion Biométrique | Masomo Pro",
    description: "Système d'authentification biométrique intégré pour la gestion de présence",
  };
}

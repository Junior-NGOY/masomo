
"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserSession } from "@/store/auth";
import { getRoles, getPermissions, Role, Permission, deleteRole } from "@/actions/security";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, Users, Edit, Trash2, Lock } from "lucide-react";
import { RoleModal } from "@/components/security/RoleModal";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RolesPage() {
  const { toast } = useToast();
  const user = useUserSession((state) => state.user);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.schoolId) return;
    setLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        getRoles(user.schoolId),
        getPermissions()
      ]);
      console.log("Permissions loaded:", permissionsData);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user?.schoolId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setSelectedRole(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete.id);
      toast({ title: "Rôle supprimé" });
      fetchData();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer le rôle", variant: "destructive" });
    } finally {
      setRoleToDelete(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Debug Info */}
      <div className="bg-yellow-100 p-2 text-xs font-mono rounded border border-yellow-300 mb-4">
        DEBUG: User: {user?.name} ({user?.email}) | School ID: {user?.schoolId}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rôles et Permissions</h1>
          <p className="text-muted-foreground">
            Gérez les rôles des utilisateurs et leurs accès aux fonctionnalités.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Rôle
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className={`h-5 w-5 ${role.isSystem ? "text-blue-500" : "text-gray-500"}`} />
                  <CardTitle>{role.name}</CardTitle>
                </div>
                {role.isSystem && <Badge variant="secondary">Système</Badge>}
              </div>
              <CardDescription>{role.description || "Aucune description"}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                {role._count?.users || 0} utilisateurs
              </div>
              
              <div className="flex flex-wrap gap-1 mt-auto">
                {role.permissions.slice(0, 5).map((p) => (
                  <Badge key={p.permission.id} variant="outline" className="text-xs">
                    {p.permission.name}
                  </Badge>
                ))}
                {role.permissions.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{role.permissions.length - 5} autres
                  </Badge>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                {!role.isSystem && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setRoleToDelete(role)}
                    disabled={role._count?.users > 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
        permissions={permissions}
        schoolId={user?.schoolId || ""}
        onSuccess={fetchData}
      />

      <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le rôle sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useUserSession } from "@/store/auth";
import { getRoles } from "@/actions/security";
import { getUsers, updateUserStatus } from "@/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/DataTableComponents/DataTable";
import { getColumns, UserWithRole } from "./columns";
import { UserRoleModal } from "@/components/security/UserRoleModal";

export default function AccessPage() {
  const { toast } = useToast();
  const user = useUserSession((state) => state.user);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.schoolId) return;
    console.log("AccessPage - Fetching data for schoolId:", user.schoolId);
    setLoading(true);
    try {
      const [rolesData, usersData] = await Promise.all([
        getRoles(user.schoolId),
        getUsers(user.schoolId)
      ]);
      console.log("AccessPage - Roles fetched:", rolesData);
      console.log("AccessPage - Users fetched:", usersData);
      setRoles(rolesData);
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.schoolId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleManageAccess = useCallback((user: UserWithRole) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleViewDetails = useCallback((user: UserWithRole) => {
    toast({
      title: "Détails de l'utilisateur",
      description: `Nom: ${user.name}\nEmail: ${user.email}\nRôle: ${user.role || "Aucun"}`,
    });
  }, [toast]);

  const handleToggleStatus = useCallback(async (user: UserWithRole) => {
    try {
      await updateUserStatus(user.id, !user.isActive);
      toast({
        title: "Succès",
        description: `Utilisateur ${user.isActive ? "désactivé" : "activé"} avec succès`,
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur",
        variant: "destructive",
      });
    }
  }, [fetchData, toast]);

  const columns = useMemo(() => getColumns(handleManageAccess, handleViewDetails, handleToggleStatus), [handleManageAccess, handleViewDetails, handleToggleStatus]);

  return (
    <div className="space-y-6 p-6">
      {/* Debug Info */}
      <div className="bg-yellow-100 p-2 text-xs font-mono rounded border border-yellow-300 mb-4">
        DEBUG: User: {user?.name} ({user?.email}) | School ID: {user?.schoolId}
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contrôle d'Accès</h1>
        <p className="text-muted-foreground">
          Gérez les accès des utilisateurs en leur attribuant des rôles.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Utilisateurs et Rôles</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} />
        </CardContent>
      </Card>

      <UserRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        roles={roles}
        onSuccess={fetchData}
      />
    </div>
  );
}


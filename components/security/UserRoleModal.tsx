"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserRole } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  roles: any[];
  onSuccess: () => void;
}

export function UserRoleModal({ isOpen, onClose, user, roles, onSuccess }: UserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && roles.length > 0) {
      const foundRole = roles.find(r => r.name === user.role);
      setSelectedRole(foundRole ? foundRole.id : "no-role");
    }
  }, [user, roles, isOpen]);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUserRole(user.id, selectedRole);
      toast({ title: "Succès", description: "Rôle mis à jour avec succès" });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de mettre à jour le rôle", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gérer les accès pour {user?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rôle</Label>
            {roles.length === 0 ? (
              <div className="p-2 text-sm text-yellow-600 bg-yellow-50 rounded border border-yellow-200">
                Aucun rôle n'a été trouvé pour cette école. Veuillez d'abord créer des rôles dans la section Rôles.
              </div>
            ) : (
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-role">Aucun rôle</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

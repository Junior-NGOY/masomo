
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { createRole, updateRole } from "@/actions/security";
import { useToast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: any;
  permissions: Record<string, Permission[]>;
  schoolId: string;
  onSuccess: () => void;
}

export function RoleModal({ isOpen, onClose, role, permissions, schoolId, onSuccess }: RoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || "");
      setSelectedPermissions(role.permissions.map((p: any) => p.permission.id));
    } else {
      setName("");
      setDescription("");
      setSelectedPermissions([]);
    }
  }, [role, isOpen]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleModuleToggle = (modulePermissions: Permission[]) => {
    const allSelected = modulePermissions.every(p => selectedPermissions.includes(p.id));
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !modulePermissions.find(p => p.id === id)));
    } else {
      const newIds = modulePermissions.map(p => p.id).filter(id => !selectedPermissions.includes(id));
      setSelectedPermissions(prev => [...prev, ...newIds]);
    }
  };

  const handleSubmit = async () => {
    if (!name) return;

    setLoading(true);
    try {
      const data = {
        name,
        description,
        schoolId,
        permissionIds: selectedPermissions
      };

      if (role) {
        await updateRole(role.id, data);
        toast({ title: "Rôle mis à jour avec succès" });
      } else {
        await createRole(data);
        toast({ title: "Rôle créé avec succès" });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{role ? "Modifier le rôle" : "Nouveau rôle"}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4 flex-1 overflow-hidden">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du rôle</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Enseignant" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description du rôle..." />
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <Label className="mb-2 block">Permissions</Label>
            <div className="flex-1 border rounded-md overflow-hidden">
              <ScrollArea className="h-full p-4">
                <Accordion type="multiple" className="w-full">
                {Object.entries(permissions).length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Aucune permission disponible.
                  </div>
                ) : (
                  Object.entries(permissions).map(([module, modulePermissions]) => (
                    <AccordionItem key={module} value={module}>
                      <div className="flex items-center">
                        <Checkbox 
                          checked={modulePermissions.length > 0 && modulePermissions.every(p => selectedPermissions.includes(p.id))}
                          onCheckedChange={() => handleModuleToggle(modulePermissions)}
                          className="mr-2"
                        />
                        <AccordionTrigger className="hover:no-underline flex-1">
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{module}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({modulePermissions.filter(p => selectedPermissions.includes(p.id)).length}/{modulePermissions.length})
                            </span>
                          </div>
                        </AccordionTrigger>
                      </div>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 pl-6 pt-2">
                        {modulePermissions.map((perm) => (
                          <div key={perm.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={perm.id} 
                              checked={selectedPermissions.includes(perm.id)}
                              onCheckedChange={() => handlePermissionToggle(perm.id)}
                            />
                            <label
                              htmlFor={perm.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {perm.action}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  ))
                )}
              </Accordion>
              </ScrollArea>
            </div>
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

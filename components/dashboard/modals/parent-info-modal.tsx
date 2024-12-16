"use client";

import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Flag,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  Users,
  Lock,
  Clock,
  Edit,
  Trash2
} from "lucide-react";

export type Parent = {
  title: string;
  firstname: string;
  lastname: string;
  relationship: string;
  email: string;
  NIN: string;
  gender: string;
  dob: string;
  phone: string;
  nationality: string;
  whatsappNo: string;
  imageUrl: string;
  contactMethod: string;
  occupation: string;
  address: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

interface ParentInfoModalProps {
  parent: Parent;
  onEdit: () => void;
  onDelete: () => void;
}

export function ParentInfoModal({
  parent,
  onEdit,
  onDelete
}: ParentInfoModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Parent Information</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-4 py-2">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-2">
              <AvatarImage
                src={parent.imageUrl}
                alt={`${parent.firstname} ${parent.lastname}`}
              />
              <AvatarFallback>
                {parent.firstname[0]}
                {parent.lastname[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">
              {parent.title} {parent.firstname} {parent.lastname}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<User />}
              label="Relationship"
              value={parent.relationship}
            />
            <InfoItem icon={<Mail />} label="Email" value={parent.email} />
            <InfoItem icon={<CreditCard />} label="NIN" value={parent.NIN} />
            <InfoItem icon={<Users />} label="Gender" value={parent.gender} />
            <InfoItem
              icon={<Calendar />}
              label="Date of Birth"
              value={format(new Date(parent.dob), "PP")}
            />
            <InfoItem icon={<Phone />} label="Phone" value={parent.phone} />
            <InfoItem
              icon={<Flag />}
              label="Nationality"
              value={parent.nationality}
            />
            <InfoItem
              icon={<Phone />}
              label="WhatsApp"
              value={parent.whatsappNo}
            />
            <InfoItem
              icon={<Mail />}
              label="Contact Method"
              value={parent.contactMethod}
            />
            <InfoItem
              icon={<Briefcase />}
              label="Occupation"
              value={parent.occupation}
            />
            <InfoItem
              icon={<MapPin />}
              label="Address"
              value={parent.address}
            />
            <InfoItem icon={<Lock />} label="Password" value="********" />
            <InfoItem
              icon={<Clock />}
              label="Created At"
              value={format(new Date(parent.createdAt), "PPp")}
            />
            <InfoItem
              icon={<Clock />}
              label="Updated At"
              value={format(new Date(parent.updatedAt), "PPp")}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

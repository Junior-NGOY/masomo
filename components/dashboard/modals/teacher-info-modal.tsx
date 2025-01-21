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
  Clock,
  Edit,
  Trash2,
  BookOpen,
  GraduationCap,
  Building
} from "lucide-react";
import { Gender } from "@/types/types";

//export type Gender = "Male" | "Female" | "Other";

export type Teacher = {
  id: string;
  title: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNo: string;
  nationality: string;
  NIN: string;
  gender: Gender;
  dateOfBirth: string;
  contactMethod: string;
  dateOfJoining: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  mainSubject: string;
  mainSubjectId: string;
  subjects: string[];
  imageUrl: string;
  experience: number;
  address: string;
  createdAt: string;
  updatedAt: string;
};

interface TeacherInfoModalProps {
  teacher: Teacher;
  onEdit: () => void;
  onDelete: () => void;
}

export function TeacherInfoModal({
  teacher,
  onEdit,
  onDelete
}: TeacherInfoModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Teacher Information</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-4 py-2">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-2">
              <AvatarImage
                src={teacher.imageUrl}
                alt={`${teacher.firstName} ${teacher.lastName}`}
              />
              <AvatarFallback>
                {teacher.firstName[0]}
                {teacher.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">
              {teacher.title} {teacher.firstName} {teacher.lastName}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<CreditCard />}
              label="Employee ID"
              value={teacher.employeeId}
            />
            <InfoItem icon={<Mail />} label="Email" value={teacher.email} />
            <InfoItem icon={<Phone />} label="Phone" value={teacher.phone} />
            <InfoItem
              icon={<Phone />}
              label="WhatsApp"
              value={teacher.whatsappNo}
            />
            <InfoItem
              icon={<Flag />}
              label="Nationality"
              value={teacher.nationality}
            />
            <InfoItem icon={<CreditCard />} label="NIN" value={teacher.NIN} />
            <InfoItem icon={<Users />} label="Gender" value={teacher.gender} />
            <InfoItem
              icon={<Calendar />}
              label="Date of Birth"
              value={format(new Date(teacher.dateOfBirth), "PP")}
            />
            <InfoItem
              icon={<Mail />}
              label="Contact Method"
              value={teacher.contactMethod}
            />
            <InfoItem
              icon={<Calendar />}
              label="Date of Joining"
              value={format(new Date(teacher.dateOfJoining), "PP")}
            />
            <InfoItem
              icon={<Briefcase />}
              label="Designation"
              value={teacher.designation}
            />
            <InfoItem
              icon={<Building />}
              label="Department"
              value={teacher.departmentName}
            />
            <InfoItem
              icon={<GraduationCap />}
              label="Qualification"
              value={teacher.qualification}
            />
            <InfoItem
              icon={<BookOpen />}
              label="Main Subject"
              value={teacher.mainSubject}
            />
            <InfoItem
              icon={<BookOpen />}
              label="Subjects"
              value={teacher.subjects.join(", ")}
            />
            <InfoItem
              icon={<Clock />}
              label="Experience"
              value={`${teacher.experience} years`}
            />
            <InfoItem
              icon={<MapPin />}
              label="Address"
              value={teacher.address}
            />
            <InfoItem
              icon={<Clock />}
              label="Created At"
              value={format(new Date(teacher.createdAt), "PPp")}
            />
            <InfoItem
              icon={<Clock />}
              label="Updated At"
              value={format(new Date(teacher.updatedAt), "PPp")}
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

"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { deleteStudent } from "@/actions/students";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  User,
  Mail,
  Phone,
  Flag,
  MapPin,
  Book,
  Calendar,
  CreditCard,
  Users,
  Clock,
  Edit,
  Trash2,
  School,
  Bookmark
} from "lucide-react";
import { Student } from "@/types/types";

/* export type Student = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  parentId: string;
  classId: string;
  streamId: string;
  imageUrl: string;
  phone: string;
  state: string;
  BCN: string; // Birth Certificate Number
  nationality: string;
  religion: string;
  gender: string;
  dob: string;
  rollNo: string;
  regNo: string;
  admissionDate: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}; */

interface StudentInfoModalProps {
  student: Student;
}

export function StudentInfoModal({
  student
}: StudentInfoModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function handleDelete() {
    try {
      const res = await deleteStudent(student.id);
      if (res?.ok) {
        toast.success("Student Deleted Successfully");
        setOpen(false);
        router.refresh();
      } else {
         toast.error("Student Couldn't be delete");
      }
    } catch (error) {
      console.log(error);
      toast.error("Student Couldn't be delete");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Student Info</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Student Information</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-4 py-2">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
            <Avatar className="w-24 h-24 mb-2 md:mb-0 md:mr-4">
              <AvatarImage
                src={student.imageUrl}
                alt={`${student.firstName} ${student.lastName}`}
              />
              <AvatarFallback>
                {student.firstName[0]}
                {student.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">
                {student.firstName} {student.lastName}
              </h2>
              <p className=" text-xs text-muted-foreground">ID: {student.id}</p>
              <p className=" text-xs text-muted-foreground">
                Roll No: {student.rollNo}
              </p>
              <p className=" text-xs text-muted-foreground">
                Reg No: {student.regNo}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem icon={<Mail />} label="Email" value={student.email} />
            <InfoItem icon={<Phone />} label="Phone" value={student.phone} />
            <InfoItem
              icon={<MapPin />}
              label="Address"
              value={student.address}
            />
            <InfoItem
              icon={<Flag />}
              label="Nationality"
              value={student.nationality}
            />
            <InfoItem icon={<MapPin />} label="State" value={student.state} />
            <InfoItem icon={<Users />} label="Gender" value={student.gender} />
            <InfoItem
              icon={<Calendar />}
              label="Date of Birth"
              value={format(new Date(student.dob), "PP")}
            />
            <InfoItem
              icon={<Book />}
              label="Religion"
              value={student.religion}
            />
            <InfoItem icon={<CreditCard />} label="BCN" value={student.BCN} />
            <InfoItem
              icon={<School />}
              label="Class "
              value={student?.classTitle || student.classId}
            />
            <InfoItem
              icon={<Bookmark />}
              label="Stream"
              value={student?.streamTitle || student.streamId}
            />
            <InfoItem
              icon={<User />}
              label="Parent"
              value={student?.parentName || student.parentId}
            />
            <InfoItem
              icon={<Calendar />}
              label="Admission Date"
              value={format(new Date(student.admissionDate), "PP")}
            />
            <InfoItem
              icon={<Clock />}
              label="Created At"
              value={format(new Date(student.createdAt), "PPp")}
            />
            <InfoItem
              icon={<Clock />}
              label="Updated At"
              value={format(new Date(student.updatedAt), "PPp")}
            />
          </div>
        </ScrollArea>
       
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => router.push(`/dashboard/students/update/${student.id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {student.firstName} {student.lastName}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant={"destructive"} onClick={handleDelete}>
                  Permanently Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

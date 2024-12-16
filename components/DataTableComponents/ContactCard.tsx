import { useState } from "react";
import { Contact } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Mail, Phone, MapPin, School, Users, BookOpen } from "lucide-react";

interface ContactModalProps {
  contact: Contact;
}

export function ContactInfoModal({ contact }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogDescription>
            View detailed information about {contact.fullName}
          </DialogDescription>
        </DialogHeader>
        <Card className="mt-4 overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-primary-foreground">
                {/* <AvatarImage src={contact?.avatar} alt={contact.fullName} /> */}
                <AvatarFallback>{contact.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {contact.fullName}
                </CardTitle>
                <p className="text-sm opacity-90">{contact.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-2 py-1">
                {contact.fullName}
              </Badge>
              <Badge variant="secondary" className="px-2 py-1">
                Teacher
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.school}</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <span className="text-sm">{contact.country}</span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

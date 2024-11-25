"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Mail,
  MessageCircle,
  Phone,
  Search,
  PhoneIcon as WhatsApp
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Sample articles data
const articles = [
  {
    id: 1,
    title: "Getting Started Guide",
    description: "Learn the basics of our platform",
    category: "Basics"
  },
  {
    id: 2,
    title: "Account Settings",
    description: "Manage your account preferences",
    category: "Account"
  },
  {
    id: 3,
    title: "Billing & Payments",
    description: "Understanding billing cycles and payment methods",
    category: "Billing"
  }
  // Add more articles as needed
];

// Sample FAQ data
const faqs = [
  {
    question: "What is SCHOOLPRO?",
    answer:
      "SCHOOLPRO is a comprehensive school management system designed to streamline administrative tasks, enhance communication between teachers, students, and parents, and improve overall educational processes."
  },
  {
    question: "What features does SCHOOLPRO offer?",
    answer:
      "SCHOOLPRO offers a wide range of features including student information management, attendance tracking, grade management, timetable scheduling, online assignments and quizzes, parent-teacher communication tools, and financial management modules."
  },
  {
    question:
      "Is SCHOOLPRO suitable for all types of educational institutions?",
    answer:
      "Yes, SCHOOLPRO is designed to be flexible and can be customized to suit various types of educational institutions, including primary schools, high schools, colleges, and universities."
  },
  {
    question: "How secure is the data stored in SCHOOLPRO?",
    answer:
      "SCHOOLPRO takes data security very seriously. We use industry-standard encryption protocols, regular backups, and strict access controls to ensure that all sensitive information is protected."
  },
  {
    question:
      "Can parents access information about their child's progress through SCHOOLPRO?",
    answer:
      "SCHOOLPRO includes a parent portal where parents can log in to view their child's attendance, grades, assignments, and communicate with teachers."
  },
  {
    question: "Is technical support available for SCHOOLPRO users?",
    answer:
      "Yes, we offer comprehensive technical support for all SCHOOLPRO users. This includes a dedicated help desk, user manuals, video tutorials, and regular system updates."
  },
  {
    question:
      "Can SCHOOLPRO integrate with other educational tools and software?",
    answer:
      "Yes, SCHOOLPRO is designed with integration capabilities. It can be integrated with various third-party educational tools, learning management systems, and other software commonly used in educational settings."
  },
  {
    question: "Is SCHOOLPRO accessible on mobile devices?",
    answer:
      "Yes, SCHOOLPRO is fully responsive and can be accessed on various devices including desktops, laptops, tablets, and smartphones, ensuring that users can access the system anytime, anywhere."
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-4 max-w-6xl">
      {/* Articles Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Help Articles</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Link href="#" key={article.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{article.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6 md-16 bg-blue-50 p-8 rounded-lg">
        <div className="text-center space-y-2">
          <h2 className="text-sm text-blue-500 font-medium tracking-wider text-primary uppercase">
            Questions Fréquemment Posées
          </h2>
          <p className="text-3xl font-bold">Vous demandez ? Nous répondons</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Besoin d'aide supplémentaire ?</span>
          <Button variant="link" className="text-primary h-auto p-0">
            Contactez-nous
          </Button>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-center">
          Still Need Help?
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Get help via email</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button>Send Email</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Chat with our support team</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button>Start Chat</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Call us directly</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button>Call Now</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

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
    title: "Guide de Démarrage Rapide",
    description: "Apprenez les bases de Masomo Pro en quelques étapes",
    category: "Débuter"
  },
  {
    id: 2,
    title: "Configuration de votre École",
    description: "Comment configurer les classes, sections et années académiques",
    category: "Configuration"
  },
  {
    id: 3,
    title: "Gestion des Frais Scolaires",
    description: "Tout savoir sur la facturation et les paiements échelonnés",
    category: "Finances"
  },
  {
    id: 4,
    title: "Portail Parents - Mode d'emploi",
    description: "Guide complet pour les parents utilisant le portail",
    category: "Parents"
  },
  {
    id: 5,
    title: "Gestion des Notes et Bulletins",
    description: "Comment saisir les notes et générer les bulletins",
    category: "Académique"
  },
  {
    id: 6,
    title: "Présences et Retards",
    description: "Système de suivi des présences et notifications automatiques",
    category: "Présences"
  }
];

// Sample FAQ data
const faqs = [
  {
    question: "Qu'est-ce que Masomo Pro ?",
    answer:
      "Masomo Pro est un système de gestion scolaire complet conçu pour les écoles africaines, particulièrement adaptée au système éducatif de la RDC. Il permet de gérer plusieurs écoles, les finances, les élèves, les enseignants et les parents dans une seule plateforme."
  },
  {
    question: "Quelles sont les principales fonctionnalités de Masomo Pro ?",
    answer:
      "Masomo Pro offre la gestion multi-écoles, la gestion financière (frais scolaires, paiements échelonnés), les portails pour directeurs, enseignants, élèves et parents, la génération automatique de sites web d'école, le suivi des présences, la gestion académique et bien plus."
  },
  {
    question: "Le système prend-il en charge le système éducatif congolais ?",
    answer:
      "Oui, Masomo Pro est spécialement conçu pour le système éducatif de la RDC avec support pour Maternelle, Primaire (1ère-6ème), Secondaire (1ère-6ème) et toutes les sections : Scientifique, Pédagogie, Technique, Commerciale et Littéraire."
  },
  {
    question: "Comment fonctionne la gestion multi-écoles ?",
    answer:
      "Avec un seul compte Masomo Pro, vous pouvez gérer plusieurs établissements scolaires. Chaque école a son propre espace avec ses données séparées, mais vous gardez une vue d'ensemble et des rapports consolidés."
  },
  {
    question: "Les parents peuvent-ils suivre les progrès de leurs enfants ?",
    answer:
      "Absolument ! Le portail parent permet aux parents de voir les notes, l'assiduité, les devoirs de leurs enfants, de payer les frais scolaires en ligne et de communiquer avec les enseignants."
  },
  {
    question: "Comment fonctionne la gestion financière ?",
    answer:
      "Masomo Pro gère tous les types de frais (inscription, minerval, fournitures, documents). Il permet les paiements échelonnés, génère des reçus automatiques et offre des rapports financiers détaillés pour un suivi optimal."
  },
  {
    question: "Le système génère-t-il automatiquement des sites web pour les écoles ?",
    answer:
      "Oui ! Chaque école inscrite reçoit automatiquement son propre site web personnalisable avec les informations de l'école, les actualités, les événements et la possibilité pour les parents de s'inscrire."
  },
  {
    question: "Masomo Pro est-il accessible sur mobile ?",
    answer:
      "Oui, Masomo Pro est entièrement responsive et fonctionne parfaitement sur ordinateurs, tablettes et smartphones. Une application mobile dédiée est en développement."
  },
  {
    question: "Quel support technique est disponible ?",
    answer:
      "Nous offrons un support complet : documentation détaillée, tutoriels vidéo, support par email, chat en direct et assistance téléphonique pour tous nos utilisateurs."
  },
  {
    question: "Comment commencer avec Masomo Pro ?",
    answer:
      "C'est simple ! Créez votre compte gratuit, ajoutez votre première école, configurez les classes et sections, et commencez à inscrire vos élèves. Notre équipe vous accompagne dans la mise en place."
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

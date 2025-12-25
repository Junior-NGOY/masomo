"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentFee, StudentMockDataService } from "@/services/studentMockDataService";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  Receipt,
  CreditCard,
  FileText,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
} from "lucide-react";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: StudentFee | null;
  studentInfo?: {
    name: string;
    className: string;
    imageUrl: string;
    phone: string;
    email: string;
  };
}

export default function PaymentDetailsModal({
  isOpen,
  onClose,
  payment,
  studentInfo,
}: PaymentDetailsModalProps) {
  if (!payment) return null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string; icon: any }> = {
      PAID: { color: "bg-green-100 text-green-800", text: "Payé", icon: CheckCircle },
      PENDING: { color: "bg-orange-100 text-orange-800", text: "En attente", icon: Clock },
      OVERDUE: { color: "bg-red-100 text-red-800", text: "En retard", icon: AlertTriangle },
      PARTIAL: { color: "bg-blue-100 text-blue-800", text: "Partiel", icon: Clock }
    };
    const variant = variants[status] || variants.PENDING;
    const Icon = variant.icon;
    return (
      <Badge className={`${variant.color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {variant.text}
      </Badge>
    );
  };

  const getPaymentProgress = () => {
    if (payment.status === 'PAID') return 100;
    if (payment.status === 'PARTIAL' && payment.remainingAmount) {
      return ((payment.amount - payment.remainingAmount) / payment.amount) * 100;
    }
    return 0;
  };

  const getDaysOverdue = () => {
    if (payment.status === 'OVERDUE') {
      const today = new Date();
      const dueDate = new Date(payment.dueDate);
      return Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Receipt className="h-6 w-6 text-blue-600" />
            Détails du paiement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de l'élève */}
          {studentInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations de l'élève
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {studentInfo.imageUrl && (
                    <Image
                      src={studentInfo.imageUrl}
                      alt={studentInfo.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  )}
                  {!studentInfo.imageUrl && (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200">📷</div>
                  )}
                  <div className="grid gap-1">
                    <h3 className="font-semibold text-lg">{studentInfo.name}</h3>
                    <p className="text-gray-600">{studentInfo.className}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {studentInfo.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {studentInfo.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Résumé du paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Résumé du paiement
                </span>
                {getStatusBadge(payment.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-500">Type de frais</label>
                  <p className="font-semibold text-lg">{payment.feeType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Montant total</label>
                  <p className="font-semibold text-lg text-blue-600">
                    {StudentMockDataService.formatCurrency(payment.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date d'échéance</label>
                  <p className="font-semibold flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(payment.dueDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {payment.paidDate && (
                  <div>
                    <label className="text-sm text-gray-500">Date de paiement</label>
                    <p className="font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {new Date(payment.paidDate).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Barre de progression du paiement */}
              {payment.status === 'PARTIAL' && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression du paiement</span>
                    <span>{Math.round(getPaymentProgress())}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${getPaymentProgress()}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-green-600">
                      Payé: {StudentMockDataService.formatCurrency(payment.amount - (payment.remainingAmount || 0))}
                    </span>
                    <span className="text-orange-600">
                      Restant: {StudentMockDataService.formatCurrency(payment.remainingAmount || 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Alerte retard */}
              {payment.status === 'OVERDUE' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-semibold">Paiement en retard</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    Ce paiement est en retard de {getDaysOverdue()} jour(s).
                    Veuillez procéder au paiement dans les plus brefs délais.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Détails du paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Détails du paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {payment.paymentMethod && (
                  <div>
                    <label className="text-sm text-gray-500">Méthode de paiement</label>
                    <p className="font-semibold">{payment.paymentMethod}</p>
                  </div>
                )}
                {payment.receiptNo && (
                  <div>
                    <label className="text-sm text-gray-500">Numéro de reçu</label>
                    <p className="font-semibold text-blue-600">#{payment.receiptNo}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-500">ID de transaction</label>
                  <p className="font-semibold font-mono text-gray-600">{payment.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Statut</label>
                  <div className="mt-1">
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              </div>

              {payment.notes && (
                <div className="mt-4">
                  <label className="text-sm text-gray-500">Notes</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{payment.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historique des actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Historique des actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-1 bg-blue-200 rounded-full">
                    <FileText className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Frais créé</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.dueDate).toLocaleDateString('fr-FR')} - Frais de {payment.feeType} ajouté
                    </p>
                  </div>
                </div>

                {payment.paidDate && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-1 bg-green-200 rounded-full">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Paiement effectué</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.paidDate).toLocaleDateString('fr-FR')} - 
                        Paiement de {StudentMockDataService.formatCurrency(payment.amount)} via {payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                )}

                {payment.receiptNo && (
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="p-1 bg-purple-200 rounded-full">
                      <Receipt className="h-3 w-3 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reçu généré</p>
                      <p className="text-xs text-gray-500">
                        Reçu #{payment.receiptNo} émis automatiquement
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarification - Masomo Pro',
  description: 'Découvrez nos plans tarifaires pour la gestion scolaire',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Tarification
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choisissez le plan qui convient à votre établissement
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Plan Basique */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900">Plan Basique</h3>
            <p className="mt-4 text-gray-600">
              Parfait pour les petites écoles
            </p>
            <div className="mt-8">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-600">/mois</span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Jusqu'à 100 élèves
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Gestion des frais
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Support email
              </li>
            </ul>
          </div>

          {/* Plan Professionnel */}
          <div className="bg-blue-600 rounded-lg shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold">Plan Professionnel</h3>
            <p className="mt-4 text-blue-100">
              Idéal pour les écoles moyennes
            </p>
            <div className="mt-8">
              <span className="text-4xl font-bold">$59</span>
              <span className="text-blue-100">/mois</span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                Jusqu'à 500 élèves
              </li>
              <li className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                Toutes les fonctionnalités
              </li>
              <li className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                Support prioritaire
              </li>
            </ul>
          </div>

          {/* Plan Entreprise */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900">Plan Entreprise</h3>
            <p className="mt-4 text-gray-600">
              Pour les grandes institutions
            </p>
            <div className="mt-8">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-gray-600">/mois</span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Élèves illimités
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Fonctionnalités avancées
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Support dédié
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

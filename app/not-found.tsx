import Link from "next/link";
import { Clock } from "lucide-react";
import { BackButton } from "./back-button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-[600px] w-full mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center">
            <Clock className="w-12 h-12 text-white" />
          </div>

          {/* Title & Description */}
          <h1 className="text-[2rem] font-semibold text-gray-900">404 - Page non trouvée</h1>
          <p className="text-gray-600 max-w-[440px]">
            Oups ! La page que vous recherchez n'existe pas. Elle a peut-être été déplacée ou supprimée.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Accéder à la page d&apos;accueil
            </Link>
            <BackButton />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} PowerSoft. Tous droits réservés.
      </footer>
    </div>
  );
}

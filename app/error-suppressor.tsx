'use client';

import { useEffect } from 'react';

export function ErrorSuppressor() {
  useEffect(() => {
    // Supprimer les avertissements de react-to-print
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = function(...args: any[]) {
      const message = args[0]?.toString?.() || '';
      
      // Ignorer les erreurs de react-to-print liées au chargement d'images
      if (
        message.includes('react-to-print') ||
        message.includes('Failed to load') ||
        message.includes('was unable to load a resource')
      ) {
        return;
      }
      
      originalError.apply(console, args);
    };

    console.warn = function(...args: any[]) {
      const message = args[0]?.toString?.() || '';
      
      if (message.includes('react-to-print')) {
        return;
      }
      
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null;
}

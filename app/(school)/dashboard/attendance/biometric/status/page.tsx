import { BiometricSystemStatus } from '@/components/BiometricSystemStatus';

export default function BiometricStatusPage() {
  return <BiometricSystemStatus />;
}

export function generateMetadata() {
  return {
    title: "État Système Biométrique | Masomo Pro",
    description: "Vérification complète de l'implémentation biométrique et des fonctionnalités",
  };
}

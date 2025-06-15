import { EnvelopeOpenIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export interface AlertItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
  link: string;
}

export const alerts: AlertItem[] = [
  { icon: EnvelopeOpenIcon, text: "3 RFQs awaiting quotes", link: "/erfq" },
  { icon: ExclamationTriangleIcon, text: "2 contracts expiring in 7 days", link: "/vendors" },
  { icon: MagnifyingGlassIcon, text: "Price of Steel +12% vs forecast", link: "/reports" },
  { icon: ExclamationCircleIcon, text: "Supplier X on watchlist (Risk 15%)", link: "/vendors" }
];
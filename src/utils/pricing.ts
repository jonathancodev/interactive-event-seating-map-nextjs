import { PriceTier } from '@/types/venue';

// Price tiers configuration
export const PRICE_TIERS: Record<number, PriceTier> = {
  1: { tier: 1, price: 75, label: 'Premium' },
  2: { tier: 2, price: 50, label: 'Standard' },
  3: { tier: 3, price: 25, label: 'Economy' },
};

export function getPriceForTier(tier: number): number {
  return PRICE_TIERS[tier]?.price || 0;
}

export function getPriceTierLabel(tier: number): string {
  return PRICE_TIERS[tier]?.label || 'Unknown';
}

export interface Plan {
  id: string
  name: string
  searches: number
  originalPrice: number
  salePrice: number
  savePercent: number
  tax: number
  popular?: boolean
}

export const PLANS: Plan[] = [
  {
    id: '1',
    name: '1 Search',
    searches: 1,
    originalPrice: 30.62,
    salePrice: 15.31,
    savePercent: 50,
    tax: 2.3,
  },
  {
    id: '2',
    name: '2 Searches',
    searches: 2,
    originalPrice: 51.05,
    salePrice: 25.52,
    savePercent: 60,
    tax: 4.6,
    popular: true,
  },
  {
    id: '3',
    name: '3 Searches',
    searches: 3,
    originalPrice: 59.56,
    salePrice: 29.78,
    savePercent: 68,
    tax: 5.37,
  },
]

export const DEFAULT_PLAN_ID = '2'

export function getPlanById(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[1]
}

export function formatEuro(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + '\u00a0€'
}

export function getOrderTotal(plan: Plan): number {
  return Math.round((plan.salePrice + plan.tax) * 100) / 100
}

export function getDiscount(plan: Plan): number {
  return Math.floor((plan.originalPrice - plan.salePrice) * 100) / 100
}

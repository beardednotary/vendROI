// src/types/index.ts

export interface InitialInvestment {
  machineCost: number;
  installationDelivery: number;
  initialInventory: number;
  licensesPermits: number;
}

export interface MonthlyOperatingCosts {
  productRestock: number;
  transportationFuel: number;
  maintenance: number;
  locationRent: number;
  creditCardFees: number;
  otherExpenses: number;
}

export interface MonthlyRevenue {
  itemsSoldPerDay: number;
  averageSalePrice: number;
  daysOperatingPerMonth: number;
}

export interface DashboardData {
  id: string;
  name: string;
  initialInvestment: InitialInvestment;
  operatingCosts: MonthlyOperatingCosts;
  revenue: MonthlyRevenue;
  revenueSource: 'manual' | 'productMix'; // Link to Product Mix
  linkedLocationId?: string; // Link to Location Comparison
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalInitialInvestment: number;
  totalMonthlyCosts: number;
  totalMonthlyRevenue: number;
  monthlyNetProfit: number;
  annualNetProfit: number;
  roiPercentage: number;
  breakEvenMonths: number;
  profitMargin: number;
  monthlyCashFlow: number;
}

export interface Product {
  id: string;
  name: string;
  costPerUnit: number;
  salePrice: number;
  unitsPerMonth: number;
}

export interface ProductMixData {
  id: string;
  dashboardId: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductMixMetrics {
  totalMonthlyProfit: number;
  averageMarginPercentage: number;
  bestPerformingProduct: Product | null;
  totalMonthlyRevenue: number;
  totalMonthlyCost: number;
}

export type CompetitionLevel = 'None' | 'Low' | 'Medium' | 'High';
export type LocationType = 'Office' | 'Retail' | 'School' | 'Industrial' | 'Residential' | 'Other';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  footTraffic: number;
  monthlyRent: number;
  competition: CompetitionLevel;
  photoUri?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationMetrics {
  locationScore: number;
  trafficScore: number;
  rentScore: number;
  competitionScore: number;
  estimatedDailySales: number;
  monthlyRevenue: number;
  operatingCosts: number;
  netProfit: number;
  roi: number;
}

export interface LocationComparisonData {
  id: string;
  dashboardId: string;
  locations: Location[];
  createdAt: string;
  updatedAt: string;
}

export type GrowthStrategy = 'Linear' | 'Exponential' | 'Custom';

export interface MonthlyProjection {
  month: number;
  totalMachines: number;
  investmentRequired: number;
  revenue: number;
  operatingCosts: number;
  netProfit: number;
}

export interface GrowthProjectorData {
  id: string;
  dashboardId: string;
  growthStrategy: GrowthStrategy;
  initialMachines: number;
  machinesPerQuarter: number;
  investmentPerMachine: number;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthSummary {
  totalInvestment: number;
  totalRevenue: number;
  twelveMonthNetProfit: number;
  roi: number;
}

export interface AppData {
  dashboards: DashboardData[];
  productMixes: ProductMixData[];
  locationComparisons: LocationComparisonData[];
  growthProjectors: GrowthProjectorData[];
  isPremium: boolean;
  dataOptIn: boolean;
  activeDashboardId?: string;
  totalMachinesCreated?: number;
  totalDashboardSessions?: number;
  hasSeenPositiveVerdict?: boolean;
}

export interface ExportData {
  dashboardName: string;
  metrics: DashboardMetrics;
  locations?: LocationMetrics[];
  products?: ProductMixMetrics;
  growthSummary?: GrowthSummary;
  exportDate: string;
}
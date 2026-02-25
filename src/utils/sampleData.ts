// src/utils/sampleData.ts

import { DashboardData } from '../types';

export const createSampleDashboard = (): DashboardData => {
  return {
    id: 'sample-dashboard',
    name: 'Sample Coffee Shop Machine',
    initialInvestment: {
      machineCost: 4500,
      installationDelivery: 500,
      initialInventory: 600,
      licensesPermits: 200,
    },
    operatingCosts: {
      productRestock: 800,
      transportationFuel: 100,
      maintenance: 50,
      locationRent: 300,
      creditCardFees: 60,
      otherExpenses: 40,
    },
    revenue: {
      itemsSoldPerDay: 25,
      averageSalePrice: 2.50,
      daysOperatingPerMonth: 26,
    },
    revenueSource: 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
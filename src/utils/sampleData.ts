// src/utils/sampleData.ts

import { DashboardData } from '../types';

export const createBlankDashboard = (name: string = 'New Machine'): DashboardData => ({
  id: `machine-${Date.now()}`,
  name,
  initialInvestment: {
    machineCost: 0,
    installationDelivery: 0,
    initialInventory: 0,
    licensesPermits: 0,
  },
  operatingCosts: {
    productRestock: 0,
    transportationFuel: 0,
    maintenance: 0,
    locationRent: 0,
    creditCardFees: 0,
    otherExpenses: 0,
  },
  revenue: {
    itemsSoldPerDay: 0,
    averageSalePrice: 0,
    daysOperatingPerMonth: 30,
  },
  revenueSource: 'manual',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createSampleDashboard = (): DashboardData => {
  return {
    id: `sample-${Date.now()}`,
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
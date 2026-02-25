// src/store/useAppStore.ts

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, DashboardData, ProductMixData, LocationComparisonData, GrowthProjectorData } from '../types';

const STORAGE_KEY = '@vending_roi_app_data';
const ONBOARDING_KEY = '@vending_roi_onboarding';

// Debounce helper
let saveTimeout: NodeJS.Timeout | null = null;
const debouncedSave = (saveFn: () => Promise<void>) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveFn();
  }, 500); // Wait 500ms after last keystroke before saving
};

interface AppStore extends AppData {
  // Onboarding
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  
  // Actions
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  
  // Dashboard
  addDashboard: (dashboard: DashboardData) => void;
  updateDashboard: (id: string, dashboard: Partial<DashboardData>) => void;
  deleteDashboard: (id: string) => void;
  
  // Product Mix
  addProductMix: (productMix: ProductMixData) => void;
  updateProductMix: (id: string, productMix: Partial<ProductMixData>) => void;
  deleteProductMix: (id: string) => void;
  
  // Location Comparison
  addLocationComparison: (locationComparison: LocationComparisonData) => void;
  updateLocationComparison: (id: string, locationComparison: Partial<LocationComparisonData>) => void;
  deleteLocationComparison: (id: string) => void;
  
  // Growth Projector
  addGrowthProjector: (growthProjector: GrowthProjectorData) => void;
  updateGrowthProjector: (id: string, growthProjector: Partial<GrowthProjectorData>) => void;
  deleteGrowthProjector: (id: string) => void;
  
  // Premium
  setPremium: (isPremium: boolean) => void;

  // Data opt-in
  setDataOptIn: (dataOptIn: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  dashboards: [],
  productMixes: [],
  locationComparisons: [],
  growthProjectors: [],
  isPremium: false,
  dataOptIn: false,
  hasCompletedOnboarding: false,

  loadData: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const data: AppData = JSON.parse(jsonValue);
        set(data);
      }
      
      // Load onboarding status
      const onboardingStatus = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (onboardingStatus) {
        set({ hasCompletedOnboarding: JSON.parse(onboardingStatus) });
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
  },

  saveData: async () => {
    try {
      const state = get();
      const dataToSave: AppData = {
        dashboards: state.dashboards,
        productMixes: state.productMixes,
        locationComparisons: state.locationComparisons,
        growthProjectors: state.growthProjectors,
        isPremium: state.isPremium,
        dataOptIn: state.dataOptIn,
      };
      const jsonValue = JSON.stringify(dataToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  },

  setHasCompletedOnboarding: async (value) => {
    set({ hasCompletedOnboarding: value });
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving onboarding status:', e);
    }
  },

  // Dashboard actions
  addDashboard: (dashboard) => {
    set((state) => ({
      dashboards: [...state.dashboards, dashboard],
    }));
    debouncedSave(get().saveData);
  },

  updateDashboard: (id, updates) => {
    set((state) => ({
      dashboards: state.dashboards.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
    }));
    debouncedSave(get().saveData);
  },

  deleteDashboard: (id) => {
    set((state) => ({
      dashboards: state.dashboards.filter((d) => d.id !== id),
      productMixes: state.productMixes.filter((p) => p.dashboardId !== id),
      locationComparisons: state.locationComparisons.filter((l) => l.dashboardId !== id),
      growthProjectors: state.growthProjectors.filter((g) => g.dashboardId !== id),
    }));
    get().saveData(); // Immediate save for deletes
  },

  // Product Mix actions
  addProductMix: (productMix) => {
    set((state) => ({
      productMixes: [...state.productMixes, productMix],
    }));
    debouncedSave(get().saveData);
  },

  updateProductMix: (id, updates) => {
    set((state) => ({
      productMixes: state.productMixes.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
    debouncedSave(get().saveData);
  },

  deleteProductMix: (id) => {
    set((state) => ({
      productMixes: state.productMixes.filter((p) => p.id !== id),
    }));
    get().saveData(); // Immediate save for deletes
  },

  // Location Comparison actions
  addLocationComparison: (locationComparison) => {
    set((state) => ({
      locationComparisons: [...state.locationComparisons, locationComparison],
    }));
    debouncedSave(get().saveData);
  },

  updateLocationComparison: (id, updates) => {
    set((state) => ({
      locationComparisons: state.locationComparisons.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
      ),
    }));
    debouncedSave(get().saveData);
  },

  deleteLocationComparison: (id) => {
    set((state) => ({
      locationComparisons: state.locationComparisons.filter((l) => l.id !== id),
    }));
    get().saveData(); // Immediate save for deletes
  },

  // Growth Projector actions
  addGrowthProjector: (growthProjector) => {
    set((state) => ({
      growthProjectors: [...state.growthProjectors, growthProjector],
    }));
    debouncedSave(get().saveData);
  },

  updateGrowthProjector: (id, updates) => {
    set((state) => ({
      growthProjectors: state.growthProjectors.map((g) =>
        g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      ),
    }));
    debouncedSave(get().saveData);
  },

  deleteGrowthProjector: (id) => {
    set((state) => ({
      growthProjectors: state.growthProjectors.filter((g) => g.id !== id),
    }));
    get().saveData(); // Immediate save for deletes
  },

  // Premium
  setPremium: (isPremium) => {
    set({ isPremium });
    get().saveData();
  },

  // Data opt-in
  setDataOptIn: (dataOptIn) => {
    set({ dataOptIn });
    get().saveData();
  },
}));
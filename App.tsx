// App.tsx

import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore } from './src/store/useAppStore';
import { Toast as ToastComponent } from './src/components/Toast';
import { Onboarding } from './src/components/Onboarding';
import { Toast } from './src/utils/toast';
import { createSampleDashboard } from './src/utils/sampleData';
import { initAnalytics, trackEvent, trackScreen } from './src/utils/analytics';
import { colors, spacing, textVariants } from './src/theme/theme';

import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { REVENUECAT_CONFIG } from './src/config/revenueCat';

// Screens
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LocationComparisonScreen } from './src/screens/LocationComparisonScreen';
import { ProductMixScreen } from './src/screens/ProductMixScreen';
import { GrowthProjectorScreen } from './src/screens/GrowthProjectorScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  Summary: { focused: 'calculator', unfocused: 'calculator-outline' },
  Locations: { focused: 'location', unfocused: 'location-outline' },
  Products: { focused: 'cart', unfocused: 'cart-outline' },
  Growth: { focused: 'trending-up', unfocused: 'trending-up-outline' },
};

export default function App() {
  const { 
    hasCompletedOnboarding, 
    setHasCompletedOnboarding,
    addDashboard,
    loadData,
  } = useAppStore();
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastConfig, setToastConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    initAnalytics();
    trackEvent('app_opened');
    loadData().then(() => {
      setIsLoading(false);
      useAppStore.getState().incrementDashboardSessions();
    });
  }, []);

useEffect(() => {
  const unsubscribe = Toast._subscribe((config: any) => {
    setToastConfig(config);
    setToastVisible(true);
  });
  return () => {
    unsubscribe();
  };
}, []);

// Initialize RevenueCat
useEffect(() => {
  const syncPremiumStatus = async () => {
    try {
      if (!REVENUECAT_CONFIG.apiKey) {
        useAppStore.getState().setPremium(false);
        return;
      }

      Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
      await Purchases.configure({ apiKey: REVENUECAT_CONFIG.apiKey });

      // Check subscription status on app launch
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId] !== undefined;
      useAppStore.getState().setPremium(isPremium);
    } catch (error) {
      useAppStore.getState().setPremium(false);
      if (__DEV__) {
        console.warn('RevenueCat init failed:', error);
      }
    }
  };

  syncPremiumStatus();

  const subscription = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'active') {
      syncPremiumStatus();
    }
  });

  return () => {
    subscription.remove();
  };
}, []);

  const handleOnboardingComplete = async () => {
  // Add sample dashboard
  const sampleDashboard = createSampleDashboard();
  addDashboard(sampleDashboard);

  // Force save
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mark onboarding as complete
  setHasCompletedOnboarding(true);
  trackEvent('onboarding_completed');

  // Show welcome toast
  Toast.show({
    type: 'success',
    text1: 'Welcome!',
    text2: 'Sample data loaded. Edit it or start fresh.',
  });
};

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Onboarding onComplete={handleOnboardingComplete} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }}
        onStateChange={() => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
          if (currentRouteName && currentRouteName !== previousRouteName) {
            trackScreen(currentRouteName);
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
            headerTitleStyle: {
              ...textVariants.title,
              fontSize: 18,
            },
            headerTintColor: colors.textPrimary,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: spacing.xs,
              paddingBottom: spacing.sm,
              height: 70,
            },
            tabBarActiveTintColor: colors.accentPrimary,
            tabBarInactiveTintColor: colors.muted,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
              marginTop: 2,
            },
            tabBarIconStyle: {
              marginBottom: -2,
            },
          }}
        >
          <Tab.Screen
            name="Summary"
            component={DashboardScreen}
            options={{
              headerTitle: 'Investment Summary',
              tabBarLabel: 'Summary',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? TAB_ICONS.Summary.focused : TAB_ICONS.Summary.unfocused} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Locations"
            component={LocationComparisonScreen}
            options={{
              headerTitle: 'Locations',
              tabBarLabel: 'Locations',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? TAB_ICONS.Locations.focused : TAB_ICONS.Locations.unfocused} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Products"
            component={ProductMixScreen}
            options={{
              headerTitle: 'Product Mix',
              tabBarLabel: 'Products',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? TAB_ICONS.Products.focused : TAB_ICONS.Products.unfocused} size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Growth"
            component={GrowthProjectorScreen}
            options={{
              headerTitle: 'Growth',
              tabBarLabel: 'Growth',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? TAB_ICONS.Growth.focused : TAB_ICONS.Growth.unfocused} size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      
      {toastConfig && (
        <ToastComponent
          visible={toastVisible}
          type={toastConfig.type}
          text1={toastConfig.text1}
          text2={toastConfig.text2}
          onHide={() => setToastVisible(false)}
        />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...textVariants.body,
  },
});

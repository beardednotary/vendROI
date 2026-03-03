// src/screens/PaywallScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { Button } from '../components/Button';
import { colors, spacing, textVariants, radii } from '../theme/theme';
import { useAppStore } from '../store/useAppStore';
import { Toast } from '../utils/toast';
import { REVENUECAT_CONFIG } from '../config/revenueCat';

interface PaywallScreenProps {
  onDismiss: () => void;
  onPurchaseSuccess: () => void;
}

export const PaywallScreen: React.FC<PaywallScreenProps> = ({
  onDismiss,
  onPurchaseSuccess,
}) => {
  const setPremium = useAppStore((state) => state.setPremium);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [offeringLoadFailed, setOfferingLoadFailed] = useState(false);

  useEffect(() => {
    loadOffering();
  }, []);

  const loadOffering = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const configuredOffering = offerings.all[REVENUECAT_CONFIG.offeringId];
      if (configuredOffering) {
        setOffering(configuredOffering);
      } else if (offerings.current) {
        setOffering(offerings.current);
        if (__DEV__) {
          console.warn(
            `Configured offering "${REVENUECAT_CONFIG.offeringId}" not found; falling back to current offering.`
          );
        }
      }
      setOfferingLoadFailed(false);
    } catch (error) {
      setOfferingLoadFailed(true);
      if (__DEV__) {
        console.warn('Could not load RevenueCat offerings:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    const packageToPurchase =
      offering?.availablePackages.find(
        (pkg) => pkg.product.identifier === REVENUECAT_CONFIG.productId
      ) ?? offering?.availablePackages[0];

    if (!packageToPurchase) {
      Alert.alert('Error', 'No packages available');
      return;
    }

    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(
        packageToPurchase
      );

      if (customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId]) {
        setPremium(true);
        Toast.show({
          type: 'success',
          text1: 'Welcome to Pro!',
          text2: 'All features unlocked',
        });
        onPurchaseSuccess();
      } else {
        Alert.alert(
          'Purchase Completed',
          'Your purchase was processed, but Pro did not unlock yet. Please tap Restore Purchase.'
        );
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert(
          'Purchase Failed',
          error?.message || 'We could not complete your purchase. Please try again.'
        );
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      
      if (customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId]) {
        setPremium(true);
        Toast.show({
          type: 'success',
          text1: 'Purchase Restored',
          text2: 'Pro features unlocked',
        });
        onPurchaseSuccess();
      } else {
        Alert.alert('No Purchases Found', 'You have no previous purchases to restore.');
      }
    } catch (error: any) {
      Alert.alert(
        'Restore Failed',
        error?.message || 'We could not restore purchases right now. Please try again.'
      );
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentPrimary} />
      </View>
    );
  }

  const selectedPackage =
    offering?.availablePackages.find(
      (pkg) => pkg.product.identifier === REVENUECAT_CONFIG.productId
    ) ?? offering?.availablePackages[0];
  const price = selectedPackage?.product.priceString || REVENUECAT_CONFIG.fallbackPrice;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Unlock Pro</Text>
        <Text style={styles.subtitle}>
          Get full access to all ROI calculation tools
        </Text>
        {offeringLoadFailed && (
          <Text style={styles.warningText}>
            Could not load live pricing. Check your connection and try again.
          </Text>
        )}
      </View>

      <View style={styles.featuresSection}>
        <Feature
          icon="LOC"
          title="Location Comparison"
          description="Score and compare up to 10 potential locations"
        />
        <Feature
          icon="MIX"
          title="Product Mix Optimizer"
          description="Track profitability of up to 10 products"
        />
        <Feature
          icon="GRW"
          title="Growth Projector"
          description="Model your 12-month expansion strategy"
        />
        <Feature
          icon="EXP"
          title="Export Reports"
          description="Generate PDF and CSV reports to share"
        />
      </View>

      <View style={styles.pricingSection}>
        <Text style={styles.priceLabel}>One-time payment</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.priceSubtext}>
          Lifetime access - No subscriptions
        </Text>
      </View>

      <View style={styles.buttons}>
        <Button
          title={purchasing ? 'Processing...' : `Unlock Pro - ${price}`}
          onPress={handlePurchase}
          disabled={purchasing}
          style={styles.purchaseButton}
        />

        <Button
          title="Restore Purchase"
          onPress={handleRestore}
          variant="ghost"
          disabled={purchasing}
        />

        <Button
          title="Maybe Later"
          onPress={onDismiss}
          variant="ghost"
        />
      </View>

      <Text style={styles.disclaimer}>
        One-time purchase. All features unlocked forever.{'\n'}
        No subscriptions. No recurring charges.
      </Text>
    </ScrollView>
  );
};

const Feature: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <View style={styles.feature}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...textVariants.title,
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textVariants.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  warningText: {
    ...textVariants.body,
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.accentRisk,
  },
  featuresSection: {
    marginBottom: spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...textVariants.subtitle,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...textVariants.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.accentPrimary,
  },
  priceLabel: {
    ...textVariants.label,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.accentPrimary,
    marginBottom: spacing.xs,
  },
  priceSubtext: {
    ...textVariants.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttons: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  purchaseButton: {
    paddingVertical: spacing.lg,
  },
  disclaimer: {
    ...textVariants.body,
    fontSize: 12,
    textAlign: 'center',
    color: colors.muted,
    lineHeight: 18,
  },
});


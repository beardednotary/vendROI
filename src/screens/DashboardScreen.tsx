// src/screens/DashboardScreen.tsx

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBlankDashboard } from '../utils/sampleData';
import { useAppStore } from '../store/useAppStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors, spacing, textVariants, radii } from '../theme/theme';
import {
  formatCurrency,
  formatPercent,
  getProfitColor,
  getROIColor,
} from '../utils/calculations';
import { PortfolioTicker } from '../components/PortfolioTicker';
import { PaywallScreen } from './PaywallScreen';
import { exportFullProjectToCSV, exportFullProjectToPDF } from '../utils/export';
import { Toast } from '../utils/toast';
import { REVENUECAT_CONFIG } from '../config/revenueCat';
import { maybeRequestReview } from '../utils/storeReview';
import { trackEvent } from '../utils/analytics';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export const DashboardScreen: React.FC = () => {
  const {
    dashboards,
    addDashboard,
    updateDashboard,
    deleteDashboard,
    locationComparisons,
    productMixes,
    growthProjectors,
    isPremium,
    activeDashboardId,
    setActiveDashboardId,
    totalMachinesCreated,
    totalDashboardSessions,
    hasSeenPositiveVerdict,
    markPositiveVerdictSeen,
  } = useAppStore();
  const [showPaywall, setShowPaywall] = useState(false);

  const requirePremium = (trigger: string, action: () => void) => {
    if (isPremium) {
      action();
    } else {
      trackEvent('paywall_viewed', { trigger });
      setShowPaywall(true);
    }
  };
  const currentDashboard = dashboards.find((d) => d.id === activeDashboardId) ?? dashboards[0];
  const currentLocationComparison = locationComparisons.find(
    (comparison) => comparison.dashboardId === currentDashboard?.id
  );
  const currentProductMix = productMixes.find(
    (mix) => mix.dashboardId === currentDashboard?.id
  );
  const currentGrowthProjector = growthProjectors.find(
    (growth) => growth.dashboardId === currentDashboard?.id
  );
  
  const [name, setName] = useState('My First Machine');
  const [isEditingName, setIsEditingName] = useState(false);
  const [whatIfSalesPerDay, setWhatIfSalesPerDay] = useState<number | null>(null);

  const SALES_PRESETS = [5, 10, 15, 20, 25, 30];
  
  const scrollRef = useRef<ScrollView | null>(null);
  const [sectionPositions, setSectionPositions] = useState<{
    investment?: number;
    costs?: number;
    revenue?: number;
    metrics?: number;
  }>({});

  // ---------------- INPUT STATE (STRINGS) ----------------

  const [initialInvestment, setInitialInvestment] = useState({
    machineCost: '0',
    installationDelivery: '0',
    initialInventory: '0',
    licensesPermits: '0',
  });

  const [operatingCosts, setOperatingCosts] = useState({
    productRestock: '0',
    transportationFuel: '0',
    maintenance: '0',
    locationRent: '0',
    creditCardFees: '0',
    otherExpenses: '0',
  });

  const [revenue, setRevenue] = useState({
    itemsSoldPerDay: '0',
    averageSalePrice: '0',
    daysOperatingPerMonth: '30',
  });

  // Load store data into local state when active machine changes (or on first mount)
  useEffect(() => {
    if (!currentDashboard) return;
    setName(currentDashboard.name);
    setInitialInvestment({
      machineCost: String(currentDashboard.initialInvestment.machineCost || 0),
      installationDelivery: String(currentDashboard.initialInvestment.installationDelivery || 0),
      initialInventory: String(currentDashboard.initialInvestment.initialInventory || 0),
      licensesPermits: String(currentDashboard.initialInvestment.licensesPermits || 0),
    });
    setOperatingCosts({
      productRestock: String(currentDashboard.operatingCosts.productRestock || 0),
      transportationFuel: String(currentDashboard.operatingCosts.transportationFuel || 0),
      maintenance: String(currentDashboard.operatingCosts.maintenance || 0),
      locationRent: String(currentDashboard.operatingCosts.locationRent || 0),
      creditCardFees: String(currentDashboard.operatingCosts.creditCardFees || 0),
      otherExpenses: String(currentDashboard.operatingCosts.otherExpenses || 0),
    });
    setRevenue({
      itemsSoldPerDay: String(currentDashboard.revenue.itemsSoldPerDay || 0),
      averageSalePrice: String(currentDashboard.revenue.averageSalePrice || 0),
      daysOperatingPerMonth: String(currentDashboard.revenue.daysOperatingPerMonth || 30),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDashboard?.id]);

  // Review trigger: repeat usage (3rd app session, or 3rd machine for Pro users)
  useEffect(() => {
    if (totalMachinesCreated >= 3 || totalDashboardSessions >= 3) {
      maybeRequestReview();
    }
  }, [totalMachinesCreated, totalDashboardSessions]);

  // Add a new machine (gated behind Pro for 2nd+ machine)
  const handleAddMachine = () => {
    if (isPremium) {
      addDashboard(createBlankDashboard());
      trackEvent('machine_created', { total: totalMachinesCreated + 1, isPremium: true });
    } else if (totalMachinesCreated >= 1) {
      trackEvent('paywall_viewed', { trigger: 'add_machine' });
      setShowPaywall(true);
    } else {
      addDashboard(createBlankDashboard());
      trackEvent('machine_created', { total: totalMachinesCreated + 1, isPremium: false });
    }
  };

  // Delete a machine (with guard: can’t delete the last one)
  const handleDeleteMachine = (id: string, machineName: string) => {
    if (dashboards.length === 1) {
      Alert.alert("Can’t Delete", "You must keep at least one machine.");
      return;
    }
    Alert.alert(
      "Delete Machine",
      `Delete "${machineName}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteDashboard(id) },
      ]
    );
  };

  // Clear "0" on focus so the user doesn’t have to delete it
  const onFocusClearZero =
    (value: string, setValue: (v: string) => void) => () => {
      if (value === '0') setValue('');
    };

  // ---------------- NUMERIC VALUES & METRICS ----------------

  const num = {
    machineCost: parseFloat(initialInvestment.machineCost) || 0,
    installationDelivery: parseFloat(initialInvestment.installationDelivery) || 0,
    initialInventory: parseFloat(initialInvestment.initialInventory) || 0,
    licensesPermits: parseFloat(initialInvestment.licensesPermits) || 0,

    productRestock: parseFloat(operatingCosts.productRestock) || 0,
    transportationFuel: parseFloat(operatingCosts.transportationFuel) || 0,
    maintenance: parseFloat(operatingCosts.maintenance) || 0,
    locationRent: parseFloat(operatingCosts.locationRent) || 0,
    creditCardFees: parseFloat(operatingCosts.creditCardFees) || 0,
    otherExpenses: parseFloat(operatingCosts.otherExpenses) || 0,

    itemsSoldPerDay: parseFloat(revenue.itemsSoldPerDay) || 0,
    averageSalePrice: parseFloat(revenue.averageSalePrice) || 0,
    daysOperatingPerMonth: parseFloat(revenue.daysOperatingPerMonth) || 0,
  };

  const totalInitialInvestment =
    num.machineCost +
    num.installationDelivery +
    num.initialInventory +
    num.licensesPermits;

  const totalMonthlyCosts =
    num.productRestock +
    num.transportationFuel +
    num.maintenance +
    num.locationRent +
    num.creditCardFees +
    num.otherExpenses;

  const totalMonthlyRevenue =
    num.itemsSoldPerDay * num.averageSalePrice * num.daysOperatingPerMonth;

  const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyCosts;
  const annualNetProfit = monthlyNetProfit * 12;

  // Save to store when values change
useEffect(() => {
  if (!currentDashboard) return;
  
  const timeout = setTimeout(() => {
    updateDashboard(currentDashboard.id, {
      initialInvestment: {
        machineCost: parseFloat(initialInvestment.machineCost) || 0,
        installationDelivery: parseFloat(initialInvestment.installationDelivery) || 0,
        initialInventory: parseFloat(initialInvestment.initialInventory) || 0,
        licensesPermits: parseFloat(initialInvestment.licensesPermits) || 0,
      },
      operatingCosts: {
        productRestock: parseFloat(operatingCosts.productRestock) || 0,
        transportationFuel: parseFloat(operatingCosts.transportationFuel) || 0,
        maintenance: parseFloat(operatingCosts.maintenance) || 0,
        locationRent: parseFloat(operatingCosts.locationRent) || 0,
        creditCardFees: parseFloat(operatingCosts.creditCardFees) || 0,
        otherExpenses: parseFloat(operatingCosts.otherExpenses) || 0,
      },
      revenue: {
        itemsSoldPerDay: parseFloat(revenue.itemsSoldPerDay) || 0,
        averageSalePrice: parseFloat(revenue.averageSalePrice) || 0,
        daysOperatingPerMonth: parseFloat(revenue.daysOperatingPerMonth) || 30,
      },
    });
  }, 1000);
  
  return () => clearTimeout(timeout);
}, [initialInvestment, operatingCosts, revenue]);

  const roiPercentage =
    totalInitialInvestment > 0
      ? (annualNetProfit / totalInitialInvestment) * 100
      : 0;

  const breakEvenMonths =
    monthlyNetProfit > 0
      ? totalInitialInvestment / monthlyNetProfit
      : 0;

  // Review trigger: first time the user sees a genuinely profitable verdict
  useEffect(() => {
    if (hasSeenPositiveVerdict) return;
    if (totalInitialInvestment > 0 && roiPercentage >= 25 && breakEvenMonths > 0 && breakEvenMonths <= 24) {
      markPositiveVerdictSeen();
      maybeRequestReview();
    }
  }, [hasSeenPositiveVerdict, totalInitialInvestment, roiPercentage, breakEvenMonths]);

  const getBreakEvenMessage = (months: number) => {
  if (months === 0 || months > 100) return 'Not profitable';
  if (months > 24) return 'Too long to break even';
  if (months <= 12) return 'Fast payback period';
  return 'Standard timeline';
};

const getBreakEvenIcon = (months: number): IoniconName => {
  if (months === 0 || months > 100) return 'alert-circle-outline';
  if (months > 24) return 'warning-outline';
  if (months <= 12) return 'rocket-outline';
  return 'checkmark-circle-outline';
};

const getBreakEvenColor = (months: number) => {
  if (months === 0 || months > 24) return colors.accentRisk;
  if (months <= 12) return colors.accentProfit;
  return colors.textSecondary;
};    

  const profitMargin =
    totalMonthlyRevenue > 0
      ? (monthlyNetProfit / totalMonthlyRevenue) * 100
      : 0;

  const monthlyCashFlow = monthlyNetProfit;

  // Investment verdict
  const getVerdict = (): { label: string; iconName: IoniconName; color: string; message: string } => {
    if (totalInitialInvestment === 0) return { label: 'Enter Your Numbers', iconName: 'create-outline', color: colors.muted, message: 'Fill in your investment details above' };
    if (monthlyNetProfit <= 0) return { label: 'HIGH RISK', iconName: 'alert-circle', color: colors.accentRisk, message: 'This investment is not currently profitable' };
    if (breakEvenMonths > 24) return { label: 'CAUTION', iconName: 'warning', color: colors.accentRisk, message: `Break-even exceeds 2 years` };
    if (roiPercentage >= 50 && breakEvenMonths <= 12) return { label: 'STRONG INVESTMENT', iconName: 'trending-up', color: colors.accentProfit, message: `High ROI with fast ${breakEvenMonths.toFixed(0)}-month payback` };
    if (roiPercentage >= 25) return { label: 'SOLID INVESTMENT', iconName: 'checkmark-circle', color: colors.accentProfit, message: 'Good returns with manageable timeline' };
    return { label: 'MODERATE', iconName: 'bar-chart', color: colors.accentPrimary, message: 'Viable but watch your margins closely' };
  };

  const verdict = getVerdict();

  const getVerdictLine = (): string | null => {
    if (totalInitialInvestment === 0) return null;
    const breakEvenDays = Math.round(breakEvenMonths * 30);
    if (monthlyNetProfit <= 0) {
      return "Every month this machine runs, you lose money. The numbers need to change before this is worth pursuing.";
    }
    if (breakEvenMonths > 24) {
      return `That's roughly ${breakEvenDays.toLocaleString()} days of sales just to get your money back. Most operators don't last that long.`;
    }
    if (roiPercentage >= 50 && breakEvenMonths <= 12) {
      return `You'd recover your full investment in about ${breakEvenMonths.toFixed(0)} months — then keep ${formatCurrency(monthlyNetProfit)} every month after that. This is worth scaling.`;
    }
    if (roiPercentage >= 25) {
      return `At this pace you'd break even in ${breakEvenMonths.toFixed(0)} months and earn roughly ${formatCurrency(annualNetProfit)} in year one.`;
    }
    return "Viable — but thin margins leave little room for slow months or surprise costs.";
  };

  const verdictLine = getVerdictLine();

  // Payback date
  const getPaybackDate = () => {
    if (breakEvenMonths <= 0 || breakEvenMonths > 100) return null;
    const now = new Date();
    const paybackDate = new Date(now.getFullYear(), now.getMonth() + Math.ceil(breakEvenMonths), 1);
    return paybackDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const paybackDate = getPaybackDate();

  const whatIfMonthlyProfit = whatIfSalesPerDay !== null
    ? (whatIfSalesPerDay * num.averageSalePrice * num.daysOperatingPerMonth) - totalMonthlyCosts
    : null;
  const whatIfDelta = whatIfMonthlyProfit !== null ? whatIfMonthlyProfit - monthlyNetProfit : null;

  // ---------------- METRIC CARD ----------------

  const MetricBox = ({
    label,
    value,
    valueColor,
    highlight,
    style,
    captionText,
    captionColor,
    captionIcon,
  }: {
    label: string;
    value: string;
    valueColor?: string;
    highlight?: boolean;
    style?: any;
    captionText?: string;
    captionColor?: string;
    captionIcon?: IoniconName;
  }) => (
    <View
      style={[
        styles.metricBox,
        highlight && styles.metricBoxHighlight,
        style,
      ]}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text
        style={[
          styles.metricValue,
          valueColor ? { color: valueColor } : null,
        ]}
      >
        {value}
      </Text>
      {captionText && (
        <View style={styles.metricCaptionRow}>
          {captionIcon && (
            <Ionicons name={captionIcon} size={12} color={captionColor} />
          )}
          <Text
            style={[
              styles.metricCaption,
              captionColor ? { color: captionColor } : null,
            ]}
          >
            {captionText}
          </Text>
        </View>
      )}
    </View>
  );

  // ---------------- FLOW HELPERS ----------------

  const scrollToSection = (key: keyof typeof sectionPositions) => {
    const y = sectionPositions[key];
    if (y != null && scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true });
    }
  };

  // ---------------- RENDER ----------------

  if (showPaywall) {
    return (
      <PaywallScreen
        onDismiss={() => setShowPaywall(false)}
        onPurchaseSuccess={() => setShowPaywall(false)}
      />
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {/* Machine switcher */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.machineSwitcher}
        contentContainerStyle={styles.machineSwitcherContent}
      >
        {dashboards.map((d) => (
          <TouchableOpacity
            key={d.id}
            onPress={() => setActiveDashboardId(d.id)}
            onLongPress={() => handleDeleteMachine(d.id, d.name)}
            style={[
              styles.machinePill,
              (activeDashboardId === d.id || (!activeDashboardId && d === dashboards[0])) &&
                styles.machinePillActive,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.machinePillText,
                (activeDashboardId === d.id || (!activeDashboardId && d === dashboards[0])) &&
                  styles.machinePillTextActive,
              ]}
            >
              {d.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={handleAddMachine} style={styles.machinePillAdd}>
          <Text style={styles.machinePillAddText}>+</Text>
        </TouchableOpacity>
      </ScrollView>

{isEditingName ? (
  <TextInput
    value={name}
    onChangeText={setName}
    onBlur={() => {
      setIsEditingName(false);
      if (currentDashboard) updateDashboard(currentDashboard.id, { name });
    }}
    autoFocus
    style={styles.projectNameInput}
    placeholder="Machine name"
    placeholderTextColor={colors.muted}
  />
) : (
  <TouchableOpacity onPress={() => setIsEditingName(true)}>
    <View style={styles.projectNameContainer}>
      <Text style={styles.header}>{name}</Text>
      <Ionicons name="pencil-outline" size={16} color={colors.muted} style={styles.editIcon} />
    </View>
  </TouchableOpacity>
)}
    <PortfolioTicker
  totalInvestment={totalInitialInvestment}
  totalRevenue={totalMonthlyRevenue * 12}
  roi={roiPercentage}
  monthlyNetProfit={monthlyNetProfit}
  breakEvenMonths={breakEvenMonths}
  profitMargin={profitMargin}
/>

<View style={styles.exportButtons}>
  <Button
    title="Export Full PDF"
    onPress={() => requirePremium('export_pdf', async () => {
      if (!currentDashboard) return;
      try {
        const metrics = {
          totalInitialInvestment,
          totalMonthlyCosts,
          totalMonthlyRevenue,
          monthlyNetProfit,
          annualNetProfit,
          roiPercentage,
          breakEvenMonths,
          profitMargin,
          monthlyCashFlow,
        };
        await exportFullProjectToPDF(
          currentDashboard,
          metrics,
          currentLocationComparison?.locations || [],
          currentProductMix?.products || [],
          currentGrowthProjector
        );
        Toast.show({
          type: 'success',
          text1: 'PDF Ready',
          text2: 'Full project report generated',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not generate PDF';
        Toast.show({
          type: 'error',
          text1: 'Export Failed',
          text2: message,
        });
      }
    })}
    variant="secondary"
    style={styles.exportButton}
  />

  <Button
    title="Export Full CSV"
    onPress={() => requirePremium('export_csv', async () => {
      if (!currentDashboard) return;
      try {
        const metrics = {
          totalInitialInvestment,
          totalMonthlyCosts,
          totalMonthlyRevenue,
          monthlyNetProfit,
          annualNetProfit,
          roiPercentage,
          breakEvenMonths,
          profitMargin,
          monthlyCashFlow,
        };
        await exportFullProjectToCSV(
          currentDashboard,
          metrics,
          currentLocationComparison?.locations || [],
          currentProductMix?.products || [],
          currentGrowthProjector
        );
        Toast.show({
          type: 'success',
          text1: 'CSV Ready',
          text2: 'Full project data exported',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not generate CSV';
        Toast.show({
          type: 'error',
          text1: 'Export Failed',
          text2: message,
        });
      }
    })}
    variant="secondary"
    style={styles.exportButton}
  />
</View>

      {/* STEP 1: INITIAL INVESTMENT */}
      <View
        style={styles.section}
        onLayout={event => {
          const y = event.nativeEvent.layout.y;
          setSectionPositions(prev => ({
            ...prev,
            investment: y,
          }));
        }}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Initial Investment</Text>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>Step 1 of 3</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          One-time costs to get started
        </Text>

        <Input
          label="Machine Purchase Cost"
          value={initialInvestment.machineCost}
          onChangeText={value =>
            setInitialInvestment(prev => ({ ...prev, machineCost: value }))
          }
          onFocus={onFocusClearZero(
            initialInvestment.machineCost,
            v => setInitialInvestment(prev => ({ ...prev, machineCost: v })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Typical range: $2,000-8,000"
        />

        <Input
          label="Installation/Delivery"
          value={initialInvestment.installationDelivery}
          onChangeText={value =>
            setInitialInvestment(prev => ({
              ...prev,
              installationDelivery: value,
            }))
          }
          onFocus={onFocusClearZero(
            initialInvestment.installationDelivery,
            v =>
              setInitialInvestment(prev => ({
                ...prev,
                installationDelivery: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Usually 10-20% of machine cost"
        />

        <Input
          label="Initial Inventory"
          value={initialInvestment.initialInventory}
          onChangeText={value =>
            setInitialInvestment(prev => ({
              ...prev,
              initialInventory: value,
            }))
          }
          onFocus={onFocusClearZero(
            initialInvestment.initialInventory,
            v =>
              setInitialInvestment(prev => ({
                ...prev,
                initialInventory: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Estimate 2x monthly sales"
        />

        <Input
          label="Licenses & Permits"
          value={initialInvestment.licensesPermits}
          onChangeText={value =>
            setInitialInvestment(prev => ({
              ...prev,
              licensesPermits: value,
            }))
          }
          onFocus={onFocusClearZero(
            initialInvestment.licensesPermits,
            v =>
              setInitialInvestment(prev => ({
                ...prev,
                licensesPermits: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Varies by location"
        />

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Initial Investment</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(totalInitialInvestment)}
          </Text>
        </View>

        <Button
          title="Continue to Monthly Costs"
          onPress={() => scrollToSection('costs')}
          style={styles.flowButton}
        />
      </View>

      {/* STEP 2: OPERATING COSTS */}
      <View
        style={styles.section}
        onLayout={event => {
          const y = event.nativeEvent.layout.y;
          setSectionPositions(prev => ({
            ...prev,
            costs: y,
          }));
        }}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Monthly Operating Costs</Text>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>Step 2 of 3</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          Regular expenses to keep running
        </Text>

        <Input
          label="Product Inventory Restock"
          value={operatingCosts.productRestock}
          onChangeText={value =>
            setOperatingCosts(prev => ({
              ...prev,
              productRestock: value,
            }))
          }
          onFocus={onFocusClearZero(
            operatingCosts.productRestock,
            v =>
              setOperatingCosts(prev => ({
                ...prev,
                productRestock: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Typically 30-40% of revenue"
        />

        <Input
          label="Transportation/Fuel"
          value={operatingCosts.transportationFuel}
          onChangeText={value =>
            setOperatingCosts(prev => ({
              ...prev,
              transportationFuel: value,
            }))
          }
          onFocus={onFocusClearZero(
            operatingCosts.transportationFuel,
            v =>
              setOperatingCosts(prev => ({
                ...prev,
                transportationFuel: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Track mileage for tax purposes"
        />

        <Input
          label="Machine Maintenance"
          value={operatingCosts.maintenance}
          onChangeText={value =>
            setOperatingCosts(prev => ({
              ...prev,
              maintenance: value,
            }))
          }
          onFocus={onFocusClearZero(
            operatingCosts.maintenance,
            v =>
              setOperatingCosts(prev => ({
                ...prev,
                maintenance: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Include cleaning supplies"
        />

        <Input
          label="Location Rent/Fees"
          value={operatingCosts.locationRent}
          onChangeText={value =>
            setOperatingCosts(prev => ({
              ...prev,
              locationRent: value,
            }))
          }
          onFocus={onFocusClearZero(
            operatingCosts.locationRent,
            v =>
              setOperatingCosts(prev => ({
                ...prev,
                locationRent: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Negotiate annual contracts"
        />

        <Input
          label="Credit Card Processing Fees"
          value={operatingCosts.creditCardFees}
          onChangeText={value =>
            setOperatingCosts(prev => ({
              ...prev,
              creditCardFees: value,
            }))
          }
          onFocus={onFocusClearZero(
            operatingCosts.creditCardFees,
            v =>
              setOperatingCosts(prev => ({
                ...prev,
                creditCardFees: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Usually 2.5–3% of card sales"
        />

        <Input
          label="Other Expenses"
          value={operatingCosts.otherExpenses}
          onChangeText={value =>
            setOperatingCosts(prev => ({
              ...prev,
              otherExpenses: value,
            }))
          }
          onFocus={onFocusClearZero(
            operatingCosts.otherExpenses,
            v =>
              setOperatingCosts(prev => ({
                ...prev,
                otherExpenses: v,
              })),
          )}
          keyboardType="numeric"
          prefix="$"
        />

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Monthly Costs</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(totalMonthlyCosts)}
          </Text>
        </View>

        <Button
          title="Continue to Revenue"
          onPress={() => scrollToSection('revenue')}
          style={styles.flowButton}
        />
      </View>

      {/* STEP 3: REVENUE */}
      <View
        style={styles.section}
        onLayout={event => {
          const y = event.nativeEvent.layout.y;
          setSectionPositions(prev => ({
            ...prev,
            revenue: y,
          }));
        }}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Monthly Revenue Projections</Text>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>Step 3 of 3</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          Expected income per month
        </Text>

        <Input
          label="Average Items Sold Per Day"
          value={revenue.itemsSoldPerDay}
          onChangeText={value =>
            setRevenue(prev => ({ ...prev, itemsSoldPerDay: value }))
          }
          onFocus={onFocusClearZero(
            revenue.itemsSoldPerDay,
            v => setRevenue(prev => ({ ...prev, itemsSoldPerDay: v })),
          )}
          keyboardType="numeric"
          helperText="Start conservative: 15–25 items"
        />

        <Input
          label="Average Sale Price"
          value={revenue.averageSalePrice}
          onChangeText={value =>
            setRevenue(prev => ({ ...prev, averageSalePrice: value }))
          }
          onFocus={onFocusClearZero(
            revenue.averageSalePrice,
            v => setRevenue(prev => ({ ...prev, averageSalePrice: v })),
          )}
          keyboardType="numeric"
          prefix="$"
          helperText="Common range: $1.50–3.00"
        />

        <Input
          label="Days Operating Per Month"
          value={revenue.daysOperatingPerMonth}
          onChangeText={value =>
            setRevenue(prev => ({ ...prev, daysOperatingPerMonth: value }))
          }
          onFocus={onFocusClearZero(
            revenue.daysOperatingPerMonth,
            v =>
              setRevenue(prev => ({ ...prev, daysOperatingPerMonth: v })),
          )}
          keyboardType="numeric"
          helperText="Adjust for holidays/maintenance"
        />

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Monthly Revenue</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(totalMonthlyRevenue)}
          </Text>
        </View>

        <Button
          title="View Profitability Metrics"
          onPress={() => scrollToSection('metrics')}
          style={styles.flowButton}
        />
      </View>

      {/* PROFITABILITY METRICS */}
      <View
        style={styles.metricsSection}
        onLayout={event => {
          const y = event.nativeEvent.layout.y;
          setSectionPositions(prev => ({
            ...prev,
            metrics: y,
          }));
        }}
      >
        {/* VERDICT CARD */}
        <View style={[styles.verdictCard, { borderColor: verdict.color }]}>
          <Ionicons
            name={verdict.iconName}
            size={36}
            color={verdict.color}
            style={styles.verdictIcon}
          />
          <Text style={[styles.verdictLabel, { color: verdict.color }]}>{verdict.label}</Text>
          <Text style={styles.verdictMessage}>{verdict.message}</Text>
          {verdictLine && (
            <Text style={styles.verdictLine}>{verdictLine}</Text>
          )}
          {paybackDate && (
            <Text style={[styles.verdictPayback, { color: verdict.color }]}>
              Payback by {paybackDate}
            </Text>
          )}
        </View>

        <Text style={styles.metricsTitle}>Profitability Metrics</Text>
        <Text style={styles.metricsSubtitle}>Your bottom line</Text>

        <View style={styles.metricsGrid}>
          <MetricBox
            label="Monthly Net Profit"
            value={formatCurrency(monthlyNetProfit)}
            valueColor={getProfitColor(monthlyNetProfit)}
            highlight
            style={styles.gridItem}
          />
          <MetricBox
            label="Annual Net Profit"
            value={formatCurrency(annualNetProfit)}
            valueColor={getProfitColor(annualNetProfit)}
            highlight
            style={styles.gridItem}
          />
          <MetricBox
            label="ROI Percentage"
            value={formatPercent(roiPercentage)}
            valueColor={getROIColor(roiPercentage)}
            highlight={true}
            style={styles.gridItem}
          />
<MetricBox
  label="Break-even Point"
  value={
    breakEvenMonths > 0
      ? `${breakEvenMonths.toFixed(1)} mo`
      : 'N/A'
  }
  style={styles.gridItem}
  captionText={breakEvenMonths > 0 ? getBreakEvenMessage(breakEvenMonths) : undefined}
  captionColor={breakEvenMonths > 0 ? getBreakEvenColor(breakEvenMonths) : undefined}
  captionIcon={breakEvenMonths > 0 ? getBreakEvenIcon(breakEvenMonths) : undefined}
/>
          <MetricBox
            label="Profit Margin"
            value={formatPercent(profitMargin)}
            valueColor={getProfitColor(profitMargin)}
            style={styles.gridItem}
          />
          <MetricBox
            label="Monthly Cash Flow"
            value={formatCurrency(monthlyCashFlow)}
            valueColor={getProfitColor(monthlyCashFlow)}
            style={styles.gridItem}
          />
        </View>
      </View>

      {/* WHAT IF SECTION */}
      {num.averageSalePrice > 0 && (
        <View style={styles.whatIfSection}>
          <Text style={styles.whatIfLabel}>WHAT IF YOU SOLD MORE?</Text>
          <Text style={styles.whatIfSubtitle}>
            Tap a number to see your profit at that sales volume
          </Text>
          <View style={styles.presetsRow}>
            {SALES_PRESETS.map(preset => {
              const isCurrent = Math.round(num.itemsSoldPerDay) === preset;
              const isSelected = whatIfSalesPerDay === preset;
              return (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetButton,
                    isCurrent && styles.presetButtonCurrent,
                    isSelected && styles.presetButtonActive,
                  ]}
                  onPress={() => setWhatIfSalesPerDay(prev => prev === preset ? null : preset)}
                >
                  <Text style={[
                    styles.presetButtonText,
                    isSelected && styles.presetButtonTextActive,
                  ]}>
                    {preset}
                  </Text>
                  {isCurrent && <Text style={styles.presetCurrentDot}>▲</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.presetsAxisLabel}>sales / day</Text>

          {whatIfSalesPerDay !== null && whatIfMonthlyProfit !== null && (
            <View style={styles.whatIfResult}>
              <Text style={styles.whatIfResultLabel}>
                At {whatIfSalesPerDay} sales/day
              </Text>
              <Text style={[styles.whatIfResultValue, { color: getProfitColor(whatIfMonthlyProfit) }]}>
                {formatCurrency(whatIfMonthlyProfit)}/month
              </Text>
              {whatIfDelta !== null && whatIfDelta !== 0 && (
                <Text style={[
                  styles.whatIfDelta,
                  { color: whatIfDelta > 0 ? colors.accentProfit : colors.accentRisk },
                ]}>
                  {whatIfDelta > 0 ? '+' : ''}{formatCurrency(whatIfDelta)} vs. your current setup
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* UPGRADE SECTION */}
      {!isPremium && (
        <View style={styles.upgradeSection}>
          <Text style={styles.upgradeTitle}>
            This is where most people lose money.
          </Text>
          <Text style={styles.upgradeText}>
            The math looked fine… until it wasn't.
          </Text>
          <Button
            title={`Run Full Breakdown — ${REVENUECAT_CONFIG.fallbackPrice}`}
            onPress={() => {
              trackEvent('paywall_viewed', { trigger: 'upgrade_banner' });
              setShowPaywall(true);
            }}
            style={styles.upgradeButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    ...textVariants.title,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...textVariants.subtitle,
  },
  sectionSubtitle: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  stepPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  stepPillText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
  },
  totalCard: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalLabel: {
    ...textVariants.body,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  totalValue: {
    ...textVariants.subtitle,
    fontSize: 24,
    fontWeight: '800',
  },
  flowButton: {
    marginTop: spacing.lg,
  },
  metricsSection: {
    marginTop: spacing.xl,
  },
  metricsTitle: {
    ...textVariants.subtitle,
    marginBottom: spacing.xs,
  },
  metricsSubtitle: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridItem: {
    width: '48%',
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  metricBox: {
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceAlt,
  },
  metricBoxHighlight: {
    borderColor: colors.accentPrimary,
  },
  metricLabel: {
    ...textVariants.body,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  metricValue: {
    ...textVariants.subtitle,
    fontSize: 28,
    fontWeight: '900',
  },
  metricCaptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  metricCaption: {
    fontSize: 11,
    fontWeight: '600',
  },
  whatIfSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  whatIfLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  whatIfSubtitle: {
    ...textVariants.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  presetButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  presetButtonCurrent: {
    borderColor: colors.accentPrimary,
  },
  presetButtonActive: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  presetButtonTextActive: {
    color: colors.background,
  },
  presetCurrentDot: {
    fontSize: 6,
    color: colors.accentPrimary,
    marginTop: 2,
  },
  presetsAxisLabel: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  whatIfResult: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  whatIfResultLabel: {
    ...textVariants.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  whatIfResultValue: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  whatIfDelta: {
    ...textVariants.body,
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeSection: {
    marginTop: spacing.xl,
    padding: spacing.xl,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentPrimary,
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  upgradeTitle: {
    ...textVariants.subtitle,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  upgradeText: {
    ...textVariants.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  upgradeButton: {
    width: '100%',
  },
  projectNameContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
  marginBottom: spacing.xl,
},
editIcon: {
  opacity: 0.5,
},
projectNameInput: {
  fontSize: 28,
  fontWeight: '700',
  color: colors.textPrimary,
  borderBottomWidth: 2,
  borderBottomColor: colors.accentPrimary,
  paddingBottom: spacing.sm,
  marginBottom: spacing.xl,
},
exportButtons: {
  flexDirection: 'row',
  gap: spacing.md,
  marginBottom: spacing.xl,
},
exportButton: {
  flex: 1,
},
verdictCard: {
  alignItems: 'center',
  padding: spacing.xl,
  borderRadius: radii.md,
  backgroundColor: colors.surface,
  borderWidth: 2,
  marginBottom: spacing.xl,
},
verdictIcon: {
  marginBottom: spacing.sm,
},
verdictLabel: {
  fontSize: 20,
  fontWeight: '900',
  letterSpacing: 1,
  marginBottom: spacing.xs,
},
verdictMessage: {
  ...textVariants.body,
  fontSize: 13,
  textAlign: 'center',
  color: colors.textSecondary,
},
verdictLine: {
  ...textVariants.body,
  fontSize: 14,
  textAlign: 'center',
  color: colors.textPrimary,
  marginTop: spacing.md,
  lineHeight: 22,
  fontStyle: 'italic',
},
verdictPayback: {
  fontSize: 14,
  fontWeight: '700',
  marginTop: spacing.md,
},
machineSwitcher: {
  marginBottom: spacing.lg,
},
machineSwitcherContent: {
  flexDirection: 'row',
  gap: spacing.sm,
  paddingVertical: spacing.xs,
  alignItems: 'center',
},
machinePill: {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.surface,
  maxWidth: 160,
},
machinePillActive: {
  borderColor: colors.accentPrimary,
  backgroundColor: colors.accentPrimary + '20',
},
machinePillText: {
  fontSize: 13,
  fontWeight: '600',
  color: colors.textSecondary,
},
machinePillTextActive: {
  color: colors.accentPrimary,
},
machinePillAdd: {
  width: 34,
  height: 34,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.surface,
  alignItems: 'center',
  justifyContent: 'center',
},
machinePillAddText: {
  fontSize: 22,
  lineHeight: 26,
  color: colors.textSecondary,
},
});

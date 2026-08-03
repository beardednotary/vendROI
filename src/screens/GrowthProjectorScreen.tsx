// src/screens/GrowthProjectorScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { trackEvent } from '../utils/analytics';
import { useAppStore } from '../store/useAppStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { PortfolioTicker } from '../components/PortfolioTicker';
import { PaywallScreen } from './PaywallScreen';
import { colors, spacing, textVariants, radii } from '../theme/theme';
import {
  calculateDashboardMetrics,
  formatCurrency,
  formatPercent,
  getProfitColor,
} from '../utils/calculations';
import { exportGrowthProjectionsToCSV } from '../utils/export';
import { Toast } from '../utils/toast';
import { LockedScreenOverlay } from '../components/LockedScreenOverlay';

type GrowthStrategy = 'Linear' | 'Exponential' | 'Custom';

interface MonthlyProjection {
  month: number;
  totalMachines: number;
  investmentRequired: number;
  revenue: number;
  operatingCosts: number;
  netProfit: number;
}

export const GrowthProjectorScreen = () => {
  const { dashboards, growthProjectors, addGrowthProjector, updateGrowthProjector, isPremium } = useAppStore();

  const [showPaywall, setShowPaywall] = useState(false);
  const [growthStrategy, setGrowthStrategy] = useState<GrowthStrategy>('Linear');
  const [initialMachines, setInitialMachines] = useState('1');
  const [machinesPerQuarter, setMachinesPerQuarter] = useState('1');
  const [investmentPerMachine, setInvestmentPerMachine] = useState('5000');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  const currentDashboard = dashboards[0];
  const growthProjector = growthProjectors.find(gp => gp.dashboardId === currentDashboard?.id);

  // Load data from store ONCE on mount
  useEffect(() => {
    if (growthProjector && !hasInitializedRef.current) {
      setGrowthStrategy(growthProjector.growthStrategy as GrowthStrategy);
      setInitialMachines(growthProjector.initialMachines.toString());
      setMachinesPerQuarter(growthProjector.machinesPerQuarter.toString());
      setInvestmentPerMachine(growthProjector.investmentPerMachine.toString());
      hasInitializedRef.current = true;
    }
  }, [growthProjector]);

  // Debounced save function
  const saveToStore = () => {
    if (!currentDashboard) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const saveData = {
        growthStrategy,
        initialMachines: parseFloat(initialMachines) || 1,
        machinesPerQuarter: parseFloat(machinesPerQuarter) || 1,
        investmentPerMachine: parseFloat(investmentPerMachine) || 5000,
      };

      if (growthProjector) {
        updateGrowthProjector(growthProjector.id, saveData);
      } else {
        addGrowthProjector({
          id: Date.now().toString(),
          dashboardId: currentDashboard.id,
          ...saveData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }, 1000);
  };

  // Trigger save when values change
  useEffect(() => {
    if (hasInitializedRef.current) {
      saveToStore();
    }
  }, [growthStrategy, initialMachines, machinesPerQuarter, investmentPerMachine]);

  if (showPaywall) {
    return (
      <PaywallScreen
        onDismiss={() => setShowPaywall(false)}
        onPurchaseSuccess={() => setShowPaywall(false)}
      />
    );
  }

  if (!isPremium) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View pointerEvents="none" style={{ flex: 1, opacity: 0.18, padding: spacing.xl }}>
          <Text style={styles.previewTitle}>Growth Projector</Text>
          <Text style={styles.previewSubtitle}>Model your 12-month expansion</Text>
          <View style={styles.previewGrid}>
            {['Total Investment', 'Total Revenue', 'Net Profit', 'Portfolio ROI', 'Final Machines', 'Avg Monthly Profit'].map((label) => (
              <View key={label} style={styles.previewMetricCard}>
                <Text style={styles.previewMetricLabel}>{label}</Text>
                <View style={styles.previewMetricValue} />
              </View>
            ))}
          </View>
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.previewTableRow} />
          ))}
        </View>
        <LockedScreenOverlay
          title="See your path to $1k/month"
          description="Model 12 months of growth. See exactly what it costs to scale — and when it starts compounding."
          onUnlock={() => {
            trackEvent('paywall_viewed', { trigger: 'growth_projector' });
            setShowPaywall(true);
          }}
        />
      </View>
    );
  }

  if (!currentDashboard) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please create a dashboard first</Text>
      </View>
    );
  }

  const dashboardMetrics = calculateDashboardMetrics(currentDashboard);
  const avgMonthlyRevenuePerMachine = dashboardMetrics.totalMonthlyRevenue;
  const avgMonthlyCostPerMachine = dashboardMetrics.totalMonthlyCosts;

  // Calculate monthly projections
  const projections: MonthlyProjection[] = [];
  let currentMachines = parseFloat(initialMachines) || 1;

  for (let month = 1; month <= 12; month++) {
    // Add machines every 3 months (quarterly)
    const isQuarterEnd = month % 3 === 0;
    const machinesAdded = isQuarterEnd ? (parseFloat(machinesPerQuarter) || 0) : 0;
    
    const totalMachines = currentMachines + machinesAdded;
    const investmentRequired = machinesAdded * (parseFloat(investmentPerMachine) || 0);
    
    const revenue = totalMachines * avgMonthlyRevenuePerMachine;
    const operatingCosts = totalMachines * avgMonthlyCostPerMachine;
    const netProfit = revenue - operatingCosts - investmentRequired;

    projections.push({
      month,
      totalMachines,
      investmentRequired,
      revenue,
      operatingCosts,
      netProfit,
    });

    currentMachines = totalMachines;
  }

  // Summary metrics
  const initialMachinesInvestment = (parseFloat(initialMachines) || 1) * (parseFloat(investmentPerMachine) || 0);
  const additionalInvestment = projections.reduce((sum, p) => sum + p.investmentRequired, 0);
  const totalInvestment = initialMachinesInvestment + additionalInvestment;
  const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
  const totalNetProfit = projections.reduce((sum, p) => sum + p.netProfit, 0);
  const roi = totalInvestment > 0 ? (totalNetProfit / totalInvestment) * 100 : 0;

  const finalMonthMachines = projections[11]?.totalMachines || 0;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <PortfolioTicker
        totalInvestment={totalInvestment}
        totalRevenue={totalRevenue}
        roi={roi}
      />

      <View style={styles.exportButton}>
        <Button
          title="Export CSV"
          onPress={async () => {
            try {
              await exportGrowthProjectionsToCSV(
                currentDashboard.name,
                projections,
                totalInvestment,
                totalRevenue,
                totalNetProfit,
                roi
              );
              Toast.show({
                type: 'success',
                text1: 'Exported',
                text2: 'Growth projections ready to share',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Export Failed',
              });
            }
          }}
          variant="secondary"
        />
      </View>

      <SectionHeader 
        title="Growth Projector"
        subtitle="Model your 12-month expansion"
      />

      {/* Parameters Section */}
      <View style={styles.parametersSection}>
        <Text style={styles.sectionTitle}>Growth Parameters</Text>

        <View style={styles.strategyButtons}>
          {(['Linear', 'Exponential', 'Custom'] as GrowthStrategy[]).map((strategy) => (
            <TouchableOpacity
              key={strategy}
              style={[
                styles.strategyButton,
                growthStrategy === strategy && styles.strategyButtonActive,
              ]}
              onPress={() => setGrowthStrategy(strategy)}
            >
              <Text style={[
                styles.strategyButtonText,
                growthStrategy === strategy && styles.strategyButtonTextActive,
              ]}>
                {strategy}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Starting Machines"
          value={initialMachines}
          onChangeText={setInitialMachines}
          onFocus={() => {
            if (initialMachines === '0' || initialMachines === '1') {
              setInitialMachines('');
            }
          }}
          keyboardType="numeric"
          helperText="How many machines you have now"
        />

        <Input
          label="Machines Added per Quarter"
          value={machinesPerQuarter}
          onChangeText={setMachinesPerQuarter}
          onFocus={() => {
            if (machinesPerQuarter === '0') {
              setMachinesPerQuarter('');
            }
          }}
          keyboardType="numeric"
          helperText="Add machines every 3 months"
        />

        <Input
          label="Investment per Machine"
          value={investmentPerMachine}
          onChangeText={setInvestmentPerMachine}
          onFocus={() => {
            if (investmentPerMachine === '0') {
              setInvestmentPerMachine('');
            }
          }}
          keyboardType="numeric"
          prefix="$"
          helperText="Cost to acquire & install one machine"
        />
      </View>

      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>12-Month Summary</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Investment</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalInvestment)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Revenue</Text>
            <Text style={[styles.summaryValue, { color: colors.accentProfit }]}>
              {formatCurrency(totalRevenue)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Net Profit</Text>
            <Text style={[styles.summaryValue, { color: getProfitColor(totalNetProfit) }]}>
              {formatCurrency(totalNetProfit)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Portfolio ROI</Text>
            <Text style={[styles.summaryValue, { color: getProfitColor(roi) }]}>
              {formatPercent(roi)}
            </Text>
            <View style={styles.microCopyRow}>
              <Ionicons
                name={
                  roi > 50 ? 'trending-up' : roi > 25 ? 'checkmark-circle-outline' : roi > 0 ? 'warning-outline' : 'close-circle-outline'
                }
                size={11}
                color={getProfitColor(roi)}
              />
              <Text style={[styles.microCopy, { color: getProfitColor(roi) }]}>
                {roi > 50 ? 'Excellent returns' : roi > 25 ? 'Good growth' : roi > 0 ? 'Slim margins' : 'Losing money'}
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Final Machine Count</Text>
            <Text style={styles.summaryValue}>
              {finalMonthMachines}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg Monthly Profit</Text>
            <Text style={[styles.summaryValue, { color: getProfitColor(totalNetProfit) }]}>
              {formatCurrency(totalNetProfit / 12)}
            </Text>
          </View>
        </View>
      </View>

      {/* Monthly Projections Table */}
      <View style={styles.projectionsSection}>
        <Text style={styles.sectionTitle}>Monthly Breakdown</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Mo</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Machines</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Investment</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Revenue</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Profit</Text>
        </View>

        {projections.map((projection) => (
          <View 
            key={projection.month} 
            style={[
              styles.tableRow,
              projection.month % 3 === 0 && styles.tableRowQuarter,
            ]}
          >
            <Text style={[styles.tableCell, { flex: 0.8 }]}>
              {projection.month}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {projection.totalMachines}
            </Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              {projection.investmentRequired > 0 
                ? formatCurrency(projection.investmentRequired)
                : '-'
              }
            </Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              {formatCurrency(projection.revenue)}
            </Text>
            <Text style={[
              styles.tableCell, 
              { flex: 1.5 },
              { color: getProfitColor(projection.netProfit) }
            ]}>
              {formatCurrency(projection.netProfit)}
            </Text>
          </View>
        ))}

        {/* Total Row */}
        <View style={[styles.tableRow, styles.tableRowTotal]}>
          <Text style={[styles.tableCellBold, { flex: 0.8 }]}>Total</Text>
          <Text style={[styles.tableCellBold, { flex: 1 }]}>-</Text>
          <Text style={[styles.tableCellBold, { flex: 1.5 }]}>
            {formatCurrency(totalInvestment)}
          </Text>
          <Text style={[styles.tableCellBold, { flex: 1.5 }]}>
            {formatCurrency(totalRevenue)}
          </Text>
          <Text style={[
            styles.tableCellBold, 
            { flex: 1.5 },
            { color: getProfitColor(totalNetProfit) }
          ]}>
            {formatCurrency(totalNetProfit)}
          </Text>
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <View style={styles.tipsTitleRow}>
          <Ionicons name="bulb-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.tipsTitle}>Growth Tips</Text>
        </View>
        <Text style={styles.tipText}>
          • Quarter-end additions align with typical funding cycles
        </Text>
        <Text style={styles.tipText}>
          • Plan for 2-3 months cash reserves before scaling
        </Text>
        <Text style={styles.tipText}>
          • Conservative: 1 machine/quarter, Aggressive: 3-5/quarter
        </Text>
        <Text style={styles.tipText}>
          • Factor in learning curve for first 3-6 months
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  previewTitle: {
    ...textVariants.title,
    marginBottom: spacing.sm,
  },
  previewSubtitle: {
    ...textVariants.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  previewMetricCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewMetricLabel: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.muted,
  },
  previewMetricValue: {
    height: 24,
    backgroundColor: colors.border,
    borderRadius: radii.sm,
    width: '70%',
  },
  previewTableRow: {
    height: 36,
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  errorText: {
    ...textVariants.body,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  exportButton: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  parametersSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...textVariants.subtitle,
    marginBottom: spacing.md,
  },
  strategyButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  strategyButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  strategyButtonActive: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  strategyButtonText: {
    ...textVariants.body,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  strategyButtonTextActive: {
    color: colors.background,
  },
  summarySection: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  summaryCard: {
    width: '48%',
    margin: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: {
    ...textVariants.label,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...textVariants.subtitle,
    fontSize: 18,
    fontWeight: '800',
  },
  projectionsSection: {
    padding: spacing.lg,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
  },
  tableHeaderCell: {
    ...textVariants.label,
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowQuarter: {
    backgroundColor: colors.surfaceAlt,
  },
  tableRowTotal: {
    backgroundColor: colors.surfaceAlt,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
  },
  tableCell: {
    ...textVariants.body,
    fontSize: 12,
    textAlign: 'center',
  },
  tableCellBold: {
    ...textVariants.body,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '700',
  },
  tipsSection: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tipsTitle: {
    ...textVariants.subtitle,
    fontSize: 16,
  },
  tipText: {
    ...textVariants.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  microCopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  microCopy: {
    fontSize: 10,
    fontWeight: '600',
  },
});

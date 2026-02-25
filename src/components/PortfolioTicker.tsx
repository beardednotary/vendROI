// src/components/PortfolioTicker.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, textVariants } from '../theme/theme';
import { formatCurrency, formatPercent, getProfitColor, getROIColor } from '../utils/calculations';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PortfolioTickerProps {
  totalInvestment: number;
  totalRevenue: number;
  roi: number;
  monthlyNetProfit?: number;
  breakEvenMonths?: number;
  profitMargin?: number;
}

export const PortfolioTicker: React.FC<PortfolioTickerProps> = ({
  totalInvestment,
  totalRevenue,
  roi,
  monthlyNetProfit,
  breakEvenMonths,
  profitMargin,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const annualProfit = (monthlyNetProfit ?? 0) * 12;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={toggle}>
      {/* Collapsed strip */}
      <View style={styles.tickerStrip}>
        <View style={styles.tickerRow}>
          <Text style={styles.tickerItem}>
            Invested: {formatCurrency(totalInvestment)}
          </Text>
          <Text style={styles.tickerDivider}>•</Text>
          <Text style={styles.tickerItem}>
            Revenue: {formatCurrency(totalRevenue)}
          </Text>
          <Text style={styles.tickerDivider}>•</Text>
          <Text style={styles.tickerItem}>
            ROI: {formatPercent(roi)}
          </Text>
        </View>

        <View style={styles.expandHint}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={colors.muted}
          />
        </View>
      </View>

      {/* Expanded portfolio card */}
      {expanded && (
        <View style={styles.expandedCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Portfolio at a Glance</Text>
            <Text style={styles.asOfDate}>As of {today}</Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Total Invested</Text>
              <Text style={styles.metricValue}>{formatCurrency(totalInvestment)}</Text>
            </View>

            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Annual Revenue</Text>
              <Text style={[styles.metricValue, { color: colors.accentProfit }]}>
                {formatCurrency(totalRevenue)}
              </Text>
            </View>

            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>ROI</Text>
              <Text style={[styles.metricValue, { color: getROIColor(roi) }]}>
                {formatPercent(roi)}
              </Text>
            </View>

            {monthlyNetProfit !== undefined && (
              <View style={styles.metricCell}>
                <Text style={styles.metricLabel}>Monthly Profit</Text>
                <Text style={[styles.metricValue, { color: getProfitColor(monthlyNetProfit) }]}>
                  {formatCurrency(monthlyNetProfit)}
                </Text>
              </View>
            )}

            {annualProfit !== 0 && monthlyNetProfit !== undefined && (
              <View style={styles.metricCell}>
                <Text style={styles.metricLabel}>Annual Profit</Text>
                <Text style={[styles.metricValue, { color: getProfitColor(annualProfit) }]}>
                  {formatCurrency(annualProfit)}
                </Text>
              </View>
            )}

            {profitMargin !== undefined && (
              <View style={styles.metricCell}>
                <Text style={styles.metricLabel}>Profit Margin</Text>
                <Text style={[styles.metricValue, { color: getProfitColor(profitMargin) }]}>
                  {formatPercent(profitMargin)}
                </Text>
              </View>
            )}

            {breakEvenMonths !== undefined && breakEvenMonths > 0 && (
              <View style={[styles.metricCell, styles.metricCellFull]}>
                <Text style={styles.metricLabel}>Break-even</Text>
                <Text style={styles.metricValue}>
                  {breakEvenMonths.toFixed(1)} months
                </Text>
              </View>
            )}
          </View>

        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tickerStrip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickerItem: {
    ...textVariants.body,
    fontSize: 11,
    color: colors.textSecondary,
  },
  tickerDivider: {
    ...textVariants.body,
    fontSize: 11,
    marginHorizontal: spacing.xs,
    color: colors.muted,
  },
  expandHint: {
    alignItems: 'center',
    marginTop: 2,
  },
  expandedCard: {
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...textVariants.subtitle,
    fontSize: 15,
    fontWeight: '700',
  },
  asOfDate: {
    ...textVariants.body,
    fontSize: 11,
    color: colors.muted,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  metricCell: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
  },
  metricCellFull: {
    width: '98%',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

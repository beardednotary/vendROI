// src/components/MetricCard.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radii, textVariants } from '../theme/theme';

interface MetricCardProps {
  label: string;
  value: string;
  color?: string;
  subtitle?: string;
  style?: ViewStyle;
  highlight?: boolean; // NEW: for the ROI card
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  color,
  subtitle,
  style,
  highlight = false, // NEW
}) => {
  return (
    <View style={[
      styles.container, 
      highlight && color && { borderLeftWidth: 4, borderLeftColor: color }, // NEW: thick left border
      style
    ]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, color && { color }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...textVariants.metricLabel,
    marginBottom: spacing.xs,
  },
  value: {
    ...textVariants.metric,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.muted,
  },
});
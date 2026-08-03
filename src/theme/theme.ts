// src/theme/theme.ts

export const colors = {
  // Backgrounds (elevation hierarchy: background < surfaceAlt < surface)
  background: '#02040A',
  surface: '#141927',
  surfaceAlt: '#0A0E18',

  // Accents
  accentPrimary: '#F97316', // money / CTA
  accentProfit: '#34D399',
  accentRisk: '#F87171',
  accentNeutral: '#6366F1',

  // Text
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  muted: '#8891A3',

  // Borders
  border: '#2A3142',
  softBorder: '#161B26',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 6,
  md: 12,
  pill: 999,
};

export const textVariants = {
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    color: colors.muted,
  },
  metric: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -1,
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: colors.muted,
  },
};

// Touch target minimum for one-handed use
export const touchTarget = {
  minHeight: 44,
  minWidth: 44,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
};

export default {
  colors,
  spacing,
  radii,
  textVariants,
  touchTarget,
  shadows,
};

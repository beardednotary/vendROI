// src/components/LockedScreenOverlay.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { colors, spacing, textVariants, radii } from '../theme/theme';
import { REVENUECAT_CONFIG } from '../config/revenueCat';

interface Props {
  title: string;
  description: string;
  onUnlock: () => void;
}

export const LockedScreenOverlay: React.FC<Props> = ({ title, description, onUnlock }) => (
  <View style={styles.overlay}>
    <View style={styles.card}>
      <Ionicons
        name="lock-closed"
        size={32}
        color={colors.accentPrimary}
        style={styles.lock}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Button
        title={`Run Full Breakdown — ${REVENUECAT_CONFIG.fallbackPrice}`}
        onPress={onUnlock}
        style={styles.button}
      />
      <Text style={styles.note}>One-time payment · No subscriptions</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 4, 10, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.accentPrimary,
    padding: spacing.xl,
    alignItems: 'center',
  },
  lock: {
    marginBottom: spacing.md,
  },
  title: {
    ...textVariants.subtitle,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...textVariants.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  button: {
    width: '100%',
  },
  note: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.md,
  },
});

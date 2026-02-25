// src/components/Input.tsx

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, radii, textVariants, touchTarget } from '../theme/theme';

interface InputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  helperText?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  helperText,
  error,
  prefix,
  suffix,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={styles.input}
          value={value}                // ✅ controlled input
          onChangeText={onChangeText}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          autoCapitalize="none"
          {...props}                  // includes onBlur, onFocus, keyboardType, etc.
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...textVariants.label,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: colors.accentRisk,
  },
  input: {
    flex: 1,
    ...textVariants.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  prefix: {
    ...textVariants.body,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  suffix: {
    ...textVariants.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  helperText: {
    ...textVariants.body,
    fontSize: 11,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  errorText: {
    ...textVariants.body,
    fontSize: 11,
    color: colors.accentRisk,
    marginTop: spacing.xs,
  },
});

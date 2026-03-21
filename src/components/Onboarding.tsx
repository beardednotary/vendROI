// src/components/Onboarding.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  Switch,
} from 'react-native';
import { Button } from './Button';
import { useAppStore } from '../store/useAppStore';
import { colors, spacing, radii, textVariants } from '../theme/theme';

const { width } = Dimensions.get('window');

interface OnboardingProps {
  onComplete: () => void;
}

const TOTAL_SLIDES = 5;

const slides = [
  {
    emoji: '📊',
    title: 'Calculate Your ROI',
    description: 'Get instant profitability metrics for your vending machine business. See break-even points, profit margins, and annual returns.',
  },
  {
    emoji: '📍',
    title: 'Compare Locations',
    description: 'Score potential locations based on foot traffic, rent, and competition. Find the perfect spot for maximum profits.',
  },
  {
    emoji: '🛒',
    title: 'Optimize Product Mix',
    description: 'Track which products make you the most money. Identify your best performers and cut the losers.',
  },
  {
    emoji: '📈',
    title: 'Plan Your Growth',
    description: 'Model your 12-month expansion. See exactly when to add machines and how much capital you\'ll need.',
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dataOptIn, setDataOptIn] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      const nextSlide = currentSlide + 1;

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });

      setCurrentSlide(nextSlide);
    } else {
      useAppStore.getState().setDataOptIn(dataOptIn);
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const isDataSlide = currentSlide === TOTAL_SLIDES - 1;
  const slide = !isDataSlide ? slides[currentSlide] : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {Array.from({ length: TOTAL_SLIDES }).map((_, index) => (
          <View key={index} style={styles.slide} />
        ))}
      </ScrollView>

      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {slide ? (
            <>
              <Text style={styles.emoji}>{slide.emoji}</Text>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </>
          ) : (
            <>
              <Text style={styles.emoji}>🤝</Text>
              <Text style={styles.title}>Help Fellow Operators</Text>
              <Text style={styles.description}>
                Share anonymous data (costs, revenue, locations) to help build industry benchmarks. No personal info is ever collected.
              </Text>

              <View style={styles.optInRow}>
                <Switch
                  value={dataOptIn}
                  onValueChange={setDataOptIn}
                  trackColor={{ false: colors.border, true: colors.accentProfit }}
                  thumbColor={colors.textPrimary}
                />
                <Text style={styles.optInLabel}>
                  {dataOptIn ? 'Opted in — thank you!' : 'Opt into anonymous benchmarks'}
                </Text>
              </View>

              <Text style={styles.optInDetail}>
                You can change this anytime in settings.
              </Text>
            </>
          )}
        </ScrollView>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <Button
          title={isDataSlide ? "Get Started" : "Next"}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    ...textVariants.body,
    color: colors.muted,
    fontWeight: '600',
  },
  scrollView: {
    flex: 0,
  },
  slide: {
    width,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  title: {
    ...textVariants.title,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...textVariants.body,
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  optInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optInLabel: {
    ...textVariants.body,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  optInDetail: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.accentPrimary,
    width: 24,
  },
  button: {
    width: '100%',
  },
});

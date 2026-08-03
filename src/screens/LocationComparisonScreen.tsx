// src/screens/LocationComparisonScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SectionHeader } from '../components/SectionHeader';
import { PortfolioTicker } from '../components/PortfolioTicker';
import { PaywallScreen } from './PaywallScreen';
import { colors, spacing, radii, textVariants, touchTarget } from '../theme/theme';
import {
  calculateLocationMetrics,
  calculateDashboardMetrics,
  formatCurrency,
  formatPercent,
  formatNumber,
  getROIColor,
  getProfitColor,
} from '../utils/calculations';
import { Location, LocationType, CompetitionLevel } from '../types';
import Toast from 'react-native-toast-message';
import { exportLocationsToCSV } from '../utils/export';
import { LockedScreenOverlay } from '../components/LockedScreenOverlay';
import { trackEvent } from '../utils/analytics';

export const LocationComparisonScreen: React.FC = () => {
  const { 
    dashboards, 
    locationComparisons, 
    addLocationComparison,
    updateLocationComparison,
    isPremium 
  } = useAppStore();

  const [showPaywall, setShowPaywall] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Store form inputs as STRINGS to prevent keyboard dismissal
  const [formInputs, setFormInputs] = useState({
    name: '',
    footTraffic: '0',
    monthlyRent: '0',
    notes: '',
  });

  const currentDashboard = dashboards[0];
  const locationComparison = locationComparisons.find(lc => lc.dashboardId === currentDashboard?.id);

  useEffect(() => {
    if (locationComparison) {
      setLocations(locationComparison.locations);
    }
  }, [locationComparison]);

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
          <Text style={styles.previewTitle}>Location Comparison</Text>
          <Text style={styles.previewSubtitle}>Score and rank potential locations</Text>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={styles.previewCard} />
          ))}
        </View>
        <LockedScreenOverlay
          title="Find your best location before you commit"
          description="Score locations by foot traffic, rent, and competition. Know which one actually makes money before you sign anything."
          onUnlock={() => {
            trackEvent('paywall_viewed', { trigger: 'location_comparison' });
            setShowPaywall(true);
          }}
        />
      </View>
    );
  }

  // Calculate portfolio totals for ticker
  const portfolioTotals = locations.reduce(
    (acc, loc) => {
      const metrics = calculateLocationMetrics(loc, currentDashboard);
      return {
        totalInvestment: acc.totalInvestment + (currentDashboard?.initialInvestment ? 
          Object.values(currentDashboard.initialInvestment).reduce((a, b) => a + b, 0) : 0),
        totalRevenue: acc.totalRevenue + (metrics.netProfit * 12), // Annual revenue
        avgROI: acc.avgROI + metrics.roi,
      };
    },
    { totalInvestment: 0, totalRevenue: 0, avgROI: 0 }
  );

  const avgROI = locations.length > 0 ? portfolioTotals.avgROI / locations.length : 0;

  if (!currentDashboard) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please create a dashboard first</Text>
      </View>
    );
  }

  const handleAddLocation = async () => {
    if (locations.length >= 10) {
      Alert.alert('Limit Reached', 'You can compare up to 10 locations');
      return;
    }

    const newLocation: Location = {
      id: Date.now().toString(),
      name: '',
      type: 'Retail',
      footTraffic: 0,
      monthlyRent: 0,
      competition: 'Low',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingLocation(newLocation);
    setFormInputs({
      name: '',
      footTraffic: '0',
      monthlyRent: '0',
      notes: '',
    });
    setShowAddForm(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setFormInputs({
      name: location.name,
      footTraffic: location.footTraffic.toString(),
      monthlyRent: location.monthlyRent.toString(),
      notes: location.notes || '',
    });
    setShowAddForm(true);
  };

  const handleSaveLocation = () => {
    if (!editingLocation || !formInputs.name) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please enter a location name',
      });
      return;
    }

    const locationToSave: Location = {
      ...editingLocation,
      name: formInputs.name,
      footTraffic: parseFloat(formInputs.footTraffic) || 0,
      monthlyRent: parseFloat(formInputs.monthlyRent) || 0,
      notes: formInputs.notes,
      updatedAt: new Date().toISOString(),
    };

    const updatedLocations = locations.find(l => l.id === locationToSave.id)
      ? locations.map(l => l.id === locationToSave.id ? locationToSave : l)
      : [...locations, locationToSave];

    setLocations(updatedLocations);

    if (locationComparison) {
      updateLocationComparison(locationComparison.id, {
        locations: updatedLocations,
      });
    } else {
      addLocationComparison({
        id: Date.now().toString(),
        dashboardId: currentDashboard.id,
        locations: updatedLocations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    Toast.show({
      type: 'success',
      text1: 'Location saved',
      text2: `${locationToSave.name} added to comparison`,
    });

    setShowAddForm(false);
    setEditingLocation(null);
  };

  const handlePickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Please enable photo access in settings',
      });
      return;
    }

    // Show action sheet: Camera or Gallery
    Alert.alert(
      'Add Photo',
      'Choose a source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraPermission.status !== 'granted') {
              Toast.show({
                type: 'error',
                text1: 'Camera Permission Denied',
              });
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.7,
            });

            if (!result.canceled && editingLocation) {
              setEditingLocation({
                ...editingLocation,
                photoUri: result.assets[0].uri,
              });
            }
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.7,
            });

            if (!result.canceled && editingLocation) {
              setEditingLocation({
                ...editingLocation,
                photoUri: result.assets[0].uri,
              });
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleDeleteLocation = (id: string) => {
    const locationToDelete = locations.find(l => l.id === id);
    
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedLocations = locations.filter(l => l.id !== id);
            setLocations(updatedLocations);
            if (locationComparison) {
              updateLocationComparison(locationComparison.id, {
                locations: updatedLocations,
              });
            }
            
            Toast.show({
              type: 'info',
              text1: 'Location removed',
              text2: locationToDelete?.name || 'Location deleted',
            });
          },
        },
      ]
    );
  };

  const sortedLocations = [...locations].sort((a, b) => {
    const metricsA = calculateLocationMetrics(a, currentDashboard);
    const metricsB = calculateLocationMetrics(b, currentDashboard);
    return metricsB.locationScore - metricsA.locationScore;
  });

  const renderLocationCard = ({ item }: { item: Location }) => {
    const metrics = calculateLocationMetrics(item, currentDashboard);
    const scoreColor = getROIColor(metrics.locationScore);
    
    // Calculate profit margin
    const profitMargin = metrics.monthlyRevenue > 0 
      ? (metrics.netProfit / metrics.monthlyRevenue) * 100 
      : 0;
    
    // Calculate break-even (how many months to recover initial investment)
    const totalInitialInvestment = calculateDashboardMetrics(currentDashboard).totalInitialInvestment;
    const breakEvenMonths = metrics.netProfit > 0 
      ? totalInitialInvestment / metrics.netProfit 
      : 0;
    
    return (
      <TouchableOpacity
        style={[styles.locationCard, { borderLeftWidth: 4, borderLeftColor: scoreColor }]}
        onPress={() => handleEditLocation(item)}
      >
        <View style={styles.locationHeader}>
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationName}>{item.name}</Text>
            <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
              <View style={[styles.scoreDot, { backgroundColor: scoreColor }]} />
              <Text style={[styles.scoreText, { color: scoreColor }]}>
                {metrics.locationScore.toFixed(0)}
              </Text>
              <Text style={styles.scoreUnit}>/100</Text>
            </View>
          </View>
          <Text style={styles.locationType}>{item.type}</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Monthly Profit</Text>
            <Text style={[styles.metricValue, { color: getProfitColor(metrics.netProfit) }]}>
              {formatCurrency(metrics.netProfit)}
            </Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Profit Margin</Text>
            <Text style={[styles.metricValue, { color: getProfitColor(profitMargin) }]}>
              {formatPercent(profitMargin)}
            </Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Break-even</Text>
            <Text style={styles.metricValue}>
              {breakEvenMonths > 0 ? `${breakEvenMonths.toFixed(1)} mo` : 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            Traffic: {formatNumber(item.footTraffic)}/day → ~{formatNumber(metrics.estimatedDailySales)} sales/day
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Rent: {formatCurrency(item.monthlyRent)}</Text>
          <Text style={styles.detailText}>Competition: {item.competition}</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: scoreColor }]}
            onPress={() => Alert.alert('Location Analysis', `${item.name}\n\nScore: ${metrics.locationScore.toFixed(0)}/100\nEst. Monthly Profit: ${formatCurrency(metrics.netProfit)}\nEst. Daily Sales: ${formatNumber(metrics.estimatedDailySales)}\nBreak-even: ${breakEvenMonths > 0 ? `${breakEvenMonths.toFixed(1)} months` : 'N/A'}`)}
          >
            <Text style={styles.analyzeButtonText}>ANALYZE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteLocation(item.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (showAddForm && editingLocation) {
    return (
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader 
          title={formInputs.name || 'New Location'}
          subtitle="Enter location details for comparison"
        />

        <Input
          label="Location Name"
          value={formInputs.name}
          onChangeText={(value) => setFormInputs(prev => ({ ...prev, name: value }))}
          placeholder="e.g., Downtown Office Building"
          autoCapitalize="words"
        />

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location Type</Text>
          <View style={styles.chipGroup}>
            {(['Office', 'Retail', 'School', 'Industrial', 'Residential', 'Other'] as LocationType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  editingLocation.type === type && styles.chipSelected,
                ]}
                onPress={() => setEditingLocation({ ...editingLocation, type })}
              >
                <Text style={[
                  styles.chipText,
                  editingLocation.type === type && styles.chipTextSelected,
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Foot Traffic (per day)"
          value={formInputs.footTraffic}
          onChangeText={(value) => setFormInputs(prev => ({ ...prev, footTraffic: value }))}
          onFocus={() => {
            if (formInputs.footTraffic === '0') {
              setFormInputs(prev => ({ ...prev, footTraffic: '' }));
            }
          }}
          keyboardType="numeric"
          helperText="Estimate people passing by daily"
        />

        <Input
          label="Monthly Rent"
          value={formInputs.monthlyRent}
          onChangeText={(value) => setFormInputs(prev => ({ ...prev, monthlyRent: value }))}
          onFocus={() => {
            if (formInputs.monthlyRent === '0') {
              setFormInputs(prev => ({ ...prev, monthlyRent: '' }));
            }
          }}
          keyboardType="numeric"
          prefix="$"
        />

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Competition Level</Text>
          <View style={styles.chipGroup}>
            {(['None', 'Low', 'Medium', 'High'] as CompetitionLevel[]).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.chip,
                  editingLocation.competition === level && styles.chipSelected,
                ]}
                onPress={() => setEditingLocation({ ...editingLocation, competition: level })}
              >
                <Text style={[
                  styles.chipText,
                  editingLocation.competition === level && styles.chipTextSelected,
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title={editingLocation.photoUri ? 'Change Photo' : 'Add Photo'}
          onPress={handlePickImage}
          variant="secondary"
          style={styles.photoButton}
        />

        <Input
          label="Notes"
          value={formInputs.notes}
          onChangeText={(value) => setFormInputs(prev => ({ ...prev, notes: value }))}
          multiline
          numberOfLines={3}
          placeholder="Any additional details..."
        />

        <View style={styles.formButtons}>
          <Button
            title="Cancel"
            onPress={() => {
              setShowAddForm(false);
              setEditingLocation(null);
            }}
            variant="ghost"
            style={styles.formButton}
          />
          <Button
            title="Save Location"
            onPress={handleSaveLocation}
            style={styles.formButton}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <PortfolioTicker
        totalInvestment={portfolioTotals.totalInvestment * locations.length}
        totalRevenue={portfolioTotals.totalRevenue}
        roi={avgROI}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Location Comparison</Text>
        <Text style={styles.headerSubtitle}>
          {locations.length}/10 locations
        </Text>
        
        {locations.length > 0 && (
          <Button
            title="Export CSV"
            onPress={async () => {
              try {
                await exportLocationsToCSV(locations, currentDashboard);
                Toast.show({
                  type: 'success',
                  text1: 'Exported',
                  text2: 'Location data ready to share',
                });
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: 'Export Failed',
                });
              }
            }}
            variant="secondary"
            style={styles.exportButton}
          />
        )}
      </View>

      {locations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No locations yet</Text>
          <Text style={styles.emptyText}>
            Add locations to compare their potential profitability
          </Text>
          <Button
            title="Add First Location"
            onPress={handleAddLocation}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={sortedLocations}
          renderItem={renderLocationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            locations.length < 10 ? (
              <Button
                title="Add Another Location"
                onPress={handleAddLocation}
                variant="secondary"
                style={styles.addButton}
              />
            ) : null
          }
        />
      )}
    </View>
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
  previewCard: {
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
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
  errorText: {
    ...textVariants.body,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...textVariants.title,
    fontSize: 22,
  },
  headerSubtitle: {
    ...textVariants.body,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.lg,
  },
  locationCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationHeader: {
    marginBottom: spacing.md,
  },
  locationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  locationName: {
    ...textVariants.subtitle,
    flex: 1,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    borderWidth: 1,
    backgroundColor: colors.surfaceAlt,
  },
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scoreText: {
    fontWeight: '700',
    fontSize: 14,
  },
  scoreUnit: {
    ...textVariants.body,
    fontSize: 11,
    color: colors.muted,
  },
  locationType: {
    ...textVariants.label,
    color: colors.muted,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    ...textVariants.label,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  metricValue: {
    ...textVariants.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.md,
  },
  detailText: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyzeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    backgroundColor: colors.accentPrimary,
  },
  analyzeButtonText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteText: {
    ...textVariants.body,
    color: colors.accentRisk,
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...textVariants.title,
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...textVariants.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    width: '100%',
  },
  addButton: {
    marginTop: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...textVariants.label,
    marginBottom: spacing.sm,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    margin: spacing.xs,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  chipText: {
    ...textVariants.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
  photoButton: {
    marginBottom: spacing.lg,
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  formButton: {
    flex: 1,
  },
  exportButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
});

// src/screens/ProductMixScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SectionHeader } from '../components/SectionHeader';
import { PortfolioTicker } from '../components/PortfolioTicker';
import { PaywallScreen } from './PaywallScreen';
import { colors, spacing, textVariants, radii } from '../theme/theme';
import {
  calculateDashboardMetrics,
  formatCurrency,
  formatPercent,
  formatNumber,
} from '../utils/calculations';
import { Product } from '../types';
import Toast from 'react-native-toast-message';
import { exportProductMixToCSV } from '../utils/export';

export const ProductMixScreen = () => {
  const { dashboards, productMixes, addProductMix, updateProductMix, isPremium } = useAppStore();
  
const [showPaywall, setShowPaywall] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form inputs as strings
  const [formInputs, setFormInputs] = useState({
    name: '',
    costPerUnit: '0',
    salePrice: '0',
    unitsPerMonth: '0',
  });

  const currentDashboard = dashboards[0];
  const productMix = productMixes.find(pm => pm.dashboardId === currentDashboard?.id);

  // Check premium access
useEffect(() => {
  if (!isPremium) {
    setShowPaywall(true);
  }
}, [isPremium]);
  
  useEffect(() => {
    if (productMix) {
      setProducts(productMix.products);
    }
  }, [productMix]);

  if (showPaywall) {
  return (
    <PaywallScreen
      onDismiss={() => setShowPaywall(false)}
      onPurchaseSuccess={() => setShowPaywall(false)}
    />
  );
}
  
  if (!currentDashboard) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please create a dashboard first</Text>
      </View>
    );
  }

  // Calculate metrics
  const dashboardMetrics = calculateDashboardMetrics(currentDashboard);
  
  const productMetrics = products.map(p => ({
    ...p,
    marginPerUnit: p.salePrice - p.costPerUnit,
    monthlyProfit: (p.salePrice - p.costPerUnit) * p.unitsPerMonth,
    monthlyRevenue: p.salePrice * p.unitsPerMonth,
    monthlyCost: p.costPerUnit * p.unitsPerMonth,
    marginPercentage: p.salePrice > 0 ? ((p.salePrice - p.costPerUnit) / p.salePrice) * 100 : 0,
  }));

  const totalMonthlyProfit = productMetrics.reduce((sum, p) => sum + p.monthlyProfit, 0);
  const totalMonthlyRevenue = productMetrics.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const totalMonthlyCost = productMetrics.reduce((sum, p) => sum + p.monthlyCost, 0);
  const avgMarginPercentage = products.length > 0 
    ? productMetrics.reduce((sum, p) => sum + p.marginPercentage, 0) / products.length 
    : 0;

  const bestProduct = productMetrics.length > 0
    ? productMetrics.reduce((best, current) => 
        current.monthlyProfit > best.monthlyProfit ? current : best
      )
    : null;

  const handleAddProduct = () => {
    if (products.length >= 10) {
      Alert.alert('Limit Reached', 'You can track up to 10 products');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      costPerUnit: 0,
      salePrice: 0,
      unitsPerMonth: 0,
    };

    setEditingProduct(newProduct);
    setFormInputs({
      name: '',
      costPerUnit: '0',
      salePrice: '0',
      unitsPerMonth: '0',
    });
    setShowAddForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormInputs({
      name: product.name,
      costPerUnit: product.costPerUnit.toString(),
      salePrice: product.salePrice.toString(),
      unitsPerMonth: product.unitsPerMonth.toString(),
    });
    setShowAddForm(true);
  };

  const handleSaveProduct = () => {
  if (!editingProduct || !formInputs.name) {
    Toast.show({
      type: 'error',
      text1: 'Missing Information',
      text2: 'Please enter a product name',
    });
    return;
  }

  const productToSave: Product = {
    ...editingProduct,
    name: formInputs.name,
    costPerUnit: parseFloat(formInputs.costPerUnit) || 0,
    salePrice: parseFloat(formInputs.salePrice) || 0,
    unitsPerMonth: parseFloat(formInputs.unitsPerMonth) || 0,
  };

  const updatedProducts = products.find(p => p.id === productToSave.id)
    ? products.map(p => p.id === productToSave.id ? productToSave : p)
    : [...products, productToSave];

  setProducts(updatedProducts);

  if (productMix) {
    updateProductMix(productMix.id, {
      products: updatedProducts,
    });
  } else {
    addProductMix({
      id: Date.now().toString(),
      dashboardId: currentDashboard.id,
      products: updatedProducts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  Toast.show({
    type: 'success',
    text1: 'Product saved',
    text2: `${productToSave.name} added to mix`,
  });

  setShowAddForm(false);
  setEditingProduct(null);
};

  const handleDeleteProduct = (id: string) => {
    const productToDelete = products.find(l => l.id === id);
    
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedProducts = products.filter(p => p.id !== id);
            setProducts(updatedProducts);
            if (productMix) {
              updateProductMix(productMix.id, {
                products: updatedProducts,
              });
            }
            Toast.show({
            type: 'info',
            text1: 'Product removed',
            text2: productToDelete?.name || 'Location deleted',
          });
          },
        }
      ]
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const metrics = productMetrics.find(p => p.id === item.id);
    if (!metrics) return null;

    const isBest = bestProduct?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          isBest && styles.productCardBest,
        ]}
        onPress={() => handleEditProduct(item)}
      >
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          {isBest && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestBadgeText}>🏆 Best</Text>
            </View>
          )}
        </View>

        <View style={styles.productMetrics}>
          <View style={styles.productMetricItem}>
            <Text style={styles.productMetricLabel}>Cost</Text>
            <Text style={styles.productMetricValue}>{formatCurrency(item.costPerUnit)}</Text>
          </View>

          <View style={styles.productMetricItem}>
            <Text style={styles.productMetricLabel}>Price</Text>
            <Text style={styles.productMetricValue}>{formatCurrency(item.salePrice)}</Text>
          </View>

          <View style={styles.productMetricItem}>
            <Text style={styles.productMetricLabel}>Margin</Text>
            <Text style={[styles.productMetricValue, { color: colors.accentProfit }]}>
              {formatPercent(metrics.marginPercentage)}
            </Text>
              <Text style={styles.productMicroCopy}>
    {metrics.marginPercentage > 50 ? '🔥 High' : metrics.marginPercentage > 30 ? '✓ Good' : '⚠️ Low'}
  </Text>
          </View>
        </View>

        <View style={styles.productFooter}>
          <Text style={styles.productUnits}>{formatNumber(item.unitsPerMonth)} units/month</Text>
          <Text style={[styles.productProfit, { color: colors.accentProfit }]}>
            {formatCurrency(metrics.monthlyProfit)}/mo
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (showAddForm && editingProduct) {
    return (
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader 
          title={formInputs.name || 'New Product'}
          subtitle="Enter product details for tracking"
        />

        <Input
          label="Product Name"
          value={formInputs.name}
          onChangeText={(value) => setFormInputs(prev => ({ ...prev, name: value }))}
          placeholder="e.g., Coca Cola 20oz"
          autoCapitalize="words"
        />

        <Input
          label="Cost per Unit"
          value={formInputs.costPerUnit}
          onChangeText={(value) => setFormInputs(prev => ({ ...prev, costPerUnit: value }))}
          onFocus={() => {
            if (formInputs.costPerUnit === '0') {
              setFormInputs(prev => ({ ...prev, costPerUnit: '' }));
            }
          }}
          keyboardType="numeric"
          prefix="$"
          helperText="What you pay per item"
        />

        <Input
          label="Sale Price"
          value={formInputs.salePrice}
          onChangeText={(value) => setFormInputs(prev => ({ ...prev, salePrice: value }))}
          onFocus={() => {
            if (formInputs.salePrice === '0') {
              setFormInputs(prev => ({ ...prev, salePrice: '' }));
            }
          }}
          keyboardType="numeric"
          prefix="$"
          helperText="What you charge customers"
        />

        <Input
          label="Units Sold per Month"
          value={formInputs.unitsPerMonth}
          onChangeText={(value) => setFormInputs(prev => ({ ...prev, unitsPerMonth: value }))}
          onFocus={() => {
            if (formInputs.unitsPerMonth === '0') {
              setFormInputs(prev => ({ ...prev, unitsPerMonth: '' }));
            }
          }}
          keyboardType="numeric"
          helperText="Estimated monthly sales"
        />

        <View style={styles.formButtons}>
          <Button
            title="Cancel"
            onPress={() => {
              setShowAddForm(false);
              setEditingProduct(null);
            }}
            variant="ghost"
            style={styles.formButton}
          />
          <Button
            title="Save Product"
            onPress={handleSaveProduct}
            style={styles.formButton}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <PortfolioTicker
        totalInvestment={dashboardMetrics.totalInitialInvestment}
        totalRevenue={totalMonthlyRevenue * 12}
        roi={dashboardMetrics.roiPercentage}
      />

      {products.length > 0 && (
  <Button
    title="Export CSV"
    onPress={async () => {
      try {
        await exportProductMixToCSV(products);
        Toast.show({
          type: 'success',
          text1: 'Exported',
          text2: 'Product data ready to share',
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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Mix Optimizer</Text>
        <Text style={styles.headerSubtitle}>
          {products.length}/10 products tracked
        </Text>
      </View>

      {/* Summary Cards */}
      {products.length > 0 && (
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Monthly Profit</Text>
            <Text style={[styles.summaryValue, { color: colors.accentProfit }]}>
              {formatCurrency(totalMonthlyProfit)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg Margin</Text>
            <Text style={styles.summaryValue}>
              {formatPercent(avgMarginPercentage)}
            </Text>
          </View>

          {bestProduct && (
            <View style={[styles.summaryCard, styles.summaryCardBest]}>
              <Text style={styles.summaryLabel}>Best Performer</Text>
              <Text style={styles.summaryValue}>{bestProduct.name}</Text>
              <Text style={styles.summarySubtext}>
                {formatCurrency(bestProduct.monthlyProfit)}/mo
              </Text>
            </View>
          )}
        </View>
      )}

      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No products yet</Text>
          <Text style={styles.emptyText}>
            Add products to track profitability and optimize your mix
          </Text>
          <Button
            title="Add First Product"
            onPress={handleAddProduct}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={productMetrics.sort((a, b) => b.monthlyProfit - a.monthlyProfit)}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            products.length < 10 ? (
              <Button
                title="Add Another Product"
                onPress={handleAddProduct}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
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
  summarySection: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryCardBest: {
    borderColor: colors.accentPrimary,
    borderWidth: 2,
  },
  summaryLabel: {
    ...textVariants.label,
    fontSize: 11,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...textVariants.subtitle,
    fontSize: 24,
    fontWeight: '800',
  },
  summarySubtext: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.lg,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productCardBest: {
    borderColor: colors.accentPrimary,
    borderWidth: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  productName: {
    ...textVariants.subtitle,
    flex: 1,
  },
  bestBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.accentPrimary,
    borderRadius: radii.pill,
  },
  bestBadgeText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '700',
  },
  productMetrics: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  productMetricItem: {
    flex: 1,
  },
  productMetricLabel: {
    ...textVariants.label,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  productMetricValue: {
    ...textVariants.body,
    fontSize: 14,
    fontWeight: '600',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.sm,
  },
  productUnits: {
    ...textVariants.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  productProfit: {
    ...textVariants.body,
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    padding: spacing.xs,
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
  formButtons: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  formButton: {
    flex: 1,
  },
  productMicroCopy: {
  fontSize: 9,
  fontWeight: '600',
  marginTop: spacing.xs / 2,
  color: colors.textSecondary,
},
exportButton: {
  margin: spacing.lg,
  marginTop: 0,
},
});

"use strict";
// src/utils/calculations.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDashboardMetrics = calculateDashboardMetrics;
exports.calculateProductMetrics = calculateProductMetrics;
exports.calculateProductMixMetrics = calculateProductMixMetrics;
exports.calculateLocationMetrics = calculateLocationMetrics;
exports.calculateGrowthSummary = calculateGrowthSummary;
exports.formatCurrency = formatCurrency;
exports.formatPercent = formatPercent;
exports.formatNumber = formatNumber;
exports.getROIColor = getROIColor;
exports.getProfitColor = getProfitColor;
// ============================================================================
// DASHBOARD CALCULATIONS
// ============================================================================
function calculateDashboardMetrics(dashboard) {
    const { initialInvestment, operatingCosts, revenue } = dashboard;
    // Total Initial Investment
    const totalInitialInvestment = initialInvestment.machineCost +
        initialInvestment.installationDelivery +
        initialInvestment.initialInventory +
        initialInvestment.licensesPermits;
    // Total Monthly Costs
    const totalMonthlyCosts = operatingCosts.productRestock +
        operatingCosts.transportationFuel +
        operatingCosts.maintenance +
        operatingCosts.locationRent +
        operatingCosts.creditCardFees +
        operatingCosts.otherExpenses;
    // Total Monthly Revenue
    const totalMonthlyRevenue = revenue.itemsSoldPerDay * revenue.averageSalePrice * revenue.daysOperatingPerMonth;
    // Monthly Net Profit
    const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyCosts;
    // Annual Net Profit
    const annualNetProfit = monthlyNetProfit * 12;
    // ROI Percentage
    const roiPercentage = totalInitialInvestment > 0
        ? (annualNetProfit / totalInitialInvestment) * 100
        : 0;
    // Break-even Point (Months)
    const breakEvenMonths = monthlyNetProfit > 0
        ? totalInitialInvestment / monthlyNetProfit
        : 0;
    // Profit Margin
    const profitMargin = totalMonthlyRevenue > 0
        ? (monthlyNetProfit / totalMonthlyRevenue) * 100
        : 0;
    // Monthly Cash Flow
    const monthlyCashFlow = monthlyNetProfit;
    return {
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
}
// ============================================================================
// PRODUCT MIX CALCULATIONS
// ============================================================================
function calculateProductMetrics(product) {
    const marginPerUnit = product.salePrice - product.costPerUnit;
    const monthlyProfit = marginPerUnit * product.unitsPerMonth;
    const monthlyRevenue = product.salePrice * product.unitsPerMonth;
    const monthlyCost = product.costPerUnit * product.unitsPerMonth;
    const marginPercentage = product.salePrice > 0
        ? (marginPerUnit / product.salePrice) * 100
        : 0;
    return {
        marginPerUnit,
        monthlyProfit,
        monthlyRevenue,
        monthlyCost,
        marginPercentage,
    };
}
function calculateProductMixMetrics(productMix) {
    const products = productMix.products;
    let totalMonthlyProfit = 0;
    let totalMonthlyRevenue = 0;
    let totalMonthlyCost = 0;
    let totalMarginPercentage = 0;
    let bestProduct = null;
    let bestProductProfit = 0;
    products.forEach((product) => {
        const metrics = calculateProductMetrics(product);
        totalMonthlyProfit += metrics.monthlyProfit;
        totalMonthlyRevenue += metrics.monthlyRevenue;
        totalMonthlyCost += metrics.monthlyCost;
        totalMarginPercentage += metrics.marginPercentage;
        if (metrics.monthlyProfit > bestProductProfit) {
            bestProductProfit = metrics.monthlyProfit;
            bestProduct = product;
        }
    });
    const averageMarginPercentage = products.length > 0
        ? totalMarginPercentage / products.length
        : 0;
    return {
        totalMonthlyProfit,
        averageMarginPercentage,
        bestPerformingProduct: bestProduct,
        totalMonthlyRevenue,
        totalMonthlyCost,
    };
}
// ============================================================================
// LOCATION COMPARISON CALCULATIONS
// ============================================================================
function getTrafficScore(footTraffic) {
    if (footTraffic > 1000)
        return 100;
    if (footTraffic > 500)
        return 75;
    if (footTraffic > 200)
        return 50;
    return 25;
}
function getRentScore(monthlyRent) {
    if (monthlyRent < 500)
        return 100;
    if (monthlyRent < 1000)
        return 75;
    if (monthlyRent < 2000)
        return 50;
    return 25;
}
function getCompetitionScore(competition) {
    const scores = {
        None: 100,
        Low: 75,
        Medium: 50,
        High: 25,
    };
    return scores[competition];
}
function calculateLocationMetrics(location, dashboardData) {
    // Scoring
    const trafficScore = getTrafficScore(location.footTraffic);
    const rentScore = getRentScore(location.monthlyRent);
    const competitionScore = getCompetitionScore(location.competition);
    const locationScore = (trafficScore + rentScore + competitionScore) / 3;
    // Financial Projections
    const conversionRate = 0.05; // 5% of foot traffic buys
    const estimatedDailySales = location.footTraffic * conversionRate;
    const averageSalePrice = dashboardData.revenue.averageSalePrice || 2.5;
    const daysPerMonth = dashboardData.revenue.daysOperatingPerMonth || 30;
    const monthlyRevenue = estimatedDailySales * daysPerMonth * averageSalePrice;
    // Calculate COGS from dashboard's actual product restock cost
    // Use the dashboard's cost structure, but replace location rent
    const actualCOGS = dashboardData.operatingCosts.productRestock || (monthlyRevenue * 0.35);
    const operatingCosts = location.monthlyRent + // Use THIS location's rent
        actualCOGS + // Product costs
        dashboardData.operatingCosts.transportationFuel +
        dashboardData.operatingCosts.maintenance +
        dashboardData.operatingCosts.creditCardFees +
        dashboardData.operatingCosts.otherExpenses;
    const netProfit = monthlyRevenue - operatingCosts;
    // ROI
    const totalInitialInvestment = calculateDashboardMetrics(dashboardData).totalInitialInvestment;
    const roi = totalInitialInvestment > 0
        ? ((netProfit * 12) / totalInitialInvestment) * 100
        : 0;
    return {
        locationScore,
        trafficScore,
        rentScore,
        competitionScore,
        estimatedDailySales,
        monthlyRevenue,
        operatingCosts,
        netProfit,
        roi,
    };
}
// ============================================================================
// GROWTH PROJECTOR CALCULATIONS
// ============================================================================
function calculateGrowthSummary(projections) {
    const totalInvestment = projections.reduce((sum, p) => sum + p.investmentRequired, 0);
    const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
    const twelveMonthNetProfit = projections.reduce((sum, p) => sum + p.netProfit, 0);
    const roi = totalInvestment > 0 ? (twelveMonthNetProfit / totalInvestment) * 100 : 0;
    return {
        totalInvestment,
        totalRevenue,
        twelveMonthNetProfit,
        roi,
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
function formatPercent(value) {
    return `${value.toFixed(1)}%`;
}
function formatNumber(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(value);
}
function getROIColor(roi) {
    if (roi >= 100)
        return '#00C853'; // Vivid emerald green
    if (roi >= 50)
        return '#64DD17'; // Bright lime green
    if (roi >= 20)
        return '#FFD600'; // High-visibility yellow
    if (roi >= 0)
        return '#FF9100'; // Orange for weak returns
    return '#FF1744'; // Strong red for negative ROI
}
function getProfitColor(profit) {
    return profit >= 0 ? '#00E676' : '#FF5252';
}

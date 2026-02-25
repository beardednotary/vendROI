"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculations_1 = require("../src/utils/calculations");
function assert(condition, message) {
    if (!condition)
        throw new Error(message);
}
function assertApprox(actual, expected, epsilon = 0.001, label = 'value') {
    if (Math.abs(actual - expected) > epsilon) {
        throw new Error(`${label}: expected ${expected}, got ${actual}`);
    }
}
function run(name, fn) {
    try {
        fn();
        console.log(`PASS ${name}`);
    }
    catch (error) {
        console.error(`FAIL ${name}`);
        throw error;
    }
}
const dashboard = {
    id: 'd1',
    name: 'Test Route',
    initialInvestment: {
        machineCost: 3000,
        installationDelivery: 400,
        initialInventory: 600,
        licensesPermits: 200,
    },
    operatingCosts: {
        productRestock: 700,
        transportationFuel: 120,
        maintenance: 80,
        locationRent: 300,
        creditCardFees: 60,
        otherExpenses: 40,
    },
    revenue: {
        itemsSoldPerDay: 30,
        averageSalePrice: 2.5,
        daysOperatingPerMonth: 30,
    },
    revenueSource: 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
run('calculateDashboardMetrics computes ROI outputs', () => {
    const metrics = (0, calculations_1.calculateDashboardMetrics)(dashboard);
    assert(metrics.totalInitialInvestment === 4200, 'totalInitialInvestment');
    assert(metrics.totalMonthlyCosts === 1300, 'totalMonthlyCosts');
    assert(metrics.totalMonthlyRevenue === 2250, 'totalMonthlyRevenue');
    assert(metrics.monthlyNetProfit === 950, 'monthlyNetProfit');
    assert(metrics.annualNetProfit === 11400, 'annualNetProfit');
    assertApprox(metrics.roiPercentage, (11400 / 4200) * 100, 0.001, 'roiPercentage');
    assertApprox(metrics.breakEvenMonths, 4200 / 950, 0.001, 'breakEvenMonths');
    assertApprox(metrics.profitMargin, (950 / 2250) * 100, 0.001, 'profitMargin');
});
run('calculateProductMixMetrics aggregates products and identifies best performer', () => {
    const productMix = {
        id: 'pm1',
        dashboardId: 'd1',
        products: [
            { id: 'p1', name: 'Soda', costPerUnit: 1, salePrice: 2.5, unitsPerMonth: 120 },
            { id: 'p2', name: 'Chips', costPerUnit: 0.8, salePrice: 2, unitsPerMonth: 80 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const metrics = (0, calculations_1.calculateProductMixMetrics)(productMix);
    assert(metrics.totalMonthlyRevenue === 460, 'totalMonthlyRevenue');
    assert(metrics.totalMonthlyCost === 184, 'totalMonthlyCost');
    assert(metrics.totalMonthlyProfit === 276, 'totalMonthlyProfit');
    assert(metrics.bestPerformingProduct?.id === 'p1', 'bestPerformingProduct');
});
run('calculateLocationMetrics uses location-specific rent in projections', () => {
    const location = {
        id: 'l1',
        name: 'Office Lobby',
        type: 'Office',
        footTraffic: 600,
        monthlyRent: 450,
        competition: 'Low',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const metrics = (0, calculations_1.calculateLocationMetrics)(location, dashboard);
    assertApprox(metrics.estimatedDailySales, 30, 0.001, 'estimatedDailySales');
    assertApprox(metrics.monthlyRevenue, 2250, 0.001, 'monthlyRevenue');
    assertApprox(metrics.operatingCosts, 1450, 0.001, 'operatingCosts');
    assertApprox(metrics.netProfit, 800, 0.001, 'netProfit');
    assert(metrics.locationScore > 0, 'locationScore');
});
run('calculateGrowthSummary aggregates projection totals', () => {
    const projections = [
        { month: 1, totalMachines: 1, investmentRequired: 1000, revenue: 300, operatingCosts: 150, netProfit: 150 },
        { month: 2, totalMachines: 2, investmentRequired: 500, revenue: 600, operatingCosts: 260, netProfit: 340 },
    ];
    const summary = (0, calculations_1.calculateGrowthSummary)(projections);
    assert(summary.totalInvestment === 1500, 'totalInvestment');
    assert(summary.totalRevenue === 900, 'totalRevenue');
    assert(summary.twelveMonthNetProfit === 490, 'twelveMonthNetProfit');
    assertApprox(summary.roi, (490 / 1500) * 100, 0.001, 'roi');
});
run('dashboard calculations handle zero and negative values safely', () => {
    const zeroDashboard = {
        ...dashboard,
        initialInvestment: {
            machineCost: 0,
            installationDelivery: 0,
            initialInventory: 0,
            licensesPermits: 0,
        },
        operatingCosts: {
            productRestock: 0,
            transportationFuel: 0,
            maintenance: 0,
            locationRent: 0,
            creditCardFees: 0,
            otherExpenses: 0,
        },
        revenue: {
            itemsSoldPerDay: 0,
            averageSalePrice: 0,
            daysOperatingPerMonth: 0,
        },
    };
    const zeroMetrics = (0, calculations_1.calculateDashboardMetrics)(zeroDashboard);
    assert(zeroMetrics.roiPercentage === 0, 'zero ROI should be 0');
    assert(zeroMetrics.breakEvenMonths === 0, 'zero break-even should be 0');
    assert(zeroMetrics.profitMargin === 0, 'zero profit margin should be 0');
    const lossDashboard = {
        ...dashboard,
        revenue: {
            itemsSoldPerDay: 1,
            averageSalePrice: 1,
            daysOperatingPerMonth: 1,
        },
    };
    const lossMetrics = (0, calculations_1.calculateDashboardMetrics)(lossDashboard);
    assert(lossMetrics.monthlyNetProfit < 0, 'loss dashboard should produce negative profit');
    assert(lossMetrics.breakEvenMonths === 0, 'negative profit should clamp break-even to 0');
    assert(lossMetrics.roiPercentage < 0, 'loss dashboard ROI should be negative');
});
run('product mix and growth summary handle empty arrays safely', () => {
    const emptyMix = {
        id: 'pm-empty',
        dashboardId: 'd1',
        products: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const mixMetrics = (0, calculations_1.calculateProductMixMetrics)(emptyMix);
    assert(mixMetrics.totalMonthlyProfit === 0, 'empty mix profit');
    assert(mixMetrics.totalMonthlyRevenue === 0, 'empty mix revenue');
    assert(mixMetrics.totalMonthlyCost === 0, 'empty mix cost');
    assert(mixMetrics.averageMarginPercentage === 0, 'empty mix average margin');
    assert(mixMetrics.bestPerformingProduct === null, 'empty mix best product');
    const growthMetrics = (0, calculations_1.calculateGrowthSummary)([]);
    assert(growthMetrics.totalInvestment === 0, 'empty growth investment');
    assert(growthMetrics.totalRevenue === 0, 'empty growth revenue');
    assert(growthMetrics.twelveMonthNetProfit === 0, 'empty growth net profit');
    assert(growthMetrics.roi === 0, 'empty growth ROI');
});
run('location metrics handle low traffic and zero dashboard sale inputs', () => {
    const lowTrafficLocation = {
        id: 'l-low',
        name: 'Quiet Hallway',
        type: 'Office',
        footTraffic: 50,
        monthlyRent: 2500,
        competition: 'High',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const dashboardWithZeroPrice = {
        ...dashboard,
        revenue: {
            itemsSoldPerDay: 0,
            averageSalePrice: 0,
            daysOperatingPerMonth: 0,
        },
    };
    const metrics = (0, calculations_1.calculateLocationMetrics)(lowTrafficLocation, dashboardWithZeroPrice);
    assert(metrics.estimatedDailySales > 0, 'location estimated sales should derive from traffic');
    assert(metrics.monthlyRevenue > 0, 'location should fall back to default sale price/days');
    assert(metrics.locationScore > 0 && metrics.locationScore <= 100, 'location score range');
});
run('formatters and color helpers return stable outputs', () => {
    assert((0, calculations_1.formatCurrency)(1234) === '$1,234', 'formatCurrency');
    assert((0, calculations_1.formatPercent)(12.34) === '12.3%', 'formatPercent');
    assert((0, calculations_1.getROIColor)(120) === '#00C853', 'getROIColor');
    assert((0, calculations_1.getProfitColor)(-1) === '#FF5252', 'getProfitColor');
});
console.log('All calculations tests passed.');

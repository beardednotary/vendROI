// src/utils/export.ts

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

import {
  DashboardData,
  DashboardMetrics,
  Location,
  Product,
} from '../types';
import {
  calculateLocationMetrics,
  calculateProductMetrics,
} from './calculations';

interface MonthlyProjection {
  month: number;
  totalMachines: number;
  investmentRequired: number;
  revenue: number;
  operatingCosts: number;
  netProfit: number;
}

// Helper function to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// CSV Generation Functions
function escapeCSV(value: string | number): string {
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function generateCSVRow(values: (string | number)[]): string {
  return values.map(escapeCSV).join(',') + '\n';
}

// Dashboard CSV Export
export async function exportDashboardToCSV(
  dashboard: DashboardData,
  metrics: DashboardMetrics
): Promise<void> {
  let csv = '';

  // Header
  csv += generateCSVRow(['Vending Machine ROI Calculator Export']);
  csv += generateCSVRow(['Dashboard Name', dashboard.name]);
  csv += generateCSVRow(['Export Date', formatDate(new Date())]);
  csv += '\n';

  // Initial Investment
  csv += generateCSVRow(['Initial Investment']);
  csv += generateCSVRow(['Machine Purchase Cost', dashboard.initialInvestment.machineCost]);
  csv += generateCSVRow(['Installation/Delivery', dashboard.initialInvestment.installationDelivery]);
  csv += generateCSVRow(['Initial Inventory', dashboard.initialInvestment.initialInventory]);
  csv += generateCSVRow(['Licenses & Permits', dashboard.initialInvestment.licensesPermits]);
  csv += generateCSVRow(['Total Initial Investment', metrics.totalInitialInvestment]);
  csv += '\n';

  // Monthly Operating Costs
  csv += generateCSVRow(['Monthly Operating Costs']);
  csv += generateCSVRow(['Product Inventory Restock', dashboard.operatingCosts.productRestock]);
  csv += generateCSVRow(['Transportation/Fuel', dashboard.operatingCosts.transportationFuel]);
  csv += generateCSVRow(['Machine Maintenance', dashboard.operatingCosts.maintenance]);
  csv += generateCSVRow(['Location Rent/Fees', dashboard.operatingCosts.locationRent]);
  csv += generateCSVRow(['Credit Card Processing Fees', dashboard.operatingCosts.creditCardFees]);
  csv += generateCSVRow(['Other Expenses', dashboard.operatingCosts.otherExpenses]);
  csv += generateCSVRow(['Total Monthly Costs', metrics.totalMonthlyCosts]);
  csv += '\n';

  // Monthly Revenue
  csv += generateCSVRow(['Monthly Revenue Projections']);
  csv += generateCSVRow(['Average Items Sold Per Day', dashboard.revenue.itemsSoldPerDay]);
  csv += generateCSVRow(['Average Sale Price', dashboard.revenue.averageSalePrice]);
  csv += generateCSVRow(['Days Operating Per Month', dashboard.revenue.daysOperatingPerMonth]);
  csv += generateCSVRow(['Total Monthly Revenue', metrics.totalMonthlyRevenue]);
  csv += '\n';

  // Profitability Metrics
  csv += generateCSVRow(['Profitability Metrics']);
  csv += generateCSVRow(['Monthly Net Profit', metrics.monthlyNetProfit]);
  csv += generateCSVRow(['Annual Net Profit', metrics.annualNetProfit]);
  csv += generateCSVRow(['ROI Percentage', metrics.roiPercentage.toFixed(2) + '%']);
  csv += generateCSVRow(['Break-even Point (Months)', metrics.breakEvenMonths.toFixed(1)]);
  csv += generateCSVRow(['Profit Margin', metrics.profitMargin.toFixed(2) + '%']);
  csv += generateCSVRow(['Monthly Cash Flow', metrics.monthlyCashFlow]);

  await saveAndShareFile(csv, `dashboard_${dashboard.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`);
}

// Dashboard PDF Export (HTML)
export async function exportDashboardToPDF(
  dashboard: DashboardData,
  metrics: DashboardMetrics
): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }
    h1 { 
      color: #1f2937; 
      border-bottom: 3px solid #3b82f6; 
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .date {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 30px;
    }
    h2 { 
      color: #374151; 
      margin-top: 30px;
      font-size: 20px;
      background: #f9fafb;
      padding: 10px 15px;
      border-radius: 6px;
    }
    .metric { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .metric-label { 
      color: #6b7280; 
      font-weight: 600;
      font-size: 14px;
    }
    .metric-value { 
      color: #1f2937; 
      font-weight: 700;
      font-size: 14px;
    }
    .section { 
      background: #ffffff; 
      padding: 20px; 
      margin: 20px 0; 
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .total-row {
      background: #f3f4f6;
      padding: 12px 0;
      font-weight: 700;
      margin-top: 10px;
    }
    .positive { color: #10b981; font-weight: 700; }
    .negative { color: #ef4444; font-weight: 700; }
    .footer { 
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>${dashboard.name}</h1>
  <div class="date">Generated on ${formatDate(new Date())}</div>
  
  <div class="section">
    <h2>Initial Investment</h2>
    <div class="metric">
      <span class="metric-label">Machine Purchase Cost</span>
      <span class="metric-value">$${dashboard.initialInvestment.machineCost.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Installation/Delivery</span>
      <span class="metric-value">$${dashboard.initialInvestment.installationDelivery.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Initial Inventory</span>
      <span class="metric-value">$${dashboard.initialInvestment.initialInventory.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Licenses & Permits</span>
      <span class="metric-value">$${dashboard.initialInvestment.licensesPermits.toFixed(2)}</span>
    </div>
    <div class="metric total-row">
      <span class="metric-label">Total Initial Investment</span>
      <span class="metric-value">$${metrics.totalInitialInvestment.toFixed(2)}</span>
    </div>
  </div>

  <div class="section">
    <h2>Monthly Operating Costs</h2>
    <div class="metric">
      <span class="metric-label">Product Inventory Restock</span>
      <span class="metric-value">$${dashboard.operatingCosts.productRestock.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Transportation/Fuel</span>
      <span class="metric-value">$${dashboard.operatingCosts.transportationFuel.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Machine Maintenance</span>
      <span class="metric-value">$${dashboard.operatingCosts.maintenance.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Location Rent/Fees</span>
      <span class="metric-value">$${dashboard.operatingCosts.locationRent.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Credit Card Processing Fees</span>
      <span class="metric-value">$${dashboard.operatingCosts.creditCardFees.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Other Expenses</span>
      <span class="metric-value">$${dashboard.operatingCosts.otherExpenses.toFixed(2)}</span>
    </div>
    <div class="metric total-row">
      <span class="metric-label">Total Monthly Costs</span>
      <span class="metric-value">$${metrics.totalMonthlyCosts.toFixed(2)}</span>
    </div>
  </div>

  <div class="section">
    <h2>Revenue Projections</h2>
    <div class="metric">
      <span class="metric-label">Items Sold Per Day</span>
      <span class="metric-value">${dashboard.revenue.itemsSoldPerDay}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Average Sale Price</span>
      <span class="metric-value">$${dashboard.revenue.averageSalePrice.toFixed(2)}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Days Operating Per Month</span>
      <span class="metric-value">${dashboard.revenue.daysOperatingPerMonth}</span>
    </div>
    <div class="metric total-row">
      <span class="metric-label">Total Monthly Revenue</span>
      <span class="metric-value">$${metrics.totalMonthlyRevenue.toFixed(2)}</span>
    </div>
  </div>

  <div class="section">
    <h2>Key Metrics</h2>
    <div class="metric">
      <span class="metric-label">Monthly Net Profit</span>
      <span class="metric-value ${metrics.monthlyNetProfit > 0 ? 'positive' : 'negative'}">
        $${metrics.monthlyNetProfit.toFixed(2)}
      </span>
    </div>
    <div class="metric">
      <span class="metric-label">Annual Net Profit</span>
      <span class="metric-value ${metrics.annualNetProfit > 0 ? 'positive' : 'negative'}">
        $${metrics.annualNetProfit.toFixed(2)}
      </span>
    </div>
    <div class="metric">
      <span class="metric-label">ROI Percentage</span>
      <span class="metric-value ${metrics.roiPercentage > 0 ? 'positive' : 'negative'}">
        ${metrics.roiPercentage.toFixed(1)}%
      </span>
    </div>
    <div class="metric">
      <span class="metric-label">Break-even Point</span>
      <span class="metric-value">
        ${metrics.breakEvenMonths > 0 ? `${metrics.breakEvenMonths.toFixed(1)} months` : 'N/A'}
      </span>
    </div>
    <div class="metric">
      <span class="metric-label">Profit Margin</span>
      <span class="metric-value ${metrics.profitMargin > 0 ? 'positive' : 'negative'}">
        ${metrics.profitMargin.toFixed(1)}%
      </span>
    </div>
  </div>

  <div class="footer">
    <p><strong>Vending Machine ROI Calculator</strong></p>
    <p>This report is for informational purposes only and should not be considered financial advice.</p>
  </div>
</body>
</html>
  `;

  // Generate actual PDF
  const { uri } = await Print.printToFileAsync({ html });
  
  // Share the PDF
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `${dashboard.name} - ROI Report`,
    UTI: 'com.adobe.pdf',
  });
}

// Location Comparison CSV Export
export async function exportLocationsToCSV(
  locations: Location[],
  dashboard: DashboardData
): Promise<void> {
  let csv = '';

  csv += generateCSVRow(['Location Comparison Export']);
  csv += generateCSVRow(['Export Date', formatDate(new Date())]);
  csv += '\n';

  csv += generateCSVRow([
    'Location Name',
    'Type',
    'Foot Traffic',
    'Monthly Rent',
    'Competition',
    'Location Score',
    'Est. Daily Sales',
    'Monthly Revenue',
    'Operating Costs',
    'Net Profit',
    'ROI %',
  ]);

  locations.forEach((location) => {
    const metrics = calculateLocationMetrics(location, dashboard);
    csv += generateCSVRow([
      location.name,
      location.type,
      location.footTraffic,
      location.monthlyRent,
      location.competition,
      metrics.locationScore.toFixed(1),
      metrics.estimatedDailySales.toFixed(0),
      metrics.monthlyRevenue.toFixed(2),
      metrics.operatingCosts.toFixed(2),
      metrics.netProfit.toFixed(2),
      metrics.roi.toFixed(2),
    ]);
  });

  await saveAndShareFile(csv, `locations_comparison_${Date.now()}.csv`);
}

// Product Mix CSV Export
export async function exportProductMixToCSV(
  products: Product[]
): Promise<void> {
  let csv = '';

  csv += generateCSVRow(['Product Mix Optimizer Export']);
  csv += generateCSVRow(['Export Date', formatDate(new Date())]);
  csv += '\n';

  csv += generateCSVRow([
    'Product Name',
    'Cost per Unit',
    'Sale Price',
    'Margin per Unit',
    'Margin %',
    'Units per Month',
    'Monthly Profit',
  ]);

  products.forEach((product) => {
    const metrics = calculateProductMetrics(product);
    csv += generateCSVRow([
      product.name,
      product.costPerUnit.toFixed(2),
      product.salePrice.toFixed(2),
      metrics.marginPerUnit.toFixed(2),
      metrics.marginPercentage.toFixed(2),
      product.unitsPerMonth,
      metrics.monthlyProfit.toFixed(2),
    ]);
  });

  await saveAndShareFile(csv, `product_mix_${Date.now()}.csv`);
}

// Helper function to save and share files
async function saveAndShareFile(content: string, filename: string): Promise<void> {
  try {
    // @ts-ignore - FileSystem types may be incorrect
    const fileUri = FileSystem.documentDirectory + filename;
    
    await FileSystem.writeAsStringAsync(fileUri, content, {
      // @ts-ignore
      encoding: FileSystem.EncodingType?.UTF8 || 'utf8',
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: filename.endsWith('.html') ? 'text/html' : 'text/csv',
        dialogTitle: 'Export ROI Calculator Data',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error exporting file:', error);
    throw error;
  }
}

export async function exportGrowthProjectionsToCSV(
  dashboardName: string,
  projections: MonthlyProjection[],
  totalInvestment: number,
  totalRevenue: number,
  totalNetProfit: number,
  roi: number
): Promise<void> {
  let csv = '';

  csv += generateCSVRow(['Growth Projector Export']);
  csv += generateCSVRow(['Dashboard', dashboardName]);
  csv += generateCSVRow(['Export Date', formatDate(new Date())]);
  csv += '\n';

  csv += generateCSVRow(['12-Month Summary']);
  csv += generateCSVRow(['Total Investment', totalInvestment.toFixed(2)]);
  csv += generateCSVRow(['Total Revenue', totalRevenue.toFixed(2)]);
  csv += generateCSVRow(['12-Month Net Profit', totalNetProfit.toFixed(2)]);
  csv += generateCSVRow(['ROI', roi.toFixed(2) + '%']);
  csv += '\n';

  csv += generateCSVRow([
    'Month',
    'Total Machines',
    'Investment Required',
    'Revenue',
    'Operating Costs',
    'Net Profit',
  ]);

  projections.forEach((projection) => {
    csv += generateCSVRow([
      projection.month,
      projection.totalMachines,
      projection.investmentRequired.toFixed(2),
      projection.revenue.toFixed(2),
      projection.operatingCosts.toFixed(2),
      projection.netProfit.toFixed(2),
    ]);
  });

  await saveAndShareFile(csv, `growth_projections_${Date.now()}.csv`);
}
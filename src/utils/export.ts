// src/utils/export.ts

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

import {
  DashboardData,
  DashboardMetrics,
  Location,
  Product,
  GrowthProjectorData,
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

function formatFileDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function sanitizeFileSegment(value: string): string {
  return value
    .trim()
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'Project';
}

function getProjectExportFilename(
  dashboardName: string,
  extension: 'csv' | 'pdf'
): string {
  const date = formatFileDate(new Date());
  const project = sanitizeFileSegment(dashboardName);
  return `VendROI_${project}_FullExport_${date}.${extension}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildGrowthProjections(
  dashboard: DashboardData,
  growthProjector: GrowthProjectorData
): MonthlyProjection[] {
  const avgMonthlyRevenuePerMachine =
    dashboard.revenue.itemsSoldPerDay *
    dashboard.revenue.averageSalePrice *
    dashboard.revenue.daysOperatingPerMonth;

  const avgMonthlyCostPerMachine =
    dashboard.operatingCosts.productRestock +
    dashboard.operatingCosts.transportationFuel +
    dashboard.operatingCosts.maintenance +
    dashboard.operatingCosts.locationRent +
    dashboard.operatingCosts.creditCardFees +
    dashboard.operatingCosts.otherExpenses;

  const projections: MonthlyProjection[] = [];
  let currentMachines = growthProjector.initialMachines || 1;

  for (let month = 1; month <= 12; month++) {
    const isQuarterEnd = month % 3 === 0;
    const machinesAdded = isQuarterEnd ? (growthProjector.machinesPerQuarter || 0) : 0;
    const totalMachines = currentMachines + machinesAdded;
    const investmentRequired = machinesAdded * (growthProjector.investmentPerMachine || 0);

    const revenue = totalMachines * avgMonthlyRevenuePerMachine;
    const operatingCosts = totalMachines * avgMonthlyCostPerMachine;
    const netProfit = revenue - operatingCosts - investmentRequired;

    projections.push({
      month,
      totalMachines,
      investmentRequired,
      revenue,
      operatingCosts,
      netProfit,
    });

    currentMachines = totalMachines;
  }

  return projections;
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
async function saveAndShareFile(
  content: string,
  filename: string,
  dialogTitle = 'Export ROI Calculator Data'
): Promise<void> {
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
        dialogTitle,
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

export async function exportFullProjectToCSV(
  dashboard: DashboardData,
  metrics: DashboardMetrics,
  locations: Location[] = [],
  products: Product[] = [],
  growthProjector?: GrowthProjectorData
): Promise<void> {
  let csv = '';
  const fileName = getProjectExportFilename(dashboard.name, 'csv');

  csv += generateCSVRow(['VendROI Full Project Export']);
  csv += generateCSVRow(['Project Name', dashboard.name]);
  csv += generateCSVRow(['Export Date', formatDate(new Date())]);
  csv += '\n';

  csv += generateCSVRow(['Summary']);
  csv += generateCSVRow(['Total Initial Investment', metrics.totalInitialInvestment.toFixed(2)]);
  csv += generateCSVRow(['Total Monthly Costs', metrics.totalMonthlyCosts.toFixed(2)]);
  csv += generateCSVRow(['Total Monthly Revenue', metrics.totalMonthlyRevenue.toFixed(2)]);
  csv += generateCSVRow(['Monthly Net Profit', metrics.monthlyNetProfit.toFixed(2)]);
  csv += generateCSVRow(['Annual Net Profit', metrics.annualNetProfit.toFixed(2)]);
  csv += generateCSVRow(['ROI Percentage', `${metrics.roiPercentage.toFixed(2)}%`]);
  csv += generateCSVRow(['Break-even (Months)', metrics.breakEvenMonths.toFixed(1)]);
  csv += generateCSVRow(['Profit Margin', `${metrics.profitMargin.toFixed(2)}%`]);
  csv += '\n';

  csv += generateCSVRow(['Locations']);
  if (locations.length === 0) {
    csv += generateCSVRow(['No location data entered']);
  } else {
    csv += generateCSVRow([
      'Location Name',
      'Type',
      'Foot Traffic',
      'Monthly Rent',
      'Competition',
      'Location Score',
      'Monthly Revenue',
      'Operating Costs',
      'Net Profit',
      'ROI %',
    ]);
    locations.forEach((location) => {
      const locationMetrics = calculateLocationMetrics(location, dashboard);
      csv += generateCSVRow([
        location.name,
        location.type,
        location.footTraffic,
        location.monthlyRent.toFixed(2),
        location.competition,
        locationMetrics.locationScore.toFixed(1),
        locationMetrics.monthlyRevenue.toFixed(2),
        locationMetrics.operatingCosts.toFixed(2),
        locationMetrics.netProfit.toFixed(2),
        locationMetrics.roi.toFixed(2),
      ]);
    });
  }
  csv += '\n';

  csv += generateCSVRow(['Product Mix']);
  if (products.length === 0) {
    csv += generateCSVRow(['No product data entered']);
  } else {
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
      const productMetrics = calculateProductMetrics(product);
      csv += generateCSVRow([
        product.name,
        product.costPerUnit.toFixed(2),
        product.salePrice.toFixed(2),
        productMetrics.marginPerUnit.toFixed(2),
        productMetrics.marginPercentage.toFixed(2),
        product.unitsPerMonth,
        productMetrics.monthlyProfit.toFixed(2),
      ]);
    });
  }
  csv += '\n';

  csv += generateCSVRow(['Growth Projections']);
  if (!growthProjector) {
    csv += generateCSVRow(['No growth projection data entered']);
  } else {
    const projections = buildGrowthProjections(dashboard, growthProjector);
    const totalInvestment = projections.reduce((sum, p) => sum + p.investmentRequired, 0);
    const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
    const totalNetProfit = projections.reduce((sum, p) => sum + p.netProfit, 0);
    const roi = totalInvestment > 0 ? (totalNetProfit / totalInvestment) * 100 : 0;

    csv += generateCSVRow(['Strategy', growthProjector.growthStrategy]);
    csv += generateCSVRow(['Starting Machines', growthProjector.initialMachines]);
    csv += generateCSVRow(['Machines Added per Quarter', growthProjector.machinesPerQuarter]);
    csv += generateCSVRow(['Investment per Machine', growthProjector.investmentPerMachine.toFixed(2)]);
    csv += generateCSVRow(['12-Month Total Investment', totalInvestment.toFixed(2)]);
    csv += generateCSVRow(['12-Month Total Revenue', totalRevenue.toFixed(2)]);
    csv += generateCSVRow(['12-Month Net Profit', totalNetProfit.toFixed(2)]);
    csv += generateCSVRow(['12-Month ROI', `${roi.toFixed(2)}%`]);
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
  }

  await saveAndShareFile(csv, fileName, `${dashboard.name} Full Export`);
}

export async function exportFullProjectToPDF(
  dashboard: DashboardData,
  metrics: DashboardMetrics,
  locations: Location[] = [],
  products: Product[] = [],
  growthProjector?: GrowthProjectorData
): Promise<void> {
  const locationRows = locations.length
    ? locations.map((location) => {
        const locationMetrics = calculateLocationMetrics(location, dashboard);
        return `
          <tr>
            <td>${escapeHtml(location.name)}</td>
            <td>${escapeHtml(location.type)}</td>
            <td>${location.footTraffic}</td>
            <td>$${location.monthlyRent.toFixed(2)}</td>
            <td>${escapeHtml(location.competition)}</td>
            <td>${locationMetrics.locationScore.toFixed(1)}</td>
            <td>$${locationMetrics.netProfit.toFixed(2)}</td>
          </tr>
        `;
      }).join('')
    : '<tr><td colspan="7">No location data entered</td></tr>';

  const productRows = products.length
    ? products.map((product) => {
        const productMetrics = calculateProductMetrics(product);
        return `
          <tr>
            <td>${escapeHtml(product.name)}</td>
            <td>$${product.costPerUnit.toFixed(2)}</td>
            <td>$${product.salePrice.toFixed(2)}</td>
            <td>${product.unitsPerMonth}</td>
            <td>${productMetrics.marginPercentage.toFixed(1)}%</td>
            <td>$${productMetrics.monthlyProfit.toFixed(2)}</td>
          </tr>
        `;
      }).join('')
    : '<tr><td colspan="6">No product data entered</td></tr>';

  let growthSectionHtml = `
    <p class="muted">No growth projection data entered</p>
  `;

  if (growthProjector) {
    const projections = buildGrowthProjections(dashboard, growthProjector);
    const totalInvestment = projections.reduce((sum, p) => sum + p.investmentRequired, 0);
    const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
    const totalNetProfit = projections.reduce((sum, p) => sum + p.netProfit, 0);
    const roi = totalInvestment > 0 ? (totalNetProfit / totalInvestment) * 100 : 0;

    growthSectionHtml = `
      <div class="summary-grid">
        <div><strong>Strategy:</strong> ${escapeHtml(growthProjector.growthStrategy)}</div>
        <div><strong>Starting Machines:</strong> ${growthProjector.initialMachines}</div>
        <div><strong>Added per Quarter:</strong> ${growthProjector.machinesPerQuarter}</div>
        <div><strong>Investment per Machine:</strong> $${growthProjector.investmentPerMachine.toFixed(2)}</div>
        <div><strong>12-Month Investment:</strong> $${totalInvestment.toFixed(2)}</div>
        <div><strong>12-Month Revenue:</strong> $${totalRevenue.toFixed(2)}</div>
        <div><strong>12-Month Net Profit:</strong> $${totalNetProfit.toFixed(2)}</div>
        <div><strong>12-Month ROI:</strong> ${roi.toFixed(2)}%</div>
      </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 28px; color: #1f2937; }
    h1 { margin: 0 0 6px; }
    h2 { margin-top: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    .muted { color: #6b7280; font-size: 12px; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #e5e7eb; padding: 7px; text-align: left; font-size: 12px; }
    th { background: #f3f4f6; }
  </style>
</head>
<body>
  <h1>${escapeHtml(dashboard.name)} - Full Project Export</h1>
  <div class="muted">Generated on ${formatDate(new Date())}</div>

  <h2>Summary</h2>
  <div class="summary-grid">
    <div><strong>Total Initial Investment:</strong> $${metrics.totalInitialInvestment.toFixed(2)}</div>
    <div><strong>Total Monthly Costs:</strong> $${metrics.totalMonthlyCosts.toFixed(2)}</div>
    <div><strong>Total Monthly Revenue:</strong> $${metrics.totalMonthlyRevenue.toFixed(2)}</div>
    <div><strong>Monthly Net Profit:</strong> $${metrics.monthlyNetProfit.toFixed(2)}</div>
    <div><strong>Annual Net Profit:</strong> $${metrics.annualNetProfit.toFixed(2)}</div>
    <div><strong>ROI:</strong> ${metrics.roiPercentage.toFixed(2)}%</div>
    <div><strong>Break-even:</strong> ${metrics.breakEvenMonths.toFixed(1)} months</div>
    <div><strong>Profit Margin:</strong> ${metrics.profitMargin.toFixed(2)}%</div>
  </div>

  <h2>Locations</h2>
  <table>
    <thead>
      <tr>
        <th>Name</th><th>Type</th><th>Traffic</th><th>Rent</th><th>Competition</th><th>Score</th><th>Net Profit</th>
      </tr>
    </thead>
    <tbody>${locationRows}</tbody>
  </table>

  <h2>Product Mix</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th><th>Cost</th><th>Price</th><th>Units/Month</th><th>Margin</th><th>Monthly Profit</th>
      </tr>
    </thead>
    <tbody>${productRows}</tbody>
  </table>

  <h2>Growth Projections</h2>
  ${growthSectionHtml}
</body>
</html>`;

  const fileName = getProjectExportFilename(dashboard.name, 'pdf');
  const output = await Print.printToFileAsync({ html });
  const outputUri = FileSystem.documentDirectory + fileName;
  await FileSystem.copyAsync({ from: output.uri, to: outputUri });
  await Sharing.shareAsync(outputUri, {
    mimeType: 'application/pdf',
    dialogTitle: `${dashboard.name} Full Export`,
    UTI: 'com.adobe.pdf',
  });
}

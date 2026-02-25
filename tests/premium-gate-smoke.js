const fs = require('fs');
const path = require('path');

function read(relPath) {
  return fs.readFileSync(path.join(process.cwd(), relPath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

const premiumScreens = [
  'src/screens/DashboardScreen.tsx',
  'src/screens/LocationComparisonScreen.tsx',
  'src/screens/ProductMixScreen.tsx',
  'src/screens/GrowthProjectorScreen.tsx',
];

for (const file of premiumScreens) {
  const content = read(file);
  assert(!content.includes('setPremium(true)'), `${file} still contains manual premium bypass`);
}

const paywall = read('src/screens/PaywallScreen.tsx');
assert(paywall.includes("import { REVENUECAT_CONFIG } from '../config/revenueCat';"), 'PaywallScreen missing RevenueCat config import');
assert(
  countMatches(paywall, /entitlements\.active\[REVENUECAT_CONFIG\.entitlementId\]/g) >= 2,
  'PaywallScreen should verify entitlement using configured entitlement ID for purchase and restore'
);
assert(
  countMatches(paywall, /setPremium\(true\)/g) >= 2,
  'PaywallScreen should set premium only after verified entitlement checks'
);
assert(
  paywall.includes('Could not load live pricing. Check your connection and try again.'),
  'PaywallScreen should show a user-facing pricing load failure message'
);
assert(
  paywall.includes('Your purchase was processed, but Pro did not unlock yet. Please tap Restore Purchase.'),
  'PaywallScreen should handle delayed entitlement activation after purchase'
);
assert(!paywall.includes('â€¢'), 'PaywallScreen should not contain mojibake bullet characters');
assert(!paywall.includes('ðŸ'), 'PaywallScreen should not contain mojibake icon glyphs');

const app = read('App.tsx');
assert(
  app.includes('customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId] !== undefined'),
  'App should sync premium state from configured entitlement ID on startup'
);
assert(
  app.includes("AppState.addEventListener('change'"),
  'App should refresh premium status when returning to foreground'
);

const rcConfig = read('src/config/revenueCat.ts');
assert(rcConfig.includes("entitlementId: 'premium'"), 'RevenueCat config entitlementId should be premium');
assert(rcConfig.includes("offeringId: 'default'"), 'RevenueCat config offeringId should be default');
assert(rcConfig.includes("productId: 'vendroi_pro1'"), 'RevenueCat config productId should be vendroi_pro1');

const dashboardScreen = read('src/screens/DashboardScreen.tsx');
assert(
  dashboardScreen.includes("error instanceof Error ? error.message : 'Could not generate PDF'"),
  'Dashboard export PDF error toast should surface the actual error message when available'
);
assert(
  dashboardScreen.includes("error instanceof Error ? error.message : 'Could not generate CSV'"),
  'Dashboard export CSV error toast should surface the actual error message when available'
);

const appConfig = read('app.json');
assert(appConfig.includes('"bundleIdentifier": "com.dahvio.vendROI"'), 'app.json iOS bundleIdentifier should match App Store bundle ID');

console.log('PASS premium gate smoke checks');

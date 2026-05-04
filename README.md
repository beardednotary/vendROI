# Vending ROI Calculator

A professional mobile app for vending machine operators to calculate ROI, compare locations, optimize product mix, and project growth.

## Features

### Free Tier
- **Dashboard**: Complete ROI calculator with initial investment, operating costs, revenue projections, and profitability metrics
- Real-time calculations with visual feedback
- Auto-save functionality

### Premium Tier ($9.99 lifetime)
- **Location Comparison**: Score and rank up to 10 locations with photo tracking
- **Product Mix Optimizer**: Analyze profitability by product, identify best performers
- **Growth Projector**: 12-month expansion modeling with investment planning
- **CSV Export**: Export all data for accounting/pitch decks

## Tech Stack

- React Native (Expo)
- TypeScript
- Zustand (state management)
- AsyncStorage (local persistence)
- RevenueCat (IAP - to be integrated)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Project Structure

```
vending-roi-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Main app screens
│   ├── store/            # Zustand state management
│   ├── theme/            # Design tokens
│   ├── types/            # TypeScript types
│   └── utils/            # Calculations & export utilities
├── App.tsx               # Navigation setup
└── package.json
```

## Key Design Decisions

### One-Handed Operation
- 44px minimum touch targets
- Bottom-sheet interactions for quick edits
- Auto-save on input blur
- Thumb-zone optimized layouts

### Data Linking
- Product Mix automatically updates Dashboard revenue
- Location selection populates Dashboard rent/traffic
- Growth Projector uses Dashboard metrics

### Anti-Generic Aesthetic
- No excessive gradients or shadows
- Functional color usage (orange for CTAs, green for profit)
- Data-dense without clutter
- Sharp, purposeful information hierarchy

## Revenue Model

- Freemium: Dashboard is free
- One-time purchase: $9.99 for all premium features
- No subscriptions (operators hate recurring charges)

## Next Steps

1. Integrate RevenueCat for IAP
2. Add proper icon system (replace emojis)
3. Implement cloud sync (optional, local-first)
4. Add onboarding flow
5. App store assets & screenshots
6. Beta testing with real operators

## Target Market

- Solo vending machine operators
- Side hustlers entering the business
- Small operators (1-10 machines)
- People evaluating vending as a business opportunity

## Competitive Advantage

- **Location Comparison**: Reduces #1 failure point (bad location selection)
- **One-handed operation**: Designed for field use
- **Lifetime pricing**: No recurring charges
- **Offline-first**: Works without internet
- **Professional aesthetics**: Doesn't look like an AI template app

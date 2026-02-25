# Quick Start Guide

## Get Running in 5 Minutes

### 1. Install Dependencies
```bash
cd vending-roi-app
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Device/Simulator

**iOS:**
```bash
npm run ios
```
Or press `i` in the terminal after `npm start`

**Android:**
```bash
npm run android
```
Or press `a` in the terminal after `npm start`

**Physical Device:**
1. Download Expo Go app
2. Scan QR code from terminal

## What to Test First

### Dashboard (Free Tier)
1. Enter machine cost: $5,000
2. Enter installation: $750  
3. Enter initial inventory: $600
4. Enter licenses: $350
5. **See total investment calculate automatically**

6. Enter product restock: $840
7. Enter location rent: $200
8. **See total monthly costs calculate**

9. Enter items sold/day: 20
10. Enter avg sale price: $2.00
11. **See revenue calculate**

12. **Check profitability metrics grid** - should show:
    - Positive monthly profit
    - ROI percentage color-coded
    - Break-even point in months

### Location Comparison (Premium - Currently Locked)
- Tap "Locations" tab
- See premium gate with unlock button
- Later: Mock `isPremium: true` in store to test

### Product Mix (Premium - Currently Locked)
- Tap "Products" tab  
- See premium gate
- Later: Mock premium to test product tracking

### Growth Projector (Premium - Currently Locked)
- Tap "Growth" tab
- See premium gate
- Later: Mock premium to test 12-month projections

## Testing Premium Features

To bypass premium gates during development:

**Option 1: Temporarily set premium flag**
In `src/store/useAppStore.ts`, change initial state:
```typescript
isPremium: true, // Change from false to true
```

**Option 2: Use debug button**
Add a debug button somewhere:
```typescript
<Button
  title="[DEBUG] Toggle Premium"
  onPress={() => useAppStore.getState().setPremium(
    !useAppStore.getState().isPremium
  )}
/>
```

## File Structure Quick Reference

```
vending-roi-app/
├── src/
│   ├── components/
│   │   ├── Button.tsx          - Reusable button
│   │   ├── Input.tsx           - Input with validation
│   │   ├── MetricCard.tsx      - Display metrics
│   │   └── SectionHeader.tsx   - Section titles
│   │
│   ├── screens/
│   │   ├── DashboardScreen.tsx          - Main ROI calculator (FREE)
│   │   ├── LocationComparisonScreen.tsx - Location scoring (PREMIUM)
│   │   ├── ProductMixScreen.tsx         - Product analysis (PREMIUM)
│   │   └── GrowthProjectorScreen.tsx    - Expansion model (PREMIUM)
│   │
│   ├── store/
│   │   └── useAppStore.ts      - Zustand state + AsyncStorage
│   │
│   ├── theme/
│   │   └── theme.ts            - Colors, spacing, typography
│   │
│   ├── types/
│   │   └── index.ts            - TypeScript types
│   │
│   └── utils/
│       ├── calculations.ts     - All formulas from spreadsheets
│       └── export.ts           - CSV generation
│
├── App.tsx                      - Navigation setup
├── package.json
└── app.json                     - Expo config
```

## Common Development Tasks

### Add New Input Field
1. Update type in `src/types/index.ts`
2. Add input in screen component
3. Connect to store with `updateDashboard` / `updateLocation` etc
4. Calculation engine auto-updates

### Change Colors/Theme
Edit `src/theme/theme.ts`:
```typescript
export const colors = {
  accentPrimary: '#F97316', // Change this
  accentProfit: '#22C55E',  // Or this
  // ...
};
```

### Test Calculations
All formulas in `src/utils/calculations.ts`
Match exact logic from your PDFs

### Debug State
Add this anywhere:
```typescript
const state = useAppStore();
console.log(state); // See entire app state
```

### Clear All Data
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a debug screen:
AsyncStorage.clear();
```

## Next Development Steps

1. **Replace emoji icons** (see IMPLEMENTATION_GUIDE.md)
2. **Add RevenueCat** for IAP
3. **Create app icons** in /assets/
4. **Add Settings screen** with export
5. **Polish input validation**
6. **Add onboarding flow**

## Troubleshooting

**Metro bundler errors:**
```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

**iOS build errors:**
```bash
cd ios
pod install
cd ..
npm run ios
```

**Android errors:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Type errors:**
Check `tsconfig.json` is present and run:
```bash
npm install --save-dev typescript @types/react @types/react-native
```

## Key Features to Demo

1. **Real-time calculations** - Change any input, see metrics update
2. **Auto-save** - Close app, reopen, data persists
3. **Professional metrics** - ROI, break-even, profit margin
4. **Premium value** - Show how location comparison reduces risk
5. **Export** - Generate CSV for sharing with accountants

## Development Tips

- **Hot reload works** - Save file, see changes instantly
- **Console logs work** - Check Metro terminal for logs
- **Expo Go debugging** - Shake device for dev menu
- **Use real numbers** - Test with realistic vending economics

---

**You're ready to develop. Start with Dashboard, test calculations, then move to premium features.**

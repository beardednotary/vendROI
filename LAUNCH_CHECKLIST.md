# Launch Checklist

## Day 1 - Premium/Auth Correctness
- [ ] Set `isPremium` default to `false` in `src/store/useAppStore.ts`.
- [ ] Remove manual premium bypass callbacks (`setPremium(true)`) from premium screens.
- [ ] Ensure premium access is driven only by RevenueCat entitlement state.
- [ ] Verify fresh install shows paywall for premium tabs.
- [ ] Verify purchase/restore is the only unlock path.

## Day 2 - RevenueCat Hardening
- [ ] Replace placeholder API keys in `src/config/revenueCat.ts`.
- [ ] Add startup `try/catch` around RevenueCat init in `App.tsx`.
- [ ] Add graceful fallback behavior on RevenueCat/network failure.
- [ ] Remove debug log level for release.
- [ ] Verify existing premium users are recognized on app launch.

## Day 3 - Remove Incomplete UX
- [ ] Replace `RevenueCat integration coming next` path in `src/screens/DashboardScreen.tsx` with final behavior.
- [ ] Replace `coming soon` Analyze path in `src/screens/LocationComparisonScreen.tsx` with final behavior or hide action.
- [ ] Confirm no user-facing dead-end actions remain.

## Day 4 - Test Baseline
- [ ] Add scripts: `typecheck`, `lint`, `test` in `package.json`.
- [ ] Add unit tests for `src/utils/calculations.ts` (ROI/location/product/growth formulas).
- [ ] Add premium-gate smoke test (free blocked, premium unlocked).
- [ ] Run tests locally and confirm pass.

## Day 5 - QA + Data Integrity
- [ ] Run onboarding flow end-to-end.
- [ ] Validate autosave and reload persistence.
- [ ] Validate purchase restore flow.
- [ ] Validate CSV/PDF export behavior.
- [ ] Validate offline behavior.
- [ ] Validate edge cases (zero/negative/empty inputs).
- [ ] Validate on both iOS and Android.

## Day 6 - Release Polish
- [ ] Replace emoji tab icons in `App.tsx` with production icon set.
- [ ] Remove debug copy/messages and improve user-facing errors.
- [ ] Validate app assets (`assets/*`) and metadata in `app.json`.
- [ ] Run final visual pass on core screens.

## Day 7 - Release Candidate
- [ ] Run full regression pass.
- [ ] Build release candidate for internal beta.
- [ ] Verify crash-free startup and critical flows in beta build.
- [ ] Complete go/no-go checklist review.

## Definition of Done
- [ ] Premium flow is reliable and cannot be bypassed.
- [ ] No user-facing `coming soon` dead ends.
- [ ] `typecheck`, `lint`, and `test` are present and passing.
- [ ] iOS and Android QA matrix passes.
- [ ] Release candidate is ready for submission.

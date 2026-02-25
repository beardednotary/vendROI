# TestFlight QA Checklist

## RevenueCat / Purchases
- [ ] Fresh install shows paywall for locked premium screens.
- [ ] Paywall loads product `vendroi_pro1` price from RevenueCat offering `default`.
- [ ] Sandbox/TestFlight purchase unlocks premium immediately.
- [ ] Force-close and relaunch keeps premium unlocked.
- [ ] Restore Purchase unlocks on previously purchased Apple ID.
- [ ] Restore Purchase does not unlock for a non-purchased Apple ID.

## Core App Flows
- [ ] Onboarding completes and sample data loads.
- [ ] Dashboard edits update calculations in real time.
- [ ] Data persists after app restart.
- [ ] CSV export works and can be shared.
- [ ] PDF export works and can be shared.
- [ ] Premium screens (Locations, Products, Growth) open without dead-end actions.

## Edge Cases / Reliability
- [ ] Zero values do not crash UI or show `NaN`.
- [ ] Invalid/negative values are handled safely.
- [ ] Offline launch after purchase does not crash.
- [ ] Background -> foreground refresh keeps premium state correct.

## Release Sanity
- [ ] No dev-only onboarding reset behavior in production build.
- [ ] No “coming soon” placeholder copy in core flows.
- [ ] App name/icon/metadata look correct in TestFlight.

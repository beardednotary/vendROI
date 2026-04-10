// src/utils/storeReview.ts

import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEW_KEY = '@vending_roi_last_review_requested';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Prevents multiple triggers firing in the same app session
let hasRequestedThisSession = false;

export async function maybeRequestReview(): Promise<void> {
  if (hasRequestedThisSession) return;

  const available = await StoreReview.isAvailableAsync();
  if (!available) return;

  const raw = await AsyncStorage.getItem(REVIEW_KEY);
  if (raw !== null) {
    const lastRequestedAt = parseInt(raw, 10);
    if (Date.now() - lastRequestedAt < THIRTY_DAYS_MS) return;
  }

  hasRequestedThisSession = true;
  await AsyncStorage.setItem(REVIEW_KEY, String(Date.now()));
  await StoreReview.requestReview();
}

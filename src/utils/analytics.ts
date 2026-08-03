// src/utils/analytics.ts

import PostHog from 'posthog-react-native';
import { POSTHOG_CONFIG } from '../config/analytics';

let client: PostHog | null = null;

export function initAnalytics() {
  if (!POSTHOG_CONFIG.apiKey) return;
  client = new PostHog(POSTHOG_CONFIG.apiKey, { host: POSTHOG_CONFIG.host });
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  client?.capture(name, properties);
}

export function trackScreen(name: string) {
  client?.screen(name);
}

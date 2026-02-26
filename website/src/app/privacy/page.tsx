import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - VendROI',
  description: 'VendROI Privacy Policy — how we handle your data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="pt-28 pb-20 bg-vr-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-vr-text mb-2">Privacy Policy</h1>
        <p className="text-vr-muted text-sm mb-10">Last updated: February 2026</p>

        <div className="prose-vr space-y-8">
          <Section title="Introduction">
            <p>
              VendROI (&quot;we,&quot; &quot;our,&quot; or &quot;the App&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use the VendROI mobile application.
            </p>
          </Section>

          <Section title="Data We Collect">
            <p>VendROI is designed with a <strong>local-first</strong> approach. The majority of your data never leaves your device.</p>
            <h4 className="text-vr-text font-semibold text-sm mt-4 mb-2">Data stored locally on your device:</h4>
            <ul>
              <li>Investment details (machine costs, monthly expenses, product pricing)</li>
              <li>Location information you enter for comparison</li>
              <li>Product mix configurations</li>
              <li>Growth projection settings</li>
              <li>App preferences and onboarding status</li>
            </ul>
            <p className="mt-4">This data is stored using on-device storage (AsyncStorage) and is <strong>not transmitted</strong> to our servers.</p>

            <h4 className="text-vr-text font-semibold text-sm mt-4 mb-2">Optional anonymous benchmarking:</h4>
            <p>
              If you opt in during onboarding, we may collect aggregated, de-identified investment performance data to provide community benchmarks. This data cannot be traced back to you individually. You can opt out at any time.
            </p>

            <h4 className="text-vr-text font-semibold text-sm mt-4 mb-2">Purchase information:</h4>
            <p>
              If you purchase VendROI Pro, the transaction is processed by Apple (App Store) or Google (Play Store) through RevenueCat, our payment infrastructure provider. We receive confirmation of your purchase status but do <strong>not</strong> receive your payment details (credit card number, billing address, etc.).
            </p>
          </Section>

          <Section title="How We Use Your Data">
            <ul>
              <li>To provide and improve the VendROI app experience</li>
              <li>To verify your Pro purchase status</li>
              <li>To generate anonymous community benchmarks (only if you opt in)</li>
            </ul>
          </Section>

          <Section title="Data Sharing">
            <p>
              We do <strong>not</strong> sell, rent, or share your personal data with third parties. We do not run ads. The only third-party service that receives any data is RevenueCat, solely for purchase verification.
            </p>
          </Section>

          <Section title="Data Security">
            <p>
              Your investment data is stored locally on your device and protected by your device&apos;s built-in security measures. We do not store your data on external servers (except optional anonymous benchmarks, which are aggregated and de-identified).
            </p>
          </Section>

          <Section title="Children's Privacy">
            <p>
              VendROI is not directed at children under 13. We do not knowingly collect data from children under 13.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes through the App or by updating the &quot;Last updated&quot; date above.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:support@vendroi.com" className="text-vr-orange hover:underline">
                support@vendroi.com
              </a>
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-vr-text mb-3">{title}</h2>
      <div className="text-vr-text-secondary text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-vr-text">
        {children}
      </div>
    </section>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - VendROI',
  description: 'VendROI Terms of Service — rules for using the app.',
};

export default function TermsOfService() {
  return (
    <div className="pt-28 pb-20 bg-vr-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-vr-text mb-2">Terms of Service</h1>
        <p className="text-vr-muted text-sm mb-10">Last updated: February 2026</p>

        <div className="space-y-8">
          <Section title="1. Acceptance of Terms">
            <p>
              By downloading, installing, or using VendROI (&quot;the App&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the App.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              VendROI is a vending machine investment calculator that helps users estimate return on investment, compare locations, analyze product mix, and project growth. The App provides <strong>informational tools only</strong> and is not a financial advisory service.
            </p>
          </Section>

          <Section title="3. Not Financial Advice">
            <p>
              The calculations, verdicts, scores, and projections provided by VendROI are for <strong>informational and educational purposes only</strong>. They do not constitute financial, investment, tax, or legal advice. You should consult with qualified professionals before making investment decisions. VendROI makes no guarantees about the accuracy of projections or the outcome of any investment.
            </p>
          </Section>

          <Section title="4. User Responsibilities">
            <ul>
              <li>You are responsible for the accuracy of the data you enter into the App.</li>
              <li>You are responsible for your own investment decisions.</li>
              <li>You agree not to use the App for any unlawful purpose.</li>
              <li>You agree not to reverse engineer, decompile, or disassemble the App.</li>
            </ul>
          </Section>

          <Section title="5. Purchases and Payments">
            <p>
              VendROI offers a Pro upgrade for a one-time purchase price of $29.99 (USD). All purchases are processed through the Apple App Store or Google Play Store.
            </p>
            <ul className="mt-3">
              <li>Refund requests are handled by Apple or Google per their respective refund policies.</li>
              <li>The Pro upgrade is a one-time purchase with no recurring charges.</li>
              <li>Pricing may change at any time, but changes will not affect existing purchases.</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              All content, features, and functionality of VendROI — including but not limited to text, graphics, logos, and software — are the property of VendROI and are protected by copyright and trademark laws.
            </p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, VendROI and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="mt-3">
              <li>Your use or inability to use the App</li>
              <li>Any investment decisions made based on information from the App</li>
              <li>Any errors or inaccuracies in the App&apos;s calculations</li>
              <li>Any unauthorized access to or use of your data</li>
            </ul>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p>
              The App is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </Section>

          <Section title="9. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes through the App. Continued use of the App after changes constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions about these Terms? Contact us at{' '}
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

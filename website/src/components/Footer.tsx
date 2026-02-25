import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-vr-surface border-t border-vr-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/icon.png" alt="VendROI" width={36} height={36} className="rounded-lg" />
              <span className="text-xl font-bold text-vr-orange">VendROI</span>
            </div>
            <p className="text-vr-text-secondary text-sm max-w-sm">
              The all-in-one vending machine ROI calculator. Make data-driven investment decisions with confidence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-vr-text font-semibold text-sm mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-vr-text-secondary hover:text-vr-text text-sm transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-vr-text-secondary hover:text-vr-text text-sm transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-vr-text-secondary hover:text-vr-text text-sm transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-vr-text font-semibold text-sm mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-vr-text-secondary hover:text-vr-text text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-vr-text-secondary hover:text-vr-text text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-vr-text-secondary hover:text-vr-text text-sm transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-vr-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-vr-muted text-sm">&copy; {new Date().getFullYear()} VendROI. All rights reserved.</p>
          <p className="text-vr-muted text-xs">Not financial advice. For informational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}

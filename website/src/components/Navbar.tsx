'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-vr-surface/80 backdrop-blur-lg border-b border-vr-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="VendROI" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-bold text-vr-orange">VendROI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-vr-text-secondary hover:text-vr-text transition-colors text-sm">
              Features
            </a>
            <a href="#how-it-works" className="text-vr-text-secondary hover:text-vr-text transition-colors text-sm">
              How It Works
            </a>
            <a href="#pricing" className="text-vr-text-secondary hover:text-vr-text transition-colors text-sm">
              Pricing
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vr-orange text-white text-sm font-semibold hover:brightness-110 transition-all"
            >
              Download
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-vr-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-vr-surface border-t border-vr-border">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block py-2 text-vr-text-secondary hover:text-vr-text transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-vr-text-secondary hover:text-vr-text transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block py-2 text-vr-text-secondary hover:text-vr-text transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#"
              className="block w-full text-center px-5 py-3 rounded-xl bg-vr-orange text-white font-semibold"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

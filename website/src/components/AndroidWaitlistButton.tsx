'use client';

import { useState } from 'react';

export function AndroidWaitlistButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://formspree.io/f/mbdzeabb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        Android Waitlist
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-vr-surface border border-vr-border rounded-2xl p-8 w-full max-w-sm">
            {status === 'success' ? (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-vr-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-vr-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-vr-text font-semibold mb-1">You're on the list</p>
                <p className="text-vr-text-secondary text-sm">We'll let you know when Android launches.</p>
                <button onClick={() => { setOpen(false); setStatus('idle'); setEmail(''); }} className="mt-6 text-vr-muted text-sm hover:text-vr-text transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-vr-text font-bold text-lg mb-1">Android Waitlist</h3>
                <p className="text-vr-text-secondary text-sm mb-6">
                  VendROI is iOS-first. Enter your email and we'll notify you when Android launches.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-vr-bg border border-vr-border text-vr-text placeholder:text-vr-muted text-sm focus:outline-none focus:border-vr-orange/50"
                  />
                  {status === 'error' && (
                    <p className="text-vr-risk text-xs">Something went wrong — try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 rounded-xl bg-vr-orange text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Submitting…' : 'Notify me'}
                  </button>
                </form>
                <button onClick={() => setOpen(false)} className="mt-4 w-full text-center text-vr-muted text-xs hover:text-vr-text transition-colors">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

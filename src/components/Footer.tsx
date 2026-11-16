import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BusinessContactConfig, NavSection } from '../types/sensora';

interface FooterProps {
  contactConfig: BusinessContactConfig;
  onNavigate: (section: NavSection) => void;
  onReplayPortal: () => void;
  legalModal: 'privacy' | 'terms' | null;
  onOpenLegal: (tab: 'privacy' | 'terms' | null) => void;
}

export const Footer: React.FC<FooterProps> = ({
  contactConfig,
  onNavigate,
  onReplayPortal,
  legalModal,
  onOpenLegal,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterNotice, setNewsletterNotice] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError(null);
    setNewsletterNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter_demo', email: newsletterEmail }),
      });
      const data = await res.json();
      setNewsletterNotice(
        `Preview Notice (${data.referenceId}): Email signup UI tested in demo mode — not connected to a live mailing list backend.`
      );
      setNewsletterEmail('');
    } catch {
      setNewsletterError('Unable to submit right now.');
    }
  };

  return (
    <footer className="bg-[#0B0F0F] border-t border-white/10 text-[#F4EFE5]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        {/* Newsletter & Brand Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo variant="horizontal" />
            <p className="font-display italic text-xl text-[#D5B77A]">
              Beyond Interiors. Into Experiences.
            </p>
            <p className="text-xs text-[#F4EFE5]/60 max-w-sm leading-relaxed">
              Imagine. Personalise. Experience. Conceptual AI-powered spatial architecture,
              sculptural surfaces, and atmospheric illumination.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D5B77A]">
              Journal &amp; Concept Releases
            </p>
            <form onSubmit={handleNewsletter} className="mt-3 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email for SENSORA AI release preview..."
                aria-label="Email address for newsletter preview"
                className="flex-1 px-4 py-3 rounded-md bg-[#151A1A] border border-white/15 text-sm text-[#F4EFE5] placeholder:text-[#F4EFE5]/40 focus:outline-none focus:border-[#D5B77A]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#e5ca93] cursor-pointer whitespace-nowrap"
              >
                Subscribe (Demo)
              </button>
            </form>
            {newsletterError && <p className="mt-2 text-xs text-red-300">{newsletterError}</p>}
            {newsletterNotice && (
              <p className="mt-2 text-xs text-[#D5B77A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{newsletterNotice}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-white/10 text-xs">
          <div>
            <p className="uppercase tracking-[0.18em] text-[#D5B77A] mb-4">Explore</p>
            <ul className="space-y-2.5 text-[#F4EFE5]/75">
              {(
                [
                  ['home', 'Home'],
                  ['worlds', 'Explore Worlds'],
                  ['visualisations', '3D Visualisations'],
                  ['ai-designer', 'AI Designer'],
                  ['tile-atelier', 'Tile Atelier'],
                  ['lighting-lab', 'Lighting Lab'],
                  ['projects', 'Our Projects'],
                  ['about', 'About'],
                  ['contact', 'Contact'],
                ] as [NavSection, string][]
              ).map(([id, label]) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(id)}
                    className="hover:text-[#D5B77A] transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="uppercase tracking-[0.18em] text-[#D5B77A] mb-4">Services</p>
            <ul className="space-y-2.5 text-[#F4EFE5]/75">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('spaces')}
                  className="hover:text-[#D5B77A] cursor-pointer"
                >
                  Interior Design
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('tile-atelier')}
                  className="hover:text-[#D5B77A] cursor-pointer"
                >
                  Architectural Surfaces
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('lighting-lab')}
                  className="hover:text-[#D5B77A] cursor-pointer"
                >
                  Lighting
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('ai-designer')}
                  className="hover:text-[#D5B77A] cursor-pointer"
                >
                  AI Visualisation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cities')}
                  className="hover:text-[#D5B77A] cursor-pointer"
                >
                  Commercial Projects (Concepts)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="uppercase tracking-[0.18em] text-[#D5B77A] mb-4">Contact</p>
            <ul className="space-y-2.5 text-[#F4EFE5]/75">
              <li>Bengaluru, Karnataka, India</li>
              <li className="text-[#F4EFE5]/60">{contactConfig.address}</li>
              <li className="text-[#F4EFE5]/60">{contactConfig.email}</li>
              <li className="text-[#F4EFE5]/60">{contactConfig.phone}</li>
            </ul>
          </div>

          <div>
            <p className="uppercase tracking-[0.18em] text-[#D5B77A] mb-4">
              Social &amp; Channels
            </p>
            <ul className="space-y-2 text-[#F4EFE5]/60">
              <li>Instagram: {contactConfig.instagram}</li>
              <li>Facebook: {contactConfig.facebook}</li>
              <li>LinkedIn: {contactConfig.linkedin}</li>
              <li>YouTube: {contactConfig.youtube}</li>
              <li>X: {contactConfig.xProfile}</li>
            </ul>
            <button
              type="button"
              onClick={onReplayPortal}
              className="mt-4 text-[#D5B77A] hover:underline cursor-pointer"
            >
              Replay Opening Portal
            </button>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4EFE5]/50">
          <p>© 2026 SATHSANG presents SENSORA AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#D5B77A] cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#D5B77A] cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Terms Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label={legalModal === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
        >
          <div className="max-w-xl w-full rounded-2xl border border-[#D5B77A]/35 bg-[#111515] p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display text-2xl text-[#F4EFE5]">
                {legalModal === 'privacy' ? 'Privacy Policy (Preview Notice)' : 'Terms & Conditions'}
              </h3>
              <button
                type="button"
                onClick={() => onOpenLegal(null)}
                className="p-1.5 rounded border border-white/15 text-[#F4EFE5]/70 cursor-pointer"
                aria-label="Close legal dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-[#F4EFE5]/75 leading-relaxed">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    SATHSANG presents SENSORA AI respects visitor privacy. Uploaded room photographs
                    in AI Designer and AI Tile Matcher are processed solely to generate your spatial
                    concept preview during your active session and are not published publicly.
                  </p>
                  <p>
                    Enquiry forms in this conceptual preview run in demo mode and do not transmit
                    personal data to an external CRM unless live endpoints are configured by the
                    site owner.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All spatial renders, project showcases, city experiences, and decorative tile
                    pricing displayed on SATHSANG presents SENSORA AI are conceptual visualisations
                    and illustrative demo specifications.
                  </p>
                  <p>
                    Indicative INR per-square-foot rates and budget ranges are provided for early
                    architectural estimation only and are subject to formal site measurement and
                    specification confirmation.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

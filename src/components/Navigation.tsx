import React, { useState } from 'react';
import { Menu, X, Bookmark } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { NavSection } from '../types/sensora';

interface NavigationProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenConsultation: () => void;
  enquiryCount: number;
  onOpenEnquiryDrawer: () => void;
}

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'worlds', label: 'Explore Worlds' },
  { id: 'ai-designer', label: 'AI Designer' },
  { id: 'tile-atelier', label: 'Tile Atelier' },
  { id: 'lighting-lab', label: 'Lighting Lab' },
  { id: 'projects', label: 'Our Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  onOpenConsultation,
  enquiryCount,
  onOpenEnquiryDrawer,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: NavSection) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111515]/92 border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 xl:gap-8">
        {/* Zone 1: Brand Lockup */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B77A] rounded-md cursor-pointer"
          aria-label="SATHSANG presents SENSORA AI Home"
        >
          <BrandLogo variant="horizontal" />
        </button>

        {/* Zone 2: Single-line clean typographic nav links */}
        <nav
          className="hidden xl:flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.14em]"
          aria-label="Primary Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active ? 'text-[#D5B77A]' : 'text-[#F4EFE5]/75 hover:text-[#F4EFE5]'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[1px] bg-[#D5B77A]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Mobile Menu */}
        <div className="flex items-center gap-3 shrink-0">
          {enquiryCount > 0 && (
            <button
              type="button"
              onClick={onOpenEnquiryDrawer}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-[#D5B77A] border border-[#D5B77A]/35 rounded-md hover:bg-[#102B28] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Saved & Enquiry Items"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="font-mono-tabular">{enquiryCount}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-md bg-[#D5B77A] text-[#111515] text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-[#e3c992] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book a Consultation
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="xl:hidden p-2.5 rounded-md border border-white/15 text-[#F4EFE5] hover:border-[#D5B77A]/50 cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-white/10 bg-[#111515] px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`text-left px-3 py-2.5 rounded-md text-xs uppercase tracking-[0.14em] border transition-colors ${
                  activeSection === item.id
                    ? 'border-[#D5B77A] bg-[#102B28] text-[#D5B77A]'
                    : 'border-white/10 text-[#F4EFE5]/80 hover:border-white/25'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenConsultation();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

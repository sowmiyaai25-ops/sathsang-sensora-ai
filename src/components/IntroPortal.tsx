import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ThreePortalScene } from './ThreePortalScene';

interface IntroPortalProps {
  onComplete: () => void;
}

const PORTAL_SNEAK_PEEKS = [
  {
    label: 'Aqua Sanctuary',
    image: '/src/assets/images/vis_bioluminescent_aqua_spa_1794847535692.jpg',
  },
  {
    label: 'Emerald Gallery',
    image: '/src/assets/images/hero_emerald_sanctuary_3d_1794847533511.jpg',
  },
  {
    label: 'Royal Salon',
    image: '/src/assets/images/vis_royal_chandeliers_hall_1794847533984.jpg',
  },
  {
    label: 'Desert Pavilion',
    image: '/src/assets/images/vis_desert_dune_pavilion_1794847535848.jpg',
  },
];

export const IntroPortal: React.FC<IntroPortalProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'entrance' | 'ready' | 'entering'>('entrance');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(
      () => setStage('ready'),
      reduced ? 100 : 1200
    );
    return () => window.clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    if (stage === 'entering') return;
    setStage('entering');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      onComplete();
    }, reduced ? 150 : 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'entering' ? 0 : 1 }}
        transition={{ duration: stage === 'entering' ? 0.6 : 0.4, delay: stage === 'entering' ? 0.6 : 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0B1212] text-[#F4EFE5] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="SATHSANG presents SENSORA AI Opening Portal"
      >
        {/* Layered Magical Portal Visual + Interactive 3D Three.js Architecture */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_magical_portal_vista_1794847532486.jpg"
            alt="Sensora monumental emerald marble portal overlooking misty golden sanctuary"
            className={`w-full h-full object-cover contrast-[1.06] saturate-[1.08] brightness-[1.04] transition-transform duration-1000 ${
              stage === 'entering' ? 'scale-125 opacity-100' : 'scale-[1.02] opacity-92'
            }`}
          />
          {!isMobile && (
            <div className="absolute inset-0">
              <ThreePortalScene
                mode="intro"
                entering={stage === 'entering'}
                transparentBg
                fallbackImage="/src/assets/images/hero_magical_portal_vista_1794847532486.jpg"
              />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B1212]/70 via-[#0B1212]/20 to-[#0B1212]/90" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#D5B77A]">
            Architectural Experience Portal
          </span>
          <button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#F4EFE5]/85 hover:text-[#D5B77A] border border-white/20 hover:border-[#D5B77A]/60 rounded-md bg-[#111515]/80 transition-colors cursor-pointer"
          >
            Skip Intro
          </button>
        </div>

        {/* Center Scene 1 & Scene 2 Reveal */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl my-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrandLogo variant="stacked" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-display italic text-xl sm:text-3xl text-[#F4EFE5] tracking-wide drop-shadow"
          >
            Beyond Interiors. Into Experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: stage === 'entrance' ? 0.5 : 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <button
              type="button"
              onClick={handleEnter}
              disabled={stage === 'entering'}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-md bg-[#D5B77A] text-[#111515] font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-[#e5ca93] transition-all shadow-[0_0_50px_rgba(213,183,122,0.38)] cursor-pointer disabled:opacity-60"
            >
              <span>
                {stage === 'entering' ? 'Stepping Through Portal' : 'Enter the Sensora Universe'}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-xs tracking-[0.22em] uppercase text-[#F4EFE5]/65">
              Imagine · Personalise · Experience
            </p>
          </motion.div>

          {/* Floating Glimpse Strip of Worlds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="hidden md:grid grid-cols-4 gap-3 mt-10 w-full max-w-2xl"
          >
            {PORTAL_SNEAK_PEEKS.map((item) => (
              <div
                key={item.label}
                className="rounded-lg overflow-hidden border border-[#D5B77A]/30 bg-[#111515]/80"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="py-1.5 px-2 text-[10px] uppercase tracking-[0.16em] text-[#D5B77A]">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 pb-5 text-[11px] tracking-[0.2em] uppercase text-[#F4EFE5]/50">
          Bengaluru · Conceptual Architectural Studio
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

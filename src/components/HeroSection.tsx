import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Layers, Pause, Play } from 'lucide-react';
import { ThreePortalScene } from './ThreePortalScene';
import { SafeImage } from './SafeImage';
import { BRAND_PILLARS } from '../data/sensoraData';
import { NavSection } from '../types/sensora';

interface HeroSectionProps {
  onNavigate: (section: NavSection) => void;
  onReplayPortal: () => void;
}

const HERO_PLATES = [
  {
    id: 'portal',
    label: 'Emerald Portal',
    image: '/src/assets/images/hero_magical_portal_vista_1794847532486.jpg',
    caption: 'Monumental emerald archway over a mirrored reflecting pool',
  },
  {
    id: 'gallery',
    label: '3D Tile & Skyline',
    image: '/src/assets/images/hero_emerald_sanctuary_3d_1794847533511.jpg',
    caption: 'Flowing gold ceiling ribbons & suspended 3D stone tiles',
  },
  {
    id: 'aqua',
    label: 'Aqua Hydro-Lounge',
    image: '/src/assets/images/vis_bioluminescent_aqua_spa_1794847535692.jpg',
    caption: 'Turquoise underwater vault with glowing amber jellyfish pendants',
  },
  {
    id: 'royal',
    label: 'Royal Salon',
    image: '/src/assets/images/vis_royal_chandeliers_hall_1794847533984.jpg',
    caption: 'Champagne bronze arches & backlit emerald onyx monolith',
  },
  {
    id: 'cosmic',
    label: 'Cosmic Wave',
    image: '/assets/curated/cosmic_wave_gallery.jpg',
    caption: 'Sweeping kinetic light ribbons across midnight mineral walls',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onReplayPortal,
}) => {
  const [motionPaused, setMotionPaused] = useState(false);
  const [atmosphere, setAtmosphere] = useState<'emerald' | 'aqua' | 'cosmic'>('emerald');
  const [activePlateIdx, setActivePlateIdx] = useState(0);
  const [show3DLayer, setShow3DLayer] = useState(true);
  const [pointerGlow, setPointerGlow] = useState({ x: 65, y: 42 });

  useEffect(() => {
    if (motionPaused) return;
    const id = window.setInterval(() => {
      setActivePlateIdx((i) => (i + 1) % HERO_PLATES.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [motionPaused]);

  const currentPlate = HERO_PLATES[activePlateIdx];

  return (
    <section
      id="home"
      className="relative bg-[#111515]"
      onMouseMove={(e) => {
        if (motionPaused) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        setPointerGlow({ x, y });
      }}
    >
      {/* Full-Screen 3D + Architectural Visualisation Hero */}
      <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-white/10">
        {/* Background Visual Plate Crossfade + Interactive 3D Portal Layer */}
        <div className="absolute inset-0">
          {HERO_PLATES.map((plate, idx) => (
            <div
              key={plate.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === activePlateIdx ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <SafeImage
                src={plate.image}
                alt={plate.caption}
                className="w-full h-full object-cover scale-[1.01] contrast-[1.06] saturate-[1.08]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {show3DLayer && (
            <div className="absolute inset-0 opacity-90">
              <ThreePortalScene
                mode="hero"
                paused={motionPaused}
                atmosphere={atmosphere}
                transparentBg
                fallbackImage={currentPlate.image}
              />
            </div>
          )}

          {/* Pointer-reactive golden architectural light aura */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 mix-blend-screen"
            style={{
              background: `radial-gradient(520px circle at ${pointerGlow.x}% ${pointerGlow.y}%, rgba(213, 183, 122, 0.2), transparent 68%)`,
            }}
          />

          {/* Subtle angled volumetric sunbeam shimmer */}
          <div
            className="pointer-events-none absolute inset-0 opacity-35 mix-blend-screen"
            style={{
              background:
                'linear-gradient(118deg, transparent 35%, rgba(213,183,122,0.16) 49%, rgba(108,214,202,0.08) 54%, transparent 66%)',
            }}
          />

          {/* Localized contrast scrims so center/right architectural photography stays crystal sharp */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#111515]/88 via-[#111515]/32 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111515]/85 via-transparent to-[#111515]/35" />
        </div>

        {/* Main Hero Copy + Visual Window Cards */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 pb-8 lg:pt-24 my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 max-w-2xl"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.22em] uppercase text-[#D5B77A]">
              <span>SATHSANG presents SENSORA AI</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#F4EFE5]/75">Imagine · Personalise · Experience</span>
            </div>

            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#F4EFE5] leading-[1.06]">
              Step Into a Different World.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#F4EFE5]/85 leading-relaxed max-w-xl">
              Where artificial intelligence meets architectural imagination. Discover extraordinary
              spaces, intelligent design and surfaces that transform the way we experience
              interiors.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('ai-designer')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#e5ca93] transition-colors cursor-pointer"
              >
                <span>Create My World</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('worlds')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md border border-[#D5B77A]/55 bg-[#102B28]/85 text-[#F4EFE5] text-xs font-semibold uppercase tracking-[0.18em] hover:border-[#D5B77A] hover:bg-[#102B28] transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#D5B77A]" />
                <span>Explore Sensora</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('visualisations')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-md border border-white/20 bg-[#111515]/75 text-[#F4EFE5]/90 text-xs font-semibold uppercase tracking-[0.18em] hover:border-[#D5B77A] hover:text-[#D5B77A] transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#D5B77A]" />
                <span>3D Visualisations</span>
              </button>
            </div>
          </motion.div>

          {/* Interactive Hero Visual Plate Switcher Thumbnails */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-[#D5B77A]">
              <span className="uppercase tracking-[0.18em]">Architectural Vista</span>
              <span className="text-[#F4EFE5]/70">{currentPlate.label}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {HERO_PLATES.map((plate, idx) => (
                <button
                  key={plate.id}
                  type="button"
                  onClick={() => setActivePlateIdx(idx)}
                  className={`group rounded-lg overflow-hidden border transition-all cursor-pointer text-left ${
                    idx === activePlateIdx
                      ? 'border-[#D5B77A] ring-1 ring-[#D5B77A]/60 scale-[1.02]'
                      : 'border-white/20 opacity-75 hover:opacity-100'
                  }`}
                  title={plate.label}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={plate.image}
                      alt={plate.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-[#F4EFE5]/70">{currentPlate.caption}</p>
          </div>
        </div>

        {/* Bottom 3D & Scene Control Dock */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto px-6 lg:px-12 pb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#F4EFE5]/60">
            Interactive 3D Portal &amp; Concept Showcase · Move pointer to orbit view
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-[#111515]/92 border border-white/15 rounded-lg p-1.5">
            {(['emerald', 'aqua', 'cosmic'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAtmosphere(preset)}
                className={`px-2.5 py-1.5 rounded text-[11px] uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  atmosphere === preset
                    ? 'bg-[#102B28] text-[#D5B77A] border border-[#D5B77A]/40'
                    : 'text-[#F4EFE5]/65 hover:text-[#F4EFE5]'
                }`}
              >
                {preset}
              </button>
            ))}
            <span className="h-4 w-[1px] bg-white/15" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setShow3DLayer((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] transition-colors cursor-pointer ${
                show3DLayer ? 'text-[#D5B77A]' : 'text-[#F4EFE5]/65'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{show3DLayer ? '3D Overlay On' : '3D Overlay Off'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMotionPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] text-[#F4EFE5]/80 hover:text-[#D5B77A] transition-colors cursor-pointer"
              aria-label={motionPaused ? 'Resume 3D scene motion' : 'Pause 3D scene motion'}
            >
              {motionPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{motionPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button
              type="button"
              onClick={onReplayPortal}
              className="px-2.5 py-1.5 rounded text-[11px] text-[#D5B77A]/90 hover:text-[#D5B77A] transition-colors cursor-pointer"
            >
              Replay Portal
            </button>
          </div>
        </div>
      </div>

      {/* Brand Ecosystem Architecture Bar */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#D5B77A]">
              Brand Architecture
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl text-[#F4EFE5]">
              One Universe. Six Architectural Disciplines.
            </h2>
          </div>
          <p className="text-sm text-[#F4EFE5]/65 max-w-md">
            Beyond Interiors. Into Experiences — uniting conceptual space design, bespoke
            architectural surfaces, calibrated illumination, and interactive AI previews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 pt-10">
          {BRAND_PILLARS.map((pillar) => (
            <div
              key={pillar.code}
              className="group border-b border-white/10 pb-6 transition-colors hover:border-[#D5B77A]/45"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono-tabular text-xs text-[#D5B77A]">{pillar.code}.</span>
                <h3 className="font-display text-lg tracking-wide text-[#F4EFE5] group-hover:text-[#D5B77A] transition-colors">
                  {pillar.name}
                </h3>
              </div>
              <p className="mt-2 text-sm text-[#F4EFE5]/70 leading-relaxed">{pillar.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

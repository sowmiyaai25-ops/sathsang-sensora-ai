import React, { useState } from 'react';
import { Lightbulb, SunMedium } from 'lucide-react';
import { LIGHTING_SYSTEMS } from '../data/sensoraData';
import { SafeImage } from './SafeImage';
import { ThreeWorldViewer } from './ThreeWorldViewer';

interface LightingLabProps {
  onLightingEnquiry: (kelvinLabel: string) => void;
}

type KelvinMode = 'warm' | 'neutral' | 'cool';

const KELVIN_MODES: Record<
  KelvinMode,
  {
    label: string;
    kelvin: string;
    mood: string;
    overlayCss: string;
    hexNum: number;
    swatch: string;
  }
> = {
  warm: {
    label: 'Warm Amber',
    kelvin: '2700K',
    mood: 'Intimate hospitality glow, softens travertine, bronze, and emerald veins.',
    overlayCss: 'rgba(229, 165, 86, 0.24)',
    hexNum: 0xf4c47a,
    swatch: '#F4C47A',
  },
  neutral: {
    label: 'Architectural Neutral',
    kelvin: '4000K',
    mood: 'Balanced gallery fidelity preserving true mineral colour and subtle relief shadows.',
    overlayCss: 'rgba(244, 239, 229, 0.14)',
    hexNum: 0xf4efe5,
    swatch: '#F4EFE5',
  },
  cool: {
    label: 'Crisp Daylight / Marine',
    kelvin: '6000K',
    mood: 'High-clarity futuristic luminance highlighting metallic titanium and glass surfaces.',
    overlayCss: 'rgba(130, 200, 232, 0.22)',
    hexNum: 0xaadcf5,
    swatch: '#AADCF5',
  },
};

export const LightingLab: React.FC<LightingLabProps> = ({ onLightingEnquiry }) => {
  const [kelvinMode, setKelvinMode] = useState<KelvinMode>('warm');
  const [intensity, setIntensity] = useState<number>(82);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);

  const currentKelvin = KELVIN_MODES[kelvinMode];
  const currentSystem = LIGHTING_SYSTEMS[activeCategoryIdx] || LIGHTING_SYSTEMS[0];

  return (
    <section id="lighting-lab" className="py-20 lg:py-28 bg-[#0E1615] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              Sensora Light
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              Sensora Lighting Lab
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#F4EFE5]/70 max-w-xl">
            Experience how architectural surfaces transform across 2700K Warm, 4000K Neutral, and
            6000K Cool illumination before specifying fixtures.
          </p>
        </div>

        {/* Interactive Warm / Neutral / Cool Comparison Simulator */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Simulated Interior Frame */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/10 bg-[#111515] flex flex-col">
            <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] overflow-hidden">
              <SafeImage
                src="/assets/curated/sculptural_tile_gallery.jpg"
                alt="Architectural interior under tunable lighting comparison"
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Calibrated Kelvin tint + dimming layer */}
              <div
                className="pointer-events-none absolute inset-0 transition-all duration-500 mix-blend-soft-light"
                style={{
                  backgroundColor: currentKelvin.overlayCss,
                  opacity: intensity / 100,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-300"
                style={{ opacity: Math.max(0, (100 - intensity) * 0.0055) }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111515]/85 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono-tabular text-xs text-[#D5B77A]">
                    {currentKelvin.kelvin} · {currentKelvin.label}
                  </span>
                  <p className="text-xs text-[#F4EFE5]/85 mt-1">{currentKelvin.mood}</p>
                </div>
                <span className="font-mono-tabular text-xs px-3 py-1 rounded bg-[#111515]/85 border border-white/15 text-[#F4EFE5]">
                  Output {intensity}%
                </span>
              </div>
            </div>

            {/* Simulator Controls */}
            <div className="p-5 bg-[#151A1A] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {(['warm', 'neutral', 'cool'] as KelvinMode[]).map((mode) => {
                  const cfg = KELVIN_MODES[mode];
                  const active = kelvinMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setKelvinMode(mode)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#102B28] border-[#D5B77A] text-[#F4EFE5]'
                          : 'bg-[#111515] border-white/10 text-[#F4EFE5]/70 hover:border-white/25'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cfg.swatch }}
                      />
                      <span>
                        {cfg.kelvin} {cfg.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <label className="flex items-center gap-3 text-xs text-[#F4EFE5]/75 min-w-[180px]">
                <SunMedium className="w-4 h-4 text-[#D5B77A] shrink-0" />
                <input
                  type="range"
                  min={25}
                  max={100}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-[#D5B77A]"
                  aria-label="Dimming level percentage"
                />
              </label>
            </div>
          </div>

          {/* Live 3D Luminaire & Surface Kelvin Response */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="h-[340px] sm:h-[380px]">
              <ThreeWorldViewer
                title={`3D Luminaire (${currentKelvin.kelvin})`}
                bgHex={0x0f1716}
                slabHex={0x9b6b4a}
                accentHex={0xd5b77a}
                roughness={0.45}
                metalness={0.22}
                pattern="terracotta"
                kelvinColorHex={currentKelvin.hexNum}
                fallbackImage="/assets/curated/sculptural_tile_gallery.jpg"
              />
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-[#151A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#D5B77A]">
                  Custom Lighting Architecture
                </p>
                <p className="text-xs text-[#F4EFE5]/75 mt-1">
                  Request a scene schedule calibrated to your surfaces and ceiling heights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLightingEnquiry(`${currentKelvin.kelvin} ${currentKelvin.label}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#e5ca93] cursor-pointer shrink-0"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Lighting Enquiry</span>
              </button>
            </div>
          </div>
        </div>

        {/* 7 Lighting Disciplines */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 space-y-2">
            {LIGHTING_SYSTEMS.map((sys, idx) => {
              const active = idx === activeCategoryIdx;
              return (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => setActiveCategoryIdx(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#102B28]/80 border-[#D5B77A]/60'
                      : 'bg-[#111515] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase tracking-[0.16em] text-[#D5B77A]">
                      {sys.category}
                    </span>
                    <span className="font-mono-tabular text-[#F4EFE5]/60">{sys.kelvinRange}</span>
                  </div>
                  <p className="mt-1 font-display text-xl text-[#F4EFE5]">{sys.title}</p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/10 bg-[#111515] flex flex-col justify-between">
            <div className="aspect-[16/9] overflow-hidden">
              <SafeImage
                src={currentSystem.image}
                alt={currentSystem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D5B77A]">
                {currentSystem.category} · {currentSystem.kelvinRange}
              </p>
              <h3 className="mt-2 font-display text-3xl text-[#F4EFE5]">{currentSystem.title}</h3>
              <p className="mt-3 text-sm text-[#F4EFE5]/75 leading-relaxed">
                {currentSystem.description}
              </p>
              <p className="mt-4 text-xs text-[#F4EFE5]/60">
                Primary Application: {currentSystem.application}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { DESIGN_WORLDS } from '../data/sensoraData';
import { DesignWorld, WorldId } from '../types/sensora';
import { SafeImage } from './SafeImage';

interface WorldExplorerProps {
  onSelectWorld: (world: DesignWorld) => void;
}

export const WorldExplorer: React.FC<WorldExplorerProps> = ({ onSelectWorld }) => {
  const [activeId, setActiveId] = useState<WorldId>('aqua');
  const activeWorld = DESIGN_WORLDS.find((w) => w.id === activeId) || DESIGN_WORLDS[0];

  return (
    <section id="worlds" className="py-20 lg:py-28 bg-[#0E1615] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              Sensora Worlds
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              Explore Five Architectural Universes
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#F4EFE5]/70 max-w-lg">
            Travel between five distinct spatial worlds—each defined by its own mineral palette,
            surface relief, lighting temperature, and experiential mood.
          </p>
        </div>

        {/* Interactive World Switcher Tabs */}
        <div
          className="mt-10 flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#111515] border border-white/10 w-fit"
          role="tablist"
          aria-label="Design Worlds"
        >
          {DESIGN_WORLDS.map((world, idx) => {
            const isSelected = world.id === activeId;
            return (
              <button
                key={world.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveId(world.id)}
                className={`px-4 py-2.5 rounded-lg text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#102B28] text-[#D5B77A] border border-[#D5B77A]/40'
                    : 'text-[#F4EFE5]/70 hover:text-[#F4EFE5]'
                }`}
              >
                0{idx + 1}. {world.name}
              </button>
            );
          })}
        </div>

        {/* Featured Active World Spotlight */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-2xl overflow-hidden border border-white/10 bg-[#111515]">
          <div className="lg:col-span-7 relative min-h-[340px] lg:min-h-[480px] overflow-hidden">
            <SafeImage
              src={activeWorld.heroImage}
              alt={`${activeWorld.name} architectural concept interior`}
              className="w-full h-full object-cover contrast-[1.05] saturate-[1.06] transition-transform duration-700 hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#111515]/85 via-[#111515]/25 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#F4EFE5]/85">
                <span>Conceptual Visualisation</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#D5B77A]">{activeWorld.subtitle}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D5B77A]">
                {activeWorld.subtitle}
              </span>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl text-[#F4EFE5]">
                {activeWorld.name}
              </h3>
              <p className="mt-4 text-sm sm:text-base text-[#F4EFE5]/75 leading-relaxed">
                {activeWorld.description}
              </p>

              {/* Material & Palette Swatches */}
              <div className="mt-7 pt-6 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.16em] text-[#F4EFE5]/55">
                  Signature Palette &amp; Atmosphere
                </p>
                <div className="mt-3 flex items-center gap-3">
                  {[
                    activeWorld.palette.primary,
                    activeWorld.palette.secondary,
                    activeWorld.palette.surface,
                    activeWorld.palette.accent,
                  ].map((hex, i) => (
                    <div key={`${hex}-${i}`} className="flex flex-col items-start gap-1.5">
                      <span
                        className="w-9 h-9 rounded-md border border-white/15"
                        style={{ backgroundColor: hex }}
                        title={activeWorld.palette.names[i]}
                      />
                    </div>
                  ))}
                  <span className="ml-2 text-xs text-[#F4EFE5]/65">
                    {activeWorld.palette.names.join(' · ')}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[#F4EFE5]/55">
                  Key Experience
                </p>
                <p className="mt-1.5 text-sm text-[#F4EFE5]/80">{activeWorld.experienceSummary}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onSelectWorld(activeWorld)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#e5ca93] transition-colors cursor-pointer"
              >
                <span>{activeWorld.ctaLabel}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* All Five Worlds Quick Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {DESIGN_WORLDS.map((world) => {
            const isSelected = world.id === activeId;
            return (
              <div
                key={world.id}
                className={`group rounded-xl overflow-hidden border transition-all flex flex-col justify-between bg-[#111515] ${
                  isSelected
                    ? 'border-[#D5B77A]/70'
                    : 'border-white/10 hover:border-[#D5B77A]/40'
                }`}
              >
                <div
                  onClick={() => setActiveId(world.id)}
                  className="cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <SafeImage
                      src={world.heroImage}
                      alt={world.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111515]/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#D5B77A]">
                      {world.subtitle}
                    </p>
                    <h4 className="mt-1 font-display text-xl text-[#F4EFE5]">{world.name}</h4>
                    <p className="mt-1.5 text-xs text-[#F4EFE5]/65 line-clamp-2">
                      {world.tagline}
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectWorld(world)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D5B77A] hover:underline cursor-pointer"
                  >
                    <span>Open World Guide</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

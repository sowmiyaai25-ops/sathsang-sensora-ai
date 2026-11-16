import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SPACE_SERVICES } from '../data/sensoraData';
import { WorldId } from '../types/sensora';
import { SafeImage } from './SafeImage';

interface SpacesSectionProps {
  onEnquireSpace: (spaceTitle: string, worldId: WorldId) => void;
  onExploreWorld: (worldId: WorldId) => void;
}

export const SpacesSection: React.FC<SpacesSectionProps> = ({
  onEnquireSpace,
  onExploreWorld,
}) => {
  const [groupFilter, setGroupFilter] = useState<'All' | 'Residential' | 'Commercial'>('All');

  const visibleServices = SPACE_SERVICES.filter(
    (s) => groupFilter === 'All' || s.group === groupFilter
  );

  return (
    <section id="spaces" className="py-20 lg:py-28 bg-[#111515] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              Sensora Spaces
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              Residential &amp; Commercial Spatial Design
            </h2>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-[#151B1A] border border-white/10 w-fit">
            {(['All', 'Residential', 'Commercial'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroupFilter(g)}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  groupFilter === g
                    ? 'bg-[#D5B77A] text-[#111515] font-semibold'
                    : 'text-[#F4EFE5]/75 hover:text-[#F4EFE5]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleServices.map((svc) => (
            <article
              key={svc.id}
              className="rounded-2xl overflow-hidden border border-white/10 bg-[#151A1A] flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden">
                  <SafeImage
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-[#D5B77A]">
                    <span className="uppercase tracking-[0.16em]">{svc.group} Spaces</span>
                    <button
                      type="button"
                      onClick={() => onExploreWorld(svc.relatedWorld)}
                      className="text-[#F4EFE5]/65 hover:text-[#D5B77A] underline-offset-4 hover:underline cursor-pointer capitalize"
                    >
                      {svc.relatedWorld} World
                    </button>
                  </div>
                  <h3 className="mt-2 font-display text-2xl text-[#F4EFE5]">{svc.title}</h3>
                  <p className="mt-1 text-xs text-[#D5B77A]/85">{svc.subtitle}</p>
                  <p className="mt-3 text-xs sm:text-sm text-[#F4EFE5]/75 leading-relaxed">
                    {svc.description}
                  </p>
                  <p className="mt-3 pt-3 border-t border-white/10 text-xs text-[#F4EFE5]/60">
                    Approach: {svc.approach}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => onEnquireSpace(svc.title, svc.relatedWorld)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[#D5B77A] hover:underline cursor-pointer"
                >
                  <span>Enquire for {svc.group} Concept</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

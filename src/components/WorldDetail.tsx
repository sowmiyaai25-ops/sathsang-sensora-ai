import React from 'react';
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { CONCEPT_PROJECTS, TILE_PRODUCTS } from '../data/sensoraData';
import { DesignWorld } from '../types/sensora';
import { SafeImage } from './SafeImage';
import { ThreeWorldViewer } from './ThreeWorldViewer';

interface WorldDetailProps {
  world: DesignWorld;
  onBack: () => void;
  onBookConsultation: (preferredWorld: string) => void;
  onDesignInWorld: (worldName: string) => void;
}

export const WorldDetail: React.FC<WorldDetailProps> = ({
  world,
  onBack,
  onBookConsultation,
  onDesignInWorld,
}) => {
  const recommendedTiles = TILE_PRODUCTS.filter((t) =>
    world.recommendedTileCodes.includes(t.code)
  );
  const relatedProjects = CONCEPT_PROJECTS.filter((p) =>
    world.relatedProjectIds.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-[#111515] text-[#F4EFE5] pb-20">
      {/* Full-Width Immersive Hero */}
      <div className="relative min-h-[60vh] flex items-end border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={world.heroImage}
            alt={`${world.name} architectural environment`}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111515] via-[#111515]/55 to-[#111515]/40" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#111515]/85 border border-white/15 text-xs uppercase tracking-[0.16em] text-[#F4EFE5]/85 hover:text-[#D5B77A] hover:border-[#D5B77A]/50 transition-colors cursor-pointer mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Design Worlds</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
                {world.subtitle} · Conceptual Universe
              </p>
              <h1 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl text-[#F4EFE5]">
                {world.name}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#F4EFE5]/85 leading-relaxed">
                {world.narrative}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onDesignInWorld(world.name.replace(' World', ''))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#e5ca93] transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Design My Space in {world.name}</span>
              </button>
              <button
                type="button"
                onClick={() => onBookConsultation(world.name)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-[#D5B77A]/50 bg-[#102B28]/90 text-[#F4EFE5] text-xs font-semibold uppercase tracking-[0.16em] hover:border-[#D5B77A] transition-colors cursor-pointer"
              >
                <span>Book Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Material Studio & Architectural Specifications */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 h-[420px] lg:h-[460px]">
            <ThreeWorldViewer
              title={`${world.name} Material Slab & Luminaire`}
              bgHex={world.threeConfig.bgHex}
              slabHex={world.threeConfig.slabHex}
              accentHex={world.threeConfig.accentHex}
              roughness={world.threeConfig.roughness}
              metalness={world.threeConfig.metalness}
              pattern={world.threeConfig.pattern}
              fallbackImage={world.heroImage}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between p-8 rounded-2xl border border-white/10 bg-[#0F1918]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#D5B77A]">
                Material &amp; Lighting Direction
              </p>
              <h2 className="mt-2 font-display text-3xl text-[#F4EFE5]">
                Tactile Surface Architecture
              </h2>

              <div className="mt-6 space-y-5">
                {world.materials.map((mat) => (
                  <div key={mat.name} className="pb-4 border-b border-white/10">
                    <h3 className="font-medium text-base text-[#F4EFE5]">{mat.name}</h3>
                    <p className="mt-1 text-xs text-[#D5B77A]">{mat.specification}</p>
                    <p className="mt-1 text-xs text-[#F4EFE5]/65">Application: {mat.application}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D5B77A]">
                Lighting Calibration
              </p>
              <p className="mt-1.5 text-sm text-[#F4EFE5]/85">{world.lightingApproach.kelvin}</p>
              <p className="mt-1 text-xs text-[#F4EFE5]/65">{world.lightingApproach.fixtureStyle}</p>
            </div>
          </div>
        </div>

        {/* Secondary Visual Gallery & Interior Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 p-8 rounded-2xl border border-white/10 bg-[#151A1A]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D5B77A]">
              Interior Applications
            </p>
            <h3 className="mt-2 font-display text-2xl text-[#F4EFE5]">
              Where {world.name} Belongs
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#F4EFE5]/80">
              {world.applications.map((app) => (
                <li key={app} className="pb-2.5 border-b border-white/10">
                  {app}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {world.secondaryImages.slice(0, 2).map((img, i) => (
              <div
                key={img}
                className="aspect-[16/10] rounded-xl overflow-hidden border border-white/10"
              >
                <SafeImage
                  src={img}
                  alt={`${world.name} conceptual interior study ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Illustrative Tiles */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#D5B77A]">
                Tile Atelier Pairing
              </p>
              <h3 className="mt-1 font-display text-3xl text-[#F4EFE5]">
                Curated Surfaces for {world.name}
              </h3>
            </div>
            <span className="text-xs text-[#F4EFE5]/55">
              Illustrative demo specifications &amp; indicative pricing
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedTiles.map((tile) => (
              <div
                key={tile.id}
                className="rounded-xl overflow-hidden border border-white/10 bg-[#151A1A]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <SafeImage src={tile.image} alt={tile.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-[#F4EFE5]/60">
                    <span className="font-mono-tabular text-[#D5B77A]">{tile.code}</span>
                    <span>
                      {tile.finish} · {tile.material}
                    </span>
                  </div>
                  <h4 className="mt-2 font-display text-xl text-[#F4EFE5]">{tile.name}</h4>
                  <p className="mt-1.5 text-xs text-[#F4EFE5]/70">{tile.description}</p>
                  <p className="mt-3 font-mono-tabular text-sm text-[#D5B77A]">
                    ₹{tile.priceInrPerSqFt} / sq.ft (Indicative)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Concept Projects */}
        {relatedProjects.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#D5B77A]">
              Conceptual Portfolio
            </p>
            <h3 className="mt-1 font-display text-3xl text-[#F4EFE5]">
              Related Concept Visualisations
            </h3>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl overflow-hidden border border-white/10 bg-[#151A1A] grid grid-cols-1 sm:grid-cols-2"
                >
                  <div className="aspect-[4/3] sm:aspect-auto">
                    <SafeImage
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-[#D5B77A]">{proj.category}</p>
                      <h4 className="mt-1 font-display text-2xl text-[#F4EFE5]">{proj.title}</h4>
                      <p className="mt-2 text-xs text-[#F4EFE5]/70 leading-relaxed">
                        {proj.conceptSummary}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onBookConsultation(world.name)}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#D5B77A] hover:underline cursor-pointer"
                    >
                      <span>Enquire About This Concept</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

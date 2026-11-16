import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import { CONCEPT_PROJECTS } from '../data/sensoraData';
import { ConceptProject, WorldId } from '../types/sensora';
import { SafeImage } from './SafeImage';

interface ProjectGalleryProps {
  onCreateSimilar: (worldLabel: string) => void;
}

const WORLD_FILTERS: ('all' | WorldId)[] = ['all', 'aqua', 'forest', 'cosmic', 'royal', 'desert'];

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ onCreateSimilar }) => {
  const [filter, setFilter] = useState<'all' | WorldId>('all');
  const [selectedProject, setSelectedProject] = useState<ConceptProject | null>(null);

  const visibleProjects = CONCEPT_PROJECTS.filter(
    (p) => filter === 'all' || p.worldId === filter
  );

  return (
    <section id="projects" className="py-20 lg:py-28 bg-[#111515] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              Our Projects · Conceptual Visualisations
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              Architectural Concept Portfolio
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#151B1A] border border-white/10 w-fit">
            {WORLD_FILTERS.map((wf) => (
              <button
                key={wf}
                type="button"
                onClick={() => setFilter(wf)}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  filter === wf
                    ? 'bg-[#D5B77A] text-[#111515] font-semibold'
                    : 'text-[#F4EFE5]/70 hover:text-[#F4EFE5]'
                }`}
              >
                {wf === 'all' ? 'All Worlds' : `${wf}`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProjects.map((proj) => (
            <article
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group rounded-xl overflow-hidden border border-white/10 bg-[#151A1A] hover:border-[#D5B77A]/50 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden relative">
                  <SafeImage
                    src={proj.image}
                    alt={`${proj.title} conceptual interior visualisation`}
                    className="w-full h-full object-cover contrast-[1.05] saturate-[1.06] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#151A1A]/75 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-[#D5B77A]">
                    <span>{proj.worldLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#F4EFE5]/55">Conceptual</span>
                  </div>
                  <h3 className="mt-1.5 font-display text-2xl text-[#F4EFE5] group-hover:text-[#D5B77A] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#F4EFE5]/65">{proj.category}</p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-[#D5B77A]">
                <span>View Concept Study</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title}
        >
          <div className="max-w-4xl w-full rounded-2xl overflow-hidden border border-[#D5B77A]/35 bg-[#111515] my-8">
            <div className="relative aspect-[16/9] overflow-hidden">
              <SafeImage
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111515] via-transparent to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[#111515]/85 border border-white/20 text-[#F4EFE5] hover:text-[#D5B77A] cursor-pointer"
                aria-label="Close project detail"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#D5B77A]">
                  {selectedProject.worldLabel} · {selectedProject.locationInspiration}
                </p>
                <h3 className="mt-1 font-display text-3xl sm:text-4xl text-[#F4EFE5]">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm sm:text-base text-[#F4EFE5]/80 leading-relaxed">
                {selectedProject.conceptSummary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-white/10 text-xs">
                <div>
                  <p className="uppercase tracking-[0.14em] text-[#D5B77A] mb-2">
                    Material Selection
                  </p>
                  <ul className="space-y-1.5 text-[#F4EFE5]/80">
                    {selectedProject.materialSelection.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="uppercase tracking-[0.14em] text-[#D5B77A] mb-2">
                    Lighting Approach
                  </p>
                  <p className="text-[#F4EFE5]/80 leading-relaxed">
                    {selectedProject.lightingApproach}
                  </p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.14em] text-[#D5B77A] mb-2">
                    Architectural Details
                  </p>
                  <p className="text-[#F4EFE5]/80 leading-relaxed">
                    {selectedProject.architecturalDetails}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-[#F4EFE5]/55">
                  Note: Conceptual visualisation created for architectural ideation.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const worldName = selectedProject.worldLabel.replace(' World', '');
                    setSelectedProject(null);
                    onCreateSimilar(worldName);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#e5ca93] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create a Similar Design</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

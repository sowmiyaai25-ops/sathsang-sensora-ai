import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  Layers,
  Maximize2,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { DESIGN_WORLDS } from '../data/sensoraData';
import { WorldId } from '../types/sensora';
import { SafeImage } from './SafeImage';
import { ThreeWorldViewer } from './ThreeWorldViewer';

interface VisualisationGalleryProps {
  onCreateSimilar: (worldName: string) => void;
  onExploreWorld: (worldId: WorldId) => void;
}

type GalleryCategory =
  | 'All Visualisations'
  | 'Portals & Lobbies'
  | 'Water & Biophilic'
  | 'Cosmic & Futuristic'
  | 'Royal & Desert';

interface VisualPlate {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All Visualisations'>;
  worldId: WorldId;
  worldLabel: string;
  image: string;
  spatialFocus: string;
  materialNote: string;
  lightingNote: string;
}

const CATEGORIES: GalleryCategory[] = [
  'All Visualisations',
  'Portals & Lobbies',
  'Water & Biophilic',
  'Cosmic & Futuristic',
  'Royal & Desert',
];

const VISUAL_PLATES: VisualPlate[] = [
  {
    id: 'vp-emerald-portal',
    title: 'Emerald Sky-Bridge Arrival Portal',
    category: 'Portals & Lobbies',
    worldId: 'forest',
    worldLabel: 'Forest World',
    image: '/src/assets/images/hero_magical_portal_vista_1794847532486.jpg',
    spatialFocus: 'Double-Height Mirror Pool & Architectural Archway',
    materialNote: 'Verde Alpi Emerald Marble · Fluted Champagne Brass Framing',
    lightingNote: '2800K Warm Grazing Cove + Daylight Atrium Reflection',
  },
  {
    id: 'vp-emerald-3d-sanctuary',
    title: 'Suspended Surface Skyline Atrium',
    category: 'Portals & Lobbies',
    worldId: 'forest',
    worldLabel: 'Forest World',
    image: '/src/assets/images/hero_emerald_sanctuary_3d_1794847533511.jpg',
    spatialFocus: 'Floating 3D Tile Monoliths & Flowing Gold Ceiling Ribbons',
    materialNote: 'Sylva Deep Emerald Vein · Smoked Bronze Ceiling Ribs',
    lightingNote: '3000K Continuous Curvilinear Ceiling Ribbon',
  },
  {
    id: 'vp-aqua-hydro-vault',
    title: 'Bioluminescent Aqua Hydro-Spa',
    category: 'Water & Biophilic',
    worldId: 'aqua',
    worldLabel: 'Aqua World',
    image: '/src/assets/images/vis_bioluminescent_aqua_spa_1794847535692.jpg',
    spatialFocus: 'Submerged Glass Arch Vault & Acoustic Coral Stone',
    materialNote: 'Pelagic Coral Lustre Mosaic · Wet-Look Honed Basalt',
    lightingNote: '2700K Jellyfish Pendants + 4800K Marine Cyan Grazing',
  },
  {
    id: 'vp-royal-chandeliers',
    title: 'Backlit Emerald Onyx Royal Salon',
    category: 'Royal & Desert',
    worldId: 'royal',
    worldLabel: 'Royal World',
    image: '/src/assets/images/vis_royal_chandeliers_hall_1794847533984.jpg',
    spatialFocus: 'Champagne Bronze Arches & Heritage Inlay Lounge',
    materialNote: 'Aurelia Bronze Fluted Cladding · Deccan Imperial Octagon',
    lightingNote: '2400K Candlelight Chandeliers & Onyx Backlighting',
  },
  {
    id: 'vp-desert-dune-spa',
    title: 'Terracotta Dune Wellness Sanctuary',
    category: 'Royal & Desert',
    worldId: 'desert',
    worldLabel: 'Desert World',
    image: '/src/assets/images/vis_desert_dune_pavilion_1794847535848.jpg',
    spatialFocus: 'Carved Fluted Sandstone Over Sunken Reflecting Pool',
    materialNote: 'Bespoke Acoustic Dune Fluting · Thar Raw Travertine',
    lightingNote: '2700K Golden-Hour Grazing Slots',
  },
  {
    id: 'vp-cosmic-wave',
    title: 'Kinetic Amber Light Gallery',
    category: 'Cosmic & Futuristic',
    worldId: 'cosmic',
    worldLabel: 'Cosmic World',
    image: '/assets/curated/cosmic_wave_gallery.jpg',
    spatialFocus: 'Continuous Parametrically Curved Titanium Corridor',
    materialNote: 'Nebula Brushed Titanium Rib · Obsidian Mirror Terrazzo',
    lightingNote: '3000K Solar Ribbon LED + Micro-Optic Ceiling Array',
  },
  {
    id: 'vp-cosmic-waterfall',
    title: 'Halo Waterfall Conversation Pit',
    category: 'Cosmic & Futuristic',
    worldId: 'cosmic',
    worldLabel: 'Cosmic World',
    image: '/assets/curated/cosmic_waterfall_lounge.jpg',
    spatialFocus: 'Sunken Circular Lounge Beneath Concentric Light Rings',
    materialNote: 'Bookmatched Midnight Obsidian · Brushed Brass Trim',
    lightingNote: 'Tunable Halo Cove Matrix (2700K–5000K)',
  },
  {
    id: 'vp-aqua-tunnel',
    title: 'Marine Vault Tunnel Brasserie',
    category: 'Water & Biophilic',
    worldId: 'aqua',
    worldLabel: 'Aqua World',
    image: '/assets/curated/aqua_tunnel_lanterns.jpg',
    spatialFocus: 'Panoramic Underwater Glass Arcade & Velvet Booths',
    materialNote: 'Brushed Marine Bronze Ribs · Abyssal Velvet & Basalt',
    lightingNote: '2600K Warm Lantern Drops',
  },
  {
    id: 'vp-forest-courtyard',
    title: 'Biophilic Canopy Courtyard Lobby',
    category: 'Water & Biophilic',
    worldId: 'forest',
    worldLabel: 'Forest World',
    image: '/assets/curated/forest_world_courtyard.jpg',
    spatialFocus: 'Multi-Storey Botanical Trees & Travertine Water Islands',
    materialNote: 'Kaveri Honed Slate · Smoked Teak Trellises',
    lightingNote: 'Filtered Daylight Atrium + 3000K Tree Uplighting',
  },
  {
    id: 'vp-ai-hologram',
    title: 'Spatial AI Hologram Residence',
    category: 'Cosmic & Futuristic',
    worldId: 'cosmic',
    worldLabel: 'Cosmic World',
    image: '/assets/curated/ai_hologram_living.jpg',
    spatialFocus: 'Real-Time Spatial Material Overlay & Living Suite',
    materialNote: 'Prismatix Diamond Lattice · Acoustic Slate Plaster',
    lightingNote: 'DALI Presence-Responsive Scene Zones',
  },
  {
    id: 'vp-luxury-organic',
    title: 'Parametric Lattice Flagship Showroom',
    category: 'Portals & Lobbies',
    worldId: 'forest',
    worldLabel: 'Forest World',
    image: '/assets/curated/luxury_organic_showroom.jpg',
    spatialFocus: 'Sculpted Cellular Rib Ceiling & Botanical Gallery',
    materialNote: 'CNC Mineral Composite Ribs · Honed Limestone Floor',
    lightingNote: 'Hidden Structural Rib Uplighting',
  },
  {
    id: 'vp-sculptural-tiles',
    title: 'Unda & Hexa 3D Relief Pavilion',
    category: 'Royal & Desert',
    worldId: 'desert',
    worldLabel: 'Desert World',
    image: '/assets/curated/sculptural_tile_gallery.jpg',
    spatialFocus: 'Floor-to-Wall Parametric Wave & Hexagonal Relief',
    materialNote: 'Unda Sculptural Wave Panel · Hexa Prism Basalt',
    lightingNote: 'CRI 95+ Grazing Slots Accenting 3D Shadow Relief',
  },
  {
    id: 'vp-forest-enchanted',
    title: 'Enchanted Canopy Dining Conservatory',
    category: 'Water & Biophilic',
    worldId: 'forest',
    worldLabel: 'Forest World',
    image: '/assets/curated/forest_world_enchanted.jpg',
    spatialFocus: 'Indoor Living Canopy & Moon-Orb Pendant Cluster',
    materialNote: 'Canopy Botanical Moss Relief · Reclaimed Teak',
    lightingNote: '2700K Suspended Moon Orbs',
  },
  {
    id: 'vp-portal-arch',
    title: 'Champagne Bronze Threshold Arch',
    category: 'Portals & Lobbies',
    worldId: 'royal',
    worldLabel: 'Royal World',
    image: '/assets/curated/portal_arch.jpg',
    spatialFocus: 'Monolithic Sunset Architectural Gateway',
    materialNote: 'Aurelia Champagne Bronze Fluted · Obsidian Slate',
    lightingNote: 'Recessed Vertical Warm Architectural Strips',
  },
  {
    id: 'vp-ai-studio-space',
    title: 'Sensora AI Studio Material Desk',
    category: 'Cosmic & Futuristic',
    worldId: 'cosmic',
    worldLabel: 'Cosmic World',
    image: '/assets/curated/ai_space_designer.jpg',
    spatialFocus: 'Architect Workstation & Live Spatial Visualisation',
    materialNote: 'Meridian Gold-Inlay Chevron · Brushed Aluminium',
    lightingNote: '4000K Neutral Studio Calibration',
  },
  {
    id: 'vp-emerald-console',
    title: 'Bookmatched Emerald Monolith Salon',
    category: 'Portals & Lobbies',
    worldId: 'forest',
    worldLabel: 'Forest World',
    image: '/assets/curated/emerald_marble_console.jpg',
    spatialFocus: 'Sculpted Reception Stone Island & Orbital Rings',
    materialNote: 'Sylva Deep Emerald Vein Slab · Warm Travertine',
    lightingNote: '2900K Suspended Orbital Ring Fixtures',
  },
];

const KELVIN_MOODS = [
  { id: 'warm', label: '2700K Candlelight', hex: 0xffcc88 },
  { id: 'brass', label: '3500K Architectural Gold', hex: 0xf4dfb4 },
  { id: 'aqua', label: '5000K Bioluminescent', hex: 0x99e8f0 },
];

export const VisualisationGallery: React.FC<VisualisationGalleryProps> = ({
  onCreateSimilar,
  onExploreWorld,
}) => {
  const [category, setCategory] = useState<GalleryCategory>('All Visualisations');
  const [activeId, setActiveId] = useState<string>(VISUAL_PLATES[0].id);
  const [compareId, setCompareId] = useState<string>(VISUAL_PLATES[2].id);
  const [splitMode, setSplitMode] = useState<boolean>(false);
  const [splitPos, setSplitPos] = useState<number>(50);
  const [ambientAura, setAmbientAura] = useState<boolean>(true);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [kelvinIdx, setKelvinIdx] = useState<number>(1);
  const [hoverGlow, setHoverGlow] = useState<{ x: number; y: number } | null>(null);

  const filteredPlates = useMemo(
    () =>
      category === 'All Visualisations'
        ? VISUAL_PLATES
        : VISUAL_PLATES.filter((p) => p.category === category),
    [category]
  );

  const activePlate = useMemo(
    () =>
      VISUAL_PLATES.find((p) => p.id === activeId) ||
      filteredPlates[0] ||
      VISUAL_PLATES[0],
    [activeId, filteredPlates]
  );

  const comparePlate = useMemo(
    () =>
      VISUAL_PLATES.find((p) => p.id === compareId) ||
      VISUAL_PLATES[2],
    [compareId]
  );

  const activeWorld = useMemo(
    () =>
      DESIGN_WORLDS.find((w) => w.id === activePlate.worldId) || DESIGN_WORLDS[0],
    [activePlate]
  );

  const lightboxPlate = useMemo(
    () => VISUAL_PLATES.find((p) => p.id === lightboxId) || null,
    [lightboxId]
  );

  const stepLightbox = (dir: -1 | 1) => {
    if (!lightboxPlate) return;
    const idx = filteredPlates.findIndex((p) => p.id === lightboxPlate.id);
    const baseList = idx === -1 ? VISUAL_PLATES : filteredPlates;
    const currentIdx = baseList.findIndex((p) => p.id === lightboxPlate.id);
    const nextIdx = (currentIdx + dir + baseList.length) % baseList.length;
    const next = baseList[nextIdx];
    setLightboxId(next.id);
    setActiveId(next.id);
  };

  const activeKelvin = KELVIN_MOODS[kelvinIdx];

  return (
    <section
      id="visualisations"
      className="py-20 lg:py-28 bg-[#0C1312] border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              3D Spatial Theatre · Conceptual Visualisations
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              Interactive 3D &amp; Architectural Visualisation Gallery
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#F4EFE5]/70 max-w-xl">
            Inspect crisp architectural renders alongside an interactive Three.js 3D material &amp;
            luminaire stage, toggle ambient volumetric light aura, or compare two worlds live with
            the interactive Split-Lens slider.
          </p>
        </div>

        {/* Category Tabs + Mode Switcher */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#111515] border border-white/10 w-fit">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  const firstMatch =
                    cat === 'All Visualisations'
                      ? VISUAL_PLATES[0]
                      : VISUAL_PLATES.find((p) => p.category === cat);
                  if (firstMatch) setActiveId(firstMatch.id);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-[0.12em] transition-colors cursor-pointer whitespace-nowrap ${
                  category === cat
                    ? 'bg-[#D5B77A] text-[#111515] font-semibold'
                    : 'text-[#F4EFE5]/70 hover:text-[#F4EFE5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSplitMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                splitMode
                  ? 'bg-[#D5B77A] text-[#111515] border-[#D5B77A] font-semibold'
                  : 'bg-[#111515] border-white/15 text-[#F4EFE5]/85 hover:border-[#D5B77A]'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>{splitMode ? 'Split-Lens Active' : 'Compare Two Worlds'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAmbientAura((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                ambientAura
                  ? 'bg-[#102B28] border-[#D5B77A]/60 text-[#D5B77A]'
                  : 'bg-[#111515] border-white/15 text-[#F4EFE5]/75'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{ambientAura ? 'Ambient Aura On' : 'Pure Crisp Render'}</span>
            </button>
          </div>
        </div>

        {/* Dual Spotlight: Spatial Render / Split-Lens Comparator + Live 3D Material Stage */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Selected Architectural Plate (or Interactive Split-Lens) */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#D5B77A]/30 bg-[#111515] flex flex-col">
            <div
              className="relative aspect-[16/10] overflow-hidden group select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoverGlow({
                  x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
                  y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
                });
                if (splitMode && e.buttons === 1) {
                  const pct = ((e.clientX - rect.left) / rect.width) * 100;
                  setSplitPos(Math.min(92, Math.max(8, pct)));
                }
              }}
              onMouseLeave={() => setHoverGlow(null)}
            >
              {splitMode ? (
                <>
                  {/* Base Right Plate */}
                  <SafeImage
                    src={comparePlate.image}
                    alt={comparePlate.title}
                    className="w-full h-full object-cover contrast-[1.06] saturate-[1.08]"
                  />
                  {/* Clipped Left Plate */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
                  >
                    <SafeImage
                      src={activePlate.image}
                      alt={activePlate.title}
                      className="w-full h-full object-cover contrast-[1.06] saturate-[1.08]"
                    />
                  </div>
                  {/* Draggable Golden Split Divider */}
                  <div
                    className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-[#D5B77A] shadow-[0_0_20px_rgba(213,183,122,0.8)]"
                    style={{ left: `${splitPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#111515] border-2 border-[#D5B77A] flex items-center justify-center text-[#D5B77A] text-xs font-semibold">
                      ⇄
                    </div>
                  </div>
                  {/* Interactive Range Control Overlay */}
                  <input
                    type="range"
                    min={8}
                    max={92}
                    value={splitPos}
                    onChange={(e) => setSplitPos(Number(e.target.value))}
                    aria-label="Drag split-lens world comparison slider"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />
                  {/* Left / Right Plate Labels */}
                  <div className="pointer-events-none absolute top-4 left-4 z-10 px-3 py-1.5 rounded-md bg-[#111515]/85 border border-[#D5B77A]/40 text-[11px] text-[#D5B77A]">
                    {activePlate.worldLabel} · {activePlate.title}
                  </div>
                  <div className="pointer-events-none absolute top-4 right-4 z-10 px-3 py-1.5 rounded-md bg-[#111515]/85 border border-white/25 text-[11px] text-[#F4EFE5]">
                    {comparePlate.worldLabel} · {comparePlate.title}
                  </div>
                </>
              ) : (
                <>
                  <SafeImage
                    src={activePlate.image}
                    alt={activePlate.title}
                    className="w-full h-full object-cover contrast-[1.06] saturate-[1.08] transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {ambientAura && (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-300"
                        style={{
                          background: hoverGlow
                            ? `radial-gradient(360px circle at ${hoverGlow.x}% ${hoverGlow.y}%, rgba(213,183,122,0.22), transparent 68%)`
                            : 'linear-gradient(125deg, transparent 35%, rgba(213,183,122,0.14) 50%, transparent 68%)',
                        }}
                      />
                    </>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#111515]/90 via-[#111515]/35 to-transparent" />
                  <button
                    type="button"
                    onClick={() => setLightboxId(activePlate.id)}
                    className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111515]/85 border border-white/20 text-xs text-[#F4EFE5] hover:border-[#D5B77A] hover:text-[#D5B77A] transition-colors cursor-pointer"
                    aria-label="Inspect visualisation fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Inspect Fullscreen</span>
                  </button>

                  <div className="absolute bottom-5 left-6 right-6">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#D5B77A]">
                      <span>{activePlate.worldLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#F4EFE5]/80">{activePlate.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#F4EFE5]/65">Conceptual Visualisation</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-2xl sm:text-3xl text-[#F4EFE5]">
                      {activePlate.title}
                    </h3>
                  </div>
                </>
              )}
            </div>

            {splitMode && (
              <div className="px-6 py-3.5 bg-[#151B1A] border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#D5B77A] uppercase tracking-[0.12em]">Left:</span>
                  <select
                    value={activeId}
                    onChange={(e) => setActiveId(e.target.value)}
                    aria-label="Select left split comparison world"
                    className="bg-[#111515] border border-white/15 rounded px-2.5 py-1 text-[#F4EFE5]"
                  >
                    {VISUAL_PLATES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.worldLabel})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D5B77A] uppercase tracking-[0.12em]">Right:</span>
                  <select
                    value={compareId}
                    onChange={(e) => setCompareId(e.target.value)}
                    aria-label="Select right split comparison world"
                    className="bg-[#111515] border border-white/15 rounded px-2.5 py-1 text-[#F4EFE5]"
                  >
                    {VISUAL_PLATES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.worldLabel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-t border-white/10">
              <div className="space-y-1.5 text-xs">
                <p className="text-[#F4EFE5]/85">
                  <span className="text-[#D5B77A] uppercase tracking-[0.12em]">Space: </span>
                  {activePlate.spatialFocus}
                </p>
                <p className="text-[#F4EFE5]/75">
                  <span className="text-[#D5B77A] uppercase tracking-[0.12em]">Surfaces: </span>
                  {activePlate.materialNote}
                </p>
                <p className="text-[#F4EFE5]/65">
                  <span className="text-[#D5B77A] uppercase tracking-[0.12em]">Lighting: </span>
                  {activePlate.lightingNote}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onExploreWorld(activePlate.worldId)}
                  className="px-4 py-2.5 rounded-md border border-white/20 text-xs uppercase tracking-[0.14em] text-[#F4EFE5] hover:border-[#D5B77A] hover:text-[#D5B77A] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Open World Guide
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onCreateSimilar(activePlate.worldLabel.replace(' World', ''))
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#e5ca93] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create in AI Designer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive 3D Material & Luminaire Stage synced to Selected Plate */}
          <div className="lg:col-span-5 rounded-2xl border border-[#D5B77A]/30 bg-[#111515] p-5 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs text-[#D5B77A]">
                <Layers className="w-4 h-4" />
                <span className="uppercase tracking-[0.16em]">
                  Live 3D Material &amp; Light Rig
                </span>
              </div>
              <span className="text-[11px] text-[#F4EFE5]/60">
                Drag to orbit · Scroll to zoom
              </span>
            </div>

            <div className="my-4 h-[330px] sm:h-[370px] w-full">
              <ThreeWorldViewer
                title={`${activeWorld.name} · ${activePlate.title}`}
                bgHex={activeWorld.threeConfig.bgHex}
                slabHex={activeWorld.threeConfig.slabHex}
                accentHex={activeWorld.threeConfig.accentHex}
                roughness={activeWorld.threeConfig.roughness}
                metalness={activeWorld.threeConfig.metalness}
                pattern={activeWorld.threeConfig.pattern}
                kelvinColorHex={activeKelvin.hex}
                fallbackImage={activePlate.image}
              />
            </div>

            {/* Live Kelvin Preset Strip for 3D Rig */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#F4EFE5]/65">
                <Sun className="w-3.5 h-3.5 text-[#D5B77A]" />
                3D Light Calibration
              </span>
              <div className="flex flex-wrap gap-1.5">
                {KELVIN_MOODS.map((mood, idx) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setKelvinIdx(idx)}
                    className={`px-2.5 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
                      kelvinIdx === idx
                        ? 'bg-[#102B28] border-[#D5B77A] text-[#D5B77A]'
                        : 'border-white/15 text-[#F4EFE5]/70 hover:text-[#F4EFE5]'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rich Multi-Plate Visualisation Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPlates.map((plate) => {
            const isSelected = plate.id === activePlate.id;
            return (
              <article
                key={plate.id}
                onClick={() => setActiveId(plate.id)}
                className={`group rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer bg-[#111515] flex flex-col justify-between hover:-translate-y-1 ${
                  isSelected
                    ? 'border-[#D5B77A] ring-1 ring-[#D5B77A]/60 shadow-[0_12px_32px_rgba(213,183,122,0.14)]'
                    : 'border-white/12 hover:border-[#D5B77A]/55'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SafeImage
                    src={plate.image}
                    alt={plate.title}
                    className="w-full h-full object-cover contrast-[1.06] saturate-[1.08] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#111515]/85 via-[#111515]/25 to-transparent" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(plate.id);
                      setLightboxId(plate.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-[#111515]/85 border border-white/20 text-[#F4EFE5]/90 opacity-85 group-hover:opacity-100 hover:text-[#D5B77A] hover:border-[#D5B77A] transition-all cursor-pointer"
                    aria-label={`Zoom ${plate.title}`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-2.5 left-3 right-3 text-[11px] text-[#D5B77A]">
                    <span>{plate.worldLabel}</span>
                    <span className="text-[#F4EFE5]/70"> · {plate.category}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-display text-lg text-[#F4EFE5] group-hover:text-[#D5B77A] transition-colors leading-snug">
                    {plate.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#F4EFE5]/65 line-clamp-1">
                    {plate.materialNote}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxPlate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/92"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPlate.title}
          onClick={() => setLightboxId(null)}
        >
          <div
            className="max-w-5xl w-full rounded-2xl overflow-hidden border border-[#D5B77A]/35 bg-[#111515]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-black">
              <SafeImage
                src={lightboxPlate.image}
                alt={lightboxPlate.title}
                className="w-full h-full object-cover contrast-[1.05] saturate-[1.06]"
              />
              <button
                type="button"
                onClick={() => setLightboxId(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[#111515]/90 border border-white/20 text-[#F4EFE5] hover:text-[#D5B77A] cursor-pointer"
                aria-label="Close visualisation lightbox"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#111515]/85 border border-white/20 text-[#F4EFE5] hover:text-[#D5B77A] cursor-pointer"
                aria-label="Previous visualisation"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => stepLightbox(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#111515]/85 border border-white/20 text-[#F4EFE5] hover:text-[#D5B77A] cursor-pointer"
                aria-label="Next visualisation"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#D5B77A]">
                  {lightboxPlate.worldLabel} · {lightboxPlate.category} · Conceptual Visualisation
                </p>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl text-[#F4EFE5]">
                  {lightboxPlate.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#F4EFE5]/70">
                  {lightboxPlate.materialNote} · {lightboxPlate.lightingNote}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const id = lightboxPlate.worldId;
                    setLightboxId(null);
                    onExploreWorld(id);
                  }}
                  className="px-4 py-2.5 rounded-md border border-white/20 text-xs uppercase tracking-[0.14em] text-[#F4EFE5] hover:border-[#D5B77A] cursor-pointer"
                >
                  View World Guide
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const name = lightboxPlate.worldLabel.replace(' World', '');
                    setLightboxId(null);
                    onCreateSimilar(name);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#e5ca93] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Similar in AI Designer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

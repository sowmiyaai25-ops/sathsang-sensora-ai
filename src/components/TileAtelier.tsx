import React, { useMemo, useState } from 'react';
import { Bookmark, Check, Heart, Layers, Search, X } from 'lucide-react';
import { TILE_PRODUCTS } from '../data/sensoraData';
import { TileCategory, TileFinish, TileProduct } from '../types/sensora';
import { AITileMatcher } from './AITileMatcher';
import { SafeImage } from './SafeImage';

interface TileAtelierProps {
  wishlistIds: string[];
  enquiryIds: string[];
  onToggleWishlist: (id: string) => void;
  onAddToEnquiry: (tile: TileProduct) => void;
  onRequestSample: (tile: TileProduct) => void;
  onContactSales: () => void;
}

const CATEGORIES: ('All' | TileCategory)[] = [
  'All',
  '3D Sculptural',
  'Metallic',
  'Nature-Inspired',
  'Geometric',
  'Artistic',
  'Stone-Effect',
  'Heritage-Pattern',
  'Custom Surfaces',
];

const FINISHES: ('All' | TileFinish)[] = ['All', 'Matte', 'Glossy', 'Textured', 'Metallic'];

export const TileAtelier: React.FC<TileAtelierProps> = ({
  wishlistIds,
  enquiryIds,
  onToggleWishlist,
  onAddToEnquiry,
  onRequestSample,
  onContactSales,
}) => {
  const [activeTab, setActiveTab] = useState<'atelier' | 'matcher'>('atelier');
  const [category, setCategory] = useState<'All' | TileCategory>('All');
  const [finish, setFinish] = useState<'All' | TileFinish>('All');
  const [maxPrice, setMaxPrice] = useState<number>(900);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTile, setSelectedTile] = useState<TileProduct | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filteredTiles = useMemo(() => {
    return TILE_PRODUCTS.filter((t) => {
      if (category !== 'All' && t.category !== category) return false;
      if (finish !== 'All' && t.finish !== finish) return false;
      if (t.priceInrPerSqFt > maxPrice) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${t.name} ${t.code} ${t.material} ${t.colour} ${t.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [category, finish, maxPrice, searchQuery]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const comparedTiles = TILE_PRODUCTS.filter((t) => compareIds.includes(t.id));

  return (
    <section id="tile-atelier" className="py-20 lg:py-28 bg-[#111515] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Atelier Hero Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-white/10">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              Sensora Surfaces · Architectural Material Library
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              Tile Atelier &amp; AI Surface Matcher
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#F4EFE5]/75 max-w-2xl leading-relaxed">
              Explore 14 sculpted, metallic, botanical, and stone-effect architectural tiles. All
              product specifications and per-sq.ft INR rates are presented as illustrative demo
              data for conceptual planning.
            </p>

            {/* Switch between Showroom Catalogue & AI Tile Matcher */}
            <div className="mt-6 inline-flex p-1 rounded-xl bg-[#161D1C] border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('atelier')}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  activeTab === 'atelier'
                    ? 'bg-[#D5B77A] text-[#111515] font-semibold'
                    : 'text-[#F4EFE5]/75 hover:text-[#F4EFE5]'
                }`}
              >
                Tile Atelier Showroom
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('matcher')}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  activeTab === 'matcher'
                    ? 'bg-[#D5B77A] text-[#111515] font-semibold'
                    : 'text-[#F4EFE5]/75 hover:text-[#F4EFE5]'
                }`}
              >
                AI Tile Matcher
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 aspect-[16/9] rounded-xl overflow-hidden border border-white/10">
            <SafeImage
              src="/assets/curated/tile_atelier_wall.jpg"
              alt="Sensora Tile Atelier architectural showroom gallery wall"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {activeTab === 'matcher' ? (
          <div className="mt-10">
            <AITileMatcher
              onRequestSample={onRequestSample}
              onAddToEnquiry={onAddToEnquiry}
              enquiryIds={enquiryIds}
            />
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {/* Filter Toolbar */}
            <div className="p-5 rounded-xl bg-[#151B1A] border border-white/10 space-y-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      category === cat
                        ? 'bg-[#102B28] text-[#D5B77A] border border-[#D5B77A]/50'
                        : 'bg-[#111515] text-[#F4EFE5]/70 border border-white/10 hover:text-[#F4EFE5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-white/10 items-center">
                <div className="md:col-span-4 relative">
                  <Search className="w-4 h-4 text-[#F4EFE5]/45 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tile name, code, colour, or material..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111515] border border-white/15 text-xs text-[#F4EFE5] placeholder:text-[#F4EFE5]/40 focus:outline-none focus:border-[#D5B77A]"
                  />
                </div>

                <div className="md:col-span-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#F4EFE5]/55 mr-1">
                    Finish:
                  </span>
                  {FINISHES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFinish(f)}
                      className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                        finish === f
                          ? 'bg-[#D5B77A] text-[#111515] border-[#D5B77A] font-medium'
                          : 'bg-[#111515] text-[#F4EFE5]/75 border-white/10'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="md:col-span-4 flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[#F4EFE5]/60 whitespace-nowrap">
                    Max ₹{maxPrice}/sq.ft
                  </span>
                  <input
                    type="range"
                    min={300}
                    max={900}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#D5B77A]"
                  />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredTiles.length === 0 ? (
              <div className="p-12 rounded-2xl border border-white/10 bg-[#151B1A] text-center">
                <p className="font-display text-2xl text-[#F4EFE5]">
                  No Surfaces Match Current Filters
                </p>
                <p className="mt-2 text-xs text-[#F4EFE5]/65">
                  Try widening your finish, category, or indicative INR price range.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategory('All');
                    setFinish('All');
                    setMaxPrice(900);
                    setSearchQuery('');
                  }}
                  className="mt-4 px-5 py-2 rounded-md border border-[#D5B77A]/50 text-xs text-[#D5B77A] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredTiles.map((tile) => {
                  const wishlisted = wishlistIds.includes(tile.id);
                  const inEnquiry = enquiryIds.includes(tile.id);
                  const comparing = compareIds.includes(tile.id);

                  return (
                    <article
                      key={tile.id}
                      className="group rounded-xl overflow-hidden border border-white/10 bg-[#151A1A] flex flex-col justify-between transition-all hover:border-[#D5B77A]/45"
                    >
                      <div>
                        <div
                          onClick={() => setSelectedTile(tile)}
                          className="aspect-[4/3] overflow-hidden relative cursor-pointer"
                        >
                          <SafeImage
                            src={tile.image}
                            alt={tile.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151A1A]/75 via-transparent to-transparent" />
                          <span
                            className="absolute bottom-3 left-3 w-6 h-6 rounded border border-white/30"
                            style={{ backgroundColor: tile.colourHex }}
                            title={tile.colour}
                          />
                        </div>

                        <div className="p-5">
                          <div className="flex items-center justify-between text-xs text-[#F4EFE5]/60">
                            <span className="font-mono-tabular text-[#D5B77A]">{tile.code}</span>
                            <span>
                              {tile.category} · {tile.finish}
                            </span>
                          </div>
                          <h3
                            onClick={() => setSelectedTile(tile)}
                            className="mt-2 font-display text-xl text-[#F4EFE5] hover:text-[#D5B77A] transition-colors cursor-pointer"
                          >
                            {tile.name}
                          </h3>
                          <p className="mt-1.5 text-xs text-[#F4EFE5]/70 line-clamp-2">
                            {tile.description}
                          </p>
                          <div className="mt-3 flex items-baseline justify-between text-xs">
                            <span className="text-[#F4EFE5]/60">{tile.material}</span>
                            <span className="font-mono-tabular text-sm text-[#D5B77A]">
                              ₹{tile.priceInrPerSqFt}/sq.ft
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleWishlist(tile.id)}
                          className={`p-2 rounded-md border transition-colors cursor-pointer ${
                            wishlisted
                              ? 'border-[#D5B77A] bg-[#102B28] text-[#D5B77A]'
                              : 'border-white/15 text-[#F4EFE5]/65 hover:text-[#F4EFE5]'
                          }`}
                          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                          title="Save to Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCompare(tile.id)}
                          className={`p-2 rounded-md border transition-colors cursor-pointer ${
                            comparing
                              ? 'border-[#D5B77A] bg-[#102B28] text-[#D5B77A]'
                              : 'border-white/15 text-[#F4EFE5]/65 hover:text-[#F4EFE5]'
                          }`}
                          aria-label="Compare tile"
                          title="Compare Tile"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRequestSample(tile)}
                          className="px-3 py-2 rounded-md border border-white/15 text-[11px] text-[#F4EFE5]/85 hover:border-[#D5B77A] cursor-pointer"
                        >
                          Sample
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddToEnquiry(tile)}
                          className={`ml-auto px-3 py-2 rounded-md text-[11px] font-medium cursor-pointer ${
                            inEnquiry
                              ? 'bg-[#102B28] border border-[#D5B77A]/50 text-[#D5B77A]'
                              : 'bg-[#D5B77A] text-[#111515] hover:bg-[#e5ca93]'
                          }`}
                        >
                          {inEnquiry ? (
                            <>
                              <Check className="w-3 h-3 inline mr-1" />
                              In Enquiry
                            </>
                          ) : (
                            'Add Enquiry'
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Comparison Bar */}
            {comparedTiles.length > 0 && (
              <div className="p-6 rounded-xl bg-[#151B1A] border border-[#D5B77A]/40">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#D5B77A]">
                      Surface Comparison Matrix ({comparedTiles.length}/3)
                    </p>
                    <p className="text-xs text-[#F4EFE5]/60">
                      Illustrative specifications side-by-side
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onContactSales}
                      className="px-4 py-2 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold cursor-pointer"
                    >
                      Contact Sales Team
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompareIds([])}
                      className="px-3 py-2 rounded-md border border-white/15 text-xs text-[#F4EFE5]/75 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[#F4EFE5]/55">
                        <th className="py-2 pr-4">Product</th>
                        <th className="py-2 pr-4">Category</th>
                        <th className="py-2 pr-4">Finish</th>
                        <th className="py-2 pr-4">Colour</th>
                        <th className="py-2 pr-4">Size (mm)</th>
                        <th className="py-2">Indicative Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparedTiles.map((ct) => (
                        <tr key={ct.id} className="border-b border-white/5 text-[#F4EFE5]/85">
                          <td className="py-2.5 pr-4 font-medium">
                            {ct.name}{' '}
                            <span className="font-mono-tabular text-[#D5B77A] ml-1">{ct.code}</span>
                          </td>
                          <td className="py-2.5 pr-4">{ct.category}</td>
                          <td className="py-2.5 pr-4">{ct.finish}</td>
                          <td className="py-2.5 pr-4">{ct.colour}</td>
                          <td className="py-2.5 pr-4 font-mono-tabular">{ct.sizeMm}</td>
                          <td className="py-2.5 font-mono-tabular text-[#D5B77A]">
                            ₹{ct.priceInrPerSqFt}/sq.ft
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Atelier Footer Sales CTA */}
            <div className="p-6 rounded-xl border border-white/10 bg-[#0E1615] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#F4EFE5]">
                  Looking for custom parametric surface dimensions or commercial sample boxes?
                </p>
                <p className="text-xs text-[#F4EFE5]/60 mt-0.5">
                  Indicative demo pricing shown. Speak with our architectural surfaces team for
                  project specifications.
                </p>
              </div>
              <button
                type="button"
                onClick={onContactSales}
                className="px-5 py-2.5 rounded-md border border-[#D5B77A]/50 bg-[#102B28] text-xs uppercase tracking-[0.14em] text-[#D5B77A] hover:bg-[#153a36] cursor-pointer shrink-0"
              >
                Contact Sales Team
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedTile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label={selectedTile.name}
        >
          <div className="max-w-3xl w-full rounded-2xl overflow-hidden border border-[#D5B77A]/35 bg-[#111515] grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-[4/3] md:aspect-auto relative">
              <SafeImage
                src={selectedTile.image}
                alt={selectedTile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-tabular text-xs text-[#D5B77A]">
                    {selectedTile.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedTile(null)}
                    className="p-1.5 rounded-md border border-white/15 text-[#F4EFE5]/70 hover:text-[#F4EFE5] cursor-pointer"
                    aria-label="Close product detail"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl text-[#F4EFE5]">
                  {selectedTile.name}
                </h3>
                <p className="mt-2 text-xs text-[#F4EFE5]/75 leading-relaxed">
                  {selectedTile.description}
                </p>

                <dl className="mt-5 space-y-2 text-xs border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <dt className="text-[#F4EFE5]/55">Category</dt>
                    <dd className="text-[#F4EFE5]">{selectedTile.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#F4EFE5]/55">Finish</dt>
                    <dd className="text-[#F4EFE5]">{selectedTile.finish}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#F4EFE5]/55">Material</dt>
                    <dd className="text-[#F4EFE5]">{selectedTile.material}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#F4EFE5]/55">Colour</dt>
                    <dd className="text-[#F4EFE5] flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-sm border border-white/25"
                        style={{ backgroundColor: selectedTile.colourHex }}
                      />
                      {selectedTile.colour}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#F4EFE5]/55">Dimensions</dt>
                    <dd className="font-mono-tabular text-[#F4EFE5]">{selectedTile.sizeMm} mm</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#F4EFE5]/55">Indicative Rate (Demo)</dt>
                    <dd className="font-mono-tabular text-[#D5B77A]">
                      ₹{selectedTile.priceInrPerSqFt} / sq.ft
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onRequestSample(selectedTile);
                    setSelectedTile(null);
                  }}
                  className="px-4 py-2.5 rounded-md border border-[#D5B77A]/50 text-xs text-[#D5B77A] hover:bg-[#102B28] cursor-pointer"
                >
                  Request Sample
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddToEnquiry(selectedTile);
                    setSelectedTile(null);
                  }}
                  className="px-4 py-2.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 inline mr-1.5" />
                  Add to Enquiry List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

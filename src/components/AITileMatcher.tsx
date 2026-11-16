import React, { useMemo, useState } from 'react';
import { Check, Layers, Loader2, Sparkles, Trash2, Upload } from 'lucide-react';
import { TILE_PRODUCTS } from '../data/sensoraData';
import { TileFinish, TileProduct } from '../types/sensora';
import { SafeImage } from './SafeImage';

interface AITileMatcherProps {
  onRequestSample: (tile: TileProduct) => void;
  onAddToEnquiry: (tile: TileProduct) => void;
  enquiryIds: string[];
}

const FINISHES: TileFinish[] = ['Matte', 'Glossy', 'Textured', 'Metallic'];
const COLOUR_FILTERS = ['Emerald', 'Gold', 'Ivory', 'Charcoal', 'Turquoise', 'Sand', 'Claret'];

export const AITileMatcher: React.FC<AITileMatcherProps> = ({
  onRequestSample,
  onAddToEnquiry,
  enquiryIds,
}) => {
  const [surface, setSurface] = useState<'Wall' | 'Floor'>('Wall');
  const [colour, setColour] = useState('Emerald');
  const [finish, setFinish] = useState<TileFinish>('Matte');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imageMimeType, setImageMimeType] = useState<string | undefined>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [matching, setMatching] = useState(false);
  const [rationale, setRationale] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<'gemini-ai' | 'demo-preset' | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const handlePhoto = (file?: File) => {
    setUploadError(null);
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Unsupported image format. Please use JPG, PNG, or WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5 MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || '');
      setPreviewUrl(url);
      setImageBase64(url.split(',')[1]);
      setImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const matchedTiles = useMemo(() => {
    return TILE_PRODUCTS.map((tile) => {
      let score = 0;
      if (tile.application.includes(surface)) score += 4;
      if (tile.finish === finish) score += 3;
      if (
        tile.colour.toLowerCase().includes(colour.toLowerCase()) ||
        tile.description.toLowerCase().includes(colour.toLowerCase())
      ) {
        score += 3;
      }
      return { tile, score };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.tile);
  }, [surface, colour, finish]);

  const handleRunMatcher = async () => {
    setMatching(true);
    try {
      const res = await fetch('/api/tile-matcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surfaceType: surface,
          colourPreference: colour,
          finish,
          imageBase64,
          imageMimeType,
        }),
      });
      const data = await res.json();
      setRationale(data.rationale);
      setAiSource(data.source);
    } catch {
      setRationale(
        `Matched illustrative ${finish.toLowerCase()} architectural tiles calibrated for ${surface.toLowerCase()} installation.`
      );
      setAiSource('demo-preset');
    } finally {
      setMatching(false);
    }
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const comparedTiles = TILE_PRODUCTS.filter((t) => compareIds.includes(t.id));

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-[#D5B77A]/25 bg-[#0E1615] space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#D5B77A]">
            Sensora AI Tile Matcher
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl text-[#F4EFE5]">
            Match Architectural Surfaces to Your Interior
          </h3>
        </div>
        <span className="text-xs text-[#F4EFE5]/55">
          All tile specs &amp; INR prices are illustrative demo data
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <span className="block text-xs uppercase tracking-[0.15em] text-[#D5B77A] mb-2">
              Interior Photograph (Optional)
            </span>
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-white/20 bg-[#111515] hover:border-[#D5B77A]/60 cursor-pointer text-center">
                <Upload className="w-5 h-5 text-[#D5B77A] mb-1.5" />
                <span className="text-xs text-[#F4EFE5]">Upload room wall or floor photo</span>
                <span className="text-[11px] text-[#F4EFE5]/45 mt-0.5">Max 5 MB · JPG/PNG</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handlePhoto(e.target.files?.[0])}
                  className="sr-only"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-[#D5B77A]/40">
                <img src={previewUrl} alt="Tile match interior" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setImageBase64(undefined);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded bg-[#111515]/85 text-red-300 hover:text-red-200 cursor-pointer"
                  aria-label="Remove uploaded photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {uploadError && <p className="mt-1.5 text-xs text-red-300">{uploadError}</p>}
          </div>

          <div>
            <span className="block text-xs uppercase tracking-[0.15em] text-[#D5B77A] mb-2">
              Application Surface
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Wall', 'Floor'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSurface(s)}
                  className={`py-2.5 rounded-lg text-xs uppercase tracking-[0.14em] border transition-colors cursor-pointer ${
                    surface === s
                      ? 'bg-[#102B28] border-[#D5B77A] text-[#D5B77A]'
                      : 'bg-[#111515] border-white/10 text-[#F4EFE5]/70'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-[0.15em] text-[#D5B77A] mb-2">
              Finish
            </span>
            <div className="grid grid-cols-2 gap-2">
              {FINISHES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFinish(f)}
                  className={`py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                    finish === f
                      ? 'bg-[#102B28] border-[#D5B77A] text-[#D5B77A]'
                      : 'bg-[#111515] border-white/10 text-[#F4EFE5]/70'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="tile-matcher-colour"
              className="block text-xs uppercase tracking-[0.15em] text-[#D5B77A] mb-2"
            >
              Colour Tone Preference
            </label>
            <select
              id="tile-matcher-colour"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5]"
            >
              {COLOUR_FILTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleRunMatcher}
            disabled={matching}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#e5ca93] cursor-pointer disabled:opacity-60"
          >
            {matching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analysing Surface Match...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Match Recommended Tiles</span>
              </>
            )}
          </button>
        </div>

        {/* Matched Suggestions */}
        <div className="lg:col-span-8 space-y-5">
          {rationale && (
            <div className="p-4 rounded-xl bg-[#111515] border border-[#D5B77A]/35 text-xs text-[#F4EFE5]/85 leading-relaxed">
              <span className="text-[#D5B77A] uppercase tracking-[0.14em] mr-2">
                {aiSource === 'gemini-ai' ? 'AI Material Note:' : 'Demo Match Note:'}
              </span>
              {rationale}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {matchedTiles.map((tile) => {
              const inCompare = compareIds.includes(tile.id);
              const inEnquiry = enquiryIds.includes(tile.id);
              return (
                <div
                  key={tile.id}
                  className="rounded-xl overflow-hidden border border-white/10 bg-[#111515] flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <SafeImage
                        src={tile.image}
                        alt={tile.name}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute top-3 right-3 w-6 h-6 rounded-full border border-white/40"
                        style={{ backgroundColor: tile.colourHex }}
                        title={tile.colour}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-[11px] text-[#F4EFE5]/60">
                        <span className="font-mono-tabular text-[#D5B77A]">{tile.code}</span>
                        <span>
                          {tile.finish} · {tile.application.join('/')}
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-xl text-[#F4EFE5]">{tile.name}</h4>
                      <p className="mt-1 text-xs text-[#F4EFE5]/65">
                        {tile.material} · {tile.sizeMm} mm
                      </p>
                      <p className="mt-2 font-mono-tabular text-sm text-[#D5B77A]">
                        ₹{tile.priceInrPerSqFt} / sq.ft (Illustrative)
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCompare(tile.id)}
                      className={`px-2.5 py-1.5 rounded text-[11px] border cursor-pointer ${
                        inCompare
                          ? 'bg-[#102B28] border-[#D5B77A] text-[#D5B77A]'
                          : 'border-white/15 text-[#F4EFE5]/75 hover:border-white/30'
                      }`}
                    >
                      <Layers className="w-3 h-3 inline mr-1" />
                      {inCompare ? 'Comparing' : 'Compare'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestSample(tile)}
                      className="px-2.5 py-1.5 rounded text-[11px] border border-white/15 text-[#F4EFE5]/85 hover:border-[#D5B77A] cursor-pointer"
                    >
                      Request Sample
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToEnquiry(tile)}
                      className={`px-2.5 py-1.5 rounded text-[11px] cursor-pointer ml-auto ${
                        inEnquiry
                          ? 'bg-[#D5B77A]/20 text-[#D5B77A] border border-[#D5B77A]/40'
                          : 'bg-[#D5B77A] text-[#111515] font-medium'
                      }`}
                    >
                      {inEnquiry ? (
                        <>
                          <Check className="w-3 h-3 inline mr-1" />
                          Added
                        </>
                      ) : (
                        'Add Enquiry'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {comparedTiles.length > 0 && (
            <div className="p-5 rounded-xl bg-[#111515] border border-[#D5B77A]/35">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[#D5B77A]">
                  Side-by-Side Comparison ({comparedTiles.length}/3)
                </p>
                <button
                  type="button"
                  onClick={() => setCompareIds([])}
                  className="text-xs text-[#F4EFE5]/60 hover:text-[#F4EFE5] cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[#F4EFE5]/55">
                      <th className="py-2 pr-4">Tile</th>
                      <th className="py-2 pr-4">Finish</th>
                      <th className="py-2 pr-4">Material</th>
                      <th className="py-2 pr-4">Dimensions</th>
                      <th className="py-2">Illustrative Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparedTiles.map((ct) => (
                      <tr key={ct.id} className="border-b border-white/5 text-[#F4EFE5]/85">
                        <td className="py-2.5 pr-4 font-medium">
                          {ct.name}{' '}
                          <span className="font-mono-tabular text-[#D5B77A] ml-1">{ct.code}</span>
                        </td>
                        <td className="py-2.5 pr-4">{ct.finish}</td>
                        <td className="py-2.5 pr-4">{ct.material}</td>
                        <td className="py-2.5 pr-4 font-mono-tabular">{ct.sizeMm} mm</td>
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
        </div>
      </div>
    </div>
  );
};

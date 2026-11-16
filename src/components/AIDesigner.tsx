import React, { useEffect, useRef, useState } from 'react';
import {
  BookmarkCheck,
  Check,
  Download,
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { AIDesignerResult } from '../types/sensora';
import { SafeImage } from './SafeImage';

interface AIDesignerProps {
  preselectedWorld?: string;
  onRequestConsultation: (prefill: { world: string; spaceType: string; budget: string; notes: string }) => void;
}

const ROOM_TYPES = [
  'Living room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Office',
  'Restaurant',
  'Café',
  'Hotel',
  'Retail showroom',
];

const DESIGN_WORLDS = [
  'Aqua',
  'Forest',
  'Cosmic',
  'Royal',
  'Desert',
  'Modern luxury',
  'Minimalist',
];

const COLOUR_OPTIONS = [
  { name: 'Deep Emerald', hex: '#102B28' },
  { name: 'Champagne Gold', hex: '#D5B77A' },
  { name: 'Warm Ivory', hex: '#F4EFE5' },
  { name: 'Midnight Charcoal', hex: '#1D2222' },
  { name: 'Abyssal Turquoise', hex: '#125E6D' },
  { name: 'Terracotta Sand', hex: '#A77052' },
  { name: 'Royal Claret', hex: '#5B232B' },
];

const FINISH_OPTIONS = [
  'Sculptural Matte 3D Tile',
  'Bookmatched Glossy Stone',
  'Tactile Sandstone & Clay',
  'Brushed Metallic Ribbing',
  'Heritage Terrazzo Inlay',
];

const LIGHTING_OPTIONS = [
  '2700K Warm Ambient & Wall Grazing',
  '3000K Layered Hospitality Pendants',
  '4000K Crisp Architectural Daylight',
  'Tunable Circadian & Kinetic Coves',
];

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export const AIDesigner: React.FC<AIDesignerProps> = ({
  preselectedWorld,
  onRequestConsultation,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [roomType, setRoomType] = useState('Living room');
  const [designWorld, setDesignWorld] = useState('Forest');
  const [preferredColours, setPreferredColours] = useState<string[]>([
    'Deep Emerald',
    'Champagne Gold',
  ]);
  const [surfaceFinish, setSurfaceFinish] = useState(FINISH_OPTIONS[0]);
  const [lightingPreference, setLightingPreference] = useState(LIGHTING_OPTIONS[0]);
  const [budgetInr, setBudgetInr] = useState<number>(650000);
  const [notes, setNotes] = useState('');

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageMimeType, setImageMimeType] = useState<string | undefined>(undefined);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIDesignerResult | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [savedConcepts, setSavedConcepts] = useState<AIDesignerResult[]>([]);

  useEffect(() => {
    if (preselectedWorld && DESIGN_WORLDS.includes(preselectedWorld)) {
      setDesignWorld(preselectedWorld);
    }
  }, [preselectedWorld]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sensora_saved_concepts');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedConcepts(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleColour = (name: string) => {
    setPreferredColours((prev) =>
      prev.includes(name)
        ? prev.length > 1
          ? prev.filter((c) => c !== name)
          : prev
        : [...prev.slice(-3), name]
    );
  };

  const handleFileChange = (file: File | undefined) => {
    setUploadError(null);
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Please upload a JPG, PNG, or WebP photograph of your room.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError('Image exceeds the 5 MB upload limit. Please select a smaller photograph.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setUploadedPreviewUrl(dataUrl);
      setUploadedFileName(file.name);
      setImageBase64(dataUrl.split(',')[1]);
      setImageMimeType(file.type);
    };
    reader.onerror = () => {
      setUploadError('Unable to read the selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const clearUpload = () => {
    setUploadedFileName(null);
    setUploadedPreviewUrl(null);
    setImageBase64(undefined);
    setImageMimeType(undefined);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSavedNotice(false);

    if (!Number.isFinite(budgetInr) || budgetInr < 50000) {
      setSubmitError('Please enter an approximate project budget of at least ₹50,000.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai-designer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType,
          designWorld,
          preferredColours,
          surfaceFinish,
          lightingPreference,
          budgetInr,
          notes,
          imageBase64,
          imageMimeType,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to generate design brief.');
      }
      const data: AIDesignerResult = await res.json();
      setResult(data);
    } catch {
      setSubmitError('Unable to reach the Sensora AI Designer service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConcept = () => {
    if (!result) return;
    try {
      const next = [result, ...savedConcepts.filter((c) => c.conceptTitle !== result.conceptTitle)].slice(0, 6);
      setSavedConcepts(next);
      localStorage.setItem('sensora_saved_concepts', JSON.stringify(next));
      setSavedNotice(true);
    } catch {
      setSavedNotice(true);
    }
  };

  const handleDownloadBrief = () => {
    if (!result) return;
    const text = [
      'SATHSANG PRESENTS SENSORA AI — ARCHITECTURAL CONCEPT BRIEF',
      '============================================================',
      `Concept Title: ${result.conceptTitle}`,
      `Space Type: ${roomType} | Design World: ${designWorld}`,
      `Mode: ${result.aiActive ? 'SENSORA AI Studio (Gemini)' : 'Conceptual Demo Preset'}`,
      '',
      'DESIGN CONCEPT',
      result.designConcept,
      '',
      result.roomObservation ? `ROOM OBSERVATION\n${result.roomObservation}\n` : '',
      'COLOUR PALETTE',
      ...result.colourPalette.map((c) => `- ${c.name} (${c.hex}): ${c.role}`),
      '',
      'WALL & FLOOR MATERIALS',
      `- Walls: ${result.wallAndFloorMaterials.walls}`,
      `- Flooring: ${result.wallAndFloorMaterials.flooring}`,
      `- Architectural Accent: ${result.wallAndFloorMaterials.featureAccent}`,
      '',
      'RECOMMENDED SENSORA TILES (Illustrative Specs)',
      ...result.tileRecommendations.map(
        (t) => `- ${t.code} | ${t.name} (${t.placement}): ${t.reason}`
      ),
      '',
      'LIGHTING RECOMMENDATIONS',
      result.lightingRecommendations,
      '',
      'ARCHITECTURAL EXPLANATION',
      result.designExplanation,
      '',
      `ESTIMATED BUDGET RANGE: ${result.estimatedBudgetRange}`,
      '',
      'Note: Concept preview & illustrative demo material specifications by SATHSANG presents SENSORA AI.',
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.conceptTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brief.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="ai-designer" className="py-20 lg:py-28 bg-[#111515] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-white/10">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              Sensora AI Studio
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              SENSORA AI Designer
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#F4EFE5]/75 max-w-2xl leading-relaxed">
              Upload a photograph of your room, select an architectural world, calibrate surfaces,
              lighting, and INR budget—and receive a personalised material, lighting, and spatial
              concept brief.
            </p>
          </div>
          <div className="lg:col-span-5 aspect-[16/9] rounded-xl overflow-hidden border border-white/10">
            <SafeImage
              src="/assets/curated/ai_space_designer.jpg"
              alt="Sensora AI Designer interactive spatial preview studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Main Workspace: Configurator Left + Output Right */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column */}
          <form
            onSubmit={handleGenerate}
            className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#151B1A] space-y-6"
          >
            {/* 1. Room Photo Upload */}
            <div>
              <label className="block text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-2">
                01. Upload Room Photograph (Optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="sr-only"
                id="ai-designer-upload"
              />
              {!uploadedPreviewUrl ? (
                <label
                  htmlFor="ai-designer-upload"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileChange(e.dataTransfer.files?.[0]);
                  }}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-[#D5B77A]/35 bg-[#111515]/70 hover:border-[#D5B77A] transition-colors cursor-pointer text-center"
                >
                  <Upload className="w-6 h-6 text-[#D5B77A] mb-2" />
                  <span className="text-sm text-[#F4EFE5]">
                    Drop a room photo or click to browse
                  </span>
                  <span className="mt-1 text-xs text-[#F4EFE5]/50">
                    JPG, PNG, WebP · Maximum 5 MB
                  </span>
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-[#D5B77A]/40 bg-[#111515]">
                  <img
                    src={uploadedPreviewUrl}
                    alt="Uploaded room preview"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-3 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-[#F4EFE5]/80">{uploadedFileName}</span>
                    <button
                      type="button"
                      onClick={clearUpload}
                      className="inline-flex items-center gap-1 text-red-300 hover:text-red-200 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              )}
              {uploadError && (
                <p className="mt-2 text-xs text-red-300" role="alert">
                  {uploadError}
                </p>
              )}
            </div>

            {/* 2. Room Type & Design World */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="designer-room-type"
                  className="block text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-2"
                >
                  02. Room Type
                </label>
                <select
                  id="designer-room-type"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                >
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt} value={rt}>
                      {rt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="designer-world"
                  className="block text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-2"
                >
                  03. Design World
                </label>
                <select
                  id="designer-world"
                  value={designWorld}
                  onChange={(e) => setDesignWorld(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                >
                  {DESIGN_WORLDS.map((dw) => (
                    <option key={dw} value={dw}>
                      {dw}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Preferred Colours */}
            <div>
              <span className="block text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-2.5">
                04. Preferred Colours (Select up to 4)
              </span>
              <div className="flex flex-wrap gap-2">
                {COLOUR_OPTIONS.map((c) => {
                  const selected = preferredColours.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleColour(c.name)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#D5B77A] bg-[#102B28] text-[#F4EFE5]'
                          : 'border-white/10 bg-[#111515] text-[#F4EFE5]/70 hover:border-white/25'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-sm border border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Tile & Wall Finish + Lighting */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="designer-finish"
                  className="block text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-2"
                >
                  05. Tile &amp; Wall Finish
                </label>
                <select
                  id="designer-finish"
                  value={surfaceFinish}
                  onChange={(e) => setSurfaceFinish(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                >
                  {FINISH_OPTIONS.map((fo) => (
                    <option key={fo} value={fo}>
                      {fo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="designer-lighting"
                  className="block text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-2"
                >
                  06. Lighting Preference
                </label>
                <select
                  id="designer-lighting"
                  value={lightingPreference}
                  onChange={(e) => setLightingPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                >
                  {LIGHTING_OPTIONS.map((lo) => (
                    <option key={lo} value={lo}>
                      {lo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 7. Approximate Budget INR */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="designer-budget"
                  className="text-xs uppercase tracking-[0.16em] text-[#D5B77A]"
                >
                  07. Approximate Budget (INR)
                </label>
                <span className="font-mono-tabular text-sm text-[#F4EFE5]">
                  ₹{budgetInr.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                id="designer-budget"
                type="range"
                min={150000}
                max={5000000}
                step={50000}
                value={budgetInr}
                onChange={(e) => setBudgetInr(Number(e.target.value))}
                className="w-full accent-[#D5B77A]"
              />
              <div className="flex justify-between text-[11px] font-mono-tabular text-[#F4EFE5]/50 mt-1">
                <span>₹1,50,000</span>
                <span>₹25,00,000</span>
                <span>₹50,00,000+</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="designer-notes"
                className="block text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-2"
              >
                08. Spatial Notes (Optional)
              </label>
              <textarea
                id="designer-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ceiling height, natural daylight, acoustic needs, or seating capacity..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] placeholder:text-[#F4EFE5]/35 focus:outline-none focus:border-[#D5B77A]"
              />
            </div>

            {submitError && (
              <p className="text-xs text-red-300" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#e5ca93] transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Composing Spatial Brief...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate My Design</span>
                </>
              )}
            </button>
          </form>

          {/* Results Column */}
          <div className="lg:col-span-7">
            {!result && !loading && (
              <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#0E1615] flex flex-col justify-between min-h-[540px]">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#D5B77A]">
                    Architectural Brief Preview
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-[#F4EFE5]">
                    Your Personalised World Awaits
                  </h3>
                  <p className="mt-3 text-sm text-[#F4EFE5]/70 max-w-xl leading-relaxed">
                    Configure your room parameters on the left and click{' '}
                    <strong className="text-[#F4EFE5]">Generate My Design</strong> to receive a
                    complete spatial concept, curated tile specifications, lighting temperature
                    blueprint, and indicative INR estimate.
                  </p>
                </div>

                <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden border border-white/10">
                    <SafeImage
                      src="/assets/curated/ai_hologram_living.jpg"
                      alt="AI living room holographic spatial visualisation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[16/10] rounded-xl overflow-hidden border border-white/10">
                    <SafeImage
                      src="/assets/curated/cosmic_waterfall_lounge.jpg"
                      alt="Sensora conceptual luxury lounge visualisation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {savedConcepts.length > 0 && (
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-3">
                      Saved Concepts in This Browser
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {savedConcepts.map((sc) => (
                        <button
                          key={sc.conceptTitle}
                          type="button"
                          onClick={() => setResult(sc)}
                          className="px-3 py-1.5 rounded-md border border-white/15 bg-[#111515] text-xs text-[#F4EFE5]/85 hover:border-[#D5B77A] cursor-pointer"
                        >
                          {sc.conceptTitle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="p-12 rounded-2xl border border-white/10 bg-[#0E1615] min-h-[540px] flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 text-[#D5B77A] animate-spin mb-4" />
                <p className="font-display text-2xl text-[#F4EFE5]">
                  Synthesising {designWorld} Architecture for Your {roomType}
                </p>
                <p className="mt-2 text-xs text-[#F4EFE5]/60 max-w-md">
                  Aligning decorative tile surfaces, colour ratios, and lighting Kelvin geometry...
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="rounded-2xl border border-[#D5B77A]/35 bg-[#0E1615] overflow-hidden">
                {/* Visual Preview Banner */}
                <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10">
                  <div
                    className={`${
                      uploadedPreviewUrl ? 'md:col-span-7' : 'md:col-span-12'
                    } relative aspect-[16/9] overflow-hidden`}
                  >
                    <SafeImage
                      src={result.previewImage}
                      alt={result.conceptTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1615] via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-[#F4EFE5]/90 bg-[#111515]/85 px-3 py-1 rounded border border-white/15">
                        Concept Visualisation Preview · {designWorld}
                      </span>
                      <span className="text-[11px] text-[#D5B77A] bg-[#111515]/85 px-3 py-1 rounded border border-[#D5B77A]/30">
                        {result.aiActive
                          ? 'Brief Powered by SENSORA AI (Gemini)'
                          : 'Conceptual Demo Preset Mode'}
                      </span>
                    </div>
                  </div>
                  {uploadedPreviewUrl && (
                    <div className="md:col-span-5 relative aspect-[16/9] md:aspect-auto border-t md:border-t-0 md:border-l border-white/10">
                      <img
                        src={uploadedPreviewUrl}
                        alt="Your uploaded room"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-4 left-4 text-[11px] bg-[#111515]/85 text-[#F4EFE5]/85 px-2.5 py-1 rounded border border-white/15 inline-flex items-center gap-1.5">
                        <ImagePlus className="w-3 h-3 text-[#D5B77A]" />
                        Your Room Reference
                      </span>
                    </div>
                  )}
                </div>

                {/* Brief Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <p className="text-xs text-[#F4EFE5]/60">{result.previewDisclaimer}</p>
                    <h3 className="mt-2 font-display text-3xl text-[#F4EFE5]">
                      {result.conceptTitle}
                    </h3>
                    <p className="mt-2 text-sm text-[#F4EFE5]/80 leading-relaxed">
                      {result.designConcept}
                    </p>
                    {result.roomObservation && (
                      <p className="mt-3 text-xs text-[#D5B77A] bg-[#111515] p-3 rounded-lg border border-white/10">
                        Room Observation: {result.roomObservation}
                      </p>
                    )}
                  </div>

                  {/* Palette */}
                  <div className="pt-5 border-t border-white/10">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-3">
                      Suggested Colour Palette
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {result.colourPalette.map((cp) => (
                        <div
                          key={cp.name}
                          className="p-3 rounded-lg bg-[#111515] border border-white/10"
                        >
                          <div
                            className="w-full h-9 rounded mb-2 border border-white/10"
                            style={{ backgroundColor: cp.hex }}
                          />
                          <p className="text-xs font-medium text-[#F4EFE5]">{cp.name}</p>
                          <p className="font-mono-tabular text-[11px] text-[#D5B77A]">{cp.hex}</p>
                          <p className="text-[11px] text-[#F4EFE5]/55 mt-0.5">{cp.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wall & Floor Materials */}
                  <div className="pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#111515] border border-white/10">
                      <p className="text-[#D5B77A] uppercase tracking-[0.14em] mb-1">Walls</p>
                      <p className="text-[#F4EFE5]/80 leading-relaxed">
                        {result.wallAndFloorMaterials.walls}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#111515] border border-white/10">
                      <p className="text-[#D5B77A] uppercase tracking-[0.14em] mb-1">Flooring</p>
                      <p className="text-[#F4EFE5]/80 leading-relaxed">
                        {result.wallAndFloorMaterials.flooring}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#111515] border border-white/10">
                      <p className="text-[#D5B77A] uppercase tracking-[0.14em] mb-1">
                        Feature Accent
                      </p>
                      <p className="text-[#F4EFE5]/80 leading-relaxed">
                        {result.wallAndFloorMaterials.featureAccent}
                      </p>
                    </div>
                  </div>

                  {/* Tile Recommendations */}
                  <div className="pt-5 border-t border-white/10">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-3">
                      Curated Tile Recommendations (Illustrative)
                    </p>
                    <div className="space-y-2.5">
                      {result.tileRecommendations.map((tr) => (
                        <div
                          key={tr.code}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-lg bg-[#111515] border border-white/10 text-xs"
                        >
                          <div>
                            <span className="font-mono-tabular text-[#D5B77A]">{tr.code}</span>
                            <span className="mx-2 text-white/25">·</span>
                            <span className="font-medium text-[#F4EFE5]">{tr.name}</span>
                            <p className="text-[#F4EFE5]/65 mt-1">{tr.reason}</p>
                          </div>
                          <span className="text-[#F4EFE5]/75 shrink-0">{tr.placement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lighting & Rationale & Budget */}
                  <div className="pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                    <div>
                      <p className="text-[#D5B77A] uppercase tracking-[0.14em] mb-1.5">
                        Lighting Approach
                      </p>
                      <p className="text-[#F4EFE5]/80">{result.lightingRecommendations}</p>
                    </div>
                    <div>
                      <p className="text-[#D5B77A] uppercase tracking-[0.14em] mb-1.5">
                        Architectural Rationale
                      </p>
                      <p className="text-[#F4EFE5]/80">{result.designExplanation}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#102B28]/70 border border-[#D5B77A]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#D5B77A]">
                        Estimated Concept Budget Range
                      </p>
                      <p className="font-mono-tabular text-base text-[#F4EFE5] mt-0.5">
                        {result.estimatedBudgetRange}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={handleSaveConcept}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-white/20 bg-[#111515] text-xs text-[#F4EFE5] hover:border-[#D5B77A] cursor-pointer"
                      >
                        {savedNotice ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#D5B77A]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#D5B77A]" />
                            <span>Save Concept</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadBrief}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-white/20 bg-[#111515] text-xs text-[#F4EFE5] hover:border-[#D5B77A] cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D5B77A]" />
                        <span>Download Brief</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onRequestConsultation({
                            world: designWorld,
                            spaceType: roomType,
                            budget: `₹${budgetInr.toLocaleString('en-IN')}`,
                            notes: `Concept: ${result.conceptTitle}. Finish: ${surfaceFinish}.`,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#e5ca93] cursor-pointer"
                      >
                        <span>Request Consultation</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

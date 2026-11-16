import React, { useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { INDIAN_CITIES } from '../data/sensoraData';
import { WorldId } from '../types/sensora';
import { SafeImage } from './SafeImage';

interface CityExplorerProps {
  onCityEnquiry: (cityName: string, worldId: WorldId) => void;
}

export const CityExplorer: React.FC<CityExplorerProps> = ({ onCityEnquiry }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('bengaluru');
  const activeCity = INDIAN_CITIES.find((c) => c.id === selectedCityId) || INDIAN_CITIES[0];

  return (
    <section id="cities" className="py-20 lg:py-28 bg-[#0E1615] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              City Experience · India
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              Six Architectural City Concepts
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#F4EFE5]/65 max-w-lg">
            Proposed concept showcases illustrating how SENSORA AI adapts to India’s distinct
            architectural climates and cultures—not claims of physical branches or completed
            developments.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Interactive Stylised Map of India */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#111515] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-[0.18em] text-[#D5B77A]">
                Select a Conceptual City
              </span>
              <span className="text-[11px] text-[#F4EFE5]/50">Conceptual Showcase Map</span>
            </div>

            <div className="relative w-full max-w-[360px] mx-auto aspect-[3/4]">
              <svg
                viewBox="0 0 380 460"
                className="w-full h-full"
                role="img"
                aria-label="Interactive conceptual map of India showing Bengaluru, Mumbai, Hyderabad, Delhi, Chennai, and Pune"
              >
                {/* Stylised Architectural Silhouette of India */}
                <path
                  d="M168 24 L205 32 L222 58 L256 76 L278 112 L338 122 L352 152 L322 178 L294 176 L276 212 L254 252 L242 308 L228 368 L196 432 L176 436 L154 388 L136 332 L116 266 L82 228 L56 184 L88 154 L106 116 L132 76 Z"
                  fill="#102B28"
                  fillOpacity="0.55"
                  stroke="#D5B77A"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />
                {/* Architectural Latitude / Longitude Grid Lines */}
                <line x1="40" y1="150" x2="340" y2="150" stroke="#527B76" strokeOpacity="0.2" strokeDasharray="3 5" />
                <line x1="40" y1="280" x2="340" y2="280" stroke="#527B76" strokeOpacity="0.2" strokeDasharray="3 5" />
                <line x1="185" y1="30" x2="185" y2="430" stroke="#527B76" strokeOpacity="0.2" strokeDasharray="3 5" />

                {/* Connection arcs from Bengaluru hub */}
                {INDIAN_CITIES.filter((c) => c.id !== 'bengaluru').map((city) => (
                  <line
                    key={`arc-${city.id}`}
                    x1={185}
                    y1={365}
                    x2={city.mapCoords.x}
                    y2={city.mapCoords.y}
                    stroke="#D5B77A"
                    strokeOpacity={selectedCityId === city.id ? 0.65 : 0.16}
                    strokeWidth={selectedCityId === city.id ? 1.6 : 1}
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Interactive City Markers */}
                {INDIAN_CITIES.map((city) => {
                  const isActive = city.id === selectedCityId;
                  return (
                    <g
                      key={city.id}
                      transform={`translate(${city.mapCoords.x}, ${city.mapCoords.y})`}
                      onClick={() => setSelectedCityId(city.id)}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Explore ${city.name} concept showcase`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedCityId(city.id);
                        }
                      }}
                    >
                      <circle
                        r={isActive ? 16 : 11}
                        fill="#D5B77A"
                        fillOpacity={isActive ? 0.22 : 0.08}
                      />
                      <circle
                        r={isActive ? 6.5 : 4.5}
                        fill={isActive ? '#D5B77A' : '#F4EFE5'}
                        stroke="#111515"
                        strokeWidth="1.5"
                      />
                      <text
                        x={city.id === 'mumbai' || city.id === 'pune' ? -14 : 12}
                        y={city.id === 'pune' ? 12 : 4}
                        textAnchor={city.id === 'mumbai' || city.id === 'pune' ? 'end' : 'start'}
                        fill={isActive ? '#D5B77A' : '#F4EFE5'}
                        fontSize="11"
                        fontWeight={isActive ? '600' : '400'}
                        letterSpacing="0.06em"
                      >
                        {city.name.replace(' NCR', '')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick City Buttons */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {INDIAN_CITIES.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setSelectedCityId(city.id)}
                  className={`px-3 py-1.5 rounded-md text-xs border transition-colors cursor-pointer ${
                    city.id === selectedCityId
                      ? 'bg-[#102B28] border-[#D5B77A] text-[#D5B77A]'
                      : 'bg-[#151A1A] border-white/10 text-[#F4EFE5]/70 hover:text-[#F4EFE5]'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected City Detail Card */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/10 bg-[#111515] flex flex-col justify-between">
            <div className="aspect-[16/9] overflow-hidden relative">
              <SafeImage
                src={activeCity.image}
                alt={`${activeCity.name} architectural concept`}
                className="w-full h-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111515] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-2 text-xs text-[#F4EFE5]/90">
                <MapPin className="w-3.5 h-3.5 text-[#D5B77A]" />
                <span>
                  {activeCity.name}, {activeCity.state}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#D5B77A]">Proposed Concept Showcase</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-display text-3xl text-[#F4EFE5]">{activeCity.headline}</h3>
                <p className="mt-2.5 text-sm text-[#F4EFE5]/75 leading-relaxed">
                  {activeCity.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-white/10 text-xs">
                <div>
                  <p className="uppercase tracking-[0.16em] text-[#D5B77A] mb-2">
                    Design Themes
                  </p>
                  <ul className="space-y-1.5 text-[#F4EFE5]/80">
                    {activeCity.themes.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="uppercase tracking-[0.16em] text-[#D5B77A] mb-2">
                    Conceptual Project Formats
                  </p>
                  <ul className="space-y-1.5 text-[#F4EFE5]/80">
                    {activeCity.projectTypes.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-[#F4EFE5]/55">
                  Conceptual vision · Not an existing branch office
                </span>
                <button
                  type="button"
                  onClick={() => onCityEnquiry(activeCity.name, activeCity.recommendedWorld)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#e5ca93] cursor-pointer"
                >
                  <span>Enquire for {activeCity.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

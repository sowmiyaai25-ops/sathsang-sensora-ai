import React from 'react';
import { SafeImage } from './SafeImage';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#0E1615] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              About SATHSANG &amp; SENSORA AI
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5] leading-tight">
              Imagination, Intelligent Technology, and Architectural Craft.
            </h2>
            <p className="text-base text-[#F4EFE5]/80 leading-relaxed">
              SATHSANG presents SENSORA AI — a vision to bring imagination, intelligent technology
              and architectural creativity together.
            </p>
            <p className="text-sm sm:text-base text-[#F4EFE5]/70 leading-relaxed">
              We believe spaces should do more than serve a purpose. They should create emotions,
              inspire people and transform everyday experiences. Through AI-assisted visualisation,
              architectural surfaces, customised lighting and immersive interior concepts, SENSORA AI
              explores new possibilities in the way people imagine and experience spaces.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <h3 className="font-display text-xl text-[#D5B77A]">01. Our Vision</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#F4EFE5]/70 leading-relaxed">
                  To turn every residential room, hospitality venue, and commercial landmark into an
                  emotionally resonant spatial world.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl text-[#D5B77A]">02. Design Philosophy</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#F4EFE5]/70 leading-relaxed">
                  Tactile honesty: balancing sculpted surfaces, calibrated shadow, and natural
                  mineral palettes without ornament clutter.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl text-[#D5B77A]">03. Technology Approach</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#F4EFE5]/70 leading-relaxed">
                  Interactive 3D previews and AI-guided specification tools that empower homeowners,
                  architects, and developers before fabrication begins.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl text-[#D5B77A]">04. Commitment</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#F4EFE5]/70 leading-relaxed">
                  Deep personalisation across surface finishes, lighting temperatures, and spatial
                  themes tailored to each client’s vision.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-5">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
              <SafeImage
                src="/assets/curated/luxury_organic_showroom.jpg"
                alt="SATHSANG presents SENSORA AI organic architectural pavilion concept"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 mt-8">
              <SafeImage
                src="/assets/curated/forest_atrium_3d.jpg"
                alt="Sensora multi-level biophilic architectural atrium concept"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

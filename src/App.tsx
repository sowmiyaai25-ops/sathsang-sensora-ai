import React, { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AIDesigner } from './components/AIDesigner';
import { Chatbot } from './components/Chatbot';
import { CityExplorer } from './components/CityExplorer';
import {
  ConsultationModal,
  EnquiryDrawer,
  SampleRequestModal,
} from './components/ConsultationModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { IntroPortal } from './components/IntroPortal';
import { LightingLab } from './components/LightingLab';
import { Navigation } from './components/Navigation';
import { ProjectGallery } from './components/ProjectGallery';
import { SpacesSection } from './components/SpacesSection';
import { TileAtelier } from './components/TileAtelier';
import { VisualisationGallery } from './components/VisualisationGallery';
import { WorldDetail } from './components/WorldDetail';
import { WorldExplorer } from './components/WorldExplorer';
import {
  DEFAULT_CONTACT_CONFIG,
  DESIGN_WORLDS,
  TILE_PRODUCTS,
} from './data/sensoraData';
import {
  BusinessContactConfig,
  DesignWorld,
  NavSection,
  TileProduct,
  WorldId,
} from './types/sensora';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [selectedWorldDetail, setSelectedWorldDetail] = useState<DesignWorld | null>(null);

  const [preselectedDesignerWorld, setPreselectedDesignerWorld] = useState<string | undefined>(
    undefined
  );

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [enquiryIds, setEnquiryIds] = useState<string[]>([]);
  const [sampleTile, setSampleTile] = useState<TileProduct | null>(null);
  const [enquiryDrawerOpen, setEnquiryDrawerOpen] = useState(false);

  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationPrefill, setConsultationPrefill] = useState<{
    world?: string;
    spaceType?: string;
    city?: string;
    budget?: string;
    notes?: string;
  }>({});

  const [contactConfig, setContactConfig] = useState<BusinessContactConfig>(
    DEFAULT_CONTACT_CONFIG
  );
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const navigateToSection = (section: NavSection) => {
    setSelectedWorldDetail(null);
    setActiveSection(section);

    window.requestAnimationFrame(() => {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  useEffect(() => {
    if (selectedWorldDetail) return;
    const sectionIds: NavSection[] = [
      'home',
      'worlds',
      'visualisations',
      'ai-designer',
      'tile-atelier',
      'lighting-lab',
      'spaces',
      'cities',
      'projects',
      'about',
      'contact',
    ];
    const onScroll = () => {
      const scrollY = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [selectedWorldDetail]);

  const openWorldById = (worldId: WorldId) => {
    const found = DESIGN_WORLDS.find((w) => w.id === worldId);
    if (found) {
      setSelectedWorldDetail(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addToEnquiry = (tile: TileProduct) => {
    setEnquiryIds((prev) =>
      prev.includes(tile.id) ? prev.filter((x) => x !== tile.id) : [...prev, tile.id]
    );
  };

  const openConsultation = (prefill: typeof consultationPrefill = {}) => {
    setConsultationPrefill(prefill);
    setConsultationOpen(true);
  };

  const wishlistTiles = TILE_PRODUCTS.filter((t) => wishlistIds.includes(t.id));
  const enquiryTiles = TILE_PRODUCTS.filter((t) => enquiryIds.includes(t.id));

  return (
    <div className="min-h-screen bg-[#111515] text-[#F4EFE5] flex flex-col">
      {showIntro && <IntroPortal onComplete={() => setShowIntro(false)} />}

      <Navigation
        activeSection={activeSection}
        onNavigate={navigateToSection}
        onOpenConsultation={() => openConsultation()}
        enquiryCount={enquiryIds.length + wishlistIds.length}
        onOpenEnquiryDrawer={() => setEnquiryDrawerOpen(true)}
      />

      <main className="flex-1">
        {selectedWorldDetail ? (
          <WorldDetail
            world={selectedWorldDetail}
            onBack={() => {
              setSelectedWorldDetail(null);
              navigateToSection('worlds');
            }}
            onBookConsultation={(preferredWorld) =>
              openConsultation({ world: preferredWorld })
            }
            onDesignInWorld={(worldName) => {
              setPreselectedDesignerWorld(worldName);
              navigateToSection('ai-designer');
            }}
          />
        ) : (
          <>
            <HeroSection
              onNavigate={navigateToSection}
              onReplayPortal={() => setShowIntro(true)}
            />

            <WorldExplorer
              onSelectWorld={(world) => {
                setSelectedWorldDetail(world);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <VisualisationGallery
              onCreateSimilar={(worldName) => {
                setPreselectedDesignerWorld(worldName);
                navigateToSection('ai-designer');
              }}
              onExploreWorld={openWorldById}
            />

            <AIDesigner
              preselectedWorld={preselectedDesignerWorld}
              onRequestConsultation={(prefill) =>
                openConsultation({
                  world: `${prefill.world} World`,
                  spaceType: prefill.spaceType,
                  budget: prefill.budget,
                  notes: prefill.notes,
                })
              }
            />

            <TileAtelier
              wishlistIds={wishlistIds}
              enquiryIds={enquiryIds}
              onToggleWishlist={toggleWishlist}
              onAddToEnquiry={addToEnquiry}
              onRequestSample={(tile) => setSampleTile(tile)}
              onContactSales={() => navigateToSection('contact')}
            />

            <LightingLab
              onLightingEnquiry={(kelvinLabel) =>
                openConsultation({
                  notes: `Lighting Lab enquiry — preferred temperature: ${kelvinLabel}`,
                })
              }
            />

            <SpacesSection
              onExploreWorld={openWorldById}
              onEnquireSpace={(spaceTitle, worldId) =>
                openConsultation({
                  spaceType: spaceTitle,
                  world:
                    DESIGN_WORLDS.find((w) => w.id === worldId)?.name || 'Forest World',
                })
              }
            />

            <CityExplorer
              onCityEnquiry={(cityName, worldId) =>
                openConsultation({
                  city: cityName,
                  world:
                    DESIGN_WORLDS.find((w) => w.id === worldId)?.name || 'Forest World',
                  notes: `City Experience concept enquiry inspired by ${cityName}.`,
                })
              }
            />

            <ProjectGallery
              onCreateSimilar={(worldName) => {
                setPreselectedDesignerWorld(worldName);
                navigateToSection('ai-designer');
              }}
            />

            <AboutSection />

            <ContactSection
              contactConfig={contactConfig}
              onUpdateContactConfig={setContactConfig}
              onOpenConsultation={() => openConsultation()}
              onOpenLegal={(tab) => setLegalModal(tab)}
            />
          </>
        )}
      </main>

      <Footer
        contactConfig={contactConfig}
        onNavigate={navigateToSection}
        onReplayPortal={() => setShowIntro(true)}
        legalModal={legalModal}
        onOpenLegal={setLegalModal}
      />

      <Chatbot
        onNavigate={navigateToSection}
        onOpenConsultation={() => openConsultation()}
      />

      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        prefill={consultationPrefill}
      />

      <SampleRequestModal
        tile={sampleTile}
        onClose={() => setSampleTile(null)}
      />

      <EnquiryDrawer
        isOpen={enquiryDrawerOpen}
        onClose={() => setEnquiryDrawerOpen(false)}
        enquiryTiles={enquiryTiles}
        wishlistTiles={wishlistTiles}
        onRemoveEnquiry={(id) =>
          setEnquiryIds((prev) => prev.filter((x) => x !== id))
        }
        onProceedToConsultation={(notes) => openConsultation({ notes })}
      />
    </div>
  );
}

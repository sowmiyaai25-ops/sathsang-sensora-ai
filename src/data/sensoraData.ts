import {
  BusinessContactConfig,
  CityConcept,
  ConceptProject,
  DesignWorld,
  LightingSystem,
  SpaceService,
  TileProduct,
} from '../types/sensora';

export const BRAND_PILLARS = [
  {
    code: '01',
    name: 'SENSORA WORLDS',
    summary: 'Five distinct spatial universes translating mood, ecology, and architecture.',
  },
  {
    code: '02',
    name: 'SENSORA SURFACES',
    summary: 'Sculptural 3D tiles, mineral monoliths, and bespoke architectural finishes.',
  },
  {
    code: '03',
    name: 'SENSORA LIGHT',
    summary: 'Tunable atmospheric lighting calibrated from warm amber to crisp architectural daylight.',
  },
  {
    code: '04',
    name: 'SENSORA SPACES',
    summary: 'End-to-end conceptual interiors for private residences, hospitality, and workplaces.',
  },
  {
    code: '05',
    name: 'SENSORA AI STUDIO',
    summary: 'Interactive spatial personalisation pairing room imagery with material intelligence.',
  },
  {
    code: '06',
    name: 'SENSORA ENTERPRISE',
    summary: 'Scalable experiential environments for malls, flagship retail, and commercial towers.',
  },
];

export const DESIGN_WORLDS: DesignWorld[] = [
  {
    id: 'aqua',
    name: 'Aqua World',
    subtitle: 'Submerged Architectural Serenity',
    tagline: 'Refractive glass vaults, deep oceanic velvet, and bioluminescent calm.',
    description:
      'An underwater-inspired architectural universe merging turquoise glass canopies, coral-carved acoustic surfaces, reflective slate floors, and suspended amber & marine luminaires.',
    narrative:
      'Aqua World transforms dining and hospitality interiors into tranquil submerged sanctuaries. Curved structural arches frame living marine vistas while fluted translucent surfaces scatter light across dark mineral floors.',
    experienceSummary:
      'Conceived for destination underwater-themed cafés, fine-dining lounges, boutique spa lounges, and statement coastal residences.',
    ctaLabel: 'Explore Aqua World',
    heroImage: '/assets/curated/aqua_world_dining.jpg',
    secondaryImages: [
      '/src/assets/images/vis_bioluminescent_aqua_spa_1794847535692.jpg',
      '/assets/curated/aqua_immersive_cafe.jpg',
      '/assets/curated/aqua_tunnel_lanterns.jpg',
      '/assets/curated/aqua_portal_dining.jpg',
    ],
    palette: {
      primary: '#0A252E',
      secondary: '#125E6D',
      accent: '#D5B77A',
      surface: '#112E36',
      names: ['Abyssal Teal', 'Bioluminescent Cyan', 'Champagne Brass', 'Wet Basalt'],
    },
    materials: [
      {
        name: 'Iridescent Glazed Wave Porcelain',
        specification: '3D extruded fluid relief · Glossy marine glaze',
        application: 'Curved feature walls & bar aprons',
      },
      {
        name: 'Honoured Basalt & Sea-Glass Terrazzo',
        specification: 'Slip-rated matte mineral aggregate with brass inlays',
        application: 'Reflective dining & gallery flooring',
      },
      {
        name: 'Brushed Marine Bronze Framing',
        specification: 'Anodised corrosion-resistant architectural ribs',
        application: 'Vaulted ceiling arches & booth dividers',
      },
    ],
    lightingApproach: {
      kelvin: '3000K Warm Amber balanced with 4800K Marine Cyan Uplight',
      fixtureStyle: 'Suspended woven-glass jellyfish pendants & concealed cove grazing',
      mood: 'Caustic water reflections layered over intimate table-level pools of warm gold',
    },
    applications: [
      'Underwater-inspired cafés & brasseries',
      'Boutique hospitality lounges',
      'Hydrotherapy & wellness pavilions',
      'Statement double-height residential dining rooms',
    ],
    recommendedTileCodes: ['SNS-3D-101', 'SNS-ART-502', 'SNS-GLS-801'],
    relatedProjectIds: ['aqua-lounge', 'signature-lobby'],
    threeConfig: {
      bgHex: 0x071a21,
      fogHex: 0x071a21,
      slabHex: 0x136f7d,
      accentHex: 0xd5b77a,
      roughness: 0.16,
      metalness: 0.35,
      pattern: 'ripple',
    },
  },
  {
    id: 'forest',
    name: 'Forest World',
    subtitle: 'Biophilic Living Architecture',
    tagline: 'Emerald marble monoliths, living botanical walls, and dappled canopy light.',
    description:
      'Where nature meets monumental architecture. Forest World integrates indoor tree courts, emerald veined stone, sculpted timber coffers, and moss-textured acoustic reliefs.',
    narrative:
      'Designed to restore human rhythm indoors, Forest World pairs deep botanical greens with warm architectural timber and organic water channels that cool and soften grand interiors.',
    experienceSummary:
      'Ideal for biophilic corporate lobbies, forest-canopy restaurants, garden villas, and serene executive suites.',
    ctaLabel: 'Explore Forest World',
    heroImage: '/assets/curated/forest_world_courtyard.jpg',
    secondaryImages: [
      '/src/assets/images/hero_emerald_sanctuary_3d_1794847533511.jpg',
      '/src/assets/images/hero_magical_portal_vista_1794847532486.jpg',
      '/assets/curated/forest_world_enchanted.jpg',
      '/assets/curated/forest_emerald_lounge.jpg',
      '/assets/curated/forest_atrium_3d.jpg',
    ],
    palette: {
      primary: '#102B28',
      secondary: '#264E44',
      accent: '#D5B77A',
      surface: '#193530',
      names: ['Deep Emerald', 'Botanical Moss', 'Warm Walnut', 'Travertine Mist'],
    },
    materials: [
      {
        name: 'Verde Alpi Emerald Marble Slab',
        specification: 'Bookmatched honed natural-look sintered stone',
        application: 'Reception monoliths, islands & fireplace surrounds',
      },
      {
        name: 'Botanical Relief Acoustic Tile',
        specification: 'Matte mineral composite · Leaf-rib texture',
        application: 'Vertical feature walls & quiet dining alcoves',
      },
      {
        name: 'Smoked Teak & Travertine Planks',
        specification: 'Linear architectural timber & porous stone inlay',
        application: 'Atrium walkways & ceiling baffle grids',
      },
    ],
    lightingApproach: {
      kelvin: '2700K–3200K Warm Canopy Filtering',
      fixtureStyle: 'Orbital ring suspensions & uplighting tucked beneath indoor tree planters',
      mood: 'Filtered afternoon sunlight through layered foliage onto stone and water',
    },
    applications: [
      'Biophilic hotel atriums & resort lobbies',
      'Botanical fine-dining restaurants',
      'Wellness-focused corporate offices',
      'Courtyard villas & serene living lounges',
    ],
    recommendedTileCodes: ['SNS-NAT-301', 'SNS-STN-601', 'SNS-3D-102'],
    relatedProjectIds: ['forest-table', 'emerald-office'],
    threeConfig: {
      bgHex: 0x0b1f1c,
      fogHex: 0x0b1f1c,
      slabHex: 0x1a4d43,
      accentHex: 0xd5b77a,
      roughness: 0.38,
      metalness: 0.18,
      pattern: 'veined',
    },
  },
  {
    id: 'cosmic',
    name: 'Cosmic World',
    subtitle: 'Futuristic Spatial Horizon',
    tagline: 'Liquid-metal surfaces, starlight geometries, and kinetic light ribbons.',
    description:
      'An avant-garde architectural universe shaped by deep midnight slate, brushed titanium tiles, sweeping sculptural curves, and luminous celestial ceiling arrays.',
    narrative:
      'Cosmic World bends spatial perception with seamless dark mineral volumes sliced by warm amber and cool indigo light streams, creating galleries and lounges that feel sculpted from starlight.',
    experienceSummary:
      'Built for futuristic flagship showrooms, experiential lounges, acoustic screening rooms, and ultra-modern hotel suites.',
    ctaLabel: 'Explore Cosmic World',
    heroImage: '/assets/curated/cosmic_wave_gallery.jpg',
    secondaryImages: [
      '/assets/curated/cosmic_waterfall_lounge.jpg',
      '/assets/curated/ai_hologram_living.jpg',
    ],
    palette: {
      primary: '#0F1322',
      secondary: '#2B2347',
      accent: '#E2A85C',
      surface: '#171C2F',
      names: ['Midnight Indigo', 'Nebula Violet', 'Solar Amber', 'Brushed Obsidian'],
    },
    materials: [
      {
        name: 'Titanium Wave Metallic Tile',
        specification: 'PVD-coated sculptural aluminium-porcelain composite',
        application: 'Sweeping corridor walls & media backdrops',
      },
      {
        name: 'Obsidian Mirror Terrazzo',
        specification: 'High-gloss dark quartz with micro-metallic fleck',
        application: 'Reflective gallery floors & podiums',
      },
      {
        name: 'Acoustic Midnight Micro-Cement',
        specification: 'Seamless matte monolithic trowel finish',
        application: 'Vaulted ceilings & sculpted arches',
      },
    ],
    lightingApproach: {
      kelvin: '3000K Solar Ribbon LED paired with 5000K Micro-Pin Starlight',
      fixtureStyle: 'Recessed linear contour waves & micro-optic ceiling constellations',
      mood: 'High-contrast architectural drama with weightless glowing horizon lines',
    },
    applications: [
      'Futuristic brand galleries & tech showrooms',
      'Experiential night lounges & private clubs',
      'Signature hotel suites & penthouses',
      'Interactive multimedia exhibition halls',
    ],
    recommendedTileCodes: ['SNS-MET-201', 'SNS-GEO-401', 'SNS-3D-101'],
    relatedProjectIds: ['cosmic-suite', 'future-gallery'],
    threeConfig: {
      bgHex: 0x0b0e1a,
      fogHex: 0x0b0e1a,
      slabHex: 0x26294a,
      accentHex: 0xe2a85c,
      roughness: 0.18,
      metalness: 0.85,
      pattern: 'metallic',
    },
  },
  {
    id: 'royal',
    name: 'Royal World',
    subtitle: 'Contemporary Heritage Grandeur',
    tagline: 'Sculpted arches, brushed bronze reliefs, and jewel-toned artisan stone.',
    description:
      'Reinterpreting Indian and classical palatial proportions for modern luxury. Royal World balances rich emerald, deep claret, antique brass inlays, and carved stone geometry.',
    narrative:
      'Every arch and fluted column in Royal World honours heritage craftsmanship without ornament clutter—uniting geometric inlay flooring, velvet alcoves, and warm bronze illumination.',
    experienceSummary:
      'Curated for grand hotel lobbies, bespoke heritage dining rooms, executive boardrooms, and stately urban residences.',
    ctaLabel: 'Explore Royal World',
    heroImage: '/src/assets/images/vis_royal_chandeliers_hall_1794847533984.jpg',
    secondaryImages: [
      '/assets/curated/city_hyderabad_royal.jpg',
      '/assets/curated/portal_arch.jpg',
      '/assets/curated/luxury_organic_showroom.jpg',
    ],
    palette: {
      primary: '#1E1418',
      secondary: '#4E1F28',
      accent: '#D5B77A',
      surface: '#102B28',
      names: ['Royal Burgundy', 'Imperial Emerald', 'Champagne Gold', 'Burnished Bronze'],
    },
    materials: [
      {
        name: 'Heritage Geometric Inlay Tile',
        specification: 'Waterjet-cut marble & brass-trimmed porcelain mosaic',
        application: 'Grand foyers, banquet floors & porticoes',
      },
      {
        name: 'Fluted Champagne Bronze Cladding',
        specification: 'Brushed metallic relief with protective satin lacquer',
        application: 'Arched colonnades & feature bar backs',
      },
      {
        name: 'Carved Emerald Onyx Surface',
        specification: 'Translucent backlit stone-effect architectural panel',
        application: 'Concierge desks & dining focal walls',
      },
    ],
    lightingApproach: {
      kelvin: '2400K–2700K Candlelight Amber',
      fixtureStyle: 'Architectural bronze lanterns, fluted brass sconces & concealed arch uplights',
      mood: 'Warm regal intimacy highlighting carved textures and metallic sheen',
    },
    applications: [
      'Boutique heritage hotels & palace-inspired dining',
      'Luxury residences & formal drawing rooms',
      'Fine jewellery & couture flagships',
      'Private members clubs & lounges',
    ],
    recommendedTileCodes: ['SNS-HER-701', 'SNS-MET-202', 'SNS-ART-501'],
    relatedProjectIds: ['royal-residence', 'signature-lobby'],
    threeConfig: {
      bgHex: 0x181113,
      fogHex: 0x181113,
      slabHex: 0x4c1d24,
      accentHex: 0xd5b77a,
      roughness: 0.28,
      metalness: 0.68,
      pattern: 'heritage',
    },
  },
  {
    id: 'desert',
    name: 'Desert World',
    subtitle: 'Sculpted Earth & Golden Silence',
    tagline: 'Sun-baked terracotta, tactile sandstone curves, and warm desert light.',
    description:
      'Rooted in monolithic earthen architecture. Desert World celebrates warm limestone, fluted sandstone tiles, hand-troweled clay textures, and serene golden-hour illumination.',
    narrative:
      'Desert World strips away visual noise to let sculptural shadow and tactile grain take centre stage. Curved matte walls absorb glare while warm brass accents catch soft evening light.',
    experienceSummary:
      'Designed for luxury wellness sanctuaries, destination desert resorts, tranquil spas, and sunlit contemporary villas.',
    ctaLabel: 'Explore Desert World',
    heroImage: '/src/assets/images/vis_desert_dune_pavilion_1794847535848.jpg',
    secondaryImages: [
      '/assets/curated/sculptural_tile_gallery.jpg',
      '/assets/curated/city_chennai_tropical.jpg',
      '/assets/curated/tile_atelier_wall.jpg',
    ],
    palette: {
      primary: '#241D18',
      secondary: '#8C5E42',
      accent: '#D5B77A',
      surface: '#332820',
      names: ['Raw Terracotta', 'Dune Sandstone', 'Warm Travertine', 'Soft Bronze'],
    },
    materials: [
      {
        name: 'Dune Sculptural Sandstone Tile',
        specification: 'CNC-carved matte natural limestone composite',
        application: 'Double-height living walls & spa sanctuaries',
      },
      {
        name: 'Kiln-Fired Terracotta Fluted Slab',
        specification: 'Earthy matte clay body · Low-sheen mineral seal',
        application: 'Courtyard walls, arches & reception counters',
      },
      {
        name: 'Brushed Travertine Vein Floor Tile',
        specification: 'Large-format 1200×2400mm textured stone slab',
        application: 'Seamless indoor-outdoor pavilion floors',
      },
    ],
    lightingApproach: {
      kelvin: '2700K Golden Hour Grazing Light',
      fixtureStyle: 'Recessed wall-wash slots & alabaster stone wall sconces',
      mood: 'Soft sunset shadows gliding across fluted sandstone and organic plaster',
    },
    applications: [
      'Luxury wellness spas & retreat resorts',
      'Sunlit coastal & courtyard villas',
      'Minimalist architectural galleries',
      'Artisanal cafés & calm hospitality lounges',
    ],
    recommendedTileCodes: ['SNS-3D-102', 'SNS-STN-602', 'SNS-CUS-802'],
    relatedProjectIds: ['desert-sanctuary', 'future-gallery'],
    threeConfig: {
      bgHex: 0x1e1712,
      fogHex: 0x1e1712,
      slabHex: 0x9b6b4a,
      accentHex: 0xd5b77a,
      roughness: 0.78,
      metalness: 0.08,
      pattern: 'terracotta',
    },
  },
];

export const TILE_PRODUCTS: TileProduct[] = [
  {
    id: 'tile-1',
    code: 'SNS-3D-101',
    name: 'Unda Sculptural Wave Panel',
    category: '3D Sculptural',
    finish: 'Matte',
    material: 'Mineral Composite Porcelain',
    colour: 'Warm Sand Ivory',
    colourHex: '#D8CFC2',
    sizeMm: '600 × 1200 × 18',
    priceInrPerSqFt: 485,
    application: ['Wall'],
    worldAffinity: ['desert', 'aqua', 'cosmic'],
    image: '/assets/curated/sculptural_tile_gallery.jpg',
    description:
      'Continuous parametric wave relief engineered to cast shifting architectural shadows under linear wall-wash lighting.',
    patternStyle: 'wave',
  },
  {
    id: 'tile-2',
    code: 'SNS-3D-102',
    name: 'Hexa Prism Architectural Facet',
    category: '3D Sculptural',
    finish: 'Textured',
    material: 'Cast Basalt & Ceramic',
    colour: 'Graphite Limestone',
    colourHex: '#5D6161',
    sizeMm: '400 × 460 × 22',
    priceInrPerSqFt: 540,
    application: ['Wall'],
    worldAffinity: ['cosmic', 'forest', 'desert'],
    image: '/assets/curated/sculptural_tile_gallery.jpg',
    description:
      'Tri-level faceted hexagonal relief tile creating acoustic diffusion and multi-tonal depth on feature walls.',
    patternStyle: 'hex',
  },
  {
    id: 'tile-3',
    code: 'SNS-MET-201',
    name: 'Nebula Brushed Titanium Rib',
    category: 'Metallic',
    finish: 'Metallic',
    material: 'PVD Aluminium-Porcelain',
    colour: 'Dark Gunmetal Titanium',
    colourHex: '#353C4A',
    sizeMm: '600 × 1200 × 10',
    priceInrPerSqFt: 720,
    application: ['Wall'],
    worldAffinity: ['cosmic', 'royal'],
    image: '/assets/curated/cosmic_wave_gallery.jpg',
    description:
      'Precision-fluted metallic tile with dark titanium finish that reflects ambient light ribbons in futuristic lounges.',
    patternStyle: 'fluted',
  },
  {
    id: 'tile-4',
    code: 'SNS-MET-202',
    name: 'Aurelia Champagne Bronze Fluted',
    category: 'Metallic',
    finish: 'Metallic',
    material: 'Anodised Brass-Porcelain',
    colour: 'Champagne Bronze',
    colourHex: '#B6905A',
    sizeMm: '300 × 900 × 12',
    priceInrPerSqFt: 790,
    application: ['Wall'],
    worldAffinity: ['royal', 'cosmic'],
    image: '/assets/curated/portal_arch.jpg',
    description:
      'Satin-brushed bronze micro-flutes crafted for grand archways, concierge desks, and hospitality bar fronts.',
    patternStyle: 'bronze',
  },
  {
    id: 'tile-5',
    code: 'SNS-NAT-301',
    name: 'Sylva Deep Emerald Vein Slab',
    category: 'Nature-Inspired',
    finish: 'Glossy',
    material: 'Sintered Emerald Stone',
    colour: 'Deep Emerald',
    colourHex: '#184A42',
    sizeMm: '1200 × 2400 × 9',
    priceInrPerSqFt: 620,
    application: ['Wall', 'Floor'],
    worldAffinity: ['forest', 'royal'],
    image: '/assets/curated/emerald_marble_console.jpg',
    description:
      'Large-format sintered slab capturing swirling sea-pine and emerald mineral veins with zero-porosity durability.',
    patternStyle: 'marble',
  },
  {
    id: 'tile-6',
    code: 'SNS-NAT-302',
    name: 'Canopy Botanical Moss Relief',
    category: 'Nature-Inspired',
    finish: 'Textured',
    material: 'Mineral Bio-Ceramic',
    colour: 'Forest Sage',
    colourHex: '#395A4F',
    sizeMm: '600 × 600 × 14',
    priceInrPerSqFt: 410,
    application: ['Wall'],
    worldAffinity: ['forest'],
    image: '/assets/curated/forest_emerald_lounge.jpg',
    description:
      'Organic striated surface inspired by forest bark and moss terraces, suited for biophilic lobbies and cafés.',
    patternStyle: 'fluted',
  },
  {
    id: 'tile-7',
    code: 'SNS-GEO-401',
    name: 'Prismatix Diamond Lattice',
    category: 'Geometric',
    finish: 'Matte',
    material: 'Full-Body Porcelain',
    colour: 'Slate Charcoal',
    colourHex: '#2C3335',
    sizeMm: '600 × 600 × 10',
    priceInrPerSqFt: 340,
    application: ['Wall', 'Floor'],
    worldAffinity: ['cosmic', 'forest'],
    image: '/assets/curated/tile_atelier_wall.jpg',
    description:
      'Crisp precision-chamfered geometric tiles engineered for modular herringbone or architectural lattice layouts.',
    patternStyle: 'hex',
  },
  {
    id: 'tile-8',
    code: 'SNS-GEO-402',
    name: 'Meridian Gold-Inlay Chevron',
    category: 'Geometric',
    finish: 'Glossy',
    material: 'Porcelain & Brass Strip',
    colour: 'Ivory & Champagne',
    colourHex: '#E8DEC8',
    sizeMm: '450 × 900 × 10',
    priceInrPerSqFt: 560,
    application: ['Floor', 'Wall'],
    worldAffinity: ['royal', 'desert'],
    image: '/assets/curated/city_mumbai_penthouse.jpg',
    description:
      'Warm ivory architectural slabs articulated with hairline champagne-gold metallic channels.',
    patternStyle: 'heritage',
  },
  {
    id: 'tile-9',
    code: 'SNS-ART-501',
    name: 'Samsara Hand-Gilded Artisan Slab',
    category: 'Artistic',
    finish: 'Textured',
    material: 'Artisanal Glazed Stoneware',
    colour: 'Claret & Gold',
    colourHex: '#5B232B',
    sizeMm: '600 × 1200 × 11',
    priceInrPerSqFt: 690,
    application: ['Wall'],
    worldAffinity: ['royal'],
    image: '/assets/curated/city_hyderabad_royal.jpg',
    description:
      'Kiln-reactive metallic patina over deep claret glaze, designed for bespoke dining rooms and statement niches.',
    patternStyle: 'heritage',
  },
  {
    id: 'tile-10',
    code: 'SNS-ART-502',
    name: 'Pelagic Coral Lustre Mosaic',
    category: 'Artistic',
    finish: 'Glossy',
    material: 'Recycled Mineral Glass-Ceramic',
    colour: 'Abyssal Turquoise',
    colourHex: '#136B7A',
    sizeMm: '300 × 300 × 8',
    priceInrPerSqFt: 520,
    application: ['Wall', 'Floor'],
    worldAffinity: ['aqua'],
    image: '/assets/curated/aqua_immersive_cafe.jpg',
    description:
      'High-refraction marine glazed tiles evoking underwater light caustics across curved surfaces and pools.',
    patternStyle: 'ripple',
  },
  {
    id: 'tile-11',
    code: 'SNS-STN-601',
    name: 'Kaveri Honed Slate Monolith',
    category: 'Stone-Effect',
    finish: 'Matte',
    material: 'Rectified Vitrified Stone',
    colour: 'Charcoal Moss',
    colourHex: '#25312E',
    sizeMm: '800 × 1600 × 10',
    priceInrPerSqFt: 295,
    application: ['Floor', 'Wall'],
    worldAffinity: ['forest', 'aqua', 'cosmic'],
    image: '/assets/curated/forest_world_courtyard.jpg',
    description:
      'Anti-slip architectural stone slab with subtle mineral cleft texture, suitable for high-traffic lobbies and cafés.',
    patternStyle: 'terrazzo',
  },
  {
    id: 'tile-12',
    code: 'SNS-STN-602',
    name: 'Thar Raw Travertine Vein',
    category: 'Stone-Effect',
    finish: 'Textured',
    material: 'Porcelain Travertine',
    colour: 'Dune Beige',
    colourHex: '#C7B299',
    sizeMm: '1200 × 2400 × 10',
    priceInrPerSqFt: 365,
    application: ['Floor', 'Wall'],
    worldAffinity: ['desert', 'forest'],
    image: '/assets/curated/city_chennai_tropical.jpg',
    description:
      'Vein-cut desert travertine replica delivering warm tactile grain for wellness spas and courtyard residences.',
    patternStyle: 'sandstone',
  },
  {
    id: 'tile-13',
    code: 'SNS-HER-701',
    name: 'Deccan Imperial Octagon Inlay',
    category: 'Heritage-Pattern',
    finish: 'Matte',
    material: 'Terrazzo & Marble Aggregate',
    colour: 'Ivory, Onyx & Umber',
    colourHex: '#9C7B5C',
    sizeMm: '600 × 600 × 12',
    priceInrPerSqFt: 460,
    application: ['Floor'],
    worldAffinity: ['royal'],
    image: '/assets/curated/city_hyderabad_royal.jpg',
    description:
      'Modern reinterpretation of classical Indian palace geometry in durable precision-ground terrazzo stone.',
    patternStyle: 'heritage',
  },
  {
    id: 'tile-14',
    code: 'SNS-CUS-802',
    name: 'Bespoke Acoustic Dune Fluting',
    category: 'Custom Surfaces',
    finish: 'Matte',
    material: 'Parametric Mineral Clay',
    colour: 'Terracotta Sand',
    colourHex: '#A77052',
    sizeMm: 'Custom Modular (up to 1500mm)',
    priceInrPerSqFt: 850,
    application: ['Wall'],
    worldAffinity: ['desert', 'royal', 'forest'],
    image: '/assets/curated/tile_atelier_wall.jpg',
    description:
      'Made-to-order curved architectural cladding tailored via Sensora AI parametric profiles for signature walls.',
    patternStyle: 'sandstone',
  },
];

export const LIGHTING_SYSTEMS: LightingSystem[] = [
  {
    id: 'ambient',
    category: 'Ambient Lighting',
    title: 'Horizon Wash Cove Architecture',
    kelvinRange: '2700K – 4000K Tunable',
    description:
      'Concealed perimeter architectural coves that lift ceiling planes effortlessly, eliminating harsh glare across stone and plaster.',
    idealWorlds: ['forest', 'desert', 'royal'],
    application: 'Living spaces, hotel suites & serene spa sanctuaries',
    image: '/assets/curated/city_mumbai_penthouse.jpg',
  },
  {
    id: 'architectural',
    category: 'Architectural Lighting',
    title: 'Micro-Optic Wall Grazing Channels',
    kelvinRange: '3000K High-CRI (CRI 95+)',
    description:
      'Precision narrow-beam recessed slots calibrated to reveal 3D sculptural tile relief, fluted bronze, and sandstone grain.',
    idealWorlds: ['desert', 'cosmic', 'royal'],
    application: '3D sculptural feature walls, galleries & corridors',
    image: '/assets/curated/sculptural_tile_gallery.jpg',
  },
  {
    id: 'pendant',
    category: 'Decorative Pendant Lighting',
    title: 'Orbital & Bioluminescent Suspensions',
    kelvinRange: '2400K – 3000K Warm Gold',
    description:
      'Bespoke halo rings, woven amber lanterns, and hand-blown refractive glass forms acting as suspended spatial sculptures.',
    idealWorlds: ['aqua', 'forest', 'royal'],
    application: 'Signature dining tables, double-height lobbies & cafés',
    image: '/assets/curated/aqua_tunnel_lanterns.jpg',
  },
  {
    id: 'led-ceiling',
    category: 'LED Ceiling Systems',
    title: 'Kinetic Ribbon & Starfield Canopies',
    kelvinRange: '2700K – 6000K Dynamic',
    description:
      'Seamless architectural light ribbons and micro-point star arrays embedded inside acoustic mineral ceilings.',
    idealWorlds: ['cosmic', 'aqua'],
    application: 'Futuristic lounges, experience centres & flagship showrooms',
    image: '/assets/curated/cosmic_wave_gallery.jpg',
  },
  {
    id: 'interactive',
    category: 'Interactive Lighting Concepts',
    title: 'Circadian & Presence-Responsive Zones',
    kelvinRange: '2200K – 6500K Automated',
    description:
      'Scene choreography shifting gradually from crisp morning clarity to restorative amber evening hospitality.',
    idealWorlds: ['cosmic', 'forest', 'aqua'],
    application: 'Smart corporate offices, residences & interactive retail',
    image: '/assets/curated/ai_space_designer.jpg',
  },
  {
    id: 'hospitality',
    category: 'Hospitality Lighting',
    title: 'Layered Intimacy & Focal Dining Pools',
    kelvinRange: '2400K – 2700K Ultra-Warm',
    description:
      'Pinpoint table illumination paired with deep perimeter shadows to create theatrical calm in restaurants and bars.',
    idealWorlds: ['aqua', 'royal', 'forest'],
    application: 'Destination restaurants, underwater cafés & boutique hotels',
    image: '/assets/curated/aqua_immersive_cafe.jpg',
  },
  {
    id: 'smart',
    category: 'Smart Lighting Solutions',
    title: 'Unified Scene & Acoustic Dimming Matrix',
    kelvinRange: 'Full DALI / Matter Tunable',
    description:
      'App, voice, and sensor-driven lighting presets pre-programmed around Sensora World moods and spatial zones.',
    idealWorlds: ['cosmic', 'forest', 'desert'],
    application: 'Whole-home automation & commercial hospitality portfolios',
    image: '/assets/curated/cosmic_waterfall_lounge.jpg',
  },
];

export const CONCEPT_PROJECTS: ConceptProject[] = [
  {
    id: 'aqua-lounge',
    title: 'The Aqua Lounge',
    category: 'Destination Underwater-Themed Café',
    worldId: 'aqua',
    worldLabel: 'Aqua World',
    locationInspiration: 'Coastal Hospitality Concept · Conceptual Visualisation',
    conceptSummary:
      'An intimate vaulted glass tunnel café wrapped in deep marine velvet, brushed bronze structural ribs, and glowing amber lanterns against living reef vistas.',
    materialSelection: [
      'Pelagic Coral Lustre Mosaic (SNS-ART-502)',
      'Honoured Basalt & Brass Inlay Flooring',
      'Brushed Marine Bronze Arch Ribs',
    ],
    lightingApproach:
      '2700K warm suspended amber lanterns balanced by cool aquatic ambient refractions along the curved glass ceiling.',
    architecturalDetails:
      'Curved panoramic acoustic glass vaulting paired with deep emerald-teal banquette upholstery and reflective wet-stone walkways.',
    image: '/assets/curated/aqua_tunnel_lanterns.jpg',
    secondaryImage: '/src/assets/images/vis_bioluminescent_aqua_spa_1794847535692.jpg',
  },
  {
    id: 'emerald-office',
    title: 'The Emerald Office',
    category: 'Futuristic Biophilic Corporate Workspace',
    worldId: 'forest',
    worldLabel: 'Forest World',
    locationInspiration: 'Bengaluru Tech Corridor Concept · Conceptual Visualisation',
    conceptSummary:
      'A calm, restorative executive workspace pairing bookmatched emerald marble monoliths, suspended circular ring lights, and textured stone feature walls.',
    materialSelection: [
      'Sylva Deep Emerald Vein Slab (SNS-NAT-301)',
      'Kaveri Honed Slate Monolith (SNS-STN-601)',
      'Botanical Acoustic Moss Reliefs',
    ],
    lightingApproach:
      'Floating orbital LED ring suspensions providing uniform glare-free illumination complemented by warm hearth accent lighting.',
    architecturalDetails:
      'Open-plan lounge zoning with curved emerald velvet seating, recessed architectural bookshelves, and natural stone partitions.',
    image: '/assets/curated/forest_emerald_lounge.jpg',
    secondaryImage: '/assets/curated/city_bengaluru_biophilic.jpg',
  },
  {
    id: 'forest-table',
    title: 'The Forest Table',
    category: 'Nature-Inspired Experiential Restaurant',
    worldId: 'forest',
    worldLabel: 'Forest World',
    locationInspiration: 'Botanical Courtyard Concept · Conceptual Visualisation',
    conceptSummary:
      'An enchanted indoor conservatory restaurant anchored by sculptural living trees, moon-globe suspensions, and carved timber archways.',
    materialSelection: [
      'Canopy Botanical Moss Relief (SNS-NAT-302)',
      'Thar Raw Travertine Vein (SNS-STN-602)',
      'Reclaimed Carved Teak & Brass Trim',
    ],
    lightingApproach:
      'Luminous orb pendants nestled within the upper tree canopy combined with intimate 2700K candlelight-level table pin spots.',
    architecturalDetails:
      'Winding stone pathways, indoor water channels, and organic timber trellises creating distinct private dining alcoves.',
    image: '/assets/curated/forest_world_enchanted.jpg',
    secondaryImage: '/assets/curated/forest_world_courtyard.jpg',
  },
  {
    id: 'royal-residence',
    title: 'The Royal Residence',
    category: 'Contemporary Luxury Penthouse',
    worldId: 'royal',
    worldLabel: 'Royal World',
    locationInspiration: 'Mumbai & Hyderabad Luxury Living Concept · Conceptual Visualisation',
    conceptSummary:
      'A serene high-rise residence merging floor-to-ceiling twilight skyline views with warm ivory marble, gold-inlaid stone, and sculpted brass coffers.',
    materialSelection: [
      'Meridian Gold-Inlay Chevron (SNS-GEO-402)',
      'Aurelia Champagne Bronze Fluted (SNS-MET-202)',
      'Samsara Hand-Gilded Artisan Slab (SNS-ART-501)',
    ],
    lightingApproach:
      'Recessed warm perimeter ceiling coves paired with brushed brass table lamps that frame skyline reflections without window glare.',
    architecturalDetails:
      'Seamless bookmatched stone flooring, bespoke bronze window mullions, and calm neutral linen-upholstered seating islands.',
    image: '/src/assets/images/vis_royal_chandeliers_hall_1794847533984.jpg',
    secondaryImage: '/assets/curated/city_mumbai_penthouse.jpg',
  },
  {
    id: 'cosmic-suite',
    title: 'The Cosmic Suite',
    category: 'Futuristic Experiential Hospitality Suite',
    worldId: 'cosmic',
    worldLabel: 'Cosmic World',
    locationInspiration: 'Next-Generation Resort Concept · Conceptual Visualisation',
    conceptSummary:
      'A dramatic futuristic lounge suite centred around an illuminated circular ceiling waterfall, recessed golden ring coffers, and obsidian marble flooring.',
    materialSelection: [
      'Nebula Brushed Titanium Rib (SNS-MET-201)',
      'Obsidian & Ivory Bookmatched Porcelain',
      'Backlit Acoustic Halo Trim',
    ],
    lightingApproach:
      'Layered circular champagne-gold halo coves paired with cool cyan water-feature illumination and low-glare floor washes.',
    architecturalDetails:
      'Sunken conversation lounge encircling a central hydro-feature beneath concentric cantilevered architectural ceiling rings.',
    image: '/assets/curated/cosmic_waterfall_lounge.jpg',
    secondaryImage: '/assets/curated/ai_hologram_living.jpg',
  },
  {
    id: 'desert-sanctuary',
    title: 'The Desert Sanctuary',
    category: 'Tactile Architectural Spa & Living Pavilion',
    worldId: 'desert',
    worldLabel: 'Desert World',
    locationInspiration: 'Rajasthan & Coastal Wellness Concept · Conceptual Visualisation',
    conceptSummary:
      'A meditative architectural space wrapped in undulating 3D wave reliefs, hexagonal mineral facets, and warm timber slats bathed in grazing light.',
    materialSelection: [
      'Unda Sculptural Wave Panel (SNS-3D-101)',
      'Hexa Prism Architectural Facet (SNS-3D-102)',
      'Bespoke Acoustic Dune Fluting (SNS-CUS-802)',
    ],
    lightingApproach:
      '2700K continuous linear wall-washing concealed along ceiling perimeters to sculpt deep shadow lines across textured tiles.',
    architecturalDetails:
      'Flowing floor-to-wall tile transitions, integrated timber slat ceilings, and quiet monolithic stone platforms.',
    image: '/src/assets/images/vis_desert_dune_pavilion_1794847535848.jpg',
    secondaryImage: '/assets/curated/sculptural_tile_gallery.jpg',
  },
  {
    id: 'future-gallery',
    title: 'The Future Gallery',
    category: 'Interactive Brand & Architectural Showroom',
    worldId: 'cosmic',
    worldLabel: 'Cosmic World',
    locationInspiration: 'Flagship Experience Centre Concept · Conceptual Visualisation',
    conceptSummary:
      'An immersive gallery corridor where sweeping sculptural arches meet kinetic amber light streams and responsive spatial projection surfaces.',
    materialSelection: [
      'Nebula Brushed Titanium Rib (SNS-MET-201)',
      'Prismatix Diamond Lattice (SNS-GEO-401)',
      'Seamless Acoustic Midnight Micro-Cement',
    ],
    lightingApproach:
      'Programmable floor-to-ceiling luminous data ribbons guiding visitor circulation across dark reflective mineral surfaces.',
    architecturalDetails:
      'Organic arched portals, cantilevered sculptural reception monolith, and zero-threshold gallery transitions.',
    image: '/assets/curated/cosmic_wave_gallery.jpg',
    secondaryImage: '/assets/curated/luxury_organic_showroom.jpg',
  },
  {
    id: 'signature-lobby',
    title: 'The Signature Lobby',
    category: 'Grand Architectural Atrium & Arrival Portal',
    worldId: 'forest',
    worldLabel: 'Forest World',
    locationInspiration: 'Five-Star Hospitality Entrance Concept · Conceptual Visualisation',
    conceptSummary:
      'A monumental arrival atrium featuring multi-storey biophilic canopies, curved stone water islands, and golden structural portal geometry.',
    materialSelection: [
      'Kaveri Honed Slate Monolith (SNS-STN-601)',
      'Aurelia Champagne Bronze Fluted (SNS-MET-202)',
      'Thar Raw Travertine Vein (SNS-STN-602)',
    ],
    lightingApproach:
      'Daylit timber lattice skylights transitioning smoothly into warm 3000K architectural uplighting across trees and stone bridges.',
    architecturalDetails:
      'Double-height living botanical walls framing sculptural travertine stepping islands over shallow reflecting pools.',
    image: '/src/assets/images/hero_magical_portal_vista_1794847532486.jpg',
    secondaryImage: '/src/assets/images/hero_emerald_sanctuary_3d_1794847533511.jpg',
  },
];

export const INDIAN_CITIES: CityConcept[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    image: '/assets/curated/city_bengaluru_biophilic.jpg',
    headline: 'Biophilic Workspaces & Smart Garden Architecture',
    description:
      'Conceptual showcase inspired by Bengaluru’s lush canopy and technology culture—blending glass-roofed cafés, smart collaborative studios, and living botanical walls.',
    themes: ['Futuristic Offices', 'Smart Workspaces', 'Technology Showrooms', 'Biophilic Cafés'],
    projectTypes: ['R&D Experience Centres', 'Garden-Atrium Cafés', 'Intelligent Residences'],
    recommendedWorld: 'forest',
    mapCoords: { x: 185, y: 365 },
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    image: '/assets/curated/city_mumbai_penthouse.jpg',
    headline: 'Skyline Penthouses & Coastal Hospitality',
    description:
      'Conceptual showcase tailored to high-rise sea-facing living and flagship hospitality—pairing luminous stone slabs, brushed bronze, and twilight horizon lighting.',
    themes: ['Luxury Apartments', 'Premium Hospitality', 'Artistic Architectural Surfaces'],
    projectTypes: ['High-Rise Penthouses', 'Boutique Marine Lounges', 'Designer Flagships'],
    recommendedWorld: 'royal',
    mapCoords: { x: 122, y: 278 },
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    image: '/assets/curated/city_hyderabad_royal.jpg',
    headline: 'Contemporary Royal Hospitality & Heritage Craft',
    description:
      'Conceptual showcase celebrating Deccan architectural poise through sculpted arches, geometric inlay floors, deep claret accents, and warm lantern lighting.',
    themes: ['Heritage-Inspired Restaurants', 'Boutique Hotels', 'Contemporary Royal Interiors'],
    projectTypes: ['Destination Dining Lounges', 'Luxury Hotel Lobbies', 'Estate Villas'],
    recommendedWorld: 'royal',
    mapCoords: { x: 205, y: 298 },
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'New Delhi',
    image: '/assets/curated/city_delhi_gallery.jpg',
    headline: 'Sculptural Galleries & Statement Retail',
    description:
      'Conceptual showcase envisioning monumental travertine galleries, quiet minimalist art spaces, and bespoke architectural retail pavilions.',
    themes: ['Luxury Retail', 'Art Galleries', 'Statement Interiors'],
    projectTypes: ['Private Art Foundations', 'Couture Showrooms', 'Diplomatic Residences'],
    recommendedWorld: 'desert',
    mapCoords: { x: 178, y: 125 },
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    image: '/assets/curated/city_chennai_tropical.jpg',
    headline: 'Tropical Stone Pavilions & Coastal Wellness',
    description:
      'Conceptual showcase embracing breezy coastal proportions, natural teak ceilings, tactile sandstone, and tranquil indoor-outdoor water courts.',
    themes: ['Tropical Interiors', 'Natural Stone', 'Wellness & Hospitality'],
    projectTypes: ['Coastal Resort Villas', 'Ayurvedic Wellness Spas', 'Courtyard Homes'],
    recommendedWorld: 'desert',
    mapCoords: { x: 228, y: 375 },
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    image: '/assets/curated/city_pune_workspace.jpg',
    headline: 'Creative Studios & Acoustic Modern Living',
    description:
      'Conceptual showcase fusing sculpted acoustic wall reliefs, warm timber ceiling baffles, and fluid seating for creative campuses and modern homes.',
    themes: ['Creative Offices', 'Modern Residences', 'Technology-Inspired Interiors'],
    projectTypes: ['Design Studios', 'Acoustic Lounges', 'Contemporary Apartments'],
    recommendedWorld: 'cosmic',
    mapCoords: { x: 142, y: 292 },
  },
];

export const SPACE_SERVICES: SpaceService[] = [
  {
    id: 'res-apartments',
    group: 'Residential',
    title: 'Luxury Apartments & Penthouses',
    subtitle: 'Skyline calm · Bookmatched stone · Tunable lighting',
    description:
      'Tailored spatial concepts for urban residences balancing acoustic serenity, bespoke decorative surfaces, and intelligent evening lighting.',
    approach:
      'AI-assisted spatial zoning paired with curated Sensora World material palettes and low-glare cove illumination.',
    relatedWorld: 'royal',
    image: '/assets/curated/city_mumbai_penthouse.jpg',
  },
  {
    id: 'res-villas',
    group: 'Residential',
    title: 'Private Villas & Courtyard Homes',
    subtitle: 'Indoor-outdoor flow · Natural stone · Biophilic courts',
    description:
      'Holistic architectural interiors connecting landscaped courts, living rooms, kitchens, and spa-inspired bathrooms.',
    approach:
      'Monolithic travertine and emerald stone transitions engineered for Indian climates and timeless tactile warmth.',
    relatedWorld: 'desert',
    image: '/assets/curated/city_chennai_tropical.jpg',
  },
  {
    id: 'res-suites',
    group: 'Residential',
    title: 'Living Rooms, Bedrooms & Wellness Baths',
    subtitle: '3D feature walls · Artisanal tiles · Restorative scenes',
    description:
      'Personalised room-by-room architectural transformation covering sculptural headboard walls, seamless bath stone, and kitchen islands.',
    approach:
      'Interactive Sensora AI Designer previews paired with tactile physical tile sample boxes before execution.',
    relatedWorld: 'forest',
    image: '/assets/curated/cosmic_waterfall_lounge.jpg',
  },
  {
    id: 'com-hospitality',
    group: 'Commercial',
    title: 'Hotels, Resorts, Cafés & Restaurants',
    subtitle: 'Signature themes · Experiential storytelling · High-durability surfaces',
    description:
      'Immersive hospitality concepts—from underwater dining tunnels to enchanted forest cafés and regal hotel lobbies.',
    approach:
      'Thematic world-building integrating slip-rated architectural surfaces, custom pendants, and theatrical lighting scenes.',
    relatedWorld: 'aqua',
    image: '/assets/curated/aqua_immersive_cafe.jpg',
  },
  {
    id: 'com-workspaces',
    group: 'Commercial',
    title: 'Corporate Offices & Experience Studios',
    subtitle: 'Biophilic focus · Acoustic geometry · Smart lighting',
    description:
      'High-performance workplaces and wellness-centred executive lounges designed to inspire clarity and team connection.',
    approach:
      'Acoustic 3D wall reliefs, circadian lighting rhythms, and signature reception monoliths.',
    relatedWorld: 'forest',
    image: '/assets/curated/forest_emerald_lounge.jpg',
  },
  {
    id: 'com-retail',
    group: 'Commercial',
    title: 'Shopping Malls & Flagship Retail Showrooms',
    subtitle: 'Monumental portals · Kinetic light · Gallery architecture',
    description:
      'High-impact commercial arrival portals, luxury automotive and lifestyle pavilions, and interactive digital galleries.',
    approach:
      'Parametric ceiling geometry, metallic fluted cladding, and programmable architectural lighting corridors.',
    relatedWorld: 'cosmic',
    image: '/assets/curated/luxury_organic_showroom.jpg',
  },
];

export const DEFAULT_CONTACT_CONFIG: BusinessContactConfig = {
  address: 'No. 42, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
  email: 'atelier@sathsang-sensora.in',
  phone: '+91 80 4128 7490',
  whatsapp: '+91 98450 61234',
  instagram: '@sensora.atelier',
  facebook: 'fb.com/sensora.atelier',
  linkedin: 'linkedin.com/company/sathsang-sensora-ai',
  youtube: 'youtube.com/@sensoraatelier',
  xProfile: '@sensora_ai',
  hoursWeekday: 'Monday – Saturday: 10:00 AM – 7:30 PM IST',
  hoursWeekend: 'Sunday: By Private Studio Appointment',
};

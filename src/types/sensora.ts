export type WorldId = 'aqua' | 'forest' | 'cosmic' | 'royal' | 'desert';

export type NavSection =
  | 'home'
  | 'worlds'
  | 'visualisations'
  | 'ai-designer'
  | 'tile-atelier'
  | 'lighting-lab'
  | 'spaces'
  | 'cities'
  | 'projects'
  | 'about'
  | 'contact';

export interface DesignWorld {
  id: WorldId;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  narrative: string;
  experienceSummary: string;
  ctaLabel: string;
  heroImage: string;
  secondaryImages: string[];
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    names: string[];
  };
  materials: {
    name: string;
    specification: string;
    application: string;
  }[];
  lightingApproach: {
    kelvin: string;
    fixtureStyle: string;
    mood: string;
  };
  applications: string[];
  recommendedTileCodes: string[];
  relatedProjectIds: string[];
  threeConfig: {
    bgHex: number;
    fogHex: number;
    slabHex: number;
    accentHex: number;
    roughness: number;
    metalness: number;
    pattern: 'ripple' | 'veined' | 'metallic' | 'heritage' | 'terracotta';
  };
}

export type TileCategory =
  | '3D Sculptural'
  | 'Metallic'
  | 'Nature-Inspired'
  | 'Geometric'
  | 'Artistic'
  | 'Stone-Effect'
  | 'Heritage-Pattern'
  | 'Custom Surfaces';

export type TileFinish = 'Matte' | 'Glossy' | 'Textured' | 'Metallic';

export interface TileProduct {
  id: string;
  code: string;
  name: string;
  category: TileCategory;
  finish: TileFinish;
  material: string;
  colour: string;
  colourHex: string;
  sizeMm: string;
  priceInrPerSqFt: number;
  application: ('Wall' | 'Floor')[];
  worldAffinity: WorldId[];
  image: string;
  description: string;
  patternStyle:
    | 'fluted'
    | 'hex'
    | 'marble'
    | 'terrazzo'
    | 'bronze'
    | 'wave'
    | 'ripple'
    | 'heritage'
    | 'sandstone';
}

export interface LightingSystem {
  id: string;
  category: string;
  title: string;
  kelvinRange: string;
  description: string;
  idealWorlds: WorldId[];
  application: string;
  image: string;
}

export interface ConceptProject {
  id: string;
  title: string;
  category: string;
  worldId: WorldId;
  worldLabel: string;
  locationInspiration: string;
  conceptSummary: string;
  materialSelection: string[];
  lightingApproach: string;
  architecturalDetails: string;
  image: string;
  secondaryImage?: string;
}

export interface CityConcept {
  id: string;
  name: string;
  state: string;
  image: string;
  headline: string;
  description: string;
  themes: string[];
  projectTypes: string[];
  recommendedWorld: WorldId;
  mapCoords: { x: number; y: number };
}

export interface SpaceService {
  id: string;
  group: 'Residential' | 'Commercial';
  title: string;
  subtitle: string;
  description: string;
  approach: string;
  relatedWorld: WorldId;
  image: string;
}

export interface AIDesignerRequest {
  roomType: string;
  designWorld: string;
  preferredColours: string[];
  surfaceFinish: string;
  lightingPreference: string;
  budgetInr: number;
  notes?: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface AIDesignerResult {
  source: 'gemini-ai' | 'demo-preset';
  aiActive: boolean;
  conceptTitle: string;
  designConcept: string;
  colourPalette: { name: string; hex: string; role: string }[];
  wallAndFloorMaterials: {
    walls: string;
    flooring: string;
    featureAccent: string;
  };
  tileRecommendations: {
    code: string;
    name: string;
    placement: string;
    reason: string;
  }[];
  lightingRecommendations: string;
  designExplanation: string;
  estimatedBudgetRange: string;
  previewImage: string;
  previewDisclaimer: string;
  roomObservation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: 'gemini-ai' | 'demo-assistant';
  suggestedActions?: { label: string; target: NavSection | 'consultation' }[];
  timestamp: string;
}

export interface BusinessContactConfig {
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  xProfile: string;
  hoursWeekday: string;
  hoursWeekend: string;
}

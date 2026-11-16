import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const WORLD_PREVIEW_IMAGES: Record<string, string> = {
  aqua: '/src/assets/images/vis_bioluminescent_aqua_spa_1794847535692.jpg',
  forest: '/src/assets/images/hero_emerald_sanctuary_3d_1794847533511.jpg',
  cosmic: '/assets/curated/cosmic_wave_gallery.jpg',
  royal: '/src/assets/images/vis_royal_chandeliers_hall_1794847533984.jpg',
  desert: '/src/assets/images/vis_desert_dune_pavilion_1794847535848.jpg',
  'modern luxury': '/assets/curated/city_mumbai_penthouse.jpg',
  minimalist: '/assets/curated/city_delhi_gallery.jpg',
};

function buildFallbackDesign(payload: {
  roomType: string;
  designWorld: string;
  preferredColours: string[];
  surfaceFinish: string;
  lightingPreference: string;
  budgetInr: number;
  hasImage: boolean;
}) {
  const worldKey = payload.designWorld.toLowerCase();
  const previewImage =
    WORLD_PREVIEW_IMAGES[worldKey] || '/assets/curated/ai_space_designer.jpg';
  const lowBudget = Math.max(150000, Math.round(payload.budgetInr * 0.85));
  const highBudget = Math.max(lowBudget + 100000, Math.round(payload.budgetInr * 1.18));

  const worldPalettes: Record<string, { name: string; hex: string; role: string }[]> = {
    aqua: [
      { name: 'Abyssal Teal', hex: '#0E3A46', role: 'Feature Wall & Upholstery' },
      { name: 'Warm Basalt', hex: '#1B2426', role: 'Honed Mineral Flooring' },
      { name: 'Champagne Brass', hex: '#D5B77A', role: 'Architectural Framing & Luminaires' },
      { name: 'Seafoam Mist', hex: '#A5C7C9', role: 'Ceiling Grazing Reflection' },
    ],
    forest: [
      { name: 'Deep Emerald', hex: '#102B28', role: 'Bookmatched Stone Monolith' },
      { name: 'Smoked Walnut', hex: '#4B3626', role: 'Ceiling Baffles & Joinery' },
      { name: 'Travertine Ivory', hex: '#EAE0D0', role: 'Perimeter Plaster & Flooring' },
      { name: 'Champagne Gold', hex: '#D5B77A', role: 'Hardware & Rim Lighting' },
    ],
    cosmic: [
      { name: 'Midnight Indigo', hex: '#121829', role: 'Acoustic Ceiling & Primary Walls' },
      { name: 'Gunmetal Titanium', hex: '#353C4A', role: 'Metallic Fluted Wall Panels' },
      { name: 'Solar Amber', hex: '#E2A85C', role: 'Linear Light Ribbons' },
      { name: 'Obsidian Slate', hex: '#191B1E', role: 'Reflective Floor Planes' },
    ],
    royal: [
      { name: 'Imperial Claret', hex: '#4E1F28', role: 'Accent Niche & Soft Seating' },
      { name: 'Deep Emerald', hex: '#102B28', role: 'Architectural Feature Stone' },
      { name: 'Burnished Bronze', hex: '#A77C55', role: 'Arched Trims & Fluting' },
      { name: 'Warm Ivory', hex: '#F4EFE5', role: 'Inlay Flooring & Upper Walls' },
    ],
    desert: [
      { name: 'Dune Sandstone', hex: '#C7B299', role: 'Sculptural Relief Walls' },
      { name: 'Raw Terracotta', hex: '#9B6044', role: 'Kiln-Fired Fluted Accents' },
      { name: 'Warm Chalk', hex: '#F4EFE5', role: 'Breathable Lime Plaster' },
      { name: 'Soft Bronze', hex: '#A77C55', role: 'Concealed Grazing Channels' },
    ],
  };

  const palette = worldPalettes[worldKey] || worldPalettes.forest;

  return {
    source: 'demo-preset' as const,
    aiActive: false,
    conceptTitle: `${payload.designWorld} ${payload.roomType} Sanctuary`,
    designConcept: `A cohesive ${payload.designWorld.toLowerCase()} architectural direction for your ${payload.roomType.toLowerCase()}, combining ${payload.surfaceFinish.toLowerCase()} surfaces with ${payload.lightingPreference.toLowerCase()} illumination and notes of ${payload.preferredColours.join(', ') || 'warm mineral tones'}.`,
    colourPalette: palette,
    wallAndFloorMaterials: {
      walls: `${payload.surfaceFinish} sculptural architectural tiles paired with mineral lime-wash plaster in balanced tonal contrast.`,
      flooring: `Large-format rectified stone-effect slabs (1200×2400mm) with anti-glare ${payload.surfaceFinish.toLowerCase()} finish.`,
      featureAccent: `Brushed champagne-gold architectural trims and recessed vertical wall-wash channels.`,
    },
    tileRecommendations: [
      {
        code: worldKey === 'cosmic' ? 'SNS-MET-201' : worldKey === 'aqua' ? 'SNS-ART-502' : 'SNS-3D-101',
        name:
          worldKey === 'cosmic'
            ? 'Nebula Brushed Titanium Rib'
            : worldKey === 'aqua'
              ? 'Pelagic Coral Lustre Mosaic'
              : 'Unda Sculptural Wave Panel',
        placement: 'Primary Focal Wall',
        reason: `Delivers depth and tactile geometry aligned with ${payload.designWorld}.`,
      },
      {
        code: worldKey === 'desert' ? 'SNS-STN-602' : worldKey === 'royal' ? 'SNS-GEO-402' : 'SNS-STN-601',
        name:
          worldKey === 'desert'
            ? 'Thar Raw Travertine Vein'
            : worldKey === 'royal'
              ? 'Meridian Gold-Inlay Chevron'
              : 'Kaveri Honed Slate Monolith',
        placement: 'Continuous Floor Plane',
        reason: `Grounds the ${payload.roomType.toLowerCase()} with durable architectural continuity.`,
      },
      {
        code: worldKey === 'forest' ? 'SNS-NAT-301' : 'SNS-MET-202',
        name:
          worldKey === 'forest'
            ? 'Sylva Deep Emerald Vein Slab'
            : 'Aurelia Champagne Bronze Fluted',
        placement: 'Secondary Architectural Accent / Console',
        reason: 'Adds refined contrast and material focal hierarchy.',
      },
    ],
    lightingRecommendations: `${payload.lightingPreference} layered across perimeter 2700K–3000K architectural coves, narrow-beam wall grazers (CRI 95+) to highlight tile relief, and a central sculptural pendant.`,
    designExplanation: `To transform a ${payload.roomType.toLowerCase()} within the ${payload.designWorld} language, surfaces are organised in a calm 60-30-10 architectural hierarchy: monolithic calm across main planes, tactile ${payload.surfaceFinish.toLowerCase()} relief on the focal elevation, and deliberate warm metallic highlights.`,
    estimatedBudgetRange: `₹${lowBudget.toLocaleString('en-IN')} – ₹${highBudget.toLocaleString('en-IN')} (Illustrative Concept Estimate)`,
    previewImage,
    previewDisclaimer: payload.hasImage
      ? 'Conceptual Visualisation Preview: Curated Sensora architectural reference matched to your specifications (demo mode without live image re-rendering).'
      : 'Conceptual Visualisation Preview: Curated Sensora architectural reference matched to your selected world.',
    roomObservation: payload.hasImage
      ? 'Uploaded room photograph attached for proportion reference in your downloadable design brief.'
      : undefined,
  };
}

function ruleBasedChatbotReply(message: string): {
  reply: string;
  suggestedActions: { label: string; target: string }[];
} {
  const lower = message.toLowerCase();

  if (lower.includes('underwater') || lower.includes('aqua') || lower.includes('café') || lower.includes('cafe')) {
    return {
      reply:
        'Aqua World is crafted for underwater-inspired cafés, hospitality lounges, and serene dining spaces. We combine curved panoramic glass ribs, Pelagic Coral Lustre Mosaic (SNS-ART-502), honed basalt flooring, and 3000K warm lantern lighting layered over marine cyan uplights. Would you like to explore Aqua World or generate a bespoke café concept in our AI Designer?',
      suggestedActions: [
        { label: 'Explore Aqua World', target: 'worlds' },
        { label: 'Open AI Designer', target: 'ai-designer' },
      ],
    };
  }

  if (lower.includes('living room') || lower.includes('design my') || lower.includes('bedroom')) {
    return {
      reply:
        'I can help shape your room around one of our five architectural worlds—from the calm emerald stone of Forest World to the sculpted sandstone curves of Desert World. You can upload a photo of your room in the SENSORA AI DESIGNER, select your finish and INR budget, and download a complete material and lighting brief.',
      suggestedActions: [
        { label: 'Launch AI Designer', target: 'ai-designer' },
        { label: 'Explore Five Worlds', target: 'worlds' },
      ],
    };
  }

  if (lower.includes('tile') || lower.includes('surface') || lower.includes('sample')) {
    return {
      reply:
        'Our Tile Atelier features 14 illustrative architectural surfaces across 3D Sculptural, Metallic, Nature-Inspired, Geometric, Artistic, Stone-Effect, Heritage-Pattern, and Custom categories—starting from ₹295/sq.ft (illustrative demo pricing). You can filter finishes, compare up to 3 tiles side-by-side, or use AI Tile Matcher with a room photo.',
      suggestedActions: [
        { label: 'Browse Tile Atelier', target: 'tile-atelier' },
        { label: 'Open AI Tile Matcher', target: 'tile-atelier' },
      ],
    };
  }

  if (lower.includes('light') || lower.includes('restaurant') || lower.includes('kelvin')) {
    return {
      reply:
        'For restaurants and hospitality interiors, Sensora Lighting Lab recommends 2400K–2700K ultra-warm focal table pools paired with CRI 95+ narrow-beam wall grazers to bring out 3D tile textures. You can compare 2700K Warm, 4000K Neutral, and 6000K Cool moods live inside our Lighting Lab.',
      suggestedActions: [
        { label: 'Enter Lighting Lab', target: 'lighting-lab' },
        { label: 'Book Lighting Consultation', target: 'consultation' },
      ],
    };
  }

  if (lower.includes('book') || lower.includes('consult') || lower.includes('contact') || lower.includes('price')) {
    return {
      reply:
        'We would love to discuss your architectural vision. You can submit a Consultation Booking with your city, space type, preferred world, and approximate INR budget, or share your enquiry via our Contact section. Note that this preview stores enquiries in demo mode until live business contact details are connected.',
      suggestedActions: [
        { label: 'Book Consultation', target: 'consultation' },
        { label: 'Go to Contact', target: 'contact' },
      ],
    };
  }

  return {
    reply:
      'Welcome to SENSORA DESIGN INTELLIGENCE (Demo Assistant Mode). I can guide you across our Five Architectural Worlds (Aqua, Forest, Cosmic, Royal, Desert), suggest decorative tiles from Tile Atelier, explain Lighting Lab scenes, or route you to the SENSORA AI DESIGNER and Consultation Booking. What kind of space are you imagining today?',
    suggestedActions: [
      { label: 'Explore Five Worlds', target: 'worlds' },
      { label: 'Launch AI Designer', target: 'ai-designer' },
      { label: 'Browse Tile Atelier', target: 'tile-atelier' },
    ],
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health & capability status (never leaks secrets)
  app.get('/api/health', (_req, res) => {
    const ai = getGeminiClient();
    res.json({
      ok: true,
      aiConfigured: Boolean(ai),
      brand: 'SATHSANG presents SENSORA AI',
    });
  });

  // SENSORA AI DESIGNER endpoint
  app.post('/api/ai-designer', async (req, res) => {
    const {
      roomType = 'Living room',
      designWorld = 'Forest',
      preferredColours = ['Deep Emerald', 'Champagne Gold'],
      surfaceFinish = 'Matte',
      lightingPreference = 'Warm Ambient',
      budgetInr = 650000,
      notes = '',
      imageBase64,
      imageMimeType,
    } = req.body || {};

    const fallback = buildFallbackDesign({
      roomType,
      designWorld,
      preferredColours: Array.isArray(preferredColours) ? preferredColours : [],
      surfaceFinish,
      lightingPreference,
      budgetInr: Number(budgetInr) || 650000,
      hasImage: Boolean(imageBase64),
    });

    const ai = getGeminiClient();
    if (!ai) {
      return res.json(fallback);
    }

    try {
      const promptText = `You are the senior architectural director at SATHSANG presents SENSORA AI ("Beyond Interiors. Into Experiences.").
Create a bespoke luxury interior design specification for:
- Room Type: ${roomType}
- Design World / Style: ${designWorld}
- Preferred Colours: ${(preferredColours || []).join(', ') || 'Architect curated'}
- Surface & Tile Finish Preference: ${surfaceFinish}
- Lighting Preference: ${lightingPreference}
- Approximate Budget (INR): ₹${Number(budgetInr).toLocaleString('en-IN')}
- Client Notes: ${notes || 'None'}

Choose tile recommendations from these illustrative SENSORA codes where appropriate:
SNS-3D-101 (Unda Sculptural Wave Panel), SNS-3D-102 (Hexa Prism Architectural Facet), SNS-MET-201 (Nebula Brushed Titanium Rib), SNS-MET-202 (Aurelia Champagne Bronze Fluted), SNS-NAT-301 (Sylva Deep Emerald Vein Slab), SNS-NAT-302 (Canopy Botanical Moss Relief), SNS-GEO-401 (Prismatix Diamond Lattice), SNS-GEO-402 (Meridian Gold-Inlay Chevron), SNS-ART-501 (Samsara Hand-Gilded Artisan Slab), SNS-ART-502 (Pelagic Coral Lustre Mosaic), SNS-STN-601 (Kaveri Honed Slate Monolith), SNS-STN-602 (Thar Raw Travertine Vein), SNS-HER-701 (Deccan Imperial Octagon Inlay), SNS-CUS-802 (Bespoke Acoustic Dune Fluting).

If a room photograph is attached, include a brief, concrete "roomObservation" noting visible layout, light, or spatial proportions. Keep language refined, luxury-architectural, and truthful.`;

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (imageBase64 && imageMimeType) {
        const cleanBase64 = String(imageBase64).replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: String(imageMimeType),
            data: cleanBase64,
          },
        });
      }
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: parts.length === 1 ? promptText : { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conceptTitle: { type: Type.STRING },
              designConcept: { type: Type.STRING },
              roomObservation: { type: Type.STRING },
              colourPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                    role: { type: Type.STRING },
                  },
                },
              },
              wallAndFloorMaterials: {
                type: Type.OBJECT,
                properties: {
                  walls: { type: Type.STRING },
                  flooring: { type: Type.STRING },
                  featureAccent: { type: Type.STRING },
                },
              },
              tileRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    code: { type: Type.STRING },
                    name: { type: Type.STRING },
                    placement: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                },
              },
              lightingRecommendations: { type: Type.STRING },
              designExplanation: { type: Type.STRING },
              estimatedBudgetRange: { type: Type.STRING },
            },
          },
        },
      });

      const rawJson = (response.text || '{}')
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();
      const parsed = JSON.parse(rawJson);
      return res.json({
        ...fallback,
        ...parsed,
        source: 'gemini-ai',
        aiActive: true,
        previewDisclaimer:
          'AI Architectural Brief generated via SENSORA AI Studio (Gemini). Visual preview uses curated Sensora world photography as a conceptual reference.',
      });
    } catch (err) {
      console.error('AI Designer error, falling back to preset:', err);
      return res.json(fallback);
    }
  });

  // SENSORA AI TILE MATCHER endpoint
  app.post('/api/tile-matcher', async (req, res) => {
    const {
      surfaceType = 'Wall',
      colourPreference = 'Emerald',
      finish = 'Matte',
      imageBase64,
      imageMimeType,
    } = req.body || {};

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        source: 'demo-preset',
        aiActive: false,
        rationale: `Matched illustrative ${finish.toLowerCase()} architectural tiles suited for ${surfaceType.toLowerCase()} applications with ${colourPreference} tonal harmony.`,
      });
    }

    try {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (imageBase64 && imageMimeType) {
        parts.push({
          inlineData: {
            mimeType: String(imageMimeType),
            data: String(imageBase64).replace(/^data:[^;]+;base64,/, ''),
          },
        });
      }
      parts.push({
        text: `You are a material specialist at SENSORA AI Tile Atelier. Give a concise 2-sentence architectural rationale for matching ${finish} ${surfaceType} tiles in ${colourPreference} tones${imageBase64 ? ' based on the uploaded interior photograph' : ''}.`,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
      });

      return res.json({
        source: 'gemini-ai',
        aiActive: true,
        rationale:
          response.text?.trim() ||
          `Curated ${finish} ${surfaceType} surfaces calibrated for ${colourPreference} architectural balance.`,
      });
    } catch (err) {
      console.error('Tile matcher AI error:', err);
      return res.json({
        source: 'demo-preset',
        aiActive: false,
        rationale: `Matched illustrative ${finish.toLowerCase()} architectural tiles suited for ${surfaceType.toLowerCase()} applications with ${colourPreference} tonal harmony.`,
      });
    }
  });

  // SENSORA DESIGN INTELLIGENCE CHATBOT endpoint
  app.post('/api/chat', async (req, res) => {
    const { message = '', history = [] } = req.body || {};
    if (!String(message).trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const demo = ruleBasedChatbotReply(String(message));
      return res.json({
        source: 'demo-assistant',
        aiActive: false,
        reply: demo.reply,
        suggestedActions: demo.suggestedActions,
      });
    }

    try {
      const systemInstruction = `You are SENSORA DESIGN INTELLIGENCE, the luxury architectural and interior design assistant for "SATHSANG presents SENSORA AI" ("Beyond Interiors. Into Experiences.").
Brand Structure: SENSORA WORLDS (Aqua World, Forest World, Cosmic World, Royal World, Desert World), SENSORA SURFACES (Tile Atelier with 14 illustrative architectural tiles ₹295–₹850/sq.ft), SENSORA LIGHT (Lighting Lab with 2700K/4000K/6000K simulation), SENSORA SPACES (Residential & Commercial), SENSORA AI STUDIO (AI Designer & AI Tile Matcher), and SENSORA ENTERPRISE.
Location context: Conceptual brand based in Bengaluru, Karnataka, India, with conceptual India showcases in Bengaluru, Mumbai, Hyderabad, Delhi, Chennai, and Pune.
Honesty rules: Never claim real completed buildings, awards, or existing physical showrooms—describe project showcases as conceptual visualisations and tile prices as illustrative demo figures. Keep answers concise, warm, inspiring, and practical, guiding the user to relevant sections like AI Designer, Explore Worlds, Tile Atelier, Lighting Lab, or Consultation Booking.`;

      const recentHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map((h: { role: string; content: string }) => `${h.role === 'user' ? 'Visitor' : 'Sensora'}: ${h.content}`)
            .join('\n')
        : '';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `${recentHistory ? `Conversation so far:\n${recentHistory}\n\n` : ''}Visitor: ${message}`,
        config: {
          systemInstruction,
        },
      });

      const fallbackActions = ruleBasedChatbotReply(String(message)).suggestedActions;

      return res.json({
        source: 'gemini-ai',
        aiActive: true,
        reply:
          response.text?.trim() ||
          'Let us shape an extraordinary interior world together. Would you like to explore our five architectural worlds or launch the AI Designer?',
        suggestedActions: fallbackActions,
      });
    } catch (err) {
      console.error('Chat error, using demo fallback:', err);
      const demo = ruleBasedChatbotReply(String(message));
      return res.json({
        source: 'demo-assistant',
        aiActive: false,
        reply: demo.reply,
        suggestedActions: demo.suggestedActions,
      });
    }
  });

  // Honest demo form submission handler (consultation, contact, sample request, newsletter)
  const demoSubmissions: Record<string, unknown>[] = [];
  app.post('/api/enquiries', (req, res) => {
    const body = req.body || {};
    if (!body.type) {
      return res.status(400).json({ error: 'Enquiry type is required.' });
    }
    const referenceId = `SNS-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = {
      referenceId,
      receivedAt: new Date().toISOString(),
      ...body,
    };
    demoSubmissions.push(record);
    if (demoSubmissions.length > 100) demoSubmissions.shift();

    return res.json({
      ok: true,
      mode: 'demo-local',
      referenceId,
      recordedAt: record.receivedAt,
      notice:
        'Demo mode: This submission is recorded in your preview session only and is not connected to a live business inbox.',
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SATHSANG presents SENSORA AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

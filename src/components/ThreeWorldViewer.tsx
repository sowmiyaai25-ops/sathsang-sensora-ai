import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface ThreeWorldViewerProps {
  title: string;
  bgHex: number;
  slabHex: number;
  accentHex: number;
  roughness: number;
  metalness: number;
  pattern: 'ripple' | 'veined' | 'metallic' | 'heritage' | 'terracotta';
  kelvinColorHex?: number;
  fallbackImage: string;
  className?: string;
}

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createProceduralSurfaceTexture(
  pattern: ThreeWorldViewerProps['pattern'],
  baseHex: number,
  accentHex: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const baseColor = '#' + new THREE.Color(baseHex).getHexString();
    const accentColor = '#' + new THREE.Color(accentHex).getHexString();
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    if (pattern === 'ripple' || pattern === 'terracotta') {
      ctx.strokeStyle = accentColor;
      for (let y = 0; y < 512; y += 18) {
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x <= 512; x += 16) {
          const offset = Math.sin(x * 0.03 + y * 0.04) * 8;
          if (x === 0) ctx.moveTo(x, y + offset);
          else ctx.lineTo(x, y + offset);
        }
        ctx.stroke();
      }
    } else if (pattern === 'veined') {
      ctx.strokeStyle = accentColor;
      for (let i = 0; i < 18; i++) {
        ctx.globalAlpha = 0.26;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        let x = (i * 53) % 512;
        ctx.moveTo(x, 0);
        for (let step = 1; step <= 14; step++) {
          x += Math.sin(step + i * 0.7) * 28;
          ctx.lineTo(x, (step / 14) * 512);
        }
        ctx.stroke();
      }
    } else if (pattern === 'metallic') {
      for (let x = 0; x < 512; x += 12) {
        ctx.fillStyle = x % 24 === 0 ? accentColor : '#000000';
        ctx.globalAlpha = x % 24 === 0 ? 0.24 : 0.18;
        ctx.fillRect(x, 0, 4, 512);
      }
    } else if (pattern === 'heritage') {
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      for (let y = 32; y < 512; y += 64) {
        for (let x = 32; x < 512; x += 64) {
          ctx.strokeRect(x - 22, y - 22, 44, 44);
          ctx.beginPath();
          ctx.moveTo(x, y - 28);
          ctx.lineTo(x + 28, y);
          ctx.lineTo(x, y + 28);
          ctx.lineTo(x - 28, y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const ThreeWorldViewer: React.FC<ThreeWorldViewerProps> = ({
  title,
  bgHex,
  slabHex,
  accentHex,
  roughness,
  metalness,
  pattern,
  kelvinColorHex = 0xf4dfb4,
  fallbackImage,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const controlsRef = useRef<{
    requestRender?: () => void;
    resetCamera?: () => void;
    exploded: number;
    wireframe: boolean;
    kelvinColorHex: number;
  }>({
    exploded: 0,
    wireframe: false,
    kelvinColorHex,
  });

  controlsRef.current.exploded = exploded;
  controlsRef.current.wireframe = wireframe;
  controlsRef.current.kelvinColorHex = kelvinColorHex;

  useEffect(() => {
    controlsRef.current.requestRender?.();
  }, [exploded, wireframe, kelvinColorHex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setContextLost(true);
      return;
    }

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.06);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(3.4, 2.3, 4.4);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = !isSoftwareGl;
    orbit.dampingFactor = 0.06;
    orbit.minDistance = 2.6;
    orbit.maxDistance = 8.5;
    orbit.maxPolarAngle = Math.PI * 0.52;
    orbit.target.set(0, 1.1, 0);

    const hemi = new THREE.HemisphereLight(0xa3c2bd, 0x121515, 0.75);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(kelvinColorHex, 2.1);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const pendantLight = new THREE.PointLight(kelvinColorHex, 7.5, 16, 1.5);
    pendantLight.position.set(0, 2.85, 0.35);
    scene.add(pendantLight);

    // Architectural pedestal base
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x161b1b,
      roughness: 0.48,
      metalness: 0.25,
    });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.85, 0.22, 48), baseMat);
    plinth.position.y = 0.11;
    scene.add(plinth);

    // 3-layer composite Architectural Surface Monolith Group
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    const tex = createProceduralSurfaceTexture(pattern, slabHex, accentHex);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const coreSlabMat = new THREE.MeshPhysicalMaterial({
      color: slabHex,
      map: tex,
      roughness,
      metalness,
      clearcoat: roughness < 0.3 ? 0.85 : 0.15,
    });

    const brassTrimMat = new THREE.MeshPhysicalMaterial({
      color: accentHex,
      roughness: 0.2,
      metalness: 0.92,
      anisotropy: 0.65,
    });

    const glassVeilMat = new THREE.MeshPhysicalMaterial({
      color: 0xd5ebe6,
      roughness: 0.08,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.75,
      transparent: true,
      opacity: isSoftwareGl ? 0.32 : 0.8,
      ior: 1.5,
    });

    const backPlate = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.25, 0.14), brassTrimMat);
    backPlate.position.set(0, 1.35, -0.18);
    assemblyGroup.add(backPlate);

    const heroSlab = new THREE.Mesh(new THREE.BoxGeometry(1.48, 2.08, 0.16), coreSlabMat);
    heroSlab.position.set(0, 1.35, 0);
    assemblyGroup.add(heroSlab);

    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(1.36, 1.94, 0.06), glassVeilMat);
    frontGlass.position.set(0, 1.35, 0.22);
    assemblyGroup.add(frontGlass);

    // Suspended 3-part Architectural Ring Luminaire
    const luminaireGroup = new THREE.Group();
    luminaireGroup.position.set(0, 2.95, 0.25);
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.028, 14, 56), brassTrimMat);
    outerRing.rotation.x = Math.PI / 2 - 0.15;
    const glowRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: kelvinColorHex,
      emissiveIntensity: 2.0,
    });
    const innerGlowRing = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.015, 10, 48), glowRingMat);
    innerGlowRing.rotation.x = Math.PI / 2 - 0.15;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 12), brassTrimMat);
    stem.position.y = 0.6;
    luminaireGroup.add(outerRing, innerGlowRing, stem);
    scene.add(luminaireGroup);

    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let currentExplode = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) return;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 6);
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;

        const targetExplode = controlsRef.current.exploded;
        currentExplode = THREE.MathUtils.lerp(currentExplode, targetExplode, 0.18);
        backPlate.position.z = -0.18 - currentExplode * 0.55;
        frontGlass.position.z = 0.22 + currentExplode * 0.65;

        coreSlabMat.wireframe = controlsRef.current.wireframe;
        keyLight.color.setHex(controlsRef.current.kelvinColorHex);
        pendantLight.color.setHex(controlsRef.current.kelvinColorHex);
        glowRingMat.emissive.setHex(controlsRef.current.kelvinColorHex);

        orbit.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (Math.abs(currentExplode - targetExplode) > 0.005 || renderDirty) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    controlsRef.current.requestRender = requestRender;
    controlsRef.current.resetCamera = () => {
      camera.position.set(3.4, 2.3, 4.4);
      orbit.target.set(0, 1.1, 0);
      orbit.update();
      requestRender();
    };

    orbit.addEventListener('change', requestRender);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      orbit.removeEventListener('change', requestRender);
      orbit.dispose();
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material?.dispose();
        }
      });
      tex.dispose();
      envTex.dispose();
      renderer.dispose();
    };
  }, [bgHex, slabHex, accentHex, roughness, metalness, pattern]);

  if (contextLost) {
    return (
      <div className={`relative w-full h-full overflow-hidden rounded-xl border border-white/10 ${className}`}>
        <SafeImage src={fallbackImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111515]/80 via-transparent to-transparent flex items-end p-5">
          <p className="text-xs text-[#F4EFE5]/80">Architectural Material Preview · {title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden border border-[#D5B77A]/20 bg-[#111515] ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 text-xs text-[#F4EFE5]/75 bg-[#111515]/85 px-3 py-1.5 rounded-lg border border-white/10">
        <span>3D Studio Inspector</span>
        <span aria-hidden="true">·</span>
        <span className="text-[#D5B77A]">{title}</span>
      </div>

      {/* Collapsible Bottom Control Dock (solid/translucent non-backdrop-blur surface over WebGL) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-[min(92%,520px)]">
        <button
          type="button"
          onClick={() => setHudCollapsed((v) => !v)}
          className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#111515]/90 border border-white/15 text-[11px] text-[#F4EFE5]/80 hover:text-[#D5B77A] transition-colors"
        >
          {hudCollapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{hudCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
        </button>

        {!hudCollapsed && (
          <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#111515]/92 border border-[#D5B77A]/25 text-xs">
            <label className="flex items-center gap-2.5 text-[#F4EFE5]/85 flex-1 min-w-[160px]">
              <span className="whitespace-nowrap">Layer Split</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={exploded}
                onChange={(e) => setExploded(Number(e.target.value))}
                className="w-full accent-[#D5B77A]"
              />
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWireframe((w) => !w)}
                className={`px-2.5 py-1 rounded-md border text-[11px] transition-colors whitespace-nowrap ${
                  wireframe
                    ? 'bg-[#D5B77A] text-[#111515] border-[#D5B77A] font-medium'
                    : 'border-white/15 text-[#F4EFE5]/80 hover:border-[#D5B77A]/50'
                }`}
              >
                {wireframe ? 'Solid View' : 'Mesh View'}
              </button>
              <button
                type="button"
                onClick={() => controlsRef.current.resetCamera?.()}
                className="p-1.5 rounded-md border border-white/15 text-[#F4EFE5]/80 hover:text-[#D5B77A] hover:border-[#D5B77A]/50 transition-colors"
                title="Reset Camera"
                aria-label="Reset 3D camera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

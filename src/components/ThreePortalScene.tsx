import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SafeImage } from './SafeImage';

interface ThreePortalSceneProps {
  mode: 'intro' | 'hero';
  entering?: boolean;
  paused?: boolean;
  atmosphere?: 'emerald' | 'aqua' | 'cosmic';
  fallbackImage?: string;
  transparentBg?: boolean;
  className?: string;
}

const _vec3 = new THREE.Vector3();

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

function createMarbleTexture(baseHex: string, veinHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = veinHex;
    for (let i = 0; i < 24; i++) {
      ctx.globalAlpha = 0.09 + (i % 4) * 0.04;
      ctx.lineWidth = 1.2 + (i % 3);
      ctx.beginPath();
      let x = (i * 47) % 512;
      ctx.moveTo(x, 0);
      for (let step = 1; step <= 12; step++) {
        x += Math.sin(step * 0.8 + i) * 34;
        ctx.lineTo(x, (step / 12) * 512);
      }
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export const ThreePortalScene: React.FC<ThreePortalSceneProps> = ({
  mode,
  entering = false,
  paused = false,
  atmosphere = 'emerald',
  fallbackImage = '/src/assets/images/hero_magical_portal_vista_1794847532486.jpg',
  transparentBg = false,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ entering, paused, atmosphere });
  const [contextLost, setContextLost] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  stateRef.current = { entering, paused, atmosphere };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || reducedMotion) return;

    const isSoftwareGl = detectSoftwareGl();
    const isMobile = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: transparentBg,
      });
    } catch {
      setContextLost(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.shadowMap.enabled = !isSoftwareGl && !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (transparentBg) {
      renderer.setClearColor(0x000000, 0);
    }

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    if (!transparentBg) {
      scene.background = new THREE.Color(0x091413);
      scene.fog = new THREE.FogExp2(0x091413, 0.036);
    }

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 140);
    camera.position.set(0, 1.95, mode === 'intro' ? 11.4 : 10.4);

    // Three-point + warm/cool architectural lighting rig
    const hemiLight = new THREE.HemisphereLight(0x639891, 0x0b1212, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf6dfaa, 2.3);
    keyLight.position.set(6, 12, 8);
    if (renderer.shadowMap.enabled) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const portalPointLight = new THREE.PointLight(0xe5c583, 18, 32, 1.5);
    portalPointLight.position.set(0, 2.75, -1.2);
    scene.add(portalPointLight);

    const rimLight = new THREE.PointLight(0x289993, 11, 28, 1.5);
    rimLight.position.set(-5, 4.2, -5.5);
    scene.add(rimLight);

    // Procedural marble & brushed gold materials
    const marbleTex = createMarbleTexture('#102B28', '#D5B77A');
    marbleTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const emeraldMarbleMat = new THREE.MeshPhysicalMaterial({
      color: 0x133834,
      map: marbleTex,
      roughness: 0.22,
      metalness: 0.16,
      clearcoat: 0.72,
      clearcoatRoughness: 0.16,
    });

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xd5b77a,
      roughness: 0.16,
      metalness: 0.95,
      anisotropy: 0.75,
    });

    const emissiveGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf7e8c4,
      emissive: 0xd5b77a,
      emissiveIntensity: 2.5,
      roughness: 0.18,
      metalness: 0.5,
    });

    const glassFinMat = new THREE.MeshPhysicalMaterial({
      color: 0x7bc2b8,
      roughness: 0.06,
      metalness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.78,
      transparent: true,
      opacity: isSoftwareGl ? 0.34 : 0.85,
      ior: 1.52,
      thickness: 0.65,
    });

    // Reflective Mirror Water Floor (subtle when not transparent)
    const floorGeo = new THREE.PlaneGeometry(76, 76);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1615,
      roughness: 0.12,
      metalness: 0.45,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      transparent: transparentBg,
      opacity: transparentBg ? 0.2 : 1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Composite Architectural Portal Group
    const portalGroup = new THREE.Group();
    scene.add(portalGroup);

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.28, 2.4), emeraldMarbleMat);
    plinth.position.set(0, 0.14, -1.5);
    plinth.receiveShadow = true;
    portalGroup.add(plinth);

    const archShape = new THREE.Shape();
    archShape.moveTo(-2.85, 0);
    archShape.lineTo(-2.85, 3.65);
    archShape.absarc(0, 3.65, 2.85, Math.PI, 0, true);
    archShape.lineTo(2.85, 0);
    archShape.lineTo(2.15, 0);
    archShape.lineTo(2.15, 3.65);
    archShape.absarc(0, 3.65, 2.15, 0, Math.PI, false);
    archShape.lineTo(-2.15, 0);
    archShape.closePath();

    const archGeo = new THREE.ExtrudeGeometry(archShape, {
      depth: 0.95,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 2,
    });
    archGeo.center();
    const outerArch = new THREE.Mesh(archGeo, emeraldMarbleMat);
    outerArch.position.set(0, 3.4, -1.5);
    outerArch.castShadow = true;
    portalGroup.add(outerArch);

    const innerArchGlow = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.048, 16, 72, Math.PI),
      emissiveGoldMat
    );
    innerArchGlow.position.set(0, 3.92, -0.98);
    portalGroup.add(innerArchGlow);

    const stripGeo = new THREE.BoxGeometry(0.06, 3.92, 0.06);
    const leftStrip = new THREE.Mesh(stripGeo, emissiveGoldMat);
    leftStrip.position.set(-2.15, 1.98, -0.98);
    const rightStrip = new THREE.Mesh(stripGeo, emissiveGoldMat);
    rightStrip.position.set(2.15, 1.98, -0.98);
    portalGroup.add(leftStrip, rightStrip);

    const trimArch = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.038, 12, 64, Math.PI),
      goldMat
    );
    trimArch.position.set(0, 3.92, -0.94);
    portalGroup.add(trimArch);

    // Rotating 3D Celestial Armillary Portal Rings inside the Archway
    const armillaryGroup = new THREE.Group();
    armillaryGroup.position.set(0, 3.05, -1.35);
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.018, 12, 72), goldMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.014, 12, 64), emissiveGoldMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.012, 10, 56), goldMat);
    const coreGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.24, 0),
      emissiveGoldMat
    );
    armillaryGroup.add(ring1, ring2, ring3, coreGem);
    portalGroup.add(armillaryGroup);

    const portalThresholdRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.025, 10, 72),
      emissiveGoldMat
    );
    portalThresholdRing.rotation.x = Math.PI / 2;
    portalThresholdRing.position.set(0, 0.06, -1.5);
    portalGroup.add(portalThresholdRing);

    // Sweeping Golden Architectural Light Ribbons (TubeGeometry along CatmullRomCurve3)
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.2, 0.85, 3.2),
      new THREE.Vector3(-3.1, 2.2, 0.6),
      new THREE.Vector3(0, 4.95, -1.6),
      new THREE.Vector3(3.2, 2.35, 0.4),
      new THREE.Vector3(6.4, 1.0, 3.4),
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 72, 0.025, 8, false);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, emissiveGoldMat);
    scene.add(ribbonMesh);

    const ribbonCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.8, 4.6, -3.2),
      new THREE.Vector3(-2.6, 1.6, 0.8),
      new THREE.Vector3(0, 0.75, 2.2),
      new THREE.Vector3(2.8, 1.75, 0.6),
      new THREE.Vector3(5.8, 4.4, -3.1),
    ]);
    const ribbonGeo2 = new THREE.TubeGeometry(ribbonCurve2, 68, 0.018, 8, false);
    const ribbonMesh2 = new THREE.Mesh(ribbonGeo2, goldMat);
    scene.add(ribbonMesh2);

    // Floating Orbiting Crystal Prisms for Magical Depth
    const crystalPrisms: { mesh: THREE.Mesh; radius: number; height: number; angle: number; speed: number }[] = [];
    const prismGeo = new THREE.OctahedronGeometry(0.18, 0);
    for (let i = 0; i < 6; i++) {
      const crystal = new THREE.Mesh(prismGeo, i % 2 === 0 ? glassFinMat : emissiveGoldMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 3.2 + (i % 2) * 1.1;
      const height = 1.4 + (i % 3) * 1.15;
      crystal.position.set(Math.cos(angle) * radius, height, -1.2 + Math.sin(angle) * radius);
      scene.add(crystal);
      crystalPrisms.push({
        mesh: crystal,
        radius,
        height,
        angle,
        speed: 0.22 + (i % 3) * 0.08,
      });
    }

    // Depth Glass Fins framing the walkway
    const finGeo = new THREE.BoxGeometry(0.08, 4.5, 0.75);
    for (let i = 0; i < 6; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const depthIdx = Math.floor(i / 2);
      const fin = new THREE.Mesh(finGeo, glassFinMat);
      fin.position.set(side * (3.75 + depthIdx * 0.6), 2.25, 1.6 - depthIdx * 2.7);
      fin.rotation.y = side * 0.24;
      portalGroup.add(fin);
    }

    // Floating Beveled Architectural Surface Tiles + Orbital World Gems
    const floatingTiles: { mesh: THREE.Group; baseY: number; phase: number; speed: number }[] = [];
    const tilePositions = [
      [-4.2, 2.6, 2.2],
      [4.3, 2.1, 1.4],
      [-5.1, 3.9, -2.5],
      [4.9, 3.6, -2.8],
      [-2.8, 1.25, 3.5],
      [3.1, 1.5, 3.3],
    ];
    const tileGeo = new THREE.BoxGeometry(0.95, 1.25, 0.08);
    const tileFrameGeo = new THREE.BoxGeometry(1.01, 1.31, 0.04);

    tilePositions.forEach(([x, y, z], idx) => {
      const tileGrp = new THREE.Group();
      const slab = new THREE.Mesh(tileGeo, idx % 2 === 0 ? emeraldMarbleMat : glassFinMat);
      const frame = new THREE.Mesh(tileFrameGeo, goldMat);
      frame.position.z = -0.025;
      tileGrp.add(slab, frame);
      tileGrp.position.set(x, y, z);
      tileGrp.rotation.y = (x > 0 ? -1 : 1) * 0.35;
      scene.add(tileGrp);
      floatingTiles.push({
        mesh: tileGrp,
        baseY: y,
        phase: idx * 1.15,
        speed: 0.65 + (idx % 3) * 0.22,
      });
    });

    // Distant City Skyline Silhouettes behind the portal (Hero Mode)
    const skylineGroup = new THREE.Group();
    if (mode === 'hero' && !transparentBg) {
      const towerMat = new THREE.MeshStandardMaterial({
        color: 0x0d1f1e,
        roughness: 0.65,
        metalness: 0.3,
      });
      const towerGeo = new THREE.BoxGeometry(1, 1, 1);
      const count = isMobile ? 14 : 26;
      const towers = new THREE.InstancedMesh(towerGeo, towerMat, count);
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        const angle = -0.9 + (i / (count - 1)) * 1.8;
        const dist = 24 + (i % 4) * 4;
        const h = 5 + ((i * 7) % 12);
        const w = 1.2 + (i % 3) * 0.55;
        dummy.position.set(Math.sin(angle) * dist, h / 2, -Math.cos(angle) * dist + 2);
        dummy.scale.set(w, h, w);
        dummy.updateMatrix();
        towers.setMatrixAt(i, dummy.matrix);
      }
      towers.computeBoundingSphere();
      skylineGroup.add(towers);
      scene.add(skylineGroup);
    }

    // Drifting Luminous Gold Dust Motes
    const particleCount = isMobile ? 140 : 320;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 20;
      pPositions[i * 3 + 1] = Math.random() * 8.5 + 0.15;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf1d69c,
      size: 0.075,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();
    let zoomProgress = 0;

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

    const atmosphereTargets = {
      emerald: { bg: 0x091413, rim: 0x289993, point: 0xe5c583 },
      aqua: { bg: 0x071a22, rim: 0x1aa1b8, point: 0x91e0ee },
      cosmic: { bg: 0x0c0e1d, rim: 0x6a50ad, point: 0xe8af60 },
    };

    const _bgTarget = new THREE.Color();
    const _rimTarget = new THREE.Color();
    const _pointTarget = new THREE.Color();

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const { entering: isEntering, paused: isPaused, atmosphere: atmo } = stateRef.current;

      const targetAtmo = atmosphereTargets[atmo] || atmosphereTargets.emerald;
      _bgTarget.setHex(targetAtmo.bg);
      _rimTarget.setHex(targetAtmo.rim);
      _pointTarget.setHex(targetAtmo.point);

      if (!transparentBg && scene.background instanceof THREE.Color) {
        scene.background.lerp(_bgTarget, 0.05);
      }
      if (!transparentBg && scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(_bgTarget, 0.05);
      }
      rimLight.color.lerp(_rimTarget, 0.05);
      portalPointLight.color.lerp(_pointTarget, 0.05);

      if (!isPaused) {
        for (let i = 0; i < floatingTiles.length; i++) {
          const t = floatingTiles[i];
          t.mesh.position.y = t.baseY + Math.sin(elapsed * t.speed + t.phase) * 0.18;
          t.mesh.rotation.z = Math.sin(elapsed * 0.45 + t.phase) * 0.04;
        }

        ring1.rotation.y = elapsed * 0.25;
        ring1.rotation.x = Math.sin(elapsed * 0.2) * 0.35;
        ring2.rotation.x = elapsed * 0.32;
        ring2.rotation.z = Math.cos(elapsed * 0.25) * 0.4;
        ring3.rotation.y = -elapsed * 0.42;
        coreGem.rotation.y = elapsed * 0.65;
        coreGem.rotation.x = elapsed * 0.35;
        coreGem.position.y = Math.sin(elapsed * 1.4) * 0.08;

        for (let i = 0; i < crystalPrisms.length; i++) {
          const c = crystalPrisms[i];
          const theta = c.angle + elapsed * c.speed;
          c.mesh.position.x = Math.cos(theta) * c.radius;
          c.mesh.position.z = -1.2 + Math.sin(theta) * c.radius;
          c.mesh.position.y = c.height + Math.sin(elapsed * 1.1 + i) * 0.22;
          c.mesh.rotation.y = elapsed * 0.9;
          c.mesh.rotation.z = elapsed * 0.5;
        }

        const ringPulse = 1 + Math.sin(elapsed * 1.3) * 0.035;
        portalThresholdRing.scale.set(ringPulse, ringPulse, 1);

        particles.rotation.y = elapsed * 0.03;
        particles.position.y = Math.sin(elapsed * 0.35) * 0.18;

        portalPointLight.intensity = 16 + Math.sin(elapsed * 1.5) * 2.8;
      }

      if (mode === 'intro' && isEntering) {
        zoomProgress = Math.min(1, zoomProgress + delta * 0.95);
        const eased = zoomProgress * zoomProgress * (3 - 2 * zoomProgress);
        camera.position.z = THREE.MathUtils.lerp(11.4, -2.8, eased);
        camera.position.y = THREE.MathUtils.lerp(1.95, 2.55, eased);
        camera.lookAt(0, 2.5, -10);
      } else {
        const baseZ = mode === 'intro' ? 11.4 : 10.4;
        const targetX = pointerX * 0.85;
        const targetY = (mode === 'intro' ? 1.95 : 2.1) - pointerY * 0.35;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.2, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.2, delta);
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          baseZ + Math.sin(elapsed * 0.25) * (isPaused ? 0 : 0.35),
          2.0,
          delta
        );
        _vec3.set(pointerX * 0.25, 2.45, -2.0);
        camera.lookAt(_vec3);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material?.dispose();
          }
        }
      });
      marbleTex.dispose();
      envTex.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [mode, reducedMotion, transparentBg]);

  if (reducedMotion || contextLost) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <SafeImage
          src={fallbackImage}
          alt="SATHSANG presents SENSORA AI architectural portal"
          className="w-full h-full object-cover scale-105 opacity-80"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111515] via-[#102B28]/50 to-[#111515]/65" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      aria-label="Interactive 3D architectural portal scene"
    />
  );
};

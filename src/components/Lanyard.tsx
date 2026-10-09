/* eslint-disable react/no-unknown-property */
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

const CARD_GLB_PATH = '/assets/lanyard/card.glb';

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });
useGLTF.preload(CARD_GLB_PATH);

// 1x1 transparent pixel fallback
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture atlas
// and the back face to the RIGHT half (measured from card.glb).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

export default function Lanyard({
  position = [0, 0, 19],
  gravity = [0, -40, 0],
  fov = 25,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 0.5
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cleanLanyardDefault = useMemo(() => createCleanLanyardTexture(), []);
  const cleanBackDefault = useMemo(() => createCleanBackCardImage(), []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <SingleBandWrapper
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage || cleanBackDefault}
            imageFit={imageFit}
            lanyardImage={lanyardImage || cleanLanyardDefault}
            lanyardWidth={lanyardWidth}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function SingleBandWrapper(props: any) {
  const { viewport } = useThree();
  const topAnchorY = viewport.height / 2;
  return <Band {...props} anchorX={0} anchorY={topAnchorY} />;
}

export function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 0.5,
  anchorX = 0,
  anchorY,
  isDroppedActive = true,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  anchorX?: number;
  anchorY?: number;
  isDroppedActive?: boolean;
}) {
  const band = useRef<any>(null),
    fixed = useRef<any>(null),
    j1 = useRef<any>(null),
    j2 = useRef<any>(null),
    j3 = useRef<any>(null),
    card = useRef<any>(null),
    clipMeshRef = useRef<THREE.Mesh>(null!);

  const vec = useRef(new THREE.Vector3()).current,
    ang = useRef(new THREE.Vector3()).current,
    rot = useRef(new THREE.Vector3()).current,
    dir = useRef(new THREE.Vector3()).current,
    clipEyelet = useRef(new THREE.Vector3()).current;

  const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(CARD_GLB_PATH) as any;

  // Card enlargement scale: 3.85x
  const cardScale = 3.85;
  const cardGroupPosY = -1.7;

  // Compute exact eyelet ring position from the metal clip geometry
  const eyeletLocalPos = useMemo(() => {
    if (nodes.clip?.geometry) {
      if (!nodes.clip.geometry.boundingBox) nodes.clip.geometry.computeBoundingBox();
      const bb = nodes.clip.geometry.boundingBox;
      if (bb) {
        return new THREE.Vector3((bb.min.x + bb.max.x) / 2, bb.max.y, (bb.min.z + bb.max.z) / 2);
      }
    }
    return new THREE.Vector3(0, 0.48, 0);
  }, [nodes.clip]);

  // Position of joint anchor in card rigid body coordinates to align directly with clip eyelet
  const jointAnchorY = useMemo(() => {
    return cardGroupPosY + eyeletLocalPos.y * cardScale;
  }, [eyeletLocalPos, cardScale, cardGroupPosY]);

  const defaultLanyardTex = useMemo(() => createCleanLanyardTexture(), []);
  const defaultBackTex = useMemo(() => createCleanBackCardImage(), []);

  const texture = useTexture(lanyardImage || defaultLanyardTex);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || defaultBackTex);

  // Composite the front/back images into the card's texture atlas:
  // Front face = left half, Back face = right half.
  // Back face is guaranteed completely free of images and text (pure clean #F1F1F1 surface).
  const cardMap = useMemo(() => {
    const baseMap = materials.base?.map;
    if (!baseMap) return null;

    const baseImg = baseMap.image;
    if (!baseImg) return baseMap;
    const W = baseImg.width || 1024;
    const H = baseImg.height || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: any, rect: { x: number; y: number; w: number; h: number }) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    // Draw clean back face (strictly no image and no text)
    if (backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, imageFit, frontTex, backTex, materials.base]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  // "缩短绳子，牌子位置向上移": 精致紧凑绳索关节段长 (0.58 x 3 segments)
  const segLen = 0.58;
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], segLen]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], segLen]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], segLen]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, jointAnchorY, 0]
  ]);

  const actualAnchorY = anchorY !== undefined ? anchorY : 4.5;
  const dirSign = anchorX < 0 ? -1 : 1;

  // 物理掉落锁存标识：无论滑动多快，每帧都精准保障自然掉落与稳定渲染
  const droppedRef = useRef(false);

  useEffect(() => {
    const handleTriggerDrop = () => {
      droppedRef.current = false;
    };
    window.addEventListener('trigger-lanyard-drop', handleTriggerDrop);
    return () => window.removeEventListener('trigger-lanyard-drop', handleTriggerDrop);
  }, []);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    // 物理掉落检测：在进入激活瞬态 (isDroppedActive 变为 true) 时触发自由落体与摆动
    if (fixed.current && card.current) {
      if (isDroppedActive) {
        if (!droppedRef.current) {
          droppedRef.current = true;
          const sign = anchorX < 0 ? -1 : 1;
          const ay = actualAnchorY;
          j1.current?.setTranslation({ x: anchorX + 0.25 * sign, y: ay, z: 0 }, true);
          j1.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
          j1.current?.wakeUp();

          j2.current?.setTranslation({ x: anchorX + 0.5 * sign, y: ay, z: 0 }, true);
          j2.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
          j2.current?.wakeUp();

          j3.current?.setTranslation({ x: anchorX + 0.75 * sign, y: ay, z: 0 }, true);
          j3.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
          j3.current?.wakeUp();

          card.current?.setTranslation({ x: anchorX + 1.1 * sign, y: ay - 0.15, z: 0 }, true);
          card.current?.setLinvel({ x: 0, y: -2, z: 0 }, true);
          card.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
          card.current?.wakeUp();
        }
      } else {
        if (droppedRef.current) {
          droppedRef.current = false;
        }
      }
    }

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      // EXACT REALISTIC CONNECTION:
      // The rope tip curve.points[0] anchors directly into the swivel hook eyelet in real 3D space
      if (clipMeshRef.current) {
        clipMeshRef.current.localToWorld(clipEyelet.copy(eyeletLocalPos));
        curve.points[0].copy(clipEyelet);
      } else if (j3.current) {
        curve.points[0].copy(j3.current.translation());
      }

      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      }
      if (card.current) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[anchorX, actualAnchorY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.25 * dirSign, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody position={[0.5 * dirSign, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody position={[0.75 * dirSign, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody position={[1.0 * dirSign, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          {/* Proportional cuboid collider for 3.85x card */}
          <CuboidCollider args={[1.3, 1.88, 0.01]} />
          <group
            scale={cardScale}
            position={[0, cardGroupPosY, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => ((e.target as HTMLElement).releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={e => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh ref={clipMeshRef} geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="#1E1E22"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

/**
 * Scene content with exact top-edge viewport calculation for connecting
 * the ropes flush to the upper screen boundary.
 */
function DoubleBandSceneContent({
  awards,
  cardImages,
  cleanBackImage,
  cleanLanyardTexture,
  isMobile,
  isDroppedActive = true,
}: {
  awards: Array<{ id: string; year: string; title: string; level: string; isFirst?: boolean }>;
  cardImages: string[];
  cleanBackImage: string;
  cleanLanyardTexture: string;
  isMobile: boolean;
  isDroppedActive?: boolean;
}) {
  const { viewport } = useThree();

  // "让绳子的最上端挨着屏幕边缘":
  // Exact top edge of the visible screen at z=0 is viewport.height / 2!
  const topAnchorY = viewport.height / 2;

  // "两个牌子离近一点": 间距适度紧凑，适配放大后的牌身
  const spreadX = isMobile
    ? Math.min(1.45, viewport.width * 0.18)
    : Math.min(2.35, Math.max(1.85, viewport.width * 0.16));

  return (
    <>
      {awards[0] && (
        <Band
          isMobile={isMobile}
          frontImage={cardImages[0]}
          backImage={cleanBackImage}
          lanyardImage={cleanLanyardTexture}
          imageFit="cover"
          anchorX={-spreadX}
          anchorY={topAnchorY}
          lanyardWidth={0.5}
          isDroppedActive={isDroppedActive}
        />
      )}
      {awards[1] && (
        <Band
          isMobile={isMobile}
          frontImage={cardImages[1]}
          backImage={cleanBackImage}
          lanyardImage={cleanLanyardTexture}
          imageFit="cover"
          anchorX={spreadX}
          anchorY={topAnchorY}
          lanyardWidth={0.5}
          isDroppedActive={isDroppedActive}
        />
      )}
    </>
  );
}

/**
 * DoubleLanyard component:
 * - Natural physical gravity drop on entry (matches user provided code)
 * - Whole stage elevated and framed so the top of the ropes touch the top screen edge
 *   and the badges are fully visible without being cut off
 */
export function DoubleLanyard({
  awards = [],
  position = [0, 0, 19],
  gravity = [0, -40, 0],
  fov = 25,
  transparent = true,
  isDroppedActive = true,
}: {
  awards: Array<{ id: string; year: string; title: string; level: string; isFirst?: boolean }>;
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  isDroppedActive?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate crisp textures for the two cards:
  // - No logo background box
  // - No punch hole, no bottom accent bar
  // - No shadow on logo
  // - Logo color #1E1E20 (webpage darkest color)
  // - Card base #F1F1F1
  const cardImages = useMemo(() => {
    return awards.map(a => createAwardCardImage(a));
  }, [awards]);

  const cleanBackImage = useMemo(() => createCleanBackCardImage(), []);
  const cleanLanyardTexture = useMemo(() => createCleanLanyardTexture(), []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <DoubleBandSceneContent
            awards={awards}
            cardImages={cardImages}
            cleanBackImage={cleanBackImage}
            cleanLanyardTexture={cleanLanyardTexture}
            isMobile={isMobile}
            isDroppedActive={isDroppedActive}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

/**
 * Creates pure clean BLACK lanyard texture:
 * - "绳子是黑色，去掉绳子上的logo，保留颜色即可"
 * - Deep obsidian/black gradient with fine fabric rib weave and edge stitching
 */
function createCleanLanyardTexture(): string {
  if (typeof document === 'undefined') return BLANK_PIXEL;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return BLANK_PIXEL;

  // Rich black lanyard strap gradient
  const grad = ctx.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, '#0D0D0F');
  grad.addColorStop(0.18, '#19191B');
  grad.addColorStop(0.5, '#262629');
  grad.addColorStop(0.82, '#19191B');
  grad.addColorStop(1, '#0D0D0F');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  // Subtle dark textile rib weave lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 256; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(128, y);
    ctx.stroke();
  }

  // Edge seam stitching in subtle muted charcoal
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(10, 256);
  ctx.moveTo(118, 0);
  ctx.lineTo(118, 256);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

/**
 * Creates completely blank, pure card back:
 * - NO picture
 * - NO text
 * - Clean #F1F1F1 card face with subtle inner border
 */
function createCleanBackCardImage(): string {
  if (typeof document === 'undefined') return BLANK_PIXEL;
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) return BLANK_PIXEL;

  // Pure clean #F1F1F1 card body
  ctx.fillStyle = '#F1F1F1';
  ctx.fillRect(0, 0, 600, 900);

  // Subtle interior border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 568, 868);

  return canvas.toDataURL('image/png');
}

/**
 * Creates high-fidelity canvas front texture adhering strictly to the user's requirements:
 * - Logo without background or border
 * - Logo without shadow
 * - Logo color #1E1E20 (webpage darkest color)
 * - Clear, high-res typography for Year, Level, and Title
 */
function createAwardCardImage(award: { year: string; title: string; level: string; isFirst?: boolean }): string {
  if (typeof document === 'undefined') return BLANK_PIXEL;
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) return BLANK_PIXEL;

  // Card Background: #F1F1F1
  ctx.fillStyle = '#F1F1F1';
  ctx.fillRect(0, 0, 600, 900);

  // Subtle interior border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 568, 868);

  // Year tag (Top Right)
  ctx.fillStyle = '#E4E4E7';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(430, 50, 120, 48, 24);
  } else {
    ctx.rect(430, 50, 120, 48);
  }
  ctx.fill();
  ctx.fillStyle = '#1E1E20';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(award.year, 490, 74);

  // Logo: Trophy or Medal (NO background, NO shadow, color #1E1E20)
  ctx.fillStyle = '#1E1E20';
  ctx.strokeStyle = '#1E1E20';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = 300;
  const cy = 330;

  if (award.isFirst) {
    // Trophy
    ctx.beginPath();
    ctx.moveTo(cx - 75, cy - 85);
    ctx.lineTo(cx + 75, cy - 85);
    ctx.lineTo(cx + 60, cy + 15);
    ctx.quadraticCurveTo(cx, cy + 70, cx - 60, cy + 15);
    ctx.closePath();
    ctx.fill();

    // Stem
    ctx.fillRect(cx - 14, cy + 60, 28, 48);

    // Base
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cx - 70, cy + 104, 140, 24, 8);
    } else {
      ctx.rect(cx - 70, cy + 104, 140, 24);
    }
    ctx.fill();

    // Handles
    ctx.beginPath();
    ctx.arc(cx - 78, cy - 35, 32, Math.PI * 0.5, Math.PI * 1.5, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 78, cy - 35, 32, Math.PI * 1.5, Math.PI * 0.5, false);
    ctx.stroke();
  } else {
    // Medal
    // Ribbons
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy - 90);
    ctx.lineTo(cx - 16, cy - 8);
    ctx.lineTo(cx - 45, cy - 8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 50, cy - 90);
    ctx.lineTo(cx + 16, cy - 8);
    ctx.lineTo(cx + 45, cy - 8);
    ctx.closePath();
    ctx.fill();

    // Medal circular body
    ctx.beginPath();
    ctx.arc(cx, cy + 28, 70, 0, Math.PI * 2);
    ctx.fill();

    // Center star cutout
    ctx.fillStyle = '#F1F1F1';
    drawStar(ctx, cx, cy + 28, 5, 32, 16);
    ctx.fill();
  }

  // Award Level (Bold #1E1E20)
  ctx.fillStyle = '#1E1E20';
  ctx.font = 'bold 36px "Noto Sans SC", -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(award.level, cx, 550);

  // Award Event Title (2-line wrap)
  ctx.fillStyle = '#3F3F46';
  ctx.font = '500 28px "Noto Sans SC", -apple-system, sans-serif';
  wrapText(ctx, award.title, cx, 630, 480, 42);

  return canvas.toDataURL('image/png');
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = text.split('');
  let line = '';
  let curY = y;

  for (let n = 0; n < chars.length; n++) {
    const testLine = line + chars[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = chars[n];
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

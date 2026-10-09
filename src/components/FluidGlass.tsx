'use client';

/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import React, { useRef, useState, useEffect, useMemo, memo, Suspense } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  Preload,
  MeshTransmissionMaterial,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

export interface FluidGlassProps {
  mode?: 'lens' | 'bar' | 'cube';
  lensProps?: Record<string, any>;
  barProps?: Record<string, any>;
  cubeProps?: Record<string, any>;
  backgroundColor?: string;
  textColor?: string;
  titleText?: string;
}

export default function FluidGlass({
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {},
  backgroundColor = 'transparent',
  textColor = '#ffffff',
  titleText = 'WHO AM I'
}: FluidGlassProps) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    navItems = [],
    ...modeProps
  } = rawOverrides;

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, toneMapping: THREE.NoToneMapping, antialias: true }}
      style={{ backgroundColor, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Wrapper modeProps={modeProps} backgroundColor={backgroundColor}>
          <Typography textColor={textColor} text={titleText} />
          <Preload />
        </Wrapper>
      </Suspense>
    </Canvas>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  geometryKey = 'Cylinder',
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  backgroundColor = 'transparent',
  ...props
}: any) {
  const ref = useRef<THREE.Mesh>(null!);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  // Procedural lens geometry - completely self-contained with no missing GLB issues
  const fallbackGeometry = useRef<THREE.BufferGeometry | null>(null);
  if (!fallbackGeometry.current) {
    if (geometryKey === 'Cylinder') {
      fallbackGeometry.current = new THREE.CylinderGeometry(1.35, 1.35, 0.35, 64);
    } else {
      fallbackGeometry.current = new THREE.BoxGeometry(1.5, 1.5, 0.3);
    }
    fallbackGeometry.current.computeBoundingBox();
  }

  const activeGeometry = fallbackGeometry.current;

  useEffect(() => {
    if (activeGeometry) {
      activeGeometry.computeBoundingBox();
      if (activeGeometry.boundingBox) {
        geoWidthRef.current = activeGeometry.boundingBox.max.x - activeGeometry.boundingBox.min.x || 1;
      }
    }
  }, [activeGeometry]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

      if (modeProps.scale == null) {
        const maxWorld = v.width * 0.9;
        const desired = maxWorld / geoWidthRef.current;
        ref.current.scale.setScalar(Math.min(0.18, desired));
      }
    }

    gl.setClearColor(0x000000, 0);
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(
        <>
          {backgroundColor && backgroundColor !== 'transparent' && (
            <mesh position={[0, 0, -5]} scale={[vp.width * 2, vp.height * 2, 1]}>
              <planeGeometry />
              <meshBasicMaterial color={backgroundColor} toneMapped={false} />
            </mesh>
          )}
          {children}
        </>,
        scene
      )}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent toneMapped={false} />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.18}
        rotation-x={Math.PI / 2}
        geometry={activeGeometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.28}
          thickness={thickness ?? 9}
          anisotropy={anisotropy ?? 0.05}
          chromaticAberration={chromaticAberration ?? 0.25}
          distortion={0.4}
          distortionScale={0.3}
          temporalDistortion={0.05}
          roughness={0}
          transmission={1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }: any) {
  return <ModeWrapper geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }: any) {
  return <ModeWrapper geometryKey="Cube" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }: any) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function Typography({ textColor, text = 'WHO AM I' }: { textColor: string; text?: string }) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 175px "Barlow Condensed", "Noto Sans SC", -apple-system, sans-serif';
      ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [textColor, text]);

  // "who am i字缩小一点": 尺寸适度收缩，更显精致现代
  const planeWidth = isMobile ? Math.min(viewport.width * 0.74, 4.6) : Math.min(viewport.width * 0.64, 8.9);
  const planeHeight = planeWidth * 0.5;

  return (
    <mesh position={[0, 0, 10]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

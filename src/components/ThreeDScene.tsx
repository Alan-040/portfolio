import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  isLightMode?: boolean;
}

const AtmosphericParticles: React.FC<{ isLightMode?: boolean }> = ({ isLightMode }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 75;

  const [positions] = React.useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 15;
      pos[i + 1] = (Math.random() - 0.5) * 15;
      pos[i + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
      pointsRef.current.position.x = THREE.MathUtils.lerp(
        pointsRef.current.position.x,
        state.pointer.x * 0.35,
        0.04
      );
      pointsRef.current.position.y = THREE.MathUtils.lerp(
        pointsRef.current.position.y,
        state.pointer.y * 0.35,
        0.04
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={isLightMode ? '#6B6862' : '#F5E2A8'}
        transparent
        opacity={isLightMode ? 0.25 : 0.4}
        sizeAttenuation
      />
    </points>
  );
};

export const ThreeDScene: React.FC<SceneProps> = ({ isLightMode = false }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={isLightMode ? 0.8 : 0.4} />
        <directionalLight position={[5, 5, 5]} intensity={isLightMode ? 0.6 : 0.8} />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
          <AtmosphericParticles isLightMode={isLightMode} />
        </Float>
      </Canvas>
    </div>
  );
};


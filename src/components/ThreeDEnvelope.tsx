import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface EnvelopeProps {
  isLightMode?: boolean;
  isHovered?: boolean;
}

export const ThreeDEnvelope: React.FC<EnvelopeProps> = ({
  isLightMode = false,
  isHovered = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const sealRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetRotY = state.pointer.x * 0.45 + (isHovered ? 0.35 : 0.12);
      const targetRotX = -state.pointer.y * 0.35 + 0.15;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.06
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.06
      );
    }
    if (sealRef.current) {
      sealRef.current.rotation.z += delta * 0.6;
    }
  });

  const bodyColor = isLightMode ? '#E6E0D5' : '#22252E';
  const paperColor = isLightMode ? '#FFFFFF' : '#E8E4DC';
  const sealColor = '#D4AF37';

  return (
    <Float
      speed={isHovered ? 3.5 : 2}
      rotationIntensity={0.5}
      floatIntensity={isHovered ? 1.5 : 0.8}
    >
      <group ref={groupRef} scale={1.25} position={[0, 0, 0]}>
        {/* Main Envelope Body Pocket */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.4, 0.08]} />
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.4}
            metalness={isLightMode ? 0.1 : 0.35}
          />
        </mesh>

        {/* Paper Letter Peeking Inside */}
        <mesh position={[0, 0.22, -0.01]}>
          <boxGeometry args={[1.9, 1.2, 0.04]} />
          <meshStandardMaterial
            color={paperColor}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>

        {/* Diagonal Flap Fold Geometry */}
        <mesh position={[0, 0.28, 0.05]} rotation={[-0.25, 0, 0]}>
          <coneGeometry args={[1.3, 0.7, 3]} />
          <meshStandardMaterial
            color={isLightMode ? '#D8D0C3' : '#1A1C24'}
            roughness={0.45}
            metalness={isLightMode ? 0.15 : 0.4}
          />
        </mesh>

        {/* Golden Wax Seal / Brass Monogram Badge */}
        <mesh
          ref={sealRef}
          position={[0, -0.05, 0.06]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.18, 0.18, 0.06, 24]} />
          <meshStandardMaterial
            color={sealColor}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
};


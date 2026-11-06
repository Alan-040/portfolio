import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface SmartphoneProps {
  isLightMode?: boolean;
  isHovered?: boolean;
}

export const ThreeDSmartphone: React.FC<SmartphoneProps> = ({
  isLightMode = false,
  isHovered = false,
}) => {
  const phoneRef = useRef<THREE.Group>(null);
  const screenGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (phoneRef.current) {
      // Continuous 3D rotation with interactive mouse tilt
      const speed = isHovered ? 1.7 : 0.85;
      phoneRef.current.rotation.y += delta * speed;
      phoneRef.current.rotation.x = THREE.MathUtils.lerp(
        phoneRef.current.rotation.x,
        -state.pointer.y * 0.25 + 0.1,
        0.05
      );
      phoneRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.08;
    }
    if (screenGlowRef.current) {
      const mat = screenGlowRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.25;
      }
    }
  });

  const chassisColor = isLightMode ? '#A8A49D' : '#1C1E24';
  const glassColor = '#0B0C0E';
  const frameColor = isLightMode ? '#D2CFC8' : '#333742';

  return (
    <Float
      speed={isHovered ? 3 : 1.8}
      rotationIntensity={0.4}
      floatIntensity={1}
    >
      <group ref={phoneRef} scale={1.15} position={[0, 0, 0]}>
        {/* Phone Unibody Chassis */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 2.65, 0.12]} />
          <meshStandardMaterial
            color={chassisColor}
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>

        {/* Metallic Edge Bezel Chamfer */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.38, 2.68, 0.1]} />
          <meshStandardMaterial
            color={frameColor}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>

        {/* Glossy Front Screen Glass */}
        <mesh position={[0, 0, 0.065]}>
          <boxGeometry args={[1.25, 2.52, 0.01]} />
          <meshStandardMaterial
            color={glassColor}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Glowing Dynamic Notification Pill */}
        <mesh ref={screenGlowRef} position={[0, 0.95, 0.072]}>
          <boxGeometry args={[0.35, 0.09, 0.01]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Back Camera Island Bump */}
        <mesh position={[-0.32, 0.82, -0.075]}>
          <boxGeometry args={[0.52, 0.52, 0.04]} />
          <meshStandardMaterial
            color={frameColor}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* 3 Camera Lenses */}
        <mesh position={[-0.42, 0.92, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#0A0B0E" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[-0.22, 0.92, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#0A0B0E" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[-0.32, 0.72, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#0A0B0E" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
};


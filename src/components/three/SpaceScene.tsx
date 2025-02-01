import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const SpaceScene = () => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Responsive rotation boundaries
  const rotationBoundary = Math.min(0.3, viewport.width * 0.05);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Smooth automatic rotation
      groupRef.current.rotation.y += 0.001;
      
      // Responsive floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={50}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      <group
        scale={1}
        position={[0, 0, 0]}
      >
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#4299e1"
            roughness={0.5}
            metalness={0.8}
            emissive="#1a365d"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </group>
  );
};
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        color="#4299e1"
        metalness={0.8}
        roughness={0.5}
        emissive="#1a365d"
        emissiveIntensity={0.2}
      >
        {/* You can add Earth texture here if needed */}
      </meshStandardMaterial>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
    </mesh>
  );
};
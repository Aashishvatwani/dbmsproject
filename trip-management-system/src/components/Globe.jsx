import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function GlobeModel() {
  const globeRef = useRef();

  const gltf = useLoader(GLTFLoader, '/source/earth.gltf');

  useEffect(() => {
    if (gltf) {
      console.log('GLTF loaded:', gltf);

      // Ensure all mesh materials are double-sided
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf]);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.01; // Rotate slowly
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Earth Model */}
      <primitive
        object={gltf.scene}
        ref={globeRef}
        scale={[0.5, 0.5, 0.5]} // Adjust as needed
        position={[0, 0, 0]}
      />

      {/* Camera Controls */}
      <OrbitControls enableZoom={true} />
    </>
  );
}

export default GlobeModel;

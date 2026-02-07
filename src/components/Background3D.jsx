// src/components/Background3D.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, scale, speed, rotationSpeed }) => {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * rotationSpeed;
            mesh.current.rotation.y += delta * rotationSpeed * 0.5;
        }
    });

    const material = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.2, // Smoother for glass
        transmission: 0.6, // Glass-like transparency
        thickness: 1.5, // Refraction thickness
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        reflectivity: 0.7,
        envMapIntensity: 1.5,
    }), [color]);

    return (
        <Float
            speed={speed} // Animation speed
            rotationIntensity={1} // Float rotation
            floatIntensity={2} // Float height
            position={position}
        >
            <mesh ref={mesh} scale={scale}>
                <icosahedronGeometry args={[1, 0]} /> {/* Low poly look */}
                <primitive object={material} attach="material" />
            </mesh>
        </Float>
    );
};

const Background3DScene = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

            {/* Decorative environment reflection */}
            <Environment preset="city" />

            {/* Floating Shapes Generation */}
            <group>
                <FloatingShape
                    position={[-4, 2, -2]}
                    color="#6366f1" // Primary Indigo
                    scale={1.5}
                    speed={1.5}
                    rotationSpeed={0.2}
                />
                <FloatingShape
                    position={[5, -3, -5]}
                    color="#ec4899" // Pink
                    scale={2}
                    speed={2}
                    rotationSpeed={0.15}
                />
                <FloatingShape
                    position={[3, 4, -8]}
                    color="#8b5cf6" // Violet
                    scale={1.2}
                    speed={1.2}
                    rotationSpeed={0.3}
                />
                <FloatingShape
                    position={[-6, -4, 0]}
                    color="#ffffff"
                    scale={0.8}
                    speed={1}
                    rotationSpeed={0.1}
                />
            </group>
        </>
    );
};

const Background3D = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1, // Behind everything
            opacity: 0.6, // Subtle
            pointerEvents: 'none' // Don't block clicks
        }}>
            <Canvas dpr={[1, 2]}>
                <Background3DScene />
            </Canvas>
        </div>
    );
};

export default Background3D;

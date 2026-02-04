'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';

function Model(props: any) {
    const { scene } = useGLTF('/heart.glb');
    const meshRef = useRef<Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5; // Smooth spin
        }
    });

    return (
        <group {...props}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <primitive
                    object={scene}
                    ref={meshRef}
                    scale={4.5}
                    position={[0, -0.5, 0]}
                />
            </Float>
        </group>
    );
}

export default function Heart3D() {
    return (
        <div className="h-full w-full relative z-0">
            <Canvas
                camera={{ position: [0, -2, 8], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} />
                <Environment preset="city" />
                <Model />
            </Canvas>
        </div>
    );
}

useGLTF.preload('/heart.glb');

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
    const group = useRef<THREE.Group>(null);
    const { scene } = useGLTF(url);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.005;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <primitive
            ref={group}
            object={scene}
            scale={2.5}
            position={[0, 0, 0]}
        />
    );
}

export default function BackgroundModel() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Model url="/s2.glb" />
                    </Float>
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}

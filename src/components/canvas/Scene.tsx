'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import BlackHole from './BlackHole';
import StarField from './StarField';

interface SceneContentProps {
    mousePosition: { x: number; y: number };
}

function SceneContent({ mousePosition }: SceneContentProps) {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    useFrame(() => {
        if (cameraRef.current) {
            // Smooth camera movement following mouse with lerp
            const targetX = mousePosition.x * 0.3;
            const targetY = mousePosition.y * 0.3;

            cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02;
            cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.02;
            cameraRef.current.lookAt(0, 0, 0);
        }
    });

    return (
        <>
            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                position={[0, 0, 5]}
                fov={75}
            />
            <ambientLight intensity={0.1} />
            <StarField />
            <BlackHole mousePosition={mousePosition} />
        </>
    );
}

interface SceneProps {
    mousePosition: { x: number; y: number };
}

export default function Scene({ mousePosition }: SceneProps) {
    return (
        <Canvas
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }}
            dpr={[1, 2]}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        >
            <Suspense fallback={null}>
                <SceneContent mousePosition={mousePosition} />
            </Suspense>
        </Canvas>
    );
}

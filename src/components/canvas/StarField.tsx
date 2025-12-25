'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const starFieldVertexShader = `
  attribute float size;
  attribute float brightness;
  varying float vBrightness;
  
  void main() {
    vBrightness = brightness;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFieldFragmentShader = `
  uniform float uTime;
  varying float vBrightness;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    
    // Twinkling effect
    float twinkle = sin(uTime * 2.0 + vBrightness * 10.0) * 0.3 + 0.7;
    
    vec3 color = mix(
      vec3(0.8, 0.9, 1.0),
      vec3(0.0, 1.0, 0.64),
      vBrightness * 0.3
    );
    
    gl_FragColor = vec4(color, alpha * vBrightness * twinkle);
  }
`;

export default function StarField() {
    const pointsRef = useRef<THREE.Points>(null);

    const geometry = useMemo(() => {
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const brightnesses = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Distribute stars in a sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 20 + Math.random() * 30;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            sizes[i] = Math.random() * 2 + 0.5;
            brightnesses[i] = Math.random();
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('brightness', new THREE.BufferAttribute(brightnesses, 1));

        return geo;
    }, []);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
        }),
        []
    );

    useFrame((state) => {
        if (pointsRef.current) {
            const material = pointsRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;

            // Slow rotation
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <shaderMaterial
                vertexShader={starFieldVertexShader}
                fragmentShader={starFieldFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

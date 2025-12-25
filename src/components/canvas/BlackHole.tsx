'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for the black hole with gravitational lensing effect
const blackHoleVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const blackHoleFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  #define PI 3.14159265359
  
  // Noise function for the accretion disk
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 6; i++) {
      value += amplitude * smoothNoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    
    // Event horizon (the black center)
    float eventHorizon = 0.15;
    
    // Gravitational lensing distortion
    float lensStrength = 0.3;
    float lensDist = smoothstep(eventHorizon, 0.5, dist);
    vec2 lensedUv = uv * (1.0 + lensStrength * (1.0 - lensDist));
    
    // Rotating accretion disk
    float angle = atan(lensedUv.y, lensedUv.x);
    float rotatedAngle = angle + uTime * 0.2;
    
    // Accretion disk color
    vec3 diskColor = vec3(0.0);
    float diskRadius = smoothstep(0.12, 0.15, dist) * smoothstep(0.5, 0.25, dist);
    
    if (diskRadius > 0.0) {
      // Add noise to the disk
      float noiseVal = fbm(vec2(rotatedAngle * 3.0, dist * 10.0 + uTime * 0.5));
      
      // Color gradient from hot inner edge to cooler outer
      vec3 innerColor = vec3(1.0, 0.8, 0.4); // Hot yellow-white
      vec3 midColor = vec3(0.0, 1.0, 0.64); // Reactor green
      vec3 outerColor = vec3(0.31, 0.27, 0.9); // Reactor blue
      
      float colorMix = smoothstep(0.15, 0.4, dist);
      vec3 baseColor = mix(innerColor, mix(midColor, outerColor, colorMix), colorMix);
      
      diskColor = baseColor * noiseVal * diskRadius * 1.5;
    }
    
    // Fresnel glow at the edge
    float fresnel = pow(1.0 - smoothstep(eventHorizon - 0.02, eventHorizon + 0.05, dist), 2.0);
    vec3 fresnelColor = vec3(0.0, 1.0, 0.64) * fresnel * 2.0;
    
    // The void center
    float voidMask = smoothstep(eventHorizon - 0.01, eventHorizon, dist);
    
    // Combine all effects
    vec3 finalColor = diskColor + fresnelColor;
    finalColor *= voidMask;
    
    // Add subtle glow
    float glow = exp(-dist * 4.0) * 0.3;
    finalColor += vec3(0.0, 0.2, 0.1) * glow;
    
    // Mouse interaction - subtle light bend
    vec2 mouseEffect = uMouse * 0.02;
    finalColor += vec3(0.0, 0.1, 0.05) * (1.0 - dist) * length(mouseEffect);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface BlackHoleProps {
    mousePosition: { x: number; y: number };
}

export default function BlackHole({ mousePosition }: BlackHoleProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }),
        []
    );

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;

            // Smooth mouse following with lerp
            const targetX = mousePosition.x * 0.5;
            const targetY = mousePosition.y * 0.5;
            material.uniforms.uMouse.value.x += (targetX - material.uniforms.uMouse.value.x) * 0.05;
            material.uniforms.uMouse.value.y += (targetY - material.uniforms.uMouse.value.y) * 0.05;
        }
    });

    return (
        <mesh ref={meshRef} scale={[4, 4, 1]}>
            <planeGeometry args={[2, 2, 128, 128]} />
            <shaderMaterial
                vertexShader={blackHoleVertexShader}
                fragmentShader={blackHoleFragmentShader}
                uniforms={uniforms}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleBackgroundProps {
  frequency?: number;
  amplitude?: number;
}

export default function ParticleBackground({ frequency = 0, amplitude = 0 }: ParticleBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const particlesRef = useRef<THREE.Points>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Particle system
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Quantum color palette
    const quantumColors = [
      [0, 0.8, 1],        // quantum-blue
      [0.48, 0.41, 0.93], // plasma-purple
      [0.22, 1, 0.08],    // neon-green
      [1, 0.18, 0.57],    // cyber-pink
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Random quantum colors
      const colorIndex = Math.floor(Math.random() * quantumColors.length);
      const color = quantumColors[colorIndex];
      colors[i3] = color[0];
      colors[i3 + 1] = color[1];
      colors[i3 + 2] = color[2];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    camera.position.z = 30;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = particlesRef.current.geometry.attributes.velocity?.array as Float32Array;
        
        // Update particle positions based on audio
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          // Base movement
          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];
          
          // Audio-reactive movement
          const audioInfluence = amplitude * 0.1;
          positions[i3] += Math.sin(frequency * 0.01 + i * 0.01) * audioInfluence;
          positions[i3 + 1] += Math.cos(frequency * 0.01 + i * 0.02) * audioInfluence;
          
          // Wrap particles around screen
          if (positions[i3] > 50) positions[i3] = -50;
          if (positions[i3] < -50) positions[i3] = 50;
          if (positions[i3 + 1] > 50) positions[i3 + 1] = -50;
          if (positions[i3 + 1] < -50) positions[i3 + 1] = 50;
          if (positions[i3 + 2] > 50) positions[i3 + 2] = -50;
          if (positions[i3 + 2] < -50) positions[i3 + 2] = 50;
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        
        // Rotate particle system slowly
        particlesRef.current.rotation.x += 0.001;
        particlesRef.current.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}

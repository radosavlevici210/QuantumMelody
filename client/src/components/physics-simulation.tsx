import { useEffect, useRef } from "react";

interface PhysicsSimulationProps {
  frequency?: number;
  amplitude?: number;
  particleDensity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: number[];
}

export default function PhysicsSimulation({ 
  frequency = 0, 
  amplitude = 0, 
  particleDensity = 50 
}: PhysicsSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles based on density
    const particleCount = Math.floor((particleDensity / 100) * 50) + 10;
    const quantumColors = [
      'hsl(190, 100%, 50%)',  // quantum-blue
      'hsl(248, 53%, 58%)',   // plasma-purple
      'hsl(120, 100%, 45%)',  // neon-green
      'hsl(332, 100%, 59%)',  // cyber-pink
    ];

    if (particlesRef.current.length !== particleCount) {
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 3 + 1,
          color: quantumColors[Math.floor(Math.random() * quantumColors.length)],
          connections: [],
        });
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const particles = particlesRef.current;

      // Update particle positions
      particles.forEach((particle, index) => {
        // Base physics
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Audio influence
        const audioInfluence = amplitude * 0.1;
        particle.x += Math.sin(frequency * 0.01 + index * 0.1) * audioInfluence;
        particle.y += Math.cos(frequency * 0.01 + index * 0.1) * audioInfluence;

        // Bounce off walls
        if (particle.x <= 0 || particle.x >= canvas.offsetWidth) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.offsetWidth, particle.x));
        }
        if (particle.y <= 0 || particle.y >= canvas.offsetHeight) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.offsetHeight, particle.y));
        }
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(190, 100%, 50%, ${0.3 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [frequency, amplitude, particleDensity]);

  return (
    <div className="bg-[var(--quantum-gray)]/50 rounded-xl p-4 h-64 relative overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

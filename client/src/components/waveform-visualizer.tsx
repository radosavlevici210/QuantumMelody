import { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  audioData?: Float32Array;
  isPlaying: boolean;
}

export default function WaveformVisualizer({ audioData, isPlaying }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const barsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barCount = 64;
    
    // Initialize bars if not done
    if (barsRef.current.length === 0) {
      barsRef.current = Array(barCount).fill(0).map(() => Math.random() * 0.3 + 0.1);
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const barWidth = canvas.offsetWidth / barCount;
      const maxHeight = canvas.offsetHeight - 20;

      // Update bars based on audio data or generate animation
      if (isPlaying) {
        if (audioData) {
          // Use real audio data
          for (let i = 0; i < barCount && i < audioData.length; i++) {
            barsRef.current[i] = Math.abs(audioData[i]);
          }
        } else {
          // Generate animated bars when playing
          for (let i = 0; i < barCount; i++) {
            const target = Math.random() * 0.8 + 0.2;
            barsRef.current[i] += (target - barsRef.current[i]) * 0.3;
          }
        }
      } else {
        // Decay bars when not playing
        for (let i = 0; i < barCount; i++) {
          barsRef.current[i] *= 0.95;
        }
      }

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const height = barsRef.current[i] * maxHeight;
        const x = i * barWidth;
        const y = canvas.offsetHeight - height - 10;

        // Create gradient for quantum effect
        const gradient = ctx.createLinearGradient(0, y + height, 0, y);
        gradient.addColorStop(0, 'hsl(190, 100%, 50%)'); // quantum-blue
        gradient.addColorStop(0.5, 'hsl(248, 53%, 58%)'); // plasma-purple
        gradient.addColorStop(1, 'hsl(120, 100%, 45%)'); // neon-green

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, height);

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'hsl(190, 100%, 50%)';
        ctx.fillRect(x + 1, y, barWidth - 2, height);
        ctx.shadowBlur = 0;
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [audioData, isPlaying]);

  return (
    <div className="bg-[var(--quantum-gray)]/50 rounded-xl p-4">
      <canvas 
        ref={canvasRef}
        className="w-full h-32 rounded-lg"
        style={{ width: '100%', height: '128px' }}
      />
    </div>
  );
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: [number, number, number];
}

export class QuantumParticleSystem {
  private particles: Particle[] = [];
  private maxParticles: number;

  constructor(maxParticles: number = 1000) {
    this.maxParticles = maxParticles;
  }

  createParticle(x: number, y: number, z: number): Particle {
    const quantumColors = [
      [0, 0.8, 1],        // quantum-blue
      [0.48, 0.41, 0.93], // plasma-purple
      [0.22, 1, 0.08],    // neon-green
      [1, 0.18, 0.57],    // cyber-pink
    ];

    return {
      x,
      y,
      z,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      vz: (Math.random() - 0.5) * 0.02,
      life: 1.0,
      maxLife: Math.random() * 5 + 2,
      size: Math.random() * 2 + 0.5,
      color: quantumColors[Math.floor(Math.random() * quantumColors.length)],
    };
  }

  emit(count: number, x: number, y: number, z: number) {
    for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
      this.particles.push(this.createParticle(x, y, z));
    }
  }

  update(deltaTime: number, audioFrequency: number = 0, audioAmplitude: number = 0) {
    this.particles = this.particles.filter(particle => {
      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.z += particle.vz * deltaTime;

      // Audio-reactive behavior
      const audioInfluence = audioAmplitude * 0.1;
      particle.x += Math.sin(audioFrequency * 0.001 + particle.x * 0.1) * audioInfluence;
      particle.y += Math.cos(audioFrequency * 0.001 + particle.y * 0.1) * audioInfluence;

      // Update life
      particle.life -= deltaTime / particle.maxLife;

      // Quantum behavior - particles occasionally "teleport"
      if (Math.random() < 0.001) {
        particle.x += (Math.random() - 0.5) * 10;
        particle.y += (Math.random() - 0.5) * 10;
      }

      return particle.life > 0;
    });
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  getParticleCount(): number {
    return this.particles.length;
  }
}

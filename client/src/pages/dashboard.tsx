import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Atom, 
  Play, 
  Pause, 
  Square, 
  Mic, 
  Bot, 
  Gem, 
  FileBox,
  Box,
  Smartphone,
  Headphones,
  Github,
  Mail,
  RotateCcw,
  Shuffle,
  Layers,
  Plus,
  Menu,
  Zap,
  Activity,
  Infinity,
  Music
} from "lucide-react";
import ParticleBackground from "@/components/particle-background";
import WaveformVisualizer from "@/components/waveform-visualizer";
import PhysicsSimulation from "@/components/physics-simulation";
import AudioControls from "@/components/audio-controls";
import { useAudio } from "@/hooks/use-audio";

export default function Dashboard() {
  const [quantumResonance, setQuantumResonance] = useState([75]);
  const [particleDensity, setParticleDensity] = useState([50]);
  const [aiComplexity, setAiComplexity] = useState([85]);
  const [aiMessage, setAiMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { 
    isPlaying, 
    togglePlayback, 
    audioData, 
    frequency,
    amplitude 
  } = useAudio();

  const [physicsParams] = useState({
    particles: 42,
    energy: 3.14,
    entropy: "∞",
    waveFunction: "Ψ"
  });

  return (
    <div className="min-h-screen bg-[var(--quantum-dark)] text-white relative overflow-x-hidden">
      <ParticleBackground frequency={frequency} amplitude={amplitude} />
      
      {/* Watermark */}
      <div className="fixed bottom-4 right-4 z-50 text-xs text-gray-400 opacity-50">
        © 2024 Ervin Radosavljevic | ervin210@icloud.com | GitHub: radosavlevici210
      </div>

      {/* Header */}
      <header className="glassmorphism border-b border-[var(--quantum-blue)]/20 p-4 relative z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 gradient-quantum rounded-lg flex items-center justify-center">
              <Atom className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-quantum font-bold text-gradient-quantum">
                RealArtist AI + Quantum
              </h1>
              <p className="text-sm text-gray-400">Advanced Music & Physics Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-[var(--quantum-blue)] hover:text-[var(--neon-green)] transition-colors">Dashboard</a>
            <a href="#" className="text-gray-400 hover:text-[var(--quantum-blue)] transition-colors">Studio</a>
            <a href="#" className="text-gray-400 hover:text-[var(--quantum-blue)] transition-colors">Physics</a>
            <a href="#" className="text-gray-400 hover:text-[var(--quantum-blue)] transition-colors">NFT</a>
            <a href="#" className="text-gray-400 hover:text-[var(--quantum-blue)] transition-colors">VR/AR</a>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-[var(--quantum-blue)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </Button>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Music Production Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* Waveform Visualizer */}
          <Card className="glassmorphism border-[var(--quantum-blue)]/20 animate-float">
            <CardHeader>
              <CardTitle className="text-xl font-quantum font-bold text-[var(--quantum-blue)] flex items-center">
                <Activity className="mr-2" />
                Quantum Music Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <WaveformVisualizer audioData={audioData} isPlaying={isPlaying} />
              
              <AudioControls 
                isPlaying={isPlaying}
                onTogglePlayback={togglePlayback}
              />
              
              {/* AI Generation Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quantum Resonance</label>
                  <Slider
                    value={quantumResonance}
                    onValueChange={setQuantumResonance}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Particle Density</label>
                  <Slider
                    value={particleDensity}
                    onValueChange={setParticleDensity}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">AI Complexity</label>
                  <Slider
                    value={aiComplexity}
                    onValueChange={setAiComplexity}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Physics Simulation */}
          <Card className="glassmorphism border-[var(--quantum-blue)]/20">
            <CardHeader>
              <CardTitle className="text-xl font-quantum font-bold text-[var(--plasma-purple)] flex items-center">
                <Atom className="mr-2" />
                Quantum Physics Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <PhysicsSimulation 
                  frequency={frequency}
                  amplitude={amplitude}
                  particleDensity={particleDensity[0]}
                />
                
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" variant="secondary" className="bg-[var(--plasma-purple)]/30 hover:bg-[var(--plasma-purple)]/50">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-[var(--neon-green)]/30 hover:bg-[var(--neon-green)]/50">
                    <Shuffle className="w-4 h-4 mr-1" />
                    Randomize
                  </Button>
                </div>
              </div>
              
              {/* Physics Parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-quantum text-[var(--plasma-purple)]">{physicsParams.particles}</div>
                  <div className="text-xs text-gray-400">Particles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-quantum text-[var(--quantum-blue)]">{physicsParams.energy}</div>
                  <div className="text-xs text-gray-400">Energy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-quantum text-[var(--neon-green)]">{physicsParams.entropy}</div>
                  <div className="text-xs text-gray-400">Entropy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-quantum text-[var(--cyber-pink)]">{physicsParams.waveFunction}</div>
                  <div className="text-xs text-gray-400">Wave Function</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Assistant */}
          <Card className="glassmorphism border-[var(--quantum-blue)]/20">
            <CardHeader>
              <CardTitle className="text-lg font-quantum font-bold text-[var(--neon-green)] flex items-center">
                <Bot className="mr-2" />
                Quantum AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="bg-[var(--quantum-gray)]/30 rounded-lg p-3">
                  <div className="text-sm text-gray-300">
                    "Analyzing harmonic frequencies with quantum resonance patterns..."
                  </div>
                  <div className="text-xs text-gray-500 mt-1">AI Assistant</div>
                </div>
                <div className="bg-[var(--quantum-blue)]/20 rounded-lg p-3">
                  <div className="text-sm text-gray-300">
                    "Generate a 4/4 beat with quantum particle modulation"
                  </div>
                  <div className="text-xs text-gray-500 mt-1">You</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Input 
                  type="text" 
                  placeholder="Ask Quantum AI..." 
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  className="flex-1 bg-[var(--quantum-gray)]/50"
                />
                <Button className="gradient-neon">
                  <Layers className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* NFT Collection */}
          <Card className="glassmorphism border-[var(--quantum-blue)]/20">
            <CardHeader>
              <CardTitle className="text-lg font-quantum font-bold text-[var(--cyber-pink)] flex items-center">
                <Gem className="mr-2" />
                Quantum NFT Collection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-[var(--quantum-blue)]/20 to-[var(--plasma-purple)]/20 rounded-lg p-3 hover:scale-105 transition-transform cursor-pointer">
                  <div className="w-full h-20 gradient-quantum rounded mb-2 flex items-center justify-center">
                    <Music className="text-2xl" />
                  </div>
                  <div className="text-xs text-center">
                    <div className="font-semibold">Quantum Beat #001</div>
                    <div className="text-gray-400">0.5 ETH</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--cyber-pink)]/20 rounded-lg p-3 hover:scale-105 transition-transform cursor-pointer">
                  <div className="w-full h-20 gradient-neon rounded mb-2 flex items-center justify-center">
                    <Atom className="text-2xl" />
                  </div>
                  <div className="text-xs text-center">
                    <div className="font-semibold">Particle Wave #042</div>
                    <div className="text-gray-400">1.2 ETH</div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full gradient-cyber hover:scale-105 transition-transform">
                <Plus className="mr-2 w-4 h-4" />
                Mint New Creation
              </Button>
            </CardContent>
          </Card>
          
          {/* VR/AR Controls */}
          <Card className="glassmorphism border-[var(--quantum-blue)]/20">
            <CardHeader>
              <CardTitle className="text-lg font-quantum font-bold text-[var(--quantum-blue)] flex items-center">
                <FileBox className="mr-2" />
                VR/AR Studio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button className="w-full py-3 bg-gradient-to-r from-[var(--quantum-blue)]/20 to-[var(--plasma-purple)]/20 border border-[var(--quantum-blue)]/30 hover:bg-[var(--quantum-blue)]/30">
                  <Box className="mr-2 w-4 h-4" />
                  Launch 3D Studio
                </Button>
                <Button className="w-full py-3 bg-gradient-to-r from-[var(--neon-green)]/20 to-[var(--quantum-blue)]/20 border border-[var(--neon-green)]/30 hover:bg-[var(--neon-green)]/30">
                  <Smartphone className="mr-2 w-4 h-4" />
                  AR Composer
                </Button>
                <Button className="w-full py-3 bg-gradient-to-r from-[var(--plasma-purple)]/20 to-[var(--cyber-pink)]/20 border border-[var(--plasma-purple)]/30 hover:bg-[var(--plasma-purple)]/30">
                  <Headphones className="mr-2 w-4 h-4" />
                  VR Physics Lab
                </Button>
              </div>
              
              <div className="p-3 bg-[var(--quantum-gray)]/30 rounded-lg">
                <div className="text-sm text-gray-300 mb-2">Active Session:</div>
                <div className="text-xs text-gray-400 flex items-center">
                  <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full mr-2"></div>
                  VR Studio - 00:23:45
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="glassmorphism border-t border-[var(--quantum-blue)]/20 mt-12 p-6 relative z-10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <a href="https://github.com/radosavlevici210" className="text-gray-400 hover:text-[var(--quantum-blue)] transition-colors">
              <Github className="text-xl" />
            </a>
            <a href="mailto:ervin210@icloud.com" className="text-gray-400 hover:text-[var(--quantum-blue)] transition-colors">
              <Mail className="text-xl" />
            </a>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 RealArtist AI + Quantum Physics Platform | Developed by Ervin Radosavljevic
          </div>
          <div className="text-xs text-gray-500 mt-1">
            GitHub: radosavlevici210 | Contact: ervin210@icloud.com
          </div>
        </div>
      </footer>
    </div>
  );
}

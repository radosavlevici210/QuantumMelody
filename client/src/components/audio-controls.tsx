import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Mic } from "lucide-react";

interface AudioControlsProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
}

export default function AudioControls({ isPlaying, onTogglePlayback }: AudioControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button 
        size="lg"
        className="w-12 h-12 rounded-full gradient-quantum hover:scale-110 transition-transform animate-pulse-glow"
        onClick={onTogglePlayback}
      >
        {isPlaying ? <Pause className="text-lg" /> : <Play className="text-lg" />}
      </Button>
      
      <Button 
        size="icon"
        variant="secondary"
        className="w-10 h-10 rounded-full bg-[var(--quantum-gray)] hover:bg-[var(--quantum-blue)] transition-colors"
      >
        <Square className="w-4 h-4" />
      </Button>
      
      <Button 
        size="icon"
        variant="secondary"
        className="w-10 h-10 rounded-full bg-[var(--quantum-gray)] hover:bg-[var(--neon-green)] transition-colors"
      >
        <Mic className="w-4 h-4" />
      </Button>
    </div>
  );
}

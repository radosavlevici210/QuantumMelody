import { useState, useEffect, useRef } from "react";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array>();
  const [frequency, setFrequency] = useState(0);
  const [amplitude, setAmplitude] = useState(0);
  
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const oscillatorRef = useRef<OscillatorNode>();
  const gainNodeRef = useRef<GainNode>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    // Initialize Web Audio API
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create analyser for visualization
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        // Create gain node for volume control
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = 0.1;
        
        // Connect nodes
        analyserRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioContextRef.current.destination);
        
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    };

    initAudio();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const togglePlayback = () => {
    if (!audioContextRef.current || !analyserRef.current || !gainNodeRef.current) return;

    if (isPlaying) {
      // Stop playback
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
        oscillatorRef.current = undefined;
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      setIsPlaying(false);
    } else {
      // Start playback
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create quantum-themed audio generation
      oscillatorRef.current = audioContextRef.current.createOscillator();
      const lfoRef = audioContextRef.current.createOscillator();
      const lfoGainRef = audioContextRef.current.createGain();
      
      // Main oscillator (quantum resonance)
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.value = 220; // Base frequency
      
      // LFO for quantum modulation
      lfoRef.type = 'sine';
      lfoRef.frequency.value = 0.5;
      lfoGainRef.gain.value = 50;
      
      // Connect modulation
      lfoRef.connect(lfoGainRef);
      lfoGainRef.connect(oscillatorRef.current.frequency);
      
      // Connect to analyser and output
      oscillatorRef.current.connect(analyserRef.current);
      
      oscillatorRef.current.start();
      lfoRef.start();
      
      setIsPlaying(true);
      
      // Start audio analysis
      const analyzeAudio = () => {
        if (!analyserRef.current) return;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const frequencyArray = new Float32Array(bufferLength);
        
        analyserRef.current.getByteFrequencyData(dataArray);
        analyserRef.current.getFloatFrequencyData(frequencyArray);
        
        // Calculate frequency and amplitude for visualization
        let totalAmplitude = 0;
        let weightedFrequency = 0;
        let totalWeight = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          const amplitude = dataArray[i] / 255;
          totalAmplitude += amplitude;
          
          const freq = (i / bufferLength) * (audioContextRef.current!.sampleRate / 2);
          weightedFrequency += freq * amplitude;
          totalWeight += amplitude;
        }
        
        setAmplitude(totalAmplitude / bufferLength);
        setFrequency(totalWeight > 0 ? weightedFrequency / totalWeight : 0);
        setAudioData(new Float32Array(dataArray.map(val => val / 255)));
        
        if (isPlaying) {
          animationIdRef.current = requestAnimationFrame(analyzeAudio);
        }
      };
      
      analyzeAudio();
    }
  };

  return {
    isPlaying,
    togglePlayback,
    audioData,
    frequency,
    amplitude,
  };
}

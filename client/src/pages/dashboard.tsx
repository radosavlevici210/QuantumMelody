
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { AudioControls } from "@/components/audio-controls";
import { WaveformVisualizer } from "@/components/waveform-visualizer";
import { PhysicsSimulation } from "@/components/physics-simulation";
import { ParticleBackground } from "@/components/particle-background";
import { Play, Pause, Square, Upload, Zap, Palette, Music, Cpu, Coins, MessageSquare, Eye, Settings } from "lucide-react";
import type { AudioTrack, PhysicsSimulation as PhysicsSimulationType, NftCollection } from "@shared/schema";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("studio");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [simulationParams, setSimulationParams] = useState({
    particleCount: 1000,
    energyLevel: 50,
    entropyLevel: 25,
    waveFunction: "sine",
    colorScheme: "quantum"
  });
  const [aiMessage, setAiMessage] = useState("");
  const [vrSession, setVrSession] = useState<any>(null);

  const queryClient = useQueryClient();

  // Fetch data
  const { data: tracks = [], isLoading: tracksLoading } = useQuery({
    queryKey: ["tracks"],
    queryFn: async () => {
      const response = await fetch("/api/tracks");
      if (!response.ok) throw new Error("Failed to fetch tracks");
      return response.json();
    }
  });

  const { data: simulations = [], isLoading: simulationsLoading } = useQuery({
    queryKey: ["simulations"],
    queryFn: async () => {
      const response = await fetch("/api/simulations");
      if (!response.ok) throw new Error("Failed to fetch simulations");
      return response.json();
    }
  });

  const { data: nfts = [], isLoading: nftsLoading } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const response = await fetch("/api/nfts");
      if (!response.ok) throw new Error("Failed to fetch NFTs");
      return response.json();
    }
  });

  // Mutations
  const createTrackMutation = useMutation({
    mutationFn: async (trackData: any) => {
      const response = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackData)
      });
      if (!response.ok) throw new Error("Failed to create track");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      toast({ title: "Track created successfully!" });
    }
  });

  const createSimulationMutation = useMutation({
    mutationFn: async (simulationData: any) => {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simulationData)
      });
      if (!response.ok) throw new Error("Failed to create simulation");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
      toast({ title: "Simulation created successfully!" });
    }
  });

  const createNFTMutation = useMutation({
    mutationFn: async (nftData: any) => {
      const response = await fetch("/api/nfts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nftData)
      });
      if (!response.ok) throw new Error("Failed to create NFT");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfts"] });
      toast({ title: "NFT created successfully!" });
    }
  });

  const sendAIMessage = async () => {
    if (!aiMessage.trim()) return;
    
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: aiMessage,
          context: { type: selectedTab }
        })
      });
      const data = await response.json();
      toast({ title: "AI Assistant", description: data.message });
      setAiMessage("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  };

  const startVRSession = async (type: string) => {
    try {
      const response = await fetch("/api/vr/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      });
      const data = await response.json();
      setVrSession(data);
      toast({ title: "VR/AR Session Started", description: `${type} session is now active` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to start VR/AR session", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Quantum Music Studio
          </h1>
          <p className="text-slate-300">Create, visualize, and monetize quantum-inspired audio experiences</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 backdrop-blur">
            <TabsTrigger value="studio" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Studio
            </TabsTrigger>
            <TabsTrigger value="physics" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Physics
            </TabsTrigger>
            <TabsTrigger value="nft" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              NFT
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="vr" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              VR/AR
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Audio Studio Tab */}
          <TabsContent value="studio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Audio Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AudioControls 
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    track={currentTrack}
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardHeader>
                  <CardTitle>Waveform Visualizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <WaveformVisualizer audioData={currentTrack?.waveformData} />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle>Audio Library</CardTitle>
                <CardDescription>Manage your quantum audio tracks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tracks.map((track: AudioTrack) => (
                    <div
                      key={track.id}
                      className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-purple-500 transition-colors cursor-pointer"
                      onClick={() => setCurrentTrack(track)}
                    >
                      <h3 className="font-semibold text-purple-300">{track.title}</h3>
                      <p className="text-sm text-slate-400">{track.artist}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="secondary">{track.genre || "Unknown"}</Badge>
                        <span className="text-xs text-slate-500">{track.duration}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Physics Simulation Tab */}
          <TabsContent value="physics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardHeader>
                  <CardTitle>Simulation Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Particle Count: {simulationParams.particleCount}</Label>
                    <Slider
                      value={[simulationParams.particleCount]}
                      onValueChange={([value]) => setSimulationParams(prev => ({ ...prev, particleCount: value }))}
                      min={100}
                      max={5000}
                      step={100}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Energy Level: {simulationParams.energyLevel}%</Label>
                    <Slider
                      value={[simulationParams.energyLevel]}
                      onValueChange={([value]) => setSimulationParams(prev => ({ ...prev, energyLevel: value }))}
                      min={0}
                      max={100}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Entropy: {simulationParams.entropyLevel}%</Label>
                    <Slider
                      value={[simulationParams.entropyLevel]}
                      onValueChange={([value]) => setSimulationParams(prev => ({ ...prev, entropyLevel: value }))}
                      min={0}
                      max={100}
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    onClick={() => createSimulationMutation.mutate({
                      name: `Simulation ${Date.now()}`,
                      ...simulationParams
                    })}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Save Simulation
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-slate-800/50 backdrop-blur border-slate-700">
                <CardHeader>
                  <CardTitle>Physics Simulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <PhysicsSimulation {...simulationParams} />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle>Saved Simulations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {simulations.map((sim: PhysicsSimulationType) => (
                    <div key={sim.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <h3 className="font-semibold text-cyan-300">{sim.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{sim.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">{sim.waveFunction}</Badge>
                        <Badge variant="secondary">{sim.colorScheme}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Tab */}
          <TabsContent value="nft" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle>NFT Marketplace</CardTitle>
                <CardDescription>Tokenize your quantum music creations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nfts.map((nft: NftCollection) => (
                    <div key={nft.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <h3 className="font-semibold text-yellow-300">{nft.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{nft.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">{nft.currency}</Badge>
                        <span className="text-green-400 font-semibold">{nft.price} {nft.currency}</span>
                      </div>
                      {nft.isListed && <Badge className="mt-2 bg-green-600">Listed</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle>Quantum AI Assistant</CardTitle>
                <CardDescription>Get AI-powered insights for your quantum music</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask the AI about quantum music theory, physics simulations, or NFT strategies..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Button onClick={sendAIMessage} className="bg-purple-600 hover:bg-purple-700">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VR/AR Tab */}
          <TabsContent value="vr" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle>Immersive Experiences</CardTitle>
                <CardDescription>Create and join VR/AR sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => startVRSession("3d-studio")}
                    className="h-20 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    3D Studio
                  </Button>
                  <Button 
                    onClick={() => startVRSession("ar-composer")}
                    className="h-20 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700"
                  >
                    AR Composer
                  </Button>
                  <Button 
                    onClick={() => startVRSession("vr-physics")}
                    className="h-20 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    VR Physics
                  </Button>
                </div>

                {vrSession && (
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-green-400">Active VR/AR Session</h3>
                      <p className="text-sm text-slate-400">Session ID: {vrSession.sessionId}</p>
                      <p className="text-sm text-slate-400">Type: {vrSession.type}</p>
                      <p className="text-sm text-slate-400">Status: {vrSession.status}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-purple-400">{tracks.length}</div>
                  <p className="text-xs text-slate-400">Audio Tracks</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-cyan-400">{simulations.length}</div>
                  <p className="text-xs text-slate-400">Simulations</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-400">{nfts.length}</div>
                  <p className="text-xs text-slate-400">NFTs Created</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-400">
                    {nfts.filter((nft: NftCollection) => nft.isListed).length}
                  </div>
                  <p className="text-xs text-slate-400">Listed NFTs</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Audio Processing</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Physics Engine</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Particle Rendering</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

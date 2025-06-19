
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import ParticleBackground from "@/components/particle-background";
import { Music, Zap, Coins, Play, Pause, Upload, Download, Rocket, DollarSign } from "lucide-react";
import type { AudioTrack, PhysicsSimulation, CryptoToken } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("audio");
  const [audioForm, setAudioForm] = useState({ title: "", artist: "", duration: 0 });
  const [simulationForm, setSimulationForm] = useState({ name: "", particleCount: 1000 });
  const [cryptoForm, setCryptoForm] = useState({ 
    name: "", 
    symbol: "", 
    description: "", 
    totalSupply: "1000000", 
    initialPrice: "0.01" 
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Audio Tracks
  const { data: tracks, isLoading: tracksLoading } = useQuery<AudioTrack[]>({
    queryKey: ["tracks"],
    queryFn: async () => {
      const response = await fetch("/api/tracks");
      if (!response.ok) throw new Error("Failed to fetch tracks");
      return response.json();
    },
  });

  const createTrackMutation = useMutation({
    mutationFn: async (data: typeof audioForm) => {
      const response = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create track");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      setAudioForm({ title: "", artist: "", duration: 0 });
      toast({ title: "Success", description: "Audio track created successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create track", variant: "destructive" });
    },
  });

  // Physics Simulations
  const { data: simulations, isLoading: simulationsLoading } = useQuery<PhysicsSimulation[]>({
    queryKey: ["simulations"],
    queryFn: async () => {
      const response = await fetch("/api/simulations");
      if (!response.ok) throw new Error("Failed to fetch simulations");
      return response.json();
    },
  });

  const createSimulationMutation = useMutation({
    mutationFn: async (data: typeof simulationForm) => {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create simulation");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
      setSimulationForm({ name: "", particleCount: 1000 });
      toast({ title: "Success", description: "Physics simulation created successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create simulation", variant: "destructive" });
    },
  });

  // Crypto Tokens
  const { data: cryptoTokens, isLoading: cryptoLoading } = useQuery<CryptoToken[]>({
    queryKey: ["crypto"],
    queryFn: async () => {
      const response = await fetch("/api/crypto");
      if (!response.ok) throw new Error("Failed to fetch crypto tokens");
      return response.json();
    },
  });

  const createCryptoMutation = useMutation({
    mutationFn: async (data: typeof cryptoForm) => {
      const response = await fetch("/api/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          totalSupply: parseFloat(data.totalSupply),
          initialPrice: parseFloat(data.initialPrice)
        }),
      });
      if (!response.ok) throw new Error("Failed to create crypto token");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crypto"] });
      setCryptoForm({ name: "", symbol: "", description: "", totalSupply: "1000000", initialPrice: "0.01" });
      toast({ title: "Success", description: "Crypto token created successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create crypto token", variant: "destructive" });
    },
  });

  const deployTokenMutation = useMutation({
    mutationFn: async (tokenId: number) => {
      const response = await fetch("/api/blockchain/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId }),
      });
      if (!response.ok) throw new Error("Failed to deploy token");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crypto"] });
      toast({ title: "Success", description: "Token deployed to blockchain successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to deploy token", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ParticleBackground frequency={50} amplitude={30} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-quantum">
            Quantum Crypto Universe
          </h1>
          <p className="text-lg text-slate-300">
            Transform audio into quantum physics simulations and launch cryptocurrencies
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glassmorphism">
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Audio Tracks
            </TabsTrigger>
            <TabsTrigger value="physics" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Physics Sims
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Crypto Tokens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audio" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-white">Create Audio Track</CardTitle>
                <CardDescription>Upload and configure your audio tracks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                      id="title"
                      value={audioForm.title}
                      onChange={(e) => setAudioForm({ ...audioForm, title: e.target.value })}
                      placeholder="Track title"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist" className="text-white">Artist</Label>
                    <Input
                      id="artist"
                      value={audioForm.artist}
                      onChange={(e) => setAudioForm({ ...audioForm, artist: e.target.value })}
                      placeholder="Artist name"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-white">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={audioForm.duration}
                      onChange={(e) => setAudioForm({ ...audioForm, duration: parseInt(e.target.value) || 0 })}
                      placeholder="Duration"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => createTrackMutation.mutate(audioForm)}
                  disabled={createTrackMutation.isPending || !audioForm.title || !audioForm.artist}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {createTrackMutation.isPending ? "Creating..." : "Create Track"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracksLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="glassmorphism">
                      <CardContent className="pt-6">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : tracks?.map((track) => (
                    <Card key={track.id} className="glassmorphism hover:border-cyan-400/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">{track.title}</CardTitle>
                        <CardDescription>by {track.artist}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="secondary">{track.duration}s</Badge>
                          {track.frequency && (
                            <Badge variant="outline" className="text-cyan-400">
                              {track.frequency}Hz
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Play className="w-4 h-4 mr-1" />
                            Play
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="physics" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-white">Create Physics Simulation</CardTitle>
                <CardDescription>Configure quantum particle behaviors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sim-name" className="text-white">Simulation Name</Label>
                    <Input
                      id="sim-name"
                      value={simulationForm.name}
                      onChange={(e) => setSimulationForm({ ...simulationForm, name: e.target.value })}
                      placeholder="Simulation name"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="particle-count" className="text-white">Particle Count</Label>
                    <Input
                      id="particle-count"
                      type="number"
                      value={simulationForm.particleCount}
                      onChange={(e) => setSimulationForm({ ...simulationForm, particleCount: parseInt(e.target.value) || 1000 })}
                      placeholder="1000"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => createSimulationMutation.mutate(simulationForm)}
                  disabled={createSimulationMutation.isPending || !simulationForm.name}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {createSimulationMutation.isPending ? "Creating..." : "Create Simulation"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulationsLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="glassmorphism">
                      <CardContent className="pt-6">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : simulations?.map((sim) => (
                    <Card key={sim.id} className="glassmorphism hover:border-purple-400/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">{sim.name}</CardTitle>
                        <CardDescription>Quantum field simulation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="secondary">{sim.particleCount} particles</Badge>
                          <Badge variant={sim.isActive ? "default" : "outline"} className="text-purple-400">
                            {sim.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          <Zap className="w-4 h-4 mr-1" />
                          {sim.isActive ? "Stop" : "Start"} Simulation
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-white">Create Cryptocurrency Token</CardTitle>
                <CardDescription>Launch your quantum-powered cryptocurrency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crypto-name" className="text-white">Token Name</Label>
                    <Input
                      id="crypto-name"
                      value={cryptoForm.name}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, name: e.target.value })}
                      placeholder="QuantumCoin"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crypto-symbol" className="text-white">Symbol</Label>
                    <Input
                      id="crypto-symbol"
                      value={cryptoForm.symbol}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, symbol: e.target.value.toUpperCase() })}
                      placeholder="QTC"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crypto-supply" className="text-white">Total Supply</Label>
                    <Input
                      id="crypto-supply"
                      type="number"
                      value={cryptoForm.totalSupply}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, totalSupply: e.target.value })}
                      placeholder="1000000"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crypto-price" className="text-white">Initial Price (USD)</Label>
                    <Input
                      id="crypto-price"
                      type="number"
                      step="0.001"
                      value={cryptoForm.initialPrice}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, initialPrice: e.target.value })}
                      placeholder="0.01"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="crypto-description" className="text-white">Description</Label>
                    <Input
                      id="crypto-description"
                      value={cryptoForm.description}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, description: e.target.value })}
                      placeholder="A quantum-powered cryptocurrency..."
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => createCryptoMutation.mutate(cryptoForm)}
                  disabled={createCryptoMutation.isPending || !cryptoForm.name || !cryptoForm.symbol}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {createCryptoMutation.isPending ? "Creating..." : "Create Token"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cryptoLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="glassmorphism">
                      <CardContent className="pt-6">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : cryptoTokens?.map((token) => (
                    <Card key={token.id} className="glassmorphism hover:border-green-400/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">{token.name}</CardTitle>
                        <CardDescription>{token.symbol} • {token.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-300">Supply:</span>
                            <Badge variant="secondary">{Number(token.totalSupply).toLocaleString()}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-300">Price:</span>
                            <Badge variant="outline" className="text-green-400">
                              ${token.initialPrice}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-300">Status:</span>
                            <Badge variant={token.isLaunched ? "default" : "outline"} className="text-green-400">
                              {token.isLaunched ? "Deployed" : "Draft"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {!token.isLaunched ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => deployTokenMutation.mutate(token.id)}
                                disabled={deployTokenMutation.isPending}
                              >
                                <Rocket className="w-4 h-4 mr-1" />
                                Deploy
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="flex-1">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Trade
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
import { Music, Zap, Sparkles, Play, Pause, Upload, Download } from "lucide-react";
import type { AudioTrack, PhysicsSimulation, NftCollection } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("audio");
  const [audioForm, setAudioForm] = useState({ title: "", artist: "", duration: 0 });
  const [simulationForm, setSimulationForm] = useState({ name: "", particleCount: 1000 });
  const [nftForm, setNftForm] = useState({ name: "", description: "" });
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

  // NFT Collections
  const { data: nfts, isLoading: nftsLoading } = useQuery<NftCollection[]>({
    queryKey: ["nfts"],
    queryFn: async () => {
      const response = await fetch("/api/nfts");
      if (!response.ok) throw new Error("Failed to fetch NFTs");
      return response.json();
    },
  });

  const createNFTMutation = useMutation({
    mutationFn: async (data: typeof nftForm) => {
      const response = await fetch("/api/nfts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create NFT");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfts"] });
      setNftForm({ name: "", description: "" });
      toast({ title: "Success", description: "NFT collection created successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create NFT", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ParticleBackground frequency={50} amplitude={30} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-quantum">
            Quantum Audio Universe
          </h1>
          <p className="text-lg text-slate-300">
            Transform audio into immersive physics simulations and digital collectibles
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
            <TabsTrigger value="nfts" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              NFT Gallery
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

          <TabsContent value="nfts" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-white">Create NFT Collection</CardTitle>
                <CardDescription>Mint your audio-physics creations as NFTs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nft-name" className="text-white">Collection Name</Label>
                    <Input
                      id="nft-name"
                      value={nftForm.name}
                      onChange={(e) => setNftForm({ ...nftForm, name: e.target.value })}
                      placeholder="NFT collection name"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nft-description" className="text-white">Description</Label>
                    <Input
                      id="nft-description"
                      value={nftForm.description}
                      onChange={(e) => setNftForm({ ...nftForm, description: e.target.value })}
                      placeholder="Collection description"
                      className="bg-black/20 border-cyan-500/30 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => createNFTMutation.mutate(nftForm)}
                  disabled={createNFTMutation.isPending || !nftForm.name}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700"
                >
                  {createNFTMutation.isPending ? "Minting..." : "Mint NFT Collection"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nftsLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="glassmorphism">
                      <CardContent className="pt-6">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : nfts?.map((nft) => (
                    <Card key={nft.id} className="glassmorphism hover:border-pink-400/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">{nft.name}</CardTitle>
                        <CardDescription>{nft.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-3">
                          {nft.tokenId && (
                            <Badge variant="secondary" className="text-xs">
                              #{nft.tokenId}
                            </Badge>
                          )}
                          <Badge variant={nft.mintedAt ? "default" : "outline"} className="text-pink-400">
                            {nft.mintedAt ? "Minted" : "Draft"}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          <Sparkles className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
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
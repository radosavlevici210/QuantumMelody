
/**
 * This software is not licensed for open-source or commercial usage.
 * Any use of this code is bound by a 51% royalty for past or future use.
 */

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
import FinancialDashboard from "../components/crypto-wallet";
import { Music, BarChart3, Coins, Play, Pause, Upload, Download, TrendingUp, DollarSign } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Business Management Platform
          </h1>
          <p className="text-lg text-slate-600">
            Manage audio content, analytics, and digital assets from one dashboard
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Media Content
            </TabsTrigger>
            <TabsTrigger value="physics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Digital Assets
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audio" className="space-y-6">
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="text-slate-800">Add Media Content</CardTitle>
                <CardDescription>Upload and manage your media library</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-slate-700">Title</Label>
                    <Input
                      id="title"
                      value={audioForm.title}
                      onChange={(e) => setAudioForm({ ...audioForm, title: e.target.value })}
                      placeholder="Content title"
                      className="border-slate-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist" className="text-slate-700">Creator</Label>
                    <Input
                      id="artist"
                      value={audioForm.artist}
                      onChange={(e) => setAudioForm({ ...audioForm, artist: e.target.value })}
                      placeholder="Creator name"
                      className="border-slate-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-slate-700">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={audioForm.duration}
                      onChange={(e) => setAudioForm({ ...audioForm, duration: parseInt(e.target.value) || 0 })}
                      placeholder="Duration"
                      className="border-slate-300"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => createTrackMutation.mutate(audioForm)}
                  disabled={createTrackMutation.isPending || !audioForm.title || !audioForm.artist}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {createTrackMutation.isPending ? "Adding..." : "Add Content"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracksLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="bg-white shadow-sm border">
                      <CardContent className="pt-6">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : tracks?.map((track) => (
                    <Card key={track.id} className="bg-white shadow-sm border hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-slate-800 text-lg">{track.title}</CardTitle>
                        <CardDescription>by {track.artist}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="secondary">{track.duration}s</Badge>
                          {track.frequency && (
                            <Badge variant="outline" className="text-blue-600">
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
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="text-slate-800">Create Analytics Report</CardTitle>
                <CardDescription>Generate data analysis and reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sim-name" className="text-slate-700">Report Name</Label>
                    <Input
                      id="sim-name"
                      value={simulationForm.name}
                      onChange={(e) => setSimulationForm({ ...simulationForm, name: e.target.value })}
                      placeholder="Report name"
                      className="border-slate-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="particle-count" className="text-slate-700">Data Points</Label>
                    <Input
                      id="particle-count"
                      type="number"
                      value={simulationForm.particleCount}
                      onChange={(e) => setSimulationForm({ ...simulationForm, particleCount: parseInt(e.target.value) || 1000 })}
                      placeholder="1000"
                      className="border-slate-300"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => createSimulationMutation.mutate(simulationForm)}
                  disabled={createSimulationMutation.isPending || !simulationForm.name}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {createSimulationMutation.isPending ? "Generating..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulationsLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="bg-white shadow-sm border">
                      <CardContent className="pt-6">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : simulations?.map((sim) => (
                    <Card key={sim.id} className="bg-white shadow-sm border hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-slate-800 text-lg">{sim.name}</CardTitle>
                        <CardDescription>Data analysis report</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="secondary">{sim.particleCount} data points</Badge>
                          <Badge variant={sim.isActive ? "default" : "outline"} className="text-green-600">
                            {sim.isActive ? "Active" : "Draft"}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {sim.isActive ? "View" : "Generate"} Report
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="text-slate-800">Create Digital Asset</CardTitle>
                <CardDescription>Manage your digital tokens and assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crypto-name" className="text-slate-700">Asset Name</Label>
                    <Input
                      id="crypto-name"
                      value={cryptoForm.name}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, name: e.target.value })}
                      placeholder="Business Token"
                      className="border-slate-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crypto-symbol" className="text-slate-700">Symbol</Label>
                    <Input
                      id="crypto-symbol"
                      value={cryptoForm.symbol}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, symbol: e.target.value.toUpperCase() })}
                      placeholder="BTC"
                      className="border-slate-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crypto-supply" className="text-slate-700">Total Supply</Label>
                    <Input
                      id="crypto-supply"
                      type="number"
                      value={cryptoForm.totalSupply}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, totalSupply: e.target.value })}
                      placeholder="1000000"
                      className="border-slate-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crypto-price" className="text-slate-700">Initial Price (USD)</Label>
                    <Input
                      id="crypto-price"
                      type="number"
                      step="0.001"
                      value={cryptoForm.initialPrice}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, initialPrice: e.target.value })}
                      placeholder="0.01"
                      className="border-slate-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="crypto-description" className="text-slate-700">Description</Label>
                    <Input
                      id="crypto-description"
                      value={cryptoForm.description}
                      onChange={(e) => setCryptoForm({ ...cryptoForm, description: e.target.value })}
                      placeholder="Digital asset description..."
                      className="border-slate-300"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => createCryptoMutation.mutate(cryptoForm)}
                  disabled={createCryptoMutation.isPending || !cryptoForm.name || !cryptoForm.symbol}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {createCryptoMutation.isPending ? "Creating..." : "Create Asset"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cryptoLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="bg-white shadow-sm border">
                      <CardContent className="pt-6">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : cryptoTokens?.map((token) => (
                    <Card key={token.id} className="bg-white shadow-sm border hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-slate-800 text-lg">{token.name}</CardTitle>
                        <CardDescription>{token.symbol} • {token.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Supply:</span>
                            <Badge variant="secondary">{Number(token.totalSupply).toLocaleString()}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Price:</span>
                            <Badge variant="outline" className="text-orange-600">
                              ${token.initialPrice}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Status:</span>
                            <Badge variant={token.isLaunched ? "default" : "outline"} className="text-orange-600">
                              {token.isLaunched ? "Active" : "Draft"}
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
                                <Upload className="w-4 h-4 mr-1" />
                                Launch
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="flex-1">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Manage
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <FinancialDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

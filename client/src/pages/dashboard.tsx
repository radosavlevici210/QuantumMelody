import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Users, Shield, Settings, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { ParticleBackground } from '../components/particle-background';
import { CryptoWallet } from '../components/crypto-wallet';
import { AdvancedSearch } from '../components/advanced-search';
import { BulkOperations } from '../components/bulk-operations';
import { ActivityFeed } from '../components/activity-feed';
import { AutomationPanel } from '../components/automation-panel';
import { DashboardStats } from '../components/dashboard-stats';
import { NotificationsCenter } from '../components/notifications-center';

interface SearchFilter {
  type: string;
  value: string;
  label: string;
}

export default function Dashboard() {
  const [audioTracks, setAudioTracks] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [cryptoTokens, setCryptoTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilter[]>([]);

  useEffect(() => {
    fetchAllData();

    // Auto-refresh data every minute
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const [tracksRes, simulationsRes, cryptoRes, transactionsRes, walletsRes] = await Promise.all([
        fetch('/api/tracks'),
        fetch('/api/simulations'),
        fetch('/api/crypto'),
        fetch('/api/transactions'),
        fetch('/api/wallets')
      ]);

      setAudioTracks(await tracksRes.json());
      setSimulations(await simulationsRes.json());
      setCryptoTokens(await cryptoRes.json());
      setTransactions(await transactionsRes.json());
      setWallets(await walletsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (query: string, filters: SearchFilter[]) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    // Implement actual search logic here
    console.log('Search:', query, 'Filters:', filters);
  };

  const handleBulkOperation = async (operation: string, items: string[]) => {
    console.log(`Performing ${operation} on`, items);
    // Simulate operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    const allIds = [
      ...audioTracks.map((track: any) => `track-${track.id}`),
      ...simulations.map((sim: any) => `sim-${sim.id}`),
      ...cryptoTokens.map((token: any) => `token-${token.id}`)
    ];
    setSelectedItems(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const createNewWallet = async () => {
    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (response.ok) {
        fetchAllData();
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const totalItems = audioTracks.length + simulations.length + cryptoTokens.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Business Management Platform
            </h1>
            <p className="text-gray-400 mt-2">
              Advanced digital asset management and analytics platform
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationsCenter />
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <Zap className="h-3 w-3 mr-1" />
              Live System
            </Badge>
          </div>
        </div>

        {/* Search and Bulk Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdvancedSearch onSearch={handleSearch} />
          </div>
          <div>
            <BulkOperations
              selectedItems={selectedItems}
              totalItems={totalItems}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onOperation={handleBulkOperation}
            />
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-black/20 border-green-500/20">
                <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                  Media
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="blockchain" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                  Blockchain
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-6 bg-black/20 border-green-500/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Media Content</h3>
                    <div className="space-y-3">
                      {audioTracks.slice(0, 3).map((track: any) => (
                        <div key={track.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{track.title}</p>
                            <p className="text-gray-400 text-sm">{track.artist}</p>
                          </div>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 border-green-500/20 text-green-400 hover:bg-green-500/10">
                      View All Media
                    </Button>
                  </Card>

                  <Card className="p-6 bg-black/20 border-green-500/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Analytics Reports</h3>
                    <div className="space-y-3">
                      {simulations.slice(0, 3).map((sim: any) => (
                        <div key={sim.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{sim.name}</p>
                            <p className="text-gray-400 text-sm">{sim.particleCount} particles</p>
                          </div>
                          <Badge variant="outline" className={
                            sim.isActive 
                              ? "bg-green-500/10 text-green-400" 
                              : "bg-gray-500/10 text-gray-400"
                          }>
                            {sim.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 border-green-500/20 text-green-400 hover:bg-green-500/10">
                      View All Reports
                    </Button>
                  </Card>
                </div>

                <Card className="p-6 bg-black/20 border-green-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Digital Assets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cryptoTokens.map((token: any) => (
                      <div key={token.id} className="p-4 rounded-lg bg-white/5 border border-green-500/10">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-white font-medium">{token.name}</h4>
                            <p className="text-gray-400 text-sm">{token.symbol}</p>
                          </div>
                          <Badge variant="outline" className={
                            token.isLaunched 
                              ? "bg-green-500/10 text-green-400" 
                              : "bg-yellow-500/10 text-yellow-400"
                          }>
                            {token.isLaunched ? 'Live' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{token.description}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Supply:</span>
                            <span className="text-white">{Number(token.totalSupply).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price:</span>
                            <span className="text-green-400">${Number(token.initialPrice).toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-green-500/20 text-green-400 hover:bg-green-500/10"
                  >
                    Manage Digital Assets
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="media">
                <Card className="p-6 bg-black/20 border-green-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Media Content Library</h3>
                  <div className="space-y-4">
                    {audioTracks.map((track: any) => (
                      <div key={track.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{track.title.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{track.title}</h4>
                            <p className="text-gray-400 text-sm">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-green-400">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="p-6 bg-black/20 border-green-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Analytics & Simulations</h3>
                  <div className="space-y-4">
                    {simulations.map((sim: any) => (
                      <div key={sim.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{sim.name}</h4>
                            <p className="text-gray-400 text-sm">{sim.particleCount} particles - {sim.quantumField}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className={
                            sim.isActive 
                              ? "bg-green-500/10 text-green-400" 
                              : "bg-gray-500/10 text-gray-400"
                          }>
                            {sim.isActive ? 'Running' : 'Stopped'}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-green-400">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="blockchain">
                <div className="space-y-6">
                  <CryptoWallet 
                    wallets={wallets}
                    transactions={transactions}
                    onCreateWallet={createNewWallet}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <AutomationPanel />
            <ActivityFeed />
          </div>
        </div>

        {/* Footer */}
        <Card className="p-4 bg-black/20 border-green-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Ervin Remus Radosavlevici. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>System Status: </span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                <Shield className="h-3 w-3 mr-1" />
                Operational
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
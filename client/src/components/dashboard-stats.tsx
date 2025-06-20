import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardStats {
  totalAssets: number;
  totalValue: string;
  totalTransactions: number;
  activeWallets: number;
  mediaFiles: number;
  reports: number;
  monthlyGrowth: number;
  revenueGrowth: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch data from multiple endpoints
      const [cryptoRes, walletsRes, tracksRes, simulationsRes, transactionsRes] = await Promise.all([
        fetch('/api/crypto'),
        fetch('/api/wallets'),
        fetch('/api/tracks'),
        fetch('/api/simulations'),
        fetch('/api/transactions')
      ]);

      const [crypto, wallets, tracks, simulations, transactions] = await Promise.all([
        cryptoRes.json(),
        walletsRes.json(),
        tracksRes.json(),
        simulationsRes.json(),
        transactionsRes.json()
      ]);

      // Calculate total value of digital assets
      const totalValue = crypto.reduce((sum: number, asset: any) => {
        return sum + (parseFloat(asset.initialPrice || '0') * parseFloat(asset.totalSupply || '0'));
      }, 0);

      // Calculate growth metrics (simulated for demo)
      const monthlyGrowth = Math.random() * 20 - 5; // -5% to +15%
      const revenueGrowth = Math.random() * 30 - 10; // -10% to +20%

      setStats({
        totalAssets: crypto.length,
        totalValue: totalValue.toFixed(2),
        totalTransactions: transactions.length,
        activeWallets: wallets.length,
        mediaFiles: tracks.length,
        reports: simulations.length,
        monthlyGrowth,
        revenueGrowth
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm border">
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Digital Assets',
      value: stats?.totalAssets || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Value',
      value: `$${stats?.totalValue || '0.00'}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Wallets',
      value: stats?.activeWallets || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions || 0,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Media Files',
      value: stats?.mediaFiles || 0,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Reports Generated',
      value: stats?.reports || 0,
      icon: FileText,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Monthly Growth',
      value: `${stats?.monthlyGrowth?.toFixed(1) || '0.0'}%`,
      icon: stats?.monthlyGrowth && stats.monthlyGrowth >= 0 ? ArrowUpRight : ArrowDownRight,
      color: stats?.monthlyGrowth && stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats?.monthlyGrowth && stats.monthlyGrowth >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Revenue Growth',
      value: `${stats?.revenueGrowth?.toFixed(1) || '0.0'}%`,
      icon: stats?.revenueGrowth && stats.revenueGrowth >= 0 ? TrendingUp : TrendingDown,
      color: stats?.revenueGrowth && stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats?.revenueGrowth && stats.revenueGrowth >= 0 ? 'bg-green-50' : 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Users, Zap, Shield, Database, Globe } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface StatItem {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    const mockStats: StatItem[] = [
      {
        id: '1',
        title: 'Total Assets',
        value: '1,247',
        change: 12.5,
        changeType: 'increase',
        icon: Database,
        color: 'text-green-400',
        description: 'Audio tracks, simulations, and tokens'
      },
      {
        id: '2',
        title: 'Active Wallets',
        value: '97',
        change: 8.3,
        changeType: 'increase',
        icon: Users,
        color: 'text-blue-400',
        description: 'Ethereum wallets with balances'
      },
      {
        id: '3',
        title: 'Transactions',
        value: '2,345',
        change: -2.1,
        changeType: 'decrease',
        icon: Zap,
        color: 'text-yellow-400',
        description: 'Blockchain transactions processed'
      },
      {
        id: '4',
        title: 'System Health',
        value: '99.9%',
        change: 0.1,
        changeType: 'increase',
        icon: Shield,
        color: 'text-purple-400',
        description: 'Overall system uptime'
      },
      {
        id: '5',
        title: 'Processing Power',
        value: '847 GH/s',
        change: 15.7,
        changeType: 'increase',
        icon: Activity,
        color: 'text-red-400',
        description: 'Current computational capacity'
      },
      {
        id: '6',
        title: 'Global Reach',
        value: '42 Countries',
        change: 4.2,
        changeType: 'increase',
        icon: Globe,
        color: 'text-indigo-400',
        description: 'International user presence'
      }
    ];

    setStats(mockStats);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        change: stat.change + (Math.random() - 0.5) * 2,
        value: stat.id === '1' ? String(1247 + Math.floor(Math.random() * 10)) :
               stat.id === '2' ? String(97 + Math.floor(Math.random() * 5)) :
               stat.value
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3 text-red-400" />;
      default:
        return <Activity className="h-3 w-3 text-gray-400" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.id}
            className="p-4 bg-black/20 border-green-500/20 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <Badge
                variant="outline"
                className={`text-xs ${
                  stat.changeType === 'increase' 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : stat.changeType === 'decrease'
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}
              >
                <div className="flex items-center space-x-1">
                  {getChangeIcon(stat.changeType)}
                  <span>{Math.abs(stat.change).toFixed(1)}%</span>
                </div>
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-300">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <div className={`flex items-center space-x-1 text-xs ${getChangeColor(stat.changeType)}`}>
                {getChangeIcon(stat.changeType)}
                <span>
                  {stat.changeType === 'increase' ? '+' : ''}
                  {stat.change.toFixed(1)}% from last period
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

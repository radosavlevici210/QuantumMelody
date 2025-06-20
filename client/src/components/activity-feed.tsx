
import React, { useState, useEffect } from 'react';
import { Clock, User, Activity, TrendingUp, Zap, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface ActivityItem {
  id: string;
  type: 'creation' | 'modification' | 'transaction' | 'system' | 'security';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  metadata?: Record<string, any>;
}

export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Simulate real-time activity feed
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'creation',
        title: 'New Crypto Token Created',
        description: 'Business Token (BIZ) created with 1,000,000 total supply',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: 'System',
        metadata: { tokenId: 1, symbol: 'BIZ' }
      },
      {
        id: '2',
        type: 'transaction',
        title: 'Wallet Balance Updated',
        description: '97 wallets synchronized with current market prices',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: 'Automation',
        metadata: { walletsCount: 97 }
      },
      {
        id: '3',
        type: 'system',
        title: 'Physics Simulation Started',
        description: 'Q4 Sales Analysis simulation with 1000 particles',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        user: 'Analytics Engine',
        metadata: { simulationId: 1 }
      },
      {
        id: '4',
        type: 'security',
        title: 'Security Audit Completed',
        description: 'All systems passed security validation checks',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        user: 'Security Monitor',
        metadata: { status: 'passed' }
      },
      {
        id: '5',
        type: 'modification',
        title: 'Media Content Updated',
        description: 'Corporate Presentation track optimized for better performance',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        user: 'Content Manager',
        metadata: { trackId: 1 }
      }
    ];

    setActivities(mockActivities);

    // Simulate new activities every 30 seconds
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ['creation', 'modification', 'transaction', 'system'][Math.floor(Math.random() * 4)] as any,
        title: 'Real-time Update',
        description: 'System monitoring detected new activity',
        timestamp: new Date(),
        user: 'Real-time Monitor'
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'creation':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'modification':
        return <Activity className="h-4 w-4 text-blue-400" />;
      case 'transaction':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'system':
        return <Activity className="h-4 w-4 text-purple-400" />;
      case 'security':
        return <Shield className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityBadgeColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'creation':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'modification':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'transaction':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'system':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'security':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className="p-4 bg-black/20 border-green-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Activity Feed</h3>
        <Badge variant="secondary" className="bg-green-500/10 text-green-400">
          Live
        </Badge>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {activities.map(activity => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-500/20 text-green-400 text-xs">
                  {getActivityIcon(activity.type)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white truncate">
                    {activity.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getActivityBadgeColor(activity.type)}`}
                  >
                    {activity.type}
                  </Badge>
                </div>

                <p className="text-xs text-gray-400 mb-2">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{activity.user}</span>
                  <span>{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

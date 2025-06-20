import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Activity,
  Upload,
  Download,
  DollarSign,
  FileText,
  Settings,
  Users,
  TrendingUp
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'upload' | 'transaction' | 'report' | 'system' | 'user' | 'asset';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  amount?: string;
  status: 'success' | 'pending' | 'failed';
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate sample activity data
    const sampleActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'asset',
        title: 'Digital Asset Created',
        description: 'Business Token (BIZ) was successfully created',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: 'Admin',
        amount: '$50,000.00',
        status: 'success'
      },
      {
        id: '2',
        type: 'upload',
        title: 'Media File Uploaded',
        description: 'Corporate Presentation added to media library',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: 'Marketing Team',
        status: 'success'
      },
      {
        id: '3',
        type: 'report',
        title: 'Analytics Report Generated',
        description: 'Q4 Sales Analysis completed with 5,000 data points',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        user: 'System',
        status: 'success'
      },
      {
        id: '4',
        type: 'system',
        title: 'Automation Service Started',
        description: 'Background services initialized successfully',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        user: 'System',
        status: 'success'
      },
      {
        id: '5',
        type: 'transaction',
        title: 'Wallet Balance Updated',
        description: 'Blockchain synchronization completed',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        user: 'System',
        status: 'success'
      },
      {
        id: '6',
        type: 'user',
        title: 'User Session Started',
        description: 'New user session initiated',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: 'Admin',
        status: 'success'
      }
    ];

    setActivities(sampleActivities);
    setLoading(false);

    // Simulate real-time activity updates
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ['system', 'report', 'asset'][Math.floor(Math.random() * 3)] as any,
        title: 'System Activity',
        description: 'Background process completed',
        timestamp: new Date(),
        user: 'System',
        status: 'success'
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 3 * 60 * 1000); // Every 3 minutes

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'upload': return Upload;
      case 'transaction': return DollarSign;
      case 'report': return FileText;
      case 'system': return Settings;
      case 'user': return Users;
      case 'asset': return TrendingUp;
      default: return Activity;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'upload': return 'text-blue-600 bg-blue-50';
      case 'transaction': return 'text-green-600 bg-green-50';
      case 'report': return 'text-purple-600 bg-purple-50';
      case 'system': return 'text-orange-600 bg-orange-50';
      case 'user': return 'text-indigo-600 bg-indigo-50';
      case 'asset': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getIcon(activity.type);
              const iconColors = getIconColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${iconColors}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-900">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {activity.user && (
                            <div className="flex items-center gap-1">
                              <Avatar className="w-4 h-4">
                                <AvatarFallback className="text-xs">
                                  {activity.user.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-slate-500">
                                {activity.user}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-slate-400">
                            {formatTime(activity.timestamp)}
                          </span>
                          {activity.amount && (
                            <Badge variant="outline" className="text-xs">
                              {activity.amount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={`ml-2 ${getStatusColor(activity.status)}`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
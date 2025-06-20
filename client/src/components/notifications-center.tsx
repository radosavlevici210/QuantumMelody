
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const NotificationsCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Wallet Sync Complete',
        message: 'Successfully synchronized 97 wallets with current blockchain state',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'New Analytics Report',
        message: 'Q4 Sales Analysis report is ready for review',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false
      },
      {
        id: '3',
        type: 'warning',
        title: 'High CPU Usage',
        message: 'System is experiencing high computational load (85% CPU usage)',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true
      },
      {
        id: '4',
        type: 'success',
        title: 'Security Audit Passed',
        message: 'All security checks completed successfully',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: true
      },
      {
        id: '5',
        type: 'error',
        title: 'Connection Issue',
        message: 'Temporary connection issue with external API (resolved)',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true
      }
    ];

    setNotifications(mockNotifications);

    // Simulate new notifications
    const interval = setInterval(() => {
      const types = ['info', 'success', 'warning'] as const;
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        title: 'System Update',
        message: 'Real-time monitoring detected new activity',
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-green-400 border-green-500/20 hover:bg-green-500/10"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white border-none"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <Card className="w-80 bg-black/90 border-green-500/20 backdrop-blur-sm">
            <div className="p-4 border-b border-green-500/20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-green-400 hover:text-green-300"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="h-96">
              <div className="p-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`
                          p-3 rounded-lg border-l-2 cursor-pointer transition-colors
                          ${notification.read ? 'bg-white/5' : 'bg-white/10'}
                          ${getNotificationColor(notification.type)}
                          hover:bg-white/15
                        `}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2 flex-1">
                            {getNotificationIcon(notification.type)}
                            <div className="min-w-0 flex-1">
                              <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-500 mt-2 block">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
};

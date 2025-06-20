
import React, { useState, useEffect } from 'react';
import { Play, Pause, Settings, RotateCcw, TrendingUp, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';

interface AutomationTask {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'paused' | 'stopped';
  progress: number;
  lastRun: Date;
  nextRun: Date;
  enabled: boolean;
}

export const AutomationPanel: React.FC = () => {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [globalStatus, setGlobalStatus] = useState<'running' | 'paused'>('running');

  useEffect(() => {
    const mockTasks: AutomationTask[] = [
      {
        id: '1',
        name: 'Wallet Balance Sync',
        description: 'Updates all wallet balances from blockchain',
        status: 'running',
        progress: 85,
        lastRun: new Date(Date.now() - 5 * 60 * 1000),
        nextRun: new Date(Date.now() + 55 * 60 * 1000),
        enabled: true
      },
      {
        id: '2',
        name: 'Price Monitor',
        description: 'Monitors crypto asset prices and market data',
        status: 'running',
        progress: 100,
        lastRun: new Date(Date.now() - 2 * 60 * 1000),
        nextRun: new Date(Date.now() + 58 * 60 * 1000),
        enabled: true
      },
      {
        id: '3',
        name: 'Data Analytics',
        description: 'Generates reports and analytics insights',
        status: 'paused',
        progress: 0,
        lastRun: new Date(Date.now() - 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 120 * 60 * 1000),
        enabled: false
      },
      {
        id: '4',
        name: 'Security Audit',
        description: 'Performs security checks and validation',
        status: 'running',
        progress: 60,
        lastRun: new Date(Date.now() - 15 * 60 * 1000),
        nextRun: new Date(Date.now() + 45 * 60 * 1000),
        enabled: true
      }
    ];

    setTasks(mockTasks);

    // Simulate progress updates
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          return { ...task, progress: Math.min(100, task.progress + Math.random() * 10) };
        }
        if (task.status === 'running' && task.progress >= 100) {
          return {
            ...task,
            progress: 0,
            lastRun: new Date(),
            nextRun: new Date(Date.now() + 60 * 60 * 1000)
          };
        }
        return task;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'running' ? 'paused' : 'running';
        return {
          ...task,
          status: newStatus,
          enabled: newStatus === 'running',
          progress: newStatus === 'running' ? 0 : task.progress
        };
      }
      return task;
    }));
  };

  const restartTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: 'running',
          progress: 0,
          lastRun: new Date(),
          nextRun: new Date(Date.now() + 60 * 60 * 1000),
          enabled: true
        };
      }
      return task;
    }));
  };

  const toggleGlobalStatus = () => {
    const newStatus = globalStatus === 'running' ? 'paused' : 'running';
    setGlobalStatus(newStatus);
    
    setTasks(prev => prev.map(task => ({
      ...task,
      status: newStatus,
      enabled: newStatus === 'running'
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'stopped':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const runningTasks = tasks.filter(task => task.status === 'running').length;
  const totalTasks = tasks.length;

  return (
    <Card className="p-4 bg-black/20 border-green-500/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Automation</h3>
            <p className="text-sm text-gray-400">
              {runningTasks}/{totalTasks} tasks running
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={globalStatus === 'running' ? 
                'bg-green-500/10 text-green-400 border-green-500/20' :
                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              }
            >
              {globalStatus === 'running' ? 'Active' : 'Paused'}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleGlobalStatus}
              className="text-green-400 border-green-500/20 hover:bg-green-500/10"
            >
              {globalStatus === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-white">{task.name}</h4>
                  <p className="text-xs text-gray-400">{task.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  
                  <Switch
                    checked={task.enabled}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>

              {task.status === 'running' && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(task.progress)}%</span>
                  </div>
                  <Progress value={task.progress} className="h-1" />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Last: {formatTime(task.lastRun)}</span>
                <span>Next: {formatTime(task.nextRun)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => restartTask(task.id)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-green-500/20">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center text-green-400 mb-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Efficiency</span>
              </div>
              <span className="text-lg font-bold text-white">97.3%</span>
            </div>
            
            <div>
              <div className="flex items-center justify-center text-blue-400 mb-1">
                <Activity className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              <span className="text-lg font-bold text-white">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

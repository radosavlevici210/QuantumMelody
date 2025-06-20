import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { 
  Bot, 
  Play, 
  Pause, 
  BarChart3, 
  RefreshCw, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AutomationStatus {
  active: boolean;
  services: {
    balanceUpdates: boolean;
    reportGeneration: boolean;
    assetMonitoring: boolean;
    dataCleanup: boolean;
  };
}

export default function AutomationPanel() {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/automation/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching automation status:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAction = async (action: string, endpoint: string) => {
    setProcessing(action);
    try {
      const response = await fetch(endpoint, { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: result.message,
        });
        fetchStatus(); // Refresh status
      } else {
        throw new Error('Failed to execute action');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action}`,
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm border">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading automation status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Bot className="w-5 h-5" />
            Automation Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-slate-700">Automation Services</Label>
              {status?.active ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600">
                  <XCircle className="w-3 h-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchStatus}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>

          {/* Service Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-800">Background Services</h4>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Balance Updates</span>
                </div>
                <Badge variant={status?.services.balanceUpdates ? "default" : "outline"}>
                  {status?.services.balanceUpdates ? "Running" : "Stopped"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Report Generation</span>
                </div>
                <Badge variant={status?.services.reportGeneration ? "default" : "outline"}>
                  {status?.services.reportGeneration ? "Running" : "Stopped"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Asset Monitoring</span>
                </div>
                <Badge variant={status?.services.assetMonitoring ? "default" : "outline"}>
                  {status?.services.assetMonitoring ? "Running" : "Stopped"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Data Cleanup</span>
                </div>
                <Badge variant={status?.services.dataCleanup ? "default" : "outline"}>
                  {status?.services.dataCleanup ? "Running" : "Stopped"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-slate-800">Manual Actions</h4>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => triggerAction('generate report', '/api/automation/generate-report')}
                disabled={processing === 'generate report'}
              >
                {processing === 'generate report' ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4 mr-2" />
                )}
                Generate Report Now
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => triggerAction('update balances', '/api/automation/update-balances')}
                disabled={processing === 'update balances'}
              >
                {processing === 'update balances' ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Update All Balances
              </Button>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Automation Schedule</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• Balance updates: Every 5 minutes</div>
              <div>• Daily reports: Every day at midnight</div>
              <div>• Asset monitoring: Every 10 minutes</div>
              <div>• Data cleanup: Weekly on Sundays at 2 AM</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
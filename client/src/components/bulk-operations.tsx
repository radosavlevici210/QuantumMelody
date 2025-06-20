import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
  Upload, 
  Download, 
  RefreshCw,
  FileText,
  Database,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface BulkOperation {
  id: string;
  type: 'import' | 'export' | 'update' | 'backup';
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  itemsProcessed: number;
  totalItems: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export default function BulkOperations() {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'backup'>('import');
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [importConfig, setImportConfig] = useState({
    type: 'media',
    file: null as File | null,
    overwrite: false
  });
  const [exportConfig, setExportConfig] = useState({
    type: 'all',
    format: 'json',
    dateRange: 'all'
  });
  const { toast } = useToast();

  const startBulkImport = async () => {
    if (!importConfig.file) {
      toast({
        title: "Error",
        description: "Please select a file to import",
        variant: "destructive"
      });
      return;
    }

    const operationId = `import-${Date.now()}`;
    const newOperation: BulkOperation = {
      id: operationId,
      type: 'import',
      name: `Import ${importConfig.type} from ${importConfig.file.name}`,
      status: 'pending',
      progress: 0,
      itemsProcessed: 0,
      totalItems: 100, // Simulate
      startTime: new Date()
    };

    setOperations(prev => [newOperation, ...prev]);

    // Simulate bulk import process
    simulateOperation(operationId, 'import');
  };

  const startBulkExport = async () => {
    const operationId = `export-${Date.now()}`;
    const newOperation: BulkOperation = {
      id: operationId,
      type: 'export',
      name: `Export ${exportConfig.type} as ${exportConfig.format.toUpperCase()}`,
      status: 'pending',
      progress: 0,
      itemsProcessed: 0,
      totalItems: 50, // Simulate
      startTime: new Date()
    };

    setOperations(prev => [newOperation, ...prev]);
    simulateOperation(operationId, 'export');
  };

  const startBackup = async () => {
    const operationId = `backup-${Date.now()}`;
    const newOperation: BulkOperation = {
      id: operationId,
      type: 'backup',
      name: 'Full database backup',
      status: 'pending',
      progress: 0,
      itemsProcessed: 0,
      totalItems: 200, // Simulate
      startTime: new Date()
    };

    setOperations(prev => [newOperation, ...prev]);
    simulateOperation(operationId, 'backup');
  };

  const simulateOperation = (operationId: string, type: string) => {
    const updateProgress = () => {
      setOperations(prev => prev.map(op => {
        if (op.id === operationId) {
          const newProgress = Math.min(op.progress + Math.random() * 15 + 5, 100);
          const newItemsProcessed = Math.floor((newProgress / 100) * op.totalItems);
          
          if (newProgress >= 100) {
            return {
              ...op,
              status: 'completed' as const,
              progress: 100,
              itemsProcessed: op.totalItems,
              endTime: new Date()
            };
          }
          
          return {
            ...op,
            status: 'running' as const,
            progress: newProgress,
            itemsProcessed: newItemsProcessed
          };
        }
        return op;
      }));
    };

    // Start the operation
    setTimeout(() => {
      setOperations(prev => prev.map(op => 
        op.id === operationId ? { ...op, status: 'running' as const } : op
      ));
    }, 500);

    // Update progress periodically
    const interval = setInterval(() => {
      setOperations(prev => {
        const operation = prev.find(op => op.id === operationId);
        if (!operation || operation.status === 'completed' || operation.status === 'failed') {
          clearInterval(interval);
          if (operation?.status === 'completed') {
            toast({
              title: "Success",
              description: `${type} operation completed successfully`,
            });
          }
          return prev;
        }
        
        updateProgress();
        return prev;
      });
    }, 1000);
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'import': return Upload;
      case 'export': return Download;
      case 'backup': return Database;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'running': return RefreshCw;
      case 'failed': return AlertCircle;
      default: return Settings;
    }
  };

  return (
    <div className="space-y-6">
      {/* Operation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Import */}
        <Card className="bg-white shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Upload className="w-5 h-5" />
              Bulk Import
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Data Type</Label>
              <Select value={importConfig.type} onValueChange={(value) => setImportConfig(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="media">Media Content</SelectItem>
                  <SelectItem value="assets">Digital Assets</SelectItem>
                  <SelectItem value="reports">Analytics Reports</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Import File</Label>
              <Input
                type="file"
                accept=".csv,.json,.xlsx"
                onChange={(e) => setImportConfig(prev => ({ 
                  ...prev, 
                  file: e.target.files?.[0] || null 
                }))}
              />
            </div>

            <Button 
              onClick={startBulkImport}
              className="w-full"
              disabled={!importConfig.file}
            >
              <Upload className="w-4 h-4 mr-2" />
              Start Import
            </Button>
          </CardContent>
        </Card>

        {/* Export */}
        <Card className="bg-white shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Download className="w-5 h-5" />
              Bulk Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Data Type</Label>
              <Select value={exportConfig.type} onValueChange={(value) => setExportConfig(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="media">Media Content</SelectItem>
                  <SelectItem value="assets">Digital Assets</SelectItem>
                  <SelectItem value="reports">Analytics Reports</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Format</Label>
              <Select value={exportConfig.format} onValueChange={(value) => setExportConfig(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={startBulkExport}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Start Export
            </Button>
          </CardContent>
        </Card>

        {/* Backup */}
        <Card className="bg-white shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Database className="w-5 h-5" />
              Database Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Create a complete backup of all platform data including media files, assets, and transaction history.
            </p>

            <div className="space-y-2">
              <Label>Backup includes:</Label>
              <div className="text-sm text-slate-600 space-y-1">
                <div>• All media content and metadata</div>
                <div>• Digital assets and blockchain data</div>
                <div>• Analytics reports and configurations</div>
                <div>• User data and permissions</div>
              </div>
            </div>

            <Button 
              onClick={startBackup}
              className="w-full"
            >
              <Database className="w-4 h-4 mr-2" />
              Create Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Operations History */}
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Settings className="w-5 h-5" />
            Recent Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {operations.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No bulk operations yet</p>
                <p className="text-sm mt-1">Start an import, export, or backup operation above</p>
              </div>
            ) : (
              operations.map((operation) => {
                const OperationIcon = getOperationIcon(operation.type);
                const StatusIcon = getStatusIcon(operation.status);
                const statusColor = getStatusColor(operation.status);
                
                return (
                  <div key={operation.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <OperationIcon className="w-5 h-5 text-slate-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{operation.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusIcon className={`w-4 h-4 ${statusColor} ${operation.status === 'running' ? 'animate-spin' : ''}`} />
                              <span className={`text-sm capitalize ${statusColor}`}>
                                {operation.status}
                              </span>
                              <Badge variant="outline">
                                {operation.itemsProcessed}/{operation.totalItems} items
                              </Badge>
                            </div>
                            
                            {operation.status === 'running' && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                                  <span>Progress</span>
                                  <span>{Math.round(operation.progress)}%</span>
                                </div>
                                <Progress value={operation.progress} className="h-2" />
                              </div>
                            )}
                            
                            <div className="text-xs text-slate-400 mt-2">
                              Started: {operation.startTime?.toLocaleString()}
                              {operation.endTime && (
                                <> • Completed: {operation.endTime.toLocaleString()}</>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
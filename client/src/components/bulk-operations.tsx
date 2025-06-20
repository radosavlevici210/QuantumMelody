
import React, { useState } from 'react';
import { Check, Download, Upload, Trash2, Archive, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface BulkOperationsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onOperation: (operation: string, items: string[]) => Promise<void>;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedItems,
  totalItems,
  onSelectAll,
  onDeselectAll,
  onOperation
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentOperation, setCurrentOperation] = useState<string>('');

  const operations = [
    { id: 'export', label: 'Export', icon: Download, color: 'blue' },
    { id: 'backup', label: 'Backup', icon: Archive, color: 'green' },
    { id: 'sync', label: 'Sync', icon: Upload, color: 'purple' },
    { id: 'optimize', label: 'Optimize', icon: Settings, color: 'orange' },
    { id: 'delete', label: 'Delete', icon: Trash2, color: 'red' }
  ];

  const handleOperation = async (operationId: string) => {
    if (selectedItems.length === 0) return;

    setIsProcessing(true);
    setCurrentOperation(operationId);
    setProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onOperation(operationId, selectedItems);
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setCurrentOperation('');
      }, 1000);
    } catch (error) {
      console.error('Bulk operation failed:', error);
      setIsProcessing(false);
      setProgress(0);
      setCurrentOperation('');
    }
  };

  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  return (
    <Card className="p-4 bg-black/20 border-green-500/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={isAllSelected ? onDeselectAll : onSelectAll}
                className="border-green-500/50"
              />
              <span className="text-sm text-gray-300">
                {selectedItems.length} of {totalItems} selected
              </span>
            </div>
            
            {selectedItems.length > 0 && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                {selectedItems.length} items
              </Badge>
            )}
          </div>

          {isPartiallySelected && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              className="text-green-400 border-green-500/20 hover:bg-green-500/10"
            >
              Select All
            </Button>
          )}
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">
                Processing {currentOperation}...
              </span>
              <span className="text-green-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {selectedItems.length > 0 && !isProcessing && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {operations.map(operation => {
              const Icon = operation.icon;
              return (
                <Button
                  key={operation.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleOperation(operation.id)}
                  className={`
                    flex items-center space-x-2 text-xs
                    ${operation.color === 'red' ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : ''}
                    ${operation.color === 'blue' ? 'border-blue-500/20 text-blue-400 hover:bg-blue-500/10' : ''}
                    ${operation.color === 'green' ? 'border-green-500/20 text-green-400 hover:bg-green-500/10' : ''}
                    ${operation.color === 'purple' ? 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10' : ''}
                    ${operation.color === 'orange' ? 'border-orange-500/20 text-orange-400 hover:bg-orange-500/10' : ''}
                  `}
                >
                  <Icon className="h-3 w-3" />
                  <span>{operation.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

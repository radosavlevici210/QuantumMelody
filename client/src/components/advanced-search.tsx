
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface SearchFilter {
  type: string;
  value: string;
  label: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  placeholder?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  placeholder = "Search across all modules..."
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const availableFilters = [
    { type: 'module', values: ['Audio Tracks', 'Physics Simulations', 'Crypto Tokens', 'Transactions', 'Wallets'] },
    { type: 'status', values: ['Active', 'Inactive', 'Pending', 'Completed'] },
    { type: 'date', values: ['Today', 'This Week', 'This Month', 'This Year'] },
    { type: 'type', values: ['Media', 'Analytics', 'Blockchain', 'Financial'] }
  ];

  const addFilter = (type: string, value: string) => {
    const newFilter: SearchFilter = {
      type,
      value,
      label: `${type}: ${value}`
    };
    
    if (!filters.find(f => f.type === type && f.value === value)) {
      const updatedFilters = [...filters, newFilter];
      setFilters(updatedFilters);
      onSearch(query, updatedFilters);
    }
  };

  const removeFilter = (filterToRemove: SearchFilter) => {
    const updatedFilters = filters.filter(f => f !== filterToRemove);
    setFilters(updatedFilters);
    onSearch(query, updatedFilters);
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    onSearch(newQuery, filters);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-12 bg-white/5 border-green-500/20 text-white placeholder-gray-400"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-green-500/10 text-green-400 border-green-500/20"
            >
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(filter)}
                className="ml-1 h-auto p-0 text-green-400 hover:text-green-300"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {showFilters && (
        <Card className="p-4 bg-black/20 border-green-500/20">
          <div className="space-y-3">
            {availableFilters.map(filterGroup => (
              <div key={filterGroup.type}>
                <h4 className="text-sm font-medium text-green-400 mb-2 capitalize">
                  {filterGroup.type}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filterGroup.values.map(value => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => addFilter(filterGroup.type, value)}
                      className="text-xs border-green-500/20 text-gray-300 hover:bg-green-500/10 hover:text-green-400"
                      disabled={filters.some(f => f.type === filterGroup.type && f.value === value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

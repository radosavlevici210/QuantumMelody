import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  FileText,
  Music,
  Coins,
  X
} from 'lucide-react';

interface SearchFilters {
  query: string;
  category: string;
  dateRange: string;
  minValue: string;
  maxValue: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  id: string;
  type: 'media' | 'asset' | 'report' | 'transaction';
  title: string;
  description: string;
  value?: string;
  status: string;
  createdAt: Date;
  tags: string[];
}

export default function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    dateRange: 'all',
    minValue: '',
    maxValue: '',
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Simulate search across all data types
      const [tracksRes, cryptoRes, simulationsRes, transactionsRes] = await Promise.all([
        fetch('/api/tracks'),
        fetch('/api/crypto'),
        fetch('/api/simulations'),
        fetch('/api/transactions')
      ]);

      const [tracks, crypto, simulations, transactions] = await Promise.all([
        tracksRes.json(),
        cryptoRes.json(),
        simulationsRes.json(),
        transactionsRes.json()
      ]);

      // Convert all data to unified search results
      const searchResults: SearchResult[] = [
        ...tracks.map((item: any) => ({
          id: `media-${item.id}`,
          type: 'media' as const,
          title: item.title,
          description: `by ${item.artist} • ${item.duration}s`,
          status: 'active',
          createdAt: new Date(item.createdAt),
          tags: ['media', 'audio', item.artist.toLowerCase()]
        })),
        ...crypto.map((item: any) => ({
          id: `asset-${item.id}`,
          type: 'asset' as const,
          title: item.name,
          description: `${item.symbol} • ${item.description || 'Digital Asset'}`,
          value: `$${item.initialPrice}`,
          status: item.isLaunched ? 'active' : 'draft',
          createdAt: new Date(item.createdAt),
          tags: ['crypto', 'asset', item.symbol.toLowerCase()]
        })),
        ...simulations.map((item: any) => ({
          id: `report-${item.id}`,
          type: 'report' as const,
          title: item.name,
          description: `${item.particleCount} data points`,
          status: item.isActive ? 'active' : 'inactive',
          createdAt: new Date(item.createdAt),
          tags: ['analytics', 'report', 'data']
        })),
        ...transactions.map((item: any) => ({
          id: `transaction-${item.id}`,
          type: 'transaction' as const,
          title: `Transaction ${item.hash?.substring(0, 10)}...`,
          description: `${item.fromAddress.substring(0, 10)}... → ${item.toAddress.substring(0, 10)}...`,
          value: item.amount,
          status: item.status,
          createdAt: new Date(item.createdAt),
          tags: ['transaction', 'blockchain', item.status]
        }))
      ];

      // Apply filters
      let filteredResults = searchResults;

      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredResults = filteredResults.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.includes(query))
        );
      }

      if (filters.category !== 'all') {
        filteredResults = filteredResults.filter(item => item.type === filters.category);
      }

      if (filters.status !== 'all') {
        filteredResults = filteredResults.filter(item => item.status === filters.status);
      }

      // Apply date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const cutoff = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            cutoff.setHours(0, 0, 0, 0);
            break;
          case 'week':
            cutoff.setDate(now.getDate() - 7);
            break;
          case 'month':
            cutoff.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            cutoff.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        filteredResults = filteredResults.filter(item => item.createdAt >= cutoff);
      }

      // Apply value range filter
      if (filters.minValue || filters.maxValue) {
        filteredResults = filteredResults.filter(item => {
          if (!item.value) return false;
          const value = parseFloat(item.value.replace(/[^0-9.-]+/g, ''));
          const min = filters.minValue ? parseFloat(filters.minValue) : 0;
          const max = filters.maxValue ? parseFloat(filters.maxValue) : Infinity;
          return value >= min && value <= max;
        });
      }

      // Sort results
      filteredResults.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'date':
            comparison = a.createdAt.getTime() - b.createdAt.getTime();
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'value':
            const aValue = parseFloat(a.value?.replace(/[^0-9.-]+/g, '') || '0');
            const bValue = parseFloat(b.value?.replace(/[^0-9.-]+/g, '') || '0');
            comparison = aValue - bValue;
            break;
        }
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });

      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (filters.query || filters.category !== 'all' || filters.status !== 'all') {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [filters]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'media': return Music;
      case 'asset': return Coins;
      case 'report': return FileText;
      case 'transaction': return DollarSign;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'media': return 'bg-blue-100 text-blue-800';
      case 'asset': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'transaction': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-slate-100 text-slate-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card className="bg-white shadow-sm border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Search className="w-5 h-5" />
          Advanced Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search across all content..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="media">Media Content</SelectItem>
                  <SelectItem value="asset">Digital Assets</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="transaction">Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Min Value</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={filters.minValue}
                onChange={(e) => setFilters(prev => ({ ...prev, minValue: e.target.value }))}
              />
            </div>

            <div>
              <Label>Max Value</Label>
              <Input
                type="number"
                placeholder="1000000.00"
                value={filters.maxValue}
                onChange={(e) => setFilters(prev => ({ ...prev, maxValue: e.target.value }))}
              />
            </div>

            <div>
              <Label>Sort By</Label>
              <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  <SelectItem value="value-desc">Value (High-Low)</SelectItem>
                  <SelectItem value="value-asc">Value (Low-High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Separator />

        {/* Search Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-800">
              {loading ? 'Searching...' : `${results.length} Results`}
            </h3>
            {results.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    query: '',
                    category: 'all',
                    dateRange: 'all',
                    minValue: '',
                    maxValue: '',
                    status: 'all',
                    sortBy: 'date',
                    sortOrder: 'desc'
                  });
                  setResults([]);
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-3">
              {results.map((result) => {
                const TypeIcon = getTypeIcon(result.type);
                return (
                  <div key={result.id} className="p-4 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <TypeIcon className="w-5 h-5 text-slate-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{result.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{result.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getTypeColor(result.type)}>
                                {result.type}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(result.status)}>
                                {result.status}
                              </Badge>
                              {result.value && (
                                <Badge variant="outline">
                                  {result.value}
                                </Badge>
                              )}
                              <span className="text-xs text-slate-400">
                                {result.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {!loading && results.length === 0 && filters.query && (
                <div className="text-center py-8 text-slate-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for "{filters.query}"</p>
                  <p className="text-sm mt-1">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
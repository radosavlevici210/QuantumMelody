import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { AlertCircle, Copy, Send, ArrowUpDown, Wallet, Plus } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from '../hooks/use-toast';

interface CryptoWallet {
  id: number;
  address: string;
  privateKey: string;
  publicKey: string;
  mnemonic: string | null;
  blockchain: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: number;
  hash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  tokenId: number | null;
  blockchain: string;
  status: string;
  transactionType: string;
  createdAt: string;
}

interface ExchangeOrder {
  id: number;
  walletId: number;
  fromTokenId: number;
  toTokenId: number;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  status: string;
  orderType: string;
  createdAt: string;
}

interface CryptoToken {
  id: number;
  name: string;
  symbol: string;
  initialPrice: string;
  totalSupply: string;
  blockchain: string;
}

export default function CryptoWallet() {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<ExchangeOrder[]>([]);
  const [tokens, setTokens] = useState<CryptoToken[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Transfer form
  const [transferForm, setTransferForm] = useState({
    toAddress: '',
    amount: '',
    tokenId: ''
  });
  
  // Exchange form
  const [exchangeForm, setExchangeForm] = useState({
    fromTokenId: '',
    toTokenId: '',
    fromAmount: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [walletsRes, transactionsRes, ordersRes, tokensRes] = await Promise.all([
        fetch('/api/wallets'),
        fetch('/api/transactions'),
        fetch('/api/exchange-orders'),
        fetch('/api/crypto')
      ]);

      const walletsData = await walletsRes.json();
      const transactionsData = await transactionsRes.json();
      const ordersData = await ordersRes.json();
      const tokensData = await tokensRes.json();

      setWallets(walletsData);
      setTransactions(transactionsData);
      setOrders(ordersData);
      setTokens(tokensData);
      
      if (walletsData.length > 0 && !selectedWallet) {
        setSelectedWallet(walletsData[0]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const generateWallet = async () => {
    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: `0x${Math.random().toString(16).substr(2, 40)}`,
          privateKey: `0x${Math.random().toString(16).substr(2, 64)}`,
          publicKey: `0x${Math.random().toString(16).substr(2, 128)}`,
          mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
          blockchain: 'ethereum',
          balance: '0'
        }),
      });

      if (response.ok) {
        const newWallet = await response.json();
        setWallets([...wallets, newWallet]);
        setSelectedWallet(newWallet);
        toast({
          title: "Wallet created",
          description: "New wallet has been generated successfully",
        });
      }
    } catch (err) {
      console.error('Error creating wallet:', err);
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  const handleTransfer = async () => {
    if (!selectedWallet || !transferForm.toAddress || !transferForm.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: selectedWallet.address,
          toAddress: transferForm.toAddress,
          amount: transferForm.amount,
          tokenId: transferForm.tokenId || null
        }),
      });

      if (response.ok) {
        const transaction = await response.json();
        setTransactions([transaction, ...transactions]);
        setTransferForm({ toAddress: '', amount: '', tokenId: '' });
        toast({
          title: "Transfer sent",
          description: `Transaction hash: ${transaction.hash.substring(0, 10)}...`,
        });
      }
    } catch (err) {
      console.error('Error sending transfer:', err);
      toast({
        title: "Error",
        description: "Failed to send transfer",
        variant: "destructive"
      });
    }
  };

  const handleExchange = async () => {
    if (!selectedWallet || !exchangeForm.fromTokenId || !exchangeForm.toTokenId || !exchangeForm.fromAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletId: selectedWallet.id,
          fromTokenId: exchangeForm.fromTokenId,
          toTokenId: exchangeForm.toTokenId,
          fromAmount: exchangeForm.fromAmount
        }),
      });

      if (response.ok) {
        const order = await response.json();
        setOrders([order, ...orders]);
        setExchangeForm({ fromTokenId: '', toTokenId: '', fromAmount: '' });
        toast({
          title: "Exchange completed",
          description: `Exchanged ${order.fromAmount} tokens at rate ${parseFloat(order.exchangeRate).toFixed(4)}`,
        });
      }
    } catch (err) {
      console.error('Error processing exchange:', err);
      toast({
        title: "Error",
        description: "Failed to process exchange",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wallet className="h-8 w-8" />
          Crypto Wallet
        </h1>
        <Button onClick={generateWallet} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Generate Wallet
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Selection */}
        <Card>
          <CardHeader>
            <CardTitle>My Wallets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedWallet?.id === wallet.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedWallet(wallet)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline">{wallet.blockchain}</Badge>
                    <p className="text-sm font-mono mt-1">
                      {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{wallet.balance} ETH</p>
                  </div>
                </div>
              </div>
            ))}
            {wallets.length === 0 && (
              <p className="text-gray-500 text-center py-4">No wallets found</p>
            )}
          </CardContent>
        </Card>

        {/* Wallet Details */}
        {selectedWallet && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={selectedWallet.address}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedWallet.address)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Balance</Label>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {selectedWallet.balance} ETH
                  </div>
                </div>

                <div>
                  <Label>Blockchain</Label>
                  <Badge variant="secondary" className="mt-1">
                    {selectedWallet.blockchain}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedWallet && (
        <Tabs defaultValue="transfer" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="exchange">Exchange</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transfer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="toAddress">Recipient Address</Label>
                  <Input
                    id="toAddress"
                    placeholder="0x..."
                    value={transferForm.toAddress}
                    onChange={(e) => setTransferForm({ ...transferForm, toAddress: e.target.value })}
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tokenId">Token (Optional)</Label>
                  <select
                    id="tokenId"
                    className="w-full p-2 border rounded-md"
                    value={transferForm.tokenId}
                    onChange={(e) => setTransferForm({ ...transferForm, tokenId: e.target.value })}
                  >
                    <option value="">Select token</option>
                    {tokens.map((token) => (
                      <option key={token.id} value={token.id}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button onClick={handleTransfer} className="w-full">
                  Send Transfer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exchange" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Token Exchange
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fromToken">From Token</Label>
                  <select
                    id="fromToken"
                    className="w-full p-2 border rounded-md"
                    value={exchangeForm.fromTokenId}
                    onChange={(e) => setExchangeForm({ ...exchangeForm, fromTokenId: e.target.value })}
                  >
                    <option value="">Select token</option>
                    {tokens.map((token) => (
                      <option key={token.id} value={token.id}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="toToken">To Token</Label>
                  <select
                    id="toToken"
                    className="w-full p-2 border rounded-md"
                    value={exchangeForm.toTokenId}
                    onChange={(e) => setExchangeForm({ ...exchangeForm, toTokenId: e.target.value })}
                  >
                    <option value="">Select token</option>
                    {tokens.map((token) => (
                      <option key={token.id} value={token.id}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="fromAmount">Amount</Label>
                  <Input
                    id="fromAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={exchangeForm.fromAmount}
                    onChange={(e) => setExchangeForm({ ...exchangeForm, fromAmount: e.target.value })}
                  />
                </div>
                
                <Button onClick={handleExchange} className="w-full">
                  Execute Exchange
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                              {tx.status}
                            </Badge>
                            <p className="text-sm font-mono mt-1">
                              {tx.hash.substring(0, 10)}...
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{tx.amount} ETH</p>
                            <p className="text-xs text-gray-500">{tx.transactionType}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No transactions found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Exchange Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant={order.status === 'filled' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                            <p className="text-sm mt-1">
                              Token {order.fromTokenId} → Token {order.toTokenId}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Rate: {parseFloat(order.exchangeRate).toFixed(4)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{order.fromAmount}</p>
                            <p className="text-xs text-gray-500">{order.orderType}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No orders found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
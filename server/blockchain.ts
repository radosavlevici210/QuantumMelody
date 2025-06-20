/**
 * This software is not licensed for open-source or commercial usage.
 * Any use of this code is bound by a 51% royalty for past or future use.
 */

import { ethers } from 'ethers';
import Web3 from 'web3';
import { storage } from './storage';

// Production Ethereum configuration
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ETHEREUM_RPC_URL = INFURA_PROJECT_ID ? `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}` : null;
const ETHEREUM_TESTNET_RPC_URL = INFURA_PROJECT_ID ? `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}` : null;

// Use testnet for development, mainnet for production
const RPC_URL = process.env.NODE_ENV === 'production' ? ETHEREUM_RPC_URL : ETHEREUM_TESTNET_RPC_URL;

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null;
  private web3: Web3 | null;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !!RPC_URL;
    this.provider = RPC_URL ? new ethers.JsonRpcProvider(RPC_URL) : null;
    this.web3 = RPC_URL ? new Web3(RPC_URL) : null;
  }

  // Get wallet balance from blockchain
  async getWalletBalance(address: string): Promise<string> {
    if (!this.isEnabled || !this.provider) {
      return '0.0'; // Return mock balance when blockchain is disabled
    }
    
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return '0.0'; // Fallback to mock balance on error
    }
  }

  // Create a new wallet
  createWallet(): { address: string; privateKey: string; publicKey: string; mnemonic: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      mnemonic: wallet.mnemonic?.phrase || ''
    };
  }

  // Send ETH transaction
  async sendTransaction(
    fromPrivateKey: string,
    toAddress: string,
    amount: string,
    gasPrice?: string
  ): Promise<{ hash: string; gasUsed?: string }> {
    try {
      const wallet = new ethers.Wallet(fromPrivateKey, this.provider);
      
      // Get current gas price if not provided
      let finalGasPrice: bigint;
      if (gasPrice) {
        finalGasPrice = ethers.parseUnits(gasPrice, 'gwei');
      } else {
        const feeData = await this.provider.getFeeData();
        finalGasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');
      }
      
      const transaction = {
        to: toAddress,
        value: ethers.parseEther(amount),
        gasPrice: finalGasPrice,
        gasLimit: 21000, // Standard ETH transfer gas limit
      };

      const txResponse = await wallet.sendTransaction(transaction);
      const receipt = await txResponse.wait();

      return {
        hash: txResponse.hash,
        gasUsed: receipt?.gasUsed?.toString()
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  // Get transaction details
  async getTransaction(hash: string) {
    try {
      const tx = await this.provider.getTransaction(hash);
      const receipt = await this.provider.getTransactionReceipt(hash);
      
      return {
        transaction: tx,
        receipt: receipt,
        status: receipt?.status === 1 ? 'confirmed' : 'failed'
      };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw new Error('Failed to fetch transaction');
    }
  }

  // Validate Ethereum address
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Get current gas price
  async getCurrentGasPrice(): Promise<string> {
    try {
      const feeData = await this.provider.getFeeData();
      return ethers.formatUnits(feeData.gasPrice || 0, 'gwei');
    } catch (error) {
      console.error('Error fetching gas price:', error);
      throw new Error('Failed to fetch gas price');
    }
  }

  // Estimate gas for transaction
  async estimateGas(from: string, to: string, amount: string): Promise<string> {
    try {
      const gasEstimate = await this.provider.estimateGas({
        from,
        to,
        value: ethers.parseEther(amount)
      });
      return gasEstimate.toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw new Error('Failed to estimate gas');
    }
  }

  // Update wallet balance in database
  async updateWalletBalance(address: string): Promise<void> {
    try {
      const balance = await this.getWalletBalance(address);
      const wallet = await storage.getCryptoWalletByAddress(address);
      
      if (wallet) {
        await storage.updateCryptoWallet(wallet.id, { balance });
      }
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      // Don't throw in production, just continue without balance updates
    }
  }
}

export const blockchainService = new BlockchainService();
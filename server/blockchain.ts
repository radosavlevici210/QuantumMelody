import { ethers } from 'ethers';
import Web3 from 'web3';
import { storage } from './storage';

// Production Ethereum configuration
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
const ETHEREUM_TESTNET_RPC_URL = process.env.ETHEREUM_TESTNET_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID';

// Use testnet for development, mainnet for production
const RPC_URL = process.env.NODE_ENV === 'production' ? ETHEREUM_RPC_URL : ETHEREUM_TESTNET_RPC_URL;

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private web3: Web3;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.web3 = new Web3(RPC_URL);
  }

  // Get wallet balance from blockchain
  async getWalletBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw new Error('Failed to fetch wallet balance');
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
      throw new Error('Failed to update wallet balance');
    }
  }
}

export const blockchainService = new BlockchainService();
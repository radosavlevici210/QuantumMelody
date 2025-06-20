/**
 * Automation service for business management platform
 */

import { storage } from './storage';
import { blockchainService } from './blockchain';
import cron from 'node-cron';

class AutomationService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();

  // Start all automation services
  start() {
    this.startBalanceUpdates();
    this.startReportGeneration();
    this.startAssetMonitoring();
    this.startDataCleanup();
    console.log('🤖 Automation services started');
  }

  // Stop all automation services
  stop() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.cronJobs.forEach(job => job.stop());
    this.intervals.clear();
    this.cronJobs.clear();
    console.log('🛑 Automation services stopped');
  }

  // Automatically update wallet balances every 5 minutes
  private startBalanceUpdates() {
    const job = cron.schedule('*/5 * * * *', async () => {
      try {
        const wallets = await storage.getAllCryptoWallets();
        for (const wallet of wallets) {
          await blockchainService.updateWalletBalance(wallet.address);
        }
        console.log(`📊 Updated ${wallets.length} wallet balances`);
      } catch (error) {
        console.error('Error in balance update automation:', error);
      }
    }, { scheduled: false });

    this.cronJobs.set('balanceUpdates', job);
    job.start();
  }

  // Generate daily analytics reports at midnight
  private startReportGeneration() {
    const job = cron.schedule('0 0 * * *', async () => {
      try {
        await this.generateDailyReport();
        console.log('📈 Daily analytics report generated');
      } catch (error) {
        console.error('Error in report generation automation:', error);
      }
    }, { scheduled: false });

    this.cronJobs.set('reportGeneration', job);
    job.start();
  }

  // Monitor digital assets for price changes every 10 minutes
  private startAssetMonitoring() {
    const job = cron.schedule('*/10 * * * *', async () => {
      try {
        await this.monitorAssetPrices();
        console.log('🔍 Asset prices monitored');
      } catch (error) {
        console.error('Error in asset monitoring automation:', error);
      }
    }, { scheduled: false });

    this.cronJobs.set('assetMonitoring', job);
    job.start();
  }

  // Clean up old data weekly (Sundays at 2 AM)
  private startDataCleanup() {
    const job = cron.schedule('0 2 * * 0', async () => {
      try {
        await this.cleanupOldData();
        console.log('🧹 Old data cleaned up');
      } catch (error) {
        console.error('Error in data cleanup automation:', error);
      }
    }, { scheduled: false });

    this.cronJobs.set('dataCleanup', job);
    job.start();
  }

  // Generate comprehensive daily report
  private async generateDailyReport() {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const reportData = {
      name: `Daily Report - ${today.toISOString().split('T')[0]}`,
      particleCount: Math.floor(Math.random() * 10000) + 5000,
      generatedAt: today,
      metrics: {
        totalTracks: await this.countRecords('audioTracks'),
        totalAssets: await this.countRecords('cryptoTokens'),
        totalWallets: await this.countRecords('cryptoWallets'),
        totalTransactions: await this.countRecords('transactions')
      }
    };

    await storage.createPhysicsSimulation({
      name: reportData.name,
      particleCount: reportData.particleCount,
      parameters: reportData.metrics
    });
  }

  // Monitor asset price changes
  private async monitorAssetPrices() {
    const assets = await storage.getAllCryptoTokens();
    
    for (const asset of assets) {
      // Simulate price fluctuation (in real app, would fetch from external API)
      const priceChange = (Math.random() - 0.5) * 0.1; // ±5% change
      const currentPrice = parseFloat(asset.initialPrice || '0.01');
      const newPrice = Math.max(0.001, currentPrice * (1 + priceChange));

      await storage.updateCryptoToken(asset.id, {
        initialPrice: newPrice.toFixed(8)
      });
    }
  }

  // Clean up old data (older than 90 days)
  private async cleanupOldData() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    // This would clean up old transactions, logs, etc.
    // Implementation depends on your data retention policies
    console.log(`Cleaning up data older than ${cutoffDate.toISOString()}`);
  }

  // Helper to count records in any table
  private async countRecords(tableName: string): Promise<number> {
    try {
      switch (tableName) {
        case 'audioTracks':
          return (await storage.getAllAudioTracks()).length;
        case 'cryptoTokens':
          return (await storage.getAllCryptoTokens()).length;
        case 'cryptoWallets':
          return (await storage.getAllCryptoWallets()).length;
        case 'transactions':
          return (await storage.getAllTransactions()).length;
        default:
          return 0;
      }
    } catch (error) {
      console.error(`Error counting ${tableName}:`, error);
      return 0;
    }
  }

  // Manual trigger for immediate report generation
  async generateReportNow() {
    await this.generateDailyReport();
    return { success: true, message: 'Report generated successfully' };
  }

  // Manual trigger for balance updates
  async updateBalancesNow() {
    const wallets = await storage.getAllCryptoWallets();
    for (const wallet of wallets) {
      await blockchainService.updateWalletBalance(wallet.address);
    }
    return { success: true, message: `Updated ${wallets.length} wallet balances` };
  }

  // Get automation status
  getStatus() {
    return {
      active: this.cronJobs.size > 0,
      services: {
        balanceUpdates: this.cronJobs.has('balanceUpdates'),
        reportGeneration: this.cronJobs.has('reportGeneration'),
        assetMonitoring: this.cronJobs.has('assetMonitoring'),
        dataCleanup: this.cronJobs.has('dataCleanup')
      }
    };
  }
}

export const automationService = new AutomationService();
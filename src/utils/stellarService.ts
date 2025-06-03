import * as StellarSdk from '@stellar/stellar-sdk';
import freighterApi from '@stellar/freighter-api';

// Stellar Testnet network constants
const TESTNET_URL = 'https://horizon-testnet.stellar.org';
const TESTNET_NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

// Initialize the Stellar server connection
const server = new StellarSdk.Horizon.Server(TESTNET_URL);

// StellarService class to manage all Stellar network interactions
export class StellarService {
  /**
   * Get the current user's Freighter wallet public key
   */
  static async getPublicKey(): Promise<string | null> {
    try {
      // Check if Freighter is connected
      const isConnected = await freighterApi.isConnected();
      if (!isConnected.isConnected) {
        console.error('Freighter is not connected');
        return null;
      }

      // Check if user has granted permission
      const hasPermission = await freighterApi.isAllowed();
      if (!hasPermission.isAllowed) {
        console.error('User has not granted permission to Freighter');
        return null;
      }

      // Get the public key
      const addressData = await freighterApi.getAddress();
      return addressData.address || null;
    } catch (error) {
      console.error('Error getting public key:', error);
      return null;
    }
  }

  /**
   * Get account details from the Stellar network
   * @param publicKey The Stellar account public key
   */
  static async getAccountDetails(publicKey: string) {
    try {
      const account = await server.loadAccount(publicKey);
      return account;
    } catch (error) {
      console.error('Error loading account:', error);
      throw error;
    }
  }

  /**
   * Get account balance for a specific asset
   * @param publicKey The Stellar account public key
   * @param assetCode The asset code (default is XLM)
   */
  static async getAccountBalance(publicKey: string, assetCode = 'XLM') {
    try {
      const account = await server.loadAccount(publicKey);
      const balances = account.balances;
      
      // Find the balance for the specified asset code
      const balance = balances.find((b: any) => 
        (b.asset_type === 'native' && assetCode === 'XLM') || 
        (b.asset_code === assetCode)
      );
      
      return balance ? balance.balance : '0';
    } catch (error) {
      console.error('Error getting account balance:', error);
      return '0';
    }
  }

  /**
   * Send an XLM payment transaction using Freighter
   * @param destinationId The destination account public key
   * @param amount The amount to send
   */
  static async sendPayment(destinationId: string, amount: string) {
    try {
      const sourcePublicKey = await this.getPublicKey();
      if (!sourcePublicKey) {
        throw new Error('Source public key not available');
      }
      
      // Get source account
      const sourceAccount = await server.loadAccount(sourcePublicKey);
      
      // Build the transaction
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationId,
            asset: StellarSdk.Asset.native(),
            amount: amount
          })
        )
        .setTimeout(30)
        .build();
      
      // Convert transaction to XDR
      const xdr = transaction.toXDR();
      
      // Sign with Freighter
      const signedResponse = await freighterApi.signTransaction(xdr, {
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE
      });
      
      if (signedResponse.error) {
        throw new Error(signedResponse.error);
      }
      
      // Convert signed XDR back to transaction
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedResponse.signedTxXdr,
        TESTNET_NETWORK_PASSPHRASE
      );
      
      // Submit the transaction
      const result = await server.submitTransaction(signedTransaction);
      return result;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }

  /**
   * Retrieve Stellar network information
   */
  static async getNetworkInfo() {
    try {
      // Get network info
      const networkInfo = await freighterApi.getNetworkDetails();
      
      if (networkInfo.error) {
        throw new Error(networkInfo.error);
      }
      
      return {
        network: networkInfo.network,
        networkUrl: networkInfo.networkUrl,
        networkPassphrase: networkInfo.networkPassphrase,
        sorobanRpcUrl: networkInfo.sorobanRpcUrl
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      throw error;
    }
  }

  /**
   * Create a new Stellar account on Testnet using the Friendbot service
   * @param publicKey The public key for the new account
   */
  static async createTestnetAccount(publicKey: string) {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to create testnet account');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating testnet account:', error);
      throw error;
    }
  }
} 
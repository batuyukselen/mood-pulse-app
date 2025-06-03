import * as StellarSdk from '@stellar/stellar-sdk';
import freighterApi from '@stellar/freighter-api';
import { 
  DEFAULT_NETWORK, 
  MOODPULSE_CONTRACT_ID, 
  CONTRACT_FUNCTIONS, 
  TX_SETTINGS 
} from './stellarConstants';
import { EMOJI_DATA } from './constants';

// Freighter window tipi tanımı
declare global {
  interface Window {
    freighter?: any;
  }
}

// Initialize the Stellar server connection
const horizonServer = new StellarSdk.Horizon.Server(DEFAULT_NETWORK.networkUrl);

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
        return null;
      }

      // Check if user has granted permission
      const hasPermission = await freighterApi.isAllowed();
      if (!hasPermission.isAllowed) {
        return null;
      }

      // Get the public key
      const addressData = await freighterApi.getAddress();
      return addressData.address || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if Freighter wallet is available and connected
   */
  static async isWalletAvailable(): Promise<boolean> {
    try {
      // Check if window object exists (browser environment)
      if (typeof window === 'undefined') return false;
      
      // Check if Freighter is installed
      if (!window.freighter) {
        return false;
      }
      
      // Check if Freighter is connected
      const isConnected = await freighterApi.isConnected();
      return isConnected.isConnected;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get account details from the Stellar network
   * @param publicKey The Stellar account public key
   */
  static async getAccountDetails(publicKey: string) {
    try {
      const account = await horizonServer.loadAccount(publicKey);
      return account;
    } catch (error) {
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
      const account = await horizonServer.loadAccount(publicKey);
      const balances = account.balances;
      
      // Find the balance for the specified asset code
      const balance = balances.find((b: any) => 
        (b.asset_type === 'native' && assetCode === 'XLM') || 
        (b.asset_code === assetCode)
      );
      
      return balance ? balance.balance : '0';
    } catch (error) {
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
      const sourceAccount = await horizonServer.loadAccount(sourcePublicKey);
      
      // Build the transaction
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: TX_SETTINGS.baseFee,
        networkPassphrase: DEFAULT_NETWORK.networkPassphrase
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationId,
            asset: StellarSdk.Asset.native(),
            amount: amount
          })
        )
        .setTimeout(TX_SETTINGS.timeout)
        .build();
      
      // Convert transaction to XDR
      const xdr = transaction.toXDR();
      
      // Sign with Freighter
      const signedResponse = await freighterApi.signTransaction(xdr, {
        networkPassphrase: DEFAULT_NETWORK.networkPassphrase
      });
      
      if (signedResponse.error) {
        throw new Error(signedResponse.error);
      }
      
      // Convert signed XDR back to transaction
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedResponse.signedTxXdr,
        DEFAULT_NETWORK.networkPassphrase
      );
      
      // Submit the transaction
      const result = await horizonServer.submitTransaction(signedTransaction);
      return result;
    } catch (error) {
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
      throw error;
    }
  }

  /**
   * Record emoji selection as a transaction on Stellar Testnet
   * @param emoji The selected emoji
   * @param name The emoji name/mood
   */
  static async recordEmojiSelection(emoji: string, name: string) {
    try {
      const sourcePublicKey = await this.getPublicKey();
      if (!sourcePublicKey) {
        throw new Error('Source public key not available');
      }
      
      // Get source account
      const sourceAccount = await horizonServer.loadAccount(sourcePublicKey);
      
      // Build the transaction with memo to store emoji data
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: TX_SETTINGS.baseFee,
        networkPassphrase: DEFAULT_NETWORK.networkPassphrase
      })
        // Add a payment to the contract address - this allows the contract to track votes
        .addOperation(
          StellarSdk.Operation.payment({
            destination: MOODPULSE_CONTRACT_ID, // Payment to contract address
            asset: StellarSdk.Asset.native(),
            amount: '0.0000001' // Minimum amount
          })
        )
        // Add memo with emoji data
        .addMemo(StellarSdk.Memo.text(`${TX_SETTINGS.memoPrefix}${emoji} - ${name}`))
        .setTimeout(TX_SETTINGS.timeout)
        .build();
      
      // Convert transaction to XDR
      const xdr = transaction.toXDR();
      
      // Sign with Freighter - modern approach using async/await
      try {
        const signedResponse = await freighterApi.signTransaction(xdr, {
          networkPassphrase: DEFAULT_NETWORK.networkPassphrase
        });
        
        if (signedResponse.error) {
          throw new Error(signedResponse.error);
        }
        
        // Convert signed XDR back to transaction
        const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
          signedResponse.signedTxXdr,
          DEFAULT_NETWORK.networkPassphrase
        );
        
        // Submit the transaction
        const result = await horizonServer.submitTransaction(signedTransaction);
        
        return {
          success: true,
          transactionHash: result.hash,
          emoji,
          name
        };
      } catch (error) {
        throw new Error(`Transaction signing failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Record emoji selection to the Soroban contract
   * This is a placeholder for future contract integration
   * @param emoji The selected emoji
   * @param name The emoji name/mood
   */
  static async recordEmojiToContract(emoji: string, name: string) {
    try {
      const sourcePublicKey = await this.getPublicKey();
      if (!sourcePublicKey) {
        throw new Error('Source public key not available');
      }
      
      return {
        success: true,
        contractId: MOODPULSE_CONTRACT_ID
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get community emoji data from Stellar transactions
   * @param limit The maximum number of records to retrieve
   */
  static async getCommunityEmojis(limit = 100) {
    try {
      // Query payments to the contract address with improved error handling
      try {
        const payments = await horizonServer.payments()
          .forAccount(MOODPULSE_CONTRACT_ID)
          .limit(limit)
          .order('desc')
          .call();

        if (!payments.records || payments.records.length === 0) {
          return [];
        }
        
        // Process the payments to extract emoji data
        const emojiData = new Map();
        
        for (const payment of payments.records) {
          try {
            // Get the transaction to check the memo
            const transaction = await horizonServer.transactions()
              .transaction(payment.transaction_hash)
              .call();
            
            if (transaction.memo_type === 'text' && transaction.memo && transaction.memo.startsWith(TX_SETTINGS.memoPrefix)) {
              // Extract emoji and name from memo text
              const emojiPart = transaction.memo.replace(TX_SETTINGS.memoPrefix, '');
              const parts = emojiPart.split(' - ');
              
              if (parts.length === 2) {
                const emoji = parts[0].trim();
                const name = parts[1].trim();
                
                // Find color for the emoji
                const emojiInfo = EMOJI_DATA.find((e) => e.icon === emoji);
                const color = emojiInfo ? emojiInfo.color : '#777777';
                
                // Update count for this emoji
                if (emojiData.has(emoji)) {
                  emojiData.set(emoji, {
                    ...emojiData.get(emoji),
                    count: emojiData.get(emoji).count + 1
                  });
                } else {
                  emojiData.set(emoji, {
                    emoji,
                    name,
                    count: 1,
                    color
                  });
                }
              }
            }
          } catch (error) {
            // Skip this transaction and continue with others
            continue;
          }
        }
        
        // Convert map to array
        const result = Array.from(emojiData.values());
        
        // Calculate percentages
        const totalCount = result.reduce((sum, item) => sum + item.count, 0);
        result.forEach(item => {
          item.percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
        });
        
        return result;
      } catch (error) {
        // Return a helpful error message
        throw new Error(`Failed to fetch payments: ${error instanceof Error ? error.message : String(error)}`);
      }
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Get emoji data from the Soroban contract
   * This is a placeholder for future contract integration
   */
  static async getEmojiDataFromContract() {
    try {
      const sourcePublicKey = await this.getPublicKey();
      if (!sourcePublicKey) {
        return null;
      }
      
      // Return null for now to fall back to transaction-based data
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if an account exists on the Stellar network
   * @param publicKey The account public key to check
   */
  static async accountExists(publicKey: string): Promise<boolean> {
    try {
      await horizonServer.loadAccount(publicKey);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Validate a Stellar address
   * @param address The Stellar address to validate
   */
  static isValidStellarAddress(address: string): boolean {
    // Check if it's a valid Stellar public key format
    try {
      StellarSdk.StrKey.decodeEd25519PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }
} 
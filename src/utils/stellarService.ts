import * as StellarSdk from '@stellar/stellar-sdk';
import freighterApi from '@stellar/freighter-api';
import { 
  DEFAULT_NETWORK, 
  MOODPULSE_CONTRACT_ID, 
  CONTRACT_FUNCTIONS, 
  TX_SETTINGS 
} from './stellarConstants';

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
      const account = await horizonServer.loadAccount(publicKey);
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
      const account = await horizonServer.loadAccount(publicKey);
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
        // Add a payment to self with minimum amount (0.0000001 XLM)
        .addOperation(
          StellarSdk.Operation.payment({
            destination: sourcePublicKey, // Payment to self
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
      
      // Also record to the Soroban contract (future enhancement)
      try {
        await this.recordEmojiToContract(emoji, name);
      } catch (contractError) {
        console.error('Failed to record to contract, but main transaction succeeded:', contractError);
        // Ignore contract errors - the main transaction was successful
      }
      
      return {
        success: true,
        transactionHash: result.hash,
        emoji,
        name,
        contractId: MOODPULSE_CONTRACT_ID
      };
    } catch (error) {
      console.error('Error recording emoji selection:', error);
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
      
      // We're using a simpler approach for now since the contract isn't deployed yet
      console.log(`Would record emoji ${emoji} (${name}) to contract ${MOODPULSE_CONTRACT_ID}`);
      
      return {
        success: true,
        contractId: MOODPULSE_CONTRACT_ID
      };
    } catch (error) {
      console.error('Error recording emoji to contract:', error);
      // Don't throw - this is an enhancement, not critical
      return null;
    }
  }

  /**
   * Fetch community emoji selections from Stellar Testnet
   * This method retrieves recent transactions with MoodPulse memos
   * @param limit Maximum number of transactions to retrieve
   */
  static async getCommunityEmojis(limit = 100) {
    try {
      // Try to get data from the contract first
      const contractData = await this.getEmojiDataFromContract();
      
      // Fallback to transaction history if contract data is unavailable
      const transactions = await horizonServer
        .transactions()
        .limit(limit)
        .order('desc')
        .call();
      
      // Extract emoji data from transaction memos
      const communityEmojis = [];
      
      for (const transaction of transactions.records) {
        try {
          // Fetch transaction details to get the memo
          const txDetails = await horizonServer.transactions().transaction(transaction.hash).call();
          
          // Check if memo exists and starts with MoodPulse
          if (txDetails.memo && txDetails.memo_type === 'text' && txDetails.memo.startsWith(TX_SETTINGS.memoPrefix)) {
            // Extract emoji from memo (format: "MoodPulse: 😊 - Happy")
            const memoText = txDetails.memo;
            const emojiMatch = memoText.match(new RegExp(`${TX_SETTINGS.memoPrefix}(.*?) -`));
            
            if (emojiMatch && emojiMatch[1]) {
              const emoji = emojiMatch[1].trim();
              
              // Extract name
              const nameMatch = memoText.match(/- (.*?)$/);
              const name = nameMatch && nameMatch[1] ? nameMatch[1].trim() : 'Unknown';
              
              // Get color based on name
              let color = '#9C27B0'; // Default purple
              
              switch (name.toLowerCase()) {
                case 'happy':
                  color = '#4CAF50'; // Green
                  break;
                case 'sad':
                  color = '#2196F3'; // Blue
                  break;
                case 'angry':
                  color = '#F44336'; // Red
                  break;
                case 'neutral':
                  color = '#FFC107'; // Amber
                  break;
                case 'surprised':
                  color = '#FF9800'; // Orange
                  break;
              }
              
              communityEmojis.push({
                emoji,
                name,
                color,
                count: 1, // Each transaction represents one vote
                timestamp: new Date(txDetails.created_at).getTime()
              });
            }
          }
        } catch (error) {
          console.error(`Error processing transaction ${transaction.hash}:`, error);
          // Continue with next transaction
          continue;
        }
      }
      
      // Aggregate counts for the same emoji
      interface EmojiCountItem {
        emoji: string;
        name: string;
        count: number;
        color: string;
      }
      
      const emojiCounts: Record<string, EmojiCountItem> = {};
      
      communityEmojis.forEach((item: any) => {
        if (!emojiCounts[item.emoji]) {
          emojiCounts[item.emoji] = {
            emoji: item.emoji,
            name: item.name,
            count: 0,
            color: item.color
          };
        }
        
        emojiCounts[item.emoji].count += 1;
      });
      
      // Calculate percentages
      const totalCount = Object.values(emojiCounts).reduce((sum: number, item: EmojiCountItem) => sum + item.count, 0);
      
      const result = Object.values(emojiCounts).map((item: EmojiCountItem) => ({
        ...item,
        percentage: totalCount > 0 ? (item.count / totalCount) * 100 : 0
      }));
      
      return result;
    } catch (error) {
      console.error('Error fetching community emojis:', error);
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
      
      // This is a placeholder for when the contract is actually available
      console.log(`Would query contract ${MOODPULSE_CONTRACT_ID} for emoji data`);
      
      // Return null for now to fall back to transaction-based data
      return null;
    } catch (error) {
      console.error('Error getting emoji data from contract:', error);
      return null;
    }
  }
} 
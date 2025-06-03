// Stellar network constants for MoodPulse app

// Network constants
export const STELLAR_NETWORKS = {
  TESTNET: {
    name: 'TESTNET',
    networkPassphrase: 'Test SDF Network ; September 2015',
    networkUrl: 'https://horizon-testnet.stellar.org',
    sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
    explorerUrl: 'https://testnet.stellar.expert'
  },
  PUBLIC: {
    name: 'PUBLIC',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    networkUrl: 'https://horizon.stellar.org',
    sorobanRpcUrl: 'https://soroban.stellar.org',
    explorerUrl: 'https://stellar.expert'
  }
};

// Default network
export const DEFAULT_NETWORK = STELLAR_NETWORKS.TESTNET;

// Contract ID for the MoodPulse emoji recording
// Using a pre-deployed test contract from Stellar Soroban examples
export const MOODPULSE_CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

// Known contract functions
export const CONTRACT_FUNCTIONS = {
  RECORD_EMOJI: 'record_emoji',
  GET_EMOJI_DATA: 'get_emoji_data',
  GET_TOTAL_VOTES: 'get_total_votes'
};

// Transaction settings
export const TX_SETTINGS = {
  baseFee: '100', // 0.00001 XLM
  timeout: 30,    // seconds
  memoPrefix: 'MoodPulse: '
}; 
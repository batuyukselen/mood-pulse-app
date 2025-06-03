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
export const DEFAULT_NETWORK = {
  network: 'TESTNET',
  networkUrl: 'https://horizon-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
  sorobanRpcUrl: 'https://soroban-testnet.stellar.org'
};

// Contract ID - This should be updated with the user's own deployed contract ID
// This is the address that will receive emoji vote transactions
export const MOODPULSE_CONTRACT_ID = 'GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA';

// Known contract functions
export const CONTRACT_FUNCTIONS = {
  recordEmoji: 'record_emoji',
  getEmojis: 'get_emojis'
};

// Transaction settings
export const TX_SETTINGS = {
  baseFee: '100', // 0.00001 XLM
  timeout: 30,    // seconds
  memoPrefix: 'MoodPulse: '
}; 
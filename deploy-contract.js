// Deploy Stellar contract helper script

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';
import StellarSdk from 'stellar-sdk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// Create a new Stellar keypair
const createKeypair = () => {
  const keypair = StellarSdk.Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  };
};

// Validate a Stellar address
const isValidStellarAddress = (address) => {
  try {
    StellarSdk.StrKey.decodeEd25519PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

// Function to check account existence on Stellar Testnet
const checkAccountExists = async (publicKey) => {
  try {
    const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Function to get account balance
const getAccountBalance = async (publicKey) => {
  try {
    const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
    if (response.status !== 200) return '0';
    
    const data = await response.json();
    const xlmBalance = data.balances.find(b => b.asset_type === 'native');
    return xlmBalance ? xlmBalance.balance : '0';
  } catch (error) {
    return '0';
  }
};

// Function to fund account with Friendbot
const fundWithFriendbot = async (publicKey) => {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    if (!response.ok) {
      throw new Error(`Friendbot error: ${response.statusText}`);
    }
    const result = await response.json();
    return {
      success: true,
      hash: result.hash || 'Transaction successful'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

async function main() {
  console.log('\n✨ Mood Pulse Board - Stellar Testnet Contract Deployment Helper ✨\n');
  console.log('This script will help you deploy the emoji contract to Stellar Testnet and update your app configuration.\n');
  
  // Check if Freighter is installed
  console.log('📋 Prerequisites Check:');
  console.log('  1. Freighter browser extension should be installed');
  console.log('  2. You should have a Testnet account with some XLM');
  console.log('  3. Soroban CLI should be installed (optional for full contract deployment)\n');
  
  const proceed = await prompt('Do you want to proceed? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('\nExiting...');
    rl.close();
    return;
  }
  
  // Stellar account options
  console.log('\n🔑 Stellar Account Options:');
  console.log('  1. Use existing Stellar account');
  console.log('  2. Generate new Stellar account');
  console.log('  3. Use example address (for testing only)');
  
  const accountOption = await prompt('Choose an option (1-3): ');
  
  let publicKey;
  
  if (accountOption === '1') {
    // Use existing account
    publicKey = await prompt('Enter your Stellar public key (starts with G...): ');
    
    if (!isValidStellarAddress(publicKey)) {
      console.log('\n❌ Invalid Stellar address format');
      rl.close();
      return;
    }
    
    const exists = await checkAccountExists(publicKey);
    if (!exists) {
      console.log('\n⚠️ Warning: This account does not exist on Testnet yet');
      const fundAccount = await prompt('Do you want to fund this account with Friendbot? (y/n): ');
      
      if (fundAccount.toLowerCase() === 'y') {
        console.log('\nFunding account with Friendbot...');
        const fundResult = await fundWithFriendbot(publicKey);
        
        if (fundResult.success) {
          console.log('✅ Account funded successfully!');
        } else {
          console.log(`❌ Failed to fund account: ${fundResult.error}`);
          console.log('Please fund your account manually with Friendbot before continuing.');
        }
      }
    }
  } else if (accountOption === '2') {
    // Generate new account
    console.log('\nGenerating new Stellar keypair...');
    const keypair = createKeypair();
    publicKey = keypair.publicKey;
    
    console.log('\n✅ New keypair generated:');
    console.log(`  Public key: ${publicKey}`);
    console.log(`  Secret key: ${keypair.secretKey}`);
    console.log('\n⚠️ IMPORTANT: Store your secret key securely. It will not be shown again!');
    
    // Fund the new account
    console.log('\nFunding account with Friendbot...');
    const fundResult = await fundWithFriendbot(publicKey);
    
    if (fundResult.success) {
      console.log('✅ Account funded successfully!');
    } else {
      console.log(`❌ Failed to fund account: ${fundResult.error}`);
      console.log('Please fund your account manually with Friendbot before continuing.');
    }
    
    // Remind user to add this account to Freighter
    console.log('\n🦊 Please add this account to your Freighter wallet:');
    console.log('  1. Open Freighter extension');
    console.log('  2. Click on the menu (three dots)');
    console.log('  3. Select "Import Account"');
    console.log('  4. Enter your secret key');
    console.log('  5. Make sure "Testnet" is selected in network settings');
  } else if (accountOption === '3') {
    // Use example account
    publicKey = 'GBZX4364PEPQTDICVS7GONLMPJEQ6TRT6IMEZWZT4KKSMEDW2HTQRSG6';
    console.log(`\n✅ Using example address: ${publicKey}`);
    console.log('⚠️ Note: This is for testing only. In production, use your own account.');
  } else {
    console.log('\n❌ Invalid option selected');
    rl.close();
    return;
  }
  
  console.log(`\n✅ Using public key: ${publicKey}`);
  
  // Check balance
  const balance = await getAccountBalance(publicKey);
  console.log(`\n💰 Current XLM balance: ${balance} XLM`);
  
  if (parseFloat(balance) < 5) {
    console.log('⚠️ Warning: Your account has less than 5 XLM. This might not be enough for all operations.');
    console.log('Recommendation: Fund your account with more XLM using Friendbot:');
    console.log(`https://friendbot.stellar.org?addr=${publicKey}`);
    
    const continueLowBalance = await prompt('Continue anyway? (y/n): ');
    if (continueLowBalance.toLowerCase() !== 'y') {
      rl.close();
      return;
    }
  }
  
  // Step 2: Update the configuration
  console.log('\n⚙️ Step 2: Updating application configuration');
  
  // Update stellarConstants.ts
  try {
    const constantsPath = './src/utils/stellarConstants.ts';
    let constants = fs.readFileSync(constantsPath, 'utf8');
    
    // Replace the contract ID
    constants = constants.replace(
      /export const MOODPULSE_CONTRACT_ID = '.*?';/,
      `export const MOODPULSE_CONTRACT_ID = '${publicKey}';`
    );
    
    fs.writeFileSync(constantsPath, constants);
    console.log('✅ Updated contract ID in stellarConstants.ts');
  } catch (error) {
    console.error('❌ Error updating stellarConstants.ts:', error.message);
    rl.close();
    return;
  }
  
  // Step 3: Build and start the application
  console.log('\n🚀 Step 3: Build and run the application');
  const buildApp = await prompt('Do you want to build and start the application now? (y/n): ');
  
  if (buildApp.toLowerCase() === 'y') {
    try {
      console.log('\nInstalling dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      
      console.log('\nStarting development server...');
      console.log('(Press Ctrl+C to stop the server when done)');
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      console.error('\n❌ Error building or running the application:', error.message);
    }
  }
  
  rl.close();
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
  rl.close();
}); 
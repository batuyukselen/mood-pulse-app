import StellarSdk from 'stellar-sdk';

// Create a new keypair
const keypair = StellarSdk.Keypair.random();

console.log('Public Key (Account ID):', keypair.publicKey());
console.log('Secret Key (Keep secure!):', keypair.secret());
console.log('\nFriendbot URL to fund this account:');
console.log(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);
console.log('\nCURL command to fund this account:');
console.log(`curl -X GET "https://friendbot.stellar.org?addr=${keypair.publicKey()}"`); 
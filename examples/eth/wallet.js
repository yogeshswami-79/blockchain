const { ethers } = require('ethers');


const wallet = ethers.Wallet.createRandom();

console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('Public Key:', wallet.publicKey);
console.log('Mnemonic:', wallet.mnemonic.phrase);



function getWalletFromPrivateKey(privateKey=''){
    if(!privateKey){
        console.error('Please provide a private key');
        return;
    }
    const wallet = new ethers.Wallet(privateKey);
    console.log('Address:', wallet.address);
    console.log('Private Key:', wallet.privateKey);
    console.log('Public Key:', wallet.publicKey);
    console.log('Restored Wallet from Private Key', wallet.address);
    return wallet;
}

function getWalletFromMnemonic(mnemonic=''){
    if(!mnemonic){
        console.error('Please provide a mnemonic phrase');
        return;
    }
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log('Address:', wallet.address);
    console.log('Private Key:', wallet.privateKey);
    console.log('Public Key:', wallet.publicKey);
    console.log('Restored Wallet from Mnemonic', wallet.address);
    return wallet;
}

// Connect wallet to a provider (e.g., Infura, Alchemy, or local node) (to read/write to the blockchain)
const PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const restoredWalletFromPrivateKey = getWalletFromPrivateKey(PRIVATE_KEY);


const provider = new ethers.JsonRpcApiProvider('http://localhost:8545');
const connectedWallet = restoredWalletFromPrivateKey.connect(provider);

console.log('Connected Wallet Address:', connectedWallet.address);


async function checkBalance(address) {
    const balance = await provider.getBalance(address);
    console.log('Balance:', ethers.formatEther(balance), 'ETH');
    return balance;
    // return wallet.getBalance();
}
 checkBalance(connectedWallet.address).then(balance => {
    console.log('Balance in ETH:', ethers.formatEther(balance));
}).catch(console.error);


// Sign a message
async function signMessage(wallet, message='Hello, Ethereum!') {
    const signature = await wallet.signMessage(message);
    console.log('Signature:', signature);

    // Anyone can verify the signature using the wallet's address and the original message
    const recovered = ethers.verifyMessage(message, signature);
    console.log('Verified signer:', recovered);
    console.log('Matches?', recovered === wallet.address); // true
    return signature; 
}

signMessage(connectedWallet, 'Hello, Ethereum!');

// src/components/WalletManager.jsx
import React from 'react';
import { toast } from 'react-toastify';

export default function WalletManager() {
  const connectWallet = async () => {
    const storedWallet = localStorage.getItem('wallet');

    if (storedWallet) {
      toast.info('🔒 Already connected. Please logout to switch wallets.', { autoClose: 3000 });
      return;
    }

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        localStorage.setItem('wallet', walletAddress);
        toast.success('✅ Wallet connected!', { autoClose: 2000 });
        window.location.reload(); // Optional: refresh to reflect role-based routes
      } catch (err) {
        toast.error('❌ Wallet connection failed.');
      }
    } else {
      toast.error('🦊 MetaMask not detected.');
    }
  };

  return (
    <button className="connect-button" onClick={connectWallet}>
      Connect Wallet
    </button>
  );
}

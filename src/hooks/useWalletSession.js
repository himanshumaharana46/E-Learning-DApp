// src/hooks/useWalletSession.js
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function useWalletSession() {
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        const storedWallet = localStorage.getItem('wallet');
        const newWallet = accounts[0];

        if (storedWallet && storedWallet.toLowerCase() !== newWallet.toLowerCase()) {
          toast.error('⚠️ Please logout before switching wallets.', { autoClose: 3000 });
          window.location.reload(); // Optional: force reset
        }
      });
    }
  }, []);
}

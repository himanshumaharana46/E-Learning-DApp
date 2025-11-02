import { Contract, BrowserProvider, isAddress } from 'ethers';
import ELearningABI from '../abis/ELearning.json';


export async function getContract() {
  if (!window.ethereum) {
    throw new Error('❌ MetaMask not detected. Please install MetaMask to continue.');
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error('❌ Contract address is missing. Check your .env file.');
  }

  if (!isAddress(contractAddress.trim())) {
    throw new Error('❌ Invalid contract address format.');
  }

  return new Contract(contractAddress.trim(), ELearningABI, signer);
}

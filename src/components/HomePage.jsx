import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContract } from '../utils/contract';
import Body from '../components/Body';
import LetterLooper from '../components/LetterLooper';
import '../styles/HomePage.css';
import { isAddress } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HomePage() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!window.ethereum) {
      toast.error('🦊 MetaMask not detected. Please install it.');
      return;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      setAddress(userAddress);

      if (!isAddress(userAddress)) {
        setStatus('❌ Invalid wallet address.');
        toast.error('❌ Invalid wallet address.');
        return;
      }

      const contract = await getContract();
      const isAdmin = await contract.isAdmin(userAddress);
      const isInstructor = await contract.isInstructor(userAddress);
      const isStudent = await contract.isStudent(userAddress);

      localStorage.setItem('wallet', userAddress);

      if (isAdmin) {
        localStorage.setItem('role', 'admin');
        setStatus(`✅ Wallet connected\n👑 Welcome Admin`);
        toast.success('👑 Welcome Admin!');
        setTimeout(() => navigate('/admin'), 2000);
      } else if (isInstructor) {
        localStorage.setItem('role', 'instructor');
        setStatus(`✅ Wallet connected\n📘 Welcome Instructor`);
        toast.info('📘 Welcome Instructor!');
        setTimeout(() => navigate('/instructor'), 2000);
      } else if (isStudent) {
        localStorage.setItem('role', 'student');
        setStatus(`✅ Wallet connected\n🎓 Welcome Student`);
        toast.info('🎓 Welcome Student!');
        setTimeout(() => navigate('/student'), 2000);
      } else {
        setStatus(`✅ Wallet connected\n❌ You are not registered in the system.`);
        toast.warning('❌ You are not registered in the system.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setStatus(`❌ Login failed: ${err?.message || 'Unknown error occurred.'}`);
      toast.error(`❌ Login failed: ${err?.message || 'Unknown error occurred.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="home-container">
        <LetterLooper text="Welcome to E-learning DApp" delay={150} />

        <div className="wallet-section">
          <button className="login-button" onClick={handleLogin} disabled={loading}>
            {loading ? 'Connecting...' : 'Login'}
          </button>
          {address && <p className="wallet-address">Connected: {address}</p>}
          <pre className="status-message">{status}</pre>
        </div>

        <div className="explore-section">
          <h3>🎯 Explore Courses</h3>
          <p>Click below to view all available courses.</p>
          <button className="explore-button" onClick={() => navigate('/courses')}>
            View Courses
          </button>
        </div>
      </div>

      <Body />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

import React, { useState } from 'react';
import { getContract } from '../utils/contract';
import '../styles/AdminDashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
  const [instructorAddress, setInstructorAddress] = useState('');
  const [status, setStatus] = useState('');
  const [instructors, setInstructors] = useState([]);

 const addInstructor = async () => {
  try {
    const contract = await getContract();

    // ✅ Fetch current instructors
    const existingInstructors = await contract.getAllInstructors();

    // ✅ Check for duplicates
    const alreadyExists = existingInstructors.some(
      (addr) => addr.toLowerCase() === instructorAddress.toLowerCase()
    );

    if (alreadyExists) {
      setStatus('⚠️ This address is already registered as an instructor.');
      // toast.warn('⚠️ Instructor already exists!',{autoClose:1000});
      return;
    }

    // ✅ Proceed to add
    const tx = await contract.addInstructor(instructorAddress);
    await tx.wait();
    setStatus('✅ Instructor added successfully!');
    toast.success('✅ Instructor added!');
  } catch (err) {
    console.error('Add instructor error:', err);
    setStatus('❌ Error adding instructor.');
    toast.error('❌ Failed to add instructor.');
  }
};


  const fetchInstructors = async () => {
    try {
      const contract = await getContract();
      const list = await contract.getAllInstructors(); // Must be defined in your Solidity contract
      setInstructors(list);
      toast.info(`📋 Loaded ${list.length} instructors`,{autoClose:1000});
    } catch (err) {
      console.error('Fetch instructors error:', err);
      toast.error('❌ Failed to load instructors.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2>Admin Dashboard</h2>

        <input
          type="text"
          className="admin-input"
          placeholder="Instructor wallet address"
          value={instructorAddress}
          onChange={(e) => setInstructorAddress(e.target.value)}
        />
        <button className="admin-button" onClick={addInstructor}>
          Add Instructor
        </button>

        <button className="admin-button" onClick={fetchInstructors}>
          View Instructors
        </button>

        <p className="status-message">{status}</p>

        {instructors.length > 0 && (
          <div className="instructor-list-container">
            <h3>📘 Instructor List</h3>
            <ul className="instructor-list">
              {instructors.map((addr, index) => (
                <li key={index}>{addr}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

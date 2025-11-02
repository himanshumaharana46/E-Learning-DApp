import React, { useState } from 'react';
import { getContract } from '../utils/contract';
import '../styles/CourseForm.css';
import { parseEther } from 'ethers';
import { uploadToIPFS } from '../utils/ipfsUpload';

export default function CourseForm({ onCourseCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');

  const createCourse = async () => {
    try {
      if (!title || !description || !price || isNaN(price)) {
        setStatus('❌ Please fill all fields with valid values.');
        return;
      }

      const role = localStorage.getItem('role');
      if (role !== 'instructor') {
        setStatus('❌ You must be an instructor to create a course.');
        return;
      }

      setStatus('⏳ Uploading metadata to IPFS...');
      const metadata = { title, description };
      const ipfsHash = await uploadToIPFS(metadata);
      setIpfsHash(ipfsHash);
      console.log('✅ IPFS Hash:', ipfsHash);

      setStatus('⏳ Creating course on blockchain...');
      const contract = await getContract();

      const tx = await contract.createCourse(
        title,
        description,
        ipfsHash,
        parseEther(price)
      );
      await tx.wait();

      setStatus('✅ Course created successfully!');

      // 🔁 Trigger course list refresh in parent
      if (onCourseCreated) {
        onCourseCreated();
      }

      // Optional: reset form
      setTitle('');
      setDescription('');
      setPrice('');
    } catch (err) {
      console.error('❌ Error creating course:', err);
      if (err.response?.status === 403) {
        setStatus('❌ 403 Forbidden: Check your JWT permissions in Pinata.');
      } else if (err.response?.status === 401) {
        setStatus('❌ 401 Unauthorized: JWT may be invalid or expired.');
      } else {
        setStatus(`❌ ${err.message || 'Error creating course. See console for details.'}`);
      }
    }
  };

  return (
    <div className="course-form-container">
      <h3>Create Course</h3>

      <input
        className="course-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        className="course-input"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        className="course-input"
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="Price in ETH"
      />

      <button className="course-button" onClick={createCourse}>
        Create
      </button>

      <input
        className="course-input"
        value={ipfsHash}
        placeholder="IPFS Hash (auto-generated)"
        readOnly
      />

      <p className="course-status">{status}</p>
    </div>
  );
}

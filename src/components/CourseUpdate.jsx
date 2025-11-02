// src/components/CourseUpdate.jsx
import React, { useEffect, useState } from 'react';
import { getContract } from '../utils/contract';
import { parseEther } from 'ethers';
import { uploadToIPFS } from '../utils/ipfsUpload';
import '../styles/CourseForm.css';

export default function CourseUpdate() {
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const contract = await getContract();
        const result = await contract.getInstructorCourses();
        setCourses(result);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setStatus('❌ Failed to load courses.');
      }
    };
    fetchCourses();
  }, []);

  const handleUpdate = async () => {
    try {
      if (!selectedId || !title || !description || !price || isNaN(price)) {
        setStatus('❌ Fill all fields correctly.');
        return;
      }

      setStatus('⏳ Uploading updated metadata to IPFS...');
      const metadata = { title, description };
      const ipfsHash = await uploadToIPFS(metadata);

      const contract = await getContract();
      const tx = await contract.updateCourse(
        selectedId,
        title,
        description,
        ipfsHash,
        parseEther(price)
      );
      await tx.wait();

      setStatus('✅ Course updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      setStatus(`❌ ${err.message || 'Update failed.'}`);
    }
  };

  return (
    <div className="course-form-container">
      <h3>Update Course</h3>

      <select
        className="course-input"
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
      >
        <option value="">Select a course</option>
        {courses.map((course, i) => (
          <option key={i} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>

      <input
        className="course-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New Title"
      />
      <input
        className="course-input"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="New Description"
      />
      <input
        className="course-input"
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="New Price in ETH"
      />

      <button className="course-button" onClick={handleUpdate}>
        Update Course
      </button>

      <p className="course-status">{status}</p>
    </div>
  );
}

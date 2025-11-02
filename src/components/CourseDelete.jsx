import React, { useState, useEffect } from 'react';
import { getContract } from '../utils/contract';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/CourseDelete.css'; // Optional: for custom styling

export default function CourseDelete() {
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const contract = await getContract();
        const list = await contract.getInstructorCourses(); // Must be defined in your Solidity contract
        setCourses(list);
      } catch (err) {
        console.error('Fetch courses error:', err);
        toast.error('❌ Failed to load your courses.');
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async () => {
    try {
      const contract =await getContract();
      const tx = await contract.deleteCourse(Number(selectedId));
      await tx.wait();

      toast.success('✅ Course deleted!');
      setStatus('✅ Course deleted successfully!');
      setCourses(courses.filter(course => course.id.toString() !== selectedId));
      setSelectedId('');
      setConfirming(false);
    } catch (err) {
      console.error('Delete course error:', err);
      toast.error('❌ Failed to delete course.');
      setStatus('❌ Error deleting course.');
    }
  };

  return (
    <div className="course-deleter">
      <h3>Delete Course</h3>

      <select
        className="course-input"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">Select a course</option>
        {courses.map((course, index) => (
          <option key={index} value={course.id.toString()}>
            {course.title} (ID: {course.id})
          </option>
        ))}
      </select>

      <button
        className="course-button"
        onClick={() => setConfirming(true)}
        disabled={!selectedId}
      >
        Delete
      </button>

      {confirming && (
        <div className="confirmation-modal">
          <p>⚠️ Are you sure you want to delete this course?</p>
          <button className="confirm-button" onClick={handleDelete}>Yes, Delete</button>
          <button className="cancel-button" onClick={() => setConfirming(false)}>Cancel</button>
        </div>
      )}

      <p className="course-status">{status}</p>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

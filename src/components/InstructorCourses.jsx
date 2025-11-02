// src/components/InstructorCourses.jsx
import React, { useEffect, useState } from 'react';
import { getContract } from '../utils/contract';

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const contract = await getContract();
        const result = await contract.getInstructorCourses();
        setCourses(result);
      } catch (err) {
        console.error('Error fetching instructor courses:', err);
        setStatus('❌ Failed to load courses.');
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h3>📘 My Created Courses</h3>
      {status && <p>{status}</p>}
      {courses.length > 0 ? (
        courses.map((course, i) => (
          <div key={i} className="course-card">
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <a
              href={`https://ipfs.io/ipfs/${course.ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Course Content
            </a>
            <p>Price: {course.price.toString()} wei</p>
          </div>
        ))
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
}

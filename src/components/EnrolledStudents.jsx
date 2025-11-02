import React, { useEffect, useState } from 'react';
import { getContract } from '../utils/contract';
import '../styles/EnrolledStudents.css';

export default function EnrolledStudents() {
  const [studentsByCourse, setStudentsByCourse] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const contract = await getContract();
        const instructorCourses = await contract.getInstructorCourses();

        const result = {};

        for (const course of instructorCourses) {
          const students = await contract.getStudents(course.id); // Assumes getStudents(courseId) returns address[]
          result[course.title || `Course #${course.id}`] = students;
        }

        setStudentsByCourse(result);
      } catch (err) {
        console.error('Failed to fetch enrolled students:', err);
        setStatus('❌ Failed to load enrolled students.');
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="enrolled-students">
      <h3>👥 Enrolled Students</h3>
      {Object.keys(studentsByCourse).length > 0 ? (
        Object.entries(studentsByCourse).map(([courseTitle, students], i) => (
          <div key={i} className="course-student-block">
            <h4>{courseTitle}</h4>
            {students.length > 0 ? (
              <ul>
                {students.map((addr, j) => (
                  <li key={j}>{addr}</li>
                ))}
              </ul>
            ) : (
              <p>No students enrolled yet.</p>
            )}
          </div>
        ))
      ) : (
        <p>No  students enrolled.</p>
      )}
      <p className="status-message">{status}</p>
    </div>
  );
}

import React from 'react';
import '../styles/InstructorNavbar.css';

export default function InstructorNavbar({ onSelect }) {
  return (
    <nav className="instructor-navbar">
      <button onClick={() => onSelect('course')}>Create Course</button>
      <button onClick={() => onSelect('update')}>Update Course</button>
      <button onClick={() => onSelect('delete')}>Delete Course</button>
      <button onClick={() => onSelect('myCourses')}>View Courses</button> 
      <button onClick={() => onSelect('quiz')}>Add Quiz</button>
      <button onClick={() => onSelect('certificate')}>Issue Certificate</button>
      <button onClick={() => onSelect('students')}>Enrolled Students</button>
    </nav>
  );
}

import React, { useState, useEffect } from 'react';
import CourseForm from './CourseForm';
import QuizUploader from './QuizUploader';
import CertificateUploader from './CertificateUploader';
import InstructorNavbar from './InstructorNavbar';
import CourseDelete from './CourseDelete';
import EnrolledStudents from './EnrolledStudents';
import '../styles/InstructorDashboard.css';
import InstructorCourses from './InstructorCourses';
import CourseUpdate from './CourseUpdate';
import { getContract } from '../utils/contract';


export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('course');
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(1); // Optional: dynamic selection later

  const loadCourses = async () => {
    try {
      const contract = await getContract();
      const fetchedCourses = await contract.getAllCourses(); // or getInstructorCourses()
      setCourses(fetchedCourses);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className="instructor-dashboard">
      <h2 className="dashboard-title">Instructor Dashboard</h2>

      <div className="navbar-wrapper">
        <InstructorNavbar onSelect={setActiveTab} />
      </div>

      <div className="dashboard-content">
        {activeTab === 'course' && <CourseForm onCourseCreated={loadCourses} />}
        {activeTab === 'quiz' && <QuizUploader courseId={courseId} />}
        {activeTab === 'certificate' && <CertificateUploader courses={courses} />}
        {activeTab === 'delete' && <CourseDelete />}
        {activeTab === 'students' && <EnrolledStudents />}
        {activeTab === 'myCourses' && <InstructorCourses />}
        {activeTab === 'update' && <CourseUpdate />}
      </div>
    </div>
  );
}

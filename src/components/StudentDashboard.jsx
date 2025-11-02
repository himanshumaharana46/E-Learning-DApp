import React, { useEffect, useState } from 'react';
import { getContract } from '../utils/contract';
import { formatEther, BrowserProvider } from 'ethers'; // ✅ FIXED importimport CourseCard from './CourseCard';
import '../styles/StudentDashboard.css';
import CourseCard from './CourseCard';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [studentAddress, setStudentAddress] = useState('');
  const [status, setStatus] = useState('');

  const fetchData = async () => {
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const student = await signer.getAddress(); // ✅ FIXED

    const contract = await getContract();
    const count = await contract.courseCount();
    const allCourses = [];

    for (let i = 1; i <= count; i++) {
      const course = await contract.courses(i);
      if (course.id !== 0) allCourses.push(course);
    }

    const enrolledIds = await contract.getEnrolledCourses(student);
    const certs = await contract.getCertificates(student);

    setStudentAddress(student);
    setEnrolled(enrolledIds.map(id => Number(id)));
    setCertificates(certs);
    setCourses(allCourses);
    setStatus('');
  } catch (err) {
    console.error("❌ Failed to load student data:", err);
    setStatus('❌ Failed to load student data.');
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (id, price) => {
    try {
      const contract = await getContract();
      const tx = await contract.enroll(id, { value: price });
      await tx.wait();
      setStatus(`✅ Enrolled in course #${id}`);
      await fetchData();
    } catch (err) {
      console.error("Enrollment error:", err);
      setStatus(`❌ Enrollment failed: ${err.message}`);
    }
  };

  const enrolledCourses = courses.filter(course =>
    enrolled.includes(Number(course.id))
  );
  const availableCourses = courses.filter(course =>
    !enrolled.includes(Number(course.id))
  );

  return (
    <div className="student-dashboard">
      <h2>🎓 Welcome, Student</h2>

      <section>
        <h3>📘 Enrolled Courses</h3>
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map(course => (
            <CourseCard key={course.id} course={course} enrolled />
          ))
        ) : (
          <p>You haven’t enrolled in any courses yet.</p>
        )}
      </section>

      <section>
        <h3>🆕 Available Courses</h3>
        {courses.length === 0 ? (
          <p>⚠️ No courses found. Please check your contract or connection.</p>
        ) : availableCourses.length > 0 ? (
          availableCourses.map(course => (
            <CourseCard key={course.id} course={course}>
              <button onClick={() => handleEnroll(course.id, course.price)}>
                Enroll for {formatEther(course.price)} ETH
              </button>
            </CourseCard>
          ))
        ) : (
          <p>✅ You’re enrolled in all available courses!</p>
        )}
      </section>

      <section>
        <h3>📜 Your Certificates</h3>
        {certificates.length > 0 ? (
          <ul className="certificate-list">
            {certificates.map((cert, i) => {
              const course = courses.find(c => Number(c.id) === Number(cert.courseId));
              return (
                <li key={i} className="certificate-item">
                  <strong>{course?.title || `Course #${cert.courseId}`}</strong><br />
                  Token ID: {cert.tokenId}<br />
                  <a
                    href={`https://ipfs.io/ipfs/${cert.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Certificate
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>📭 No certificates issued yet.</p>
        )}
      </section>

      <p className="status-message">{status}</p>
    </div>
  );
}

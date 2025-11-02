import React, { useEffect, useState } from 'react';
import { getContract } from '../utils/contract';
import { formatEther } from 'ethers';
import '../styles/CourseList.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuizUploader from './QuizUploader';
import QuizPlayer from './QuizPlayer';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [quizVisibility, setQuizVisibility] = useState({});
  const [activeQuizHashes, setActiveQuizHashes] = useState([]);
  const [activeQuizCourseId, setActiveQuizCourseId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const contract = await getContract();
        const allCourses = await contract.getAllCourses();
        setCourses(allCourses);

        const storedWallet = localStorage.getItem('wallet');
        const storedRole = localStorage.getItem('role');

        if (storedWallet && storedRole === 'student') {
          setWallet(storedWallet);
          const enrolledIds = await contract.getEnrolledCourses(storedWallet);
          setEnrolled(enrolledIds.map(id => Number(id)));
        } else if (storedWallet && storedRole === 'instructor') {
          setWallet(storedWallet);
        }
      } catch (err) {
        console.error("Course fetch error:", err);
        setStatus(`❌ Failed to load courses: ${err.message}`);
      }
    };

    fetchCourses();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('🦊 MetaMask not detected. Please install it.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const selectedAccount = accounts[0];
      setWallet(selectedAccount);
      localStorage.setItem('wallet', selectedAccount);
      localStorage.setItem('role', 'student');
      toast.success(`🔗 Connected: ${selectedAccount}`);

      const contract = await getContract();
      const enrolledIds = await contract.getEnrolledCourses(selectedAccount);
      setEnrolled(enrolledIds.map(id => Number(id)));
    } catch (err) {
      console.error("Wallet connection error:", err);
      toast.error('❌ Failed to connect wallet.');
    }
  };

  const enrollInCourse = async (courseId, price) => {
    if (!wallet) {
      toast.warning('⚠️ Please connect wallet first.');
      return;
    }

    if (enrolled.includes(courseId)) {
      toast.info('ℹ️ Already enrolled.');
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.enroll(courseId, { value: price });
      await tx.wait();
      toast.success('🎓 Enrolled successfully!');
      setEnrolled([...enrolled, courseId]);
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error('❌ Enrollment failed.');
    }
  };

  const toggleQuizUploader = (courseId) => {
    setQuizVisibility(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const loadQuiz = async (courseId) => {
    try {
      const contract = await getContract();
      const count = await contract.getQuizCount(courseId);
      const hashes = [];
      for (let i = 0; i < count; i++) {
        const hash = await contract.getQuizByIndex(courseId, i);
        hashes.push(hash);
      }

      if (hashes.length === 0) {
        toast.info('ℹ️ No quiz available for this course.');
      } else {
        setActiveQuizCourseId(courseId);
        setActiveQuizHashes(hashes);
      }
    } catch (err) {
      console.error("Quiz fetch error:", err);
      toast.error('❌ Failed to load quiz.');
    }
  };

  return (
    <div className="course-list-container">
      <h3>📚 Available Courses</h3>

      {!wallet && (
        <>
          <p className="login-reminder">⚠️ Please connect wallet to enroll in a course or take quizzes.</p>
          <button className="connect-wallet-button" onClick={connectWallet}>
            🔗 Connect Wallet
          </button>
        </>
      )}

      {courses.length > 0 ? (
        courses.map((course, i) => {
          const courseId = Number(course[0]);
          const courseTitle = course[1];
          const courseDescription = course[2];
          const courseIpfsHash = course[3];
          const coursePrice = course[4];
          const courseInstructor = course[5];

          const alreadyEnrolled = enrolled.includes(courseId);
          const isVisible = quizVisibility[courseId];
          const role = localStorage.getItem('role');

          return (
            <div key={i} className="course-card">
              <h4>{courseTitle}</h4>
              <p>{courseDescription}</p>
              <a
                href={`https://ipfs.io/ipfs/${courseIpfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Course Content
              </a>
              <p>Price: {formatEther(coursePrice)} ETH</p>

              {alreadyEnrolled ? (
                <>
                  <p className="enrolled-badge">✅ Already Enrolled</p>

                  {role === 'instructor' &&
                    wallet?.toLowerCase() === courseInstructor?.toLowerCase() && (
                      <button className="quiz-button" onClick={() => toggleQuizUploader(courseId)}>
                        {isVisible ? '❌ Hide Quiz Uploader' : '📝 Add Quiz'}
                      </button>
                  )}

                  {role === 'student' && (
                    <button className="quiz-button" onClick={() => loadQuiz(courseId)}>
                      🧠 Take Quiz
                    </button>
                  )}

                  {isVisible &&
                    role === 'instructor' &&
                    wallet?.toLowerCase() === courseInstructor?.toLowerCase() && (
                      <div className="quiz-player-wrapper">
                        <h3>🧠 Quiz Section</h3>
                        <QuizUploader courseId={courseId} courseName={courseTitle} />
                      </div>
                  )}

                  {activeQuizHashes.length > 0 &&
                    activeQuizCourseId === courseId &&
                    role === 'student' && (
                      <div className="quiz-player-wrapper">
                        <h3>🧪 Quiz Player</h3>
                        <QuizPlayer ipfsHashes={activeQuizHashes} />
                      </div>
                  )}
                </>
              ) : (
                role === 'student' && (
                  <button
                    className="enroll-button"
                    onClick={() => enrollInCourse(courseId, coursePrice)}
                  >
                    Enroll
                  </button>
                )
              )}
            </div>
          );
        })
      ) : (
        <p>No courses available.</p>
      )}

      <p className="status-message">{status}</p>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

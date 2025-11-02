import React, { useState, useEffect } from 'react';
import { uploadToIPFS } from '../utils/ipfsUpload';
import { getContract } from '../utils/contract';
import { BrowserProvider } from 'ethers';
import '../styles/QuizUploader.css';

export default function QuizUploader() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [status, setStatus] = useState('');
  const [quizHashes, setQuizHashes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedQuiz, setLoadedQuiz] = useState(null);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const contract = await getContract();
        const instructorCourses = await contract.getInstructorCourses();
        setCourses(instructorCourses);
      } catch (err) {
        console.error('Error fetching instructor courses:', err);
        setStatus('❌ Failed to load your courses.');
      }
    };

    fetchInstructorCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) fetchQuizzes();
  }, [selectedCourseId]);

  useEffect(() => {
    if (quizHashes.length > 0) {
      loadQuizFromIPFS(quizHashes[currentIndex]);
    }
  }, [quizHashes, currentIndex]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, '']);

  const submitQuiz = async () => {
    if (!selectedCourseId) {
      setStatus('❌ Please select a course first.');
      return;
    }

    setStatus('Uploading to IPFS...');
    const quizData = { question, options, correctIndex };

    try {
      const ipfsHash = await uploadToIPFS(quizData);
      setStatus(`IPFS hash: ${ipfsHash}`);

      const contract = await getContract();
      const tx = await contract.addQuiz(selectedCourseId, ipfsHash);
      await tx.wait();

      setStatus('✅ Quiz added to blockchain!');
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      setStatus('❌ Error uploading quiz.');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const contract = await getContract();
      const count = await contract.getQuizCount(selectedCourseId);
      const hashes = [];
      for (let i = 0; i < count; i++) {
        const hash = await contract.getQuizByIndex(selectedCourseId, i);
        hashes.push(hash);
      }
      setQuizHashes(hashes);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    }
  };

  const loadQuizFromIPFS = async (hash) => {
    try {
      const res = await fetch(`https://ipfs.io/ipfs/${hash}`);
      const data = await res.json();
      setLoadedQuiz(data);
    } catch (err) {
      console.error('Error loading quiz from IPFS:', err);
    }
  };

  return (
    <div className="quiz-uploader-container">
      <h3>📝 Add Quiz to Your Course</h3>

      <label>Select Course:</label>
      <select
        className="quiz-select"
        value={selectedCourseId}
        onChange={e => setSelectedCourseId(e.target.value)}
      >
        <option value="">-- Select a course --</option>
        {courses.map((course, i) => (
          <option key={i} value={course[0]}>
            {course[1]} (Course #{course[0]})
          </option>
        ))}
      </select>

      {selectedCourseId && (
        <>
          <input
            className="quiz-input"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Question"
          />
          {options.map((opt, i) => (
            <input
              key={i}
              className="quiz-input"
              value={opt}
              onChange={e => handleOptionChange(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
            />
          ))}
          <button className="quiz-button" onClick={addOption}>Add Option</button>
          <select
            className="quiz-select"
            onChange={e => setCorrectIndex(Number(e.target.value))}
            value={correctIndex}
          >
            {options.map((_, i) => (
              <option key={i} value={i}>Correct: Option {i + 1}</option>
            ))}
          </select>
          <button className="quiz-button" onClick={submitQuiz}>Upload Quiz</button>
        </>
      )}

      <p className="quiz-status">{status}</p>

      {quizHashes.length > 0 && loadedQuiz && (
        <div className="quiz-viewer">
          <h4>🧠 Quiz {currentIndex + 1} of {quizHashes.length}</h4>
          <p><strong>Q:</strong> {loadedQuiz.question}</p>
          <ul>
            {loadedQuiz.options.map((opt, i) => (
              <li key={i}>
                {opt} {i === loadedQuiz.correctIndex && <strong>✅</strong>}
              </li>
            ))}
          </ul>
          <div className="quiz-nav-buttons">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              ⬅ Previous
            </button>
            <button
              disabled={currentIndex === quizHashes.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Next ➡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

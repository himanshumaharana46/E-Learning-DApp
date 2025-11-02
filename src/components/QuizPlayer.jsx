import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/QuizPlayer.css';

export default function QuizPlayer({ ipfsHashes }) {
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentHash = Array.isArray(ipfsHashes) ? ipfsHashes[currentIndex] : null;

  useEffect(() => {
    if (!currentHash) return;

    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`https://ipfs.io/ipfs/${currentHash}`);
        setQuiz(res.data);
        setSelected(null);
        setFeedback('');
      } catch (err) {
        console.error('Quiz fetch error:', err);
        setFeedback('❌ Failed to load quiz.');
      }
    };

    fetchQuiz();
  }, [currentHash]);

  const submitAnswer = () => {
    if (selected === null) {
      setFeedback('⚠️ Please select an option.');
      return;
    }

    if (selected === quiz.correctIndex) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. Correct answer: ${quiz.options[quiz.correctIndex]}`);
    }
  };

  if (!Array.isArray(ipfsHashes) || ipfsHashes.length === 0) {
    return <p>⚠️ No quizzes available.</p>;
  }

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="quiz-container">
      <h4>🧠 Question {currentIndex + 1} of {ipfsHashes.length}</h4>
      <p><strong>{quiz.question}</strong></p>

      {quiz.options.map((opt, i) => (
        <div key={i} className="quiz-option">
          <label>
            <input
              type="radio"
              name="quiz"
              value={i}
              checked={selected === i}
              onChange={() => setSelected(i)}
            />
            {opt}
          </label>
        </div>
      ))}

      <button className="quiz-button" onClick={submitAnswer}>Submit</button>
      <p className="quiz-feedback">{feedback}</p>

      <div className="quiz-nav-buttons">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          ⬅ Previous
        </button>
        <button
          disabled={currentIndex === ipfsHashes.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

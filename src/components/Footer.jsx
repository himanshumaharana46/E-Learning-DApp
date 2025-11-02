import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h4>E-learning DApp</h4>
        <p>Empowering learners with blockchain-based certification and decentralized education.</p>
      </div>

      <div className="footer-center">
        <h4>Follow Us</h4>
        <div className="social-icons">
          <a href="https://github.com/your-github-username/your-repo" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" />
          </a>
          <a href="https://twitter.com/your-twitter-handle" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
          </a>
          <a href="https://linkedin.com/in/your-linkedin-id" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" />
          </a>
        </div>
      </div>

      <div className="footer-right">
        <h4>Newsletter</h4>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </footer>
  );
}

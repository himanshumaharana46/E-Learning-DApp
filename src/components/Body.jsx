import React from 'react';
import '../styles/Body.css';

function Body() {
  return (
    <div className="body-container">
      <h2 className="body-heading">Empower Your Learning Journey</h2>

      <div className="body-content">
        {/* Left: Image Carousel */}
        <div className="image-carousel">
          <img
            src="https://th.bing.com/th/id/OIP.rWH4joUf7bRbid8lL6VJ0wHaE8?w=274&h=183"
            alt="Banner 1"
            className="carousel-image img-1"
          />
          <img
            src="https://tse2.mm.bing.net/th/id/OIP.B4ANBlGjDl_jMdSydJCCBwHaFq?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Banner 2"
            className="carousel-image img-2"
          />
          <img
            src="https://softengi.com/wp-content/uploads/2020/12/SE_E-Learning_banner_4-768x512.png"
            alt="Banner 3"
            className="carousel-image img-3"
          />
          <img
            src="https://www.bankbuddy.ai/img/posts_img/Blockchain.png"
            alt="Banner 4"
            className="carousel-image img-4"
          />
        </div>

        {/* Right: Scrolling Text */}
        <div className="body-text">
          <div className="scroll-container">
            <p>
              Our blockchain-powered e-learning platform revolutionizes how knowledge is delivered, verified, and rewarded. 
              Learners can enroll in decentralized courses, interact with smart contracts for transparent certification, and 
              track their progress securely on-chain. With features like NFT-based certificates, interactive quizzes, and 
              modular content delivery, we ensure that education is not only accessible but also verifiable and future-proof. 
              Whether you're diving into smart contract development, exploring DeFi, or mastering Web3 fundamentals, our platform 
              offers a hands-on, immersive experience tailored for both beginners and professionals. Join a global community of 
              learners and educators building the future of education—one block at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;

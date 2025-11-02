import React from 'react';
import { formatEther } from 'ethers';

export default function CourseCard({ course, enrolled, children }) {
  return (
    <div className="course-card">
      <h4>{course.title}</h4>
      <p>{course.description}</p>
      <a
        href={`https://ipfs.io/ipfs/${course.ipfsHash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Course Content
      </a>
      <p>Price: {formatEther(course.price)} ETH</p>
      {enrolled && <p className="enrolled-badge">✅ Already Enrolled</p>}
      {children}
    </div>
  );
}

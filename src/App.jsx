// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import CourseList from './components/CourseList';
import WalletManager from './components/WalletManager'; // ✅ New
import useWalletSession from './hooks/useWalletSession'; // ✅ New
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  useWalletSession(); // ✅ Enforce wallet lock globally

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <WalletManager /> {/* ✅ Wallet connect button */}
              </div>
            </>
          }
        />
        <Route path="/courses" element={<CourseList />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor"
          element={
            <ProtectedRoute role="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

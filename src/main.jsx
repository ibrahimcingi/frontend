import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState,useEffect } from 'react';

import DashBoardPage from './DashBoard.jsx';

import ReactDOM from "react-dom/client";
import { UserProvider } from '../context/UserContext.jsx';



import { LoginPage } from './LoginPage.jsx';
import { RegisterPage } from './RegisterPage.jsx';
import { ForgotPasswordPage } from './ResetPassword.jsx';
import { WordPressConnectionPage } from './WordpressConnection.jsx';
import { BlogHistoryPage } from './BlogHistoryPage.jsx';
import { SettingsPage } from './SettingsPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';





function App() {
  return (
    <Routes>
      {/* Public routes */}

      <Route
        path="/login"
        element={
          <UserProvider>
              <LoginPage />
          </UserProvider>
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resetPassword" element={<ForgotPasswordPage />} />

      {/* Protected routes */}

      <Route
        path="/"
        element={
          <UserProvider>
            <ProtectedRoute>
              <DashBoardPage />
            </ProtectedRoute>
          </UserProvider>
        }
      />
      <Route
        path="/wordpressConnection"
        element={
          <UserProvider>
            <ProtectedRoute>
              <WordPressConnectionPage />
            </ProtectedRoute>
          </UserProvider>
        }
      />
      <Route
        path="/BlogHistory"
        element={
          <UserProvider>
            <ProtectedRoute>
              <BlogHistoryPage />
            </ProtectedRoute>
          </UserProvider>
        }
      />
      <Route
        path="/settings"
        element={
          <UserProvider>
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          </UserProvider>
        }
      />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
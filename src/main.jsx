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





function App() {
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage  />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resetPassword" element={<ForgotPasswordPage />} />
      <Route path="/wordpressConnection" element={<WordPressConnectionPage />} />
      <Route path="/BlogHistory" element={<BlogHistoryPage  />} />
      <Route path="/settings" element={<SettingsPage  />} />
      <Route path="/"element={ <DashBoardPage />}
      />
    </Routes>
  );

  
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <BrowserRouter>
  <UserProvider>
    <App />
  </UserProvider>
  </BrowserRouter>
  </React.StrictMode>
);

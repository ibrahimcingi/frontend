import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from './App.jsx';

import ReactDOM from "react-dom/client";
import React  from "react";

import { LoginPage } from './LoginPage.jsx';
import { RegisterPage } from './RegisterPage.jsx';
import { ForgotPasswordPage } from './ResetPassword.jsx';
import { WordPressConnectionPage } from './WordpressConnection.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resetPassword" element={<ForgotPasswordPage />} />
      <Route path="/wordpressConnection" element={<WordPressConnectionPage />} />
      <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );

  
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

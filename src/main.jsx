import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState,useEffect } from 'react';

import DashBoardPage from './DashBoard.jsx';

import ReactDOM from "react-dom/client";


import { LoginPage } from './LoginPage.jsx';
import { RegisterPage } from './RegisterPage.jsx';
import { ForgotPasswordPage } from './ResetPassword.jsx';
import { WordPressConnectionPage } from './WordpressConnection.jsx';
import { BlogHistoryPage } from './BlogHistoryPage.jsx';

import { useNavigate,useLocation } from "react-router-dom";



function App() {
  const [email,setEmail]=useState()
  const [name,setName]=useState()
  const [wordpressUrl,setWordpressUrl]=useState()
  const [categories,setCategories]=useState([])
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const navigate=useNavigate()

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://autonomous-blog-app-9oron.ondigitalocean.app/api/users/me', {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok && data.user) {
        console.log('✅ Successfully fetched user data');
          setEmail(data.user.email);
          setName(data.user.name);
          setWordpressUrl(data.user.wordpressUrl);
          setCategories(data.user.categories);
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error("❌ User fetch error:", error);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [location.pathname,wordpressUrl]);
  
  
  if (isLoading) return <p className="text-center mt-10">⏳ Loading user data...</p>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage  />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resetPassword" element={<ForgotPasswordPage />} />
      <Route path="/wordpressConnection" element={<WordPressConnectionPage />} />
      <Route path="/BlogHistory" element={<BlogHistoryPage wordpressUrl={wordpressUrl} Usercategories={categories} name={name} email={email} />} />
      <Route
        path="/"
        element={
          <DashBoardPage
            name={name}
            email={email}
            wordpressUrl={wordpressUrl}
            categories={categories}
          />
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

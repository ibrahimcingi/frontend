// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user,loading } = useUser();
    if (!loading){
      if (!user) return <Navigate to="/login" replace />;
      return children;

    } 
   

}

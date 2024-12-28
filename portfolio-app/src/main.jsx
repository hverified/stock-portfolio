import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <AuthProvider>  {/* Wrap the app with AuthProvider */}
    <App />
  </AuthProvider>
);

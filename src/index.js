import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1035965460197-fingmcmt79qnhidf5j3iiubdb7ge2tas.apps.googleusercontent.com">
      <BrowserRouter future={{ 
        v7_relativeSplatPath: true,
        v7_startTransition: true 
      }}>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
); 
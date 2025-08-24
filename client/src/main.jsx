import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import Hardening from './utils/hardening.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Hardening />
    <App />
  </React.StrictMode>
);

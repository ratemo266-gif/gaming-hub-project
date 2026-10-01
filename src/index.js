import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const loader = document.getElementById('initial-loader');
if (loader) {
  loader.classList.add('hidden');
  setTimeout(() => loader.remove(), 400);
}
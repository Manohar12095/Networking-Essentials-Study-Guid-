import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/bricolage-grotesque';
import '@fontsource/source-serif-4';
import '@fontsource/jetbrains-mono';
import App from './App.tsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

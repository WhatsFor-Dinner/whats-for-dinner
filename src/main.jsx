import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.jsx';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error("Could not find #root element to mount React");

const root = createRoot(rootEl);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

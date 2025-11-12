import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/homePage/Home.jsx';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error("Could not find #root element to mount React");

const root = createRoot(rootEl);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

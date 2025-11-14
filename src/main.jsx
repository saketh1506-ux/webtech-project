import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.jsx';
import GetStarted from './components/GetStarted.jsx';
import Builder from './components/Builder.jsx';
import MyPlan from './components/MyPlan.jsx';
import Score from './components/Score.jsx';
import Courses from './components/Courses.jsx';
import { Navigate } from 'react-router-dom';
import './styles/style.css';
import './styles/builder.css';
import './styles/getstarted.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/myplan" element={<MyPlan />} />
        <Route path="/score" element={<Score />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

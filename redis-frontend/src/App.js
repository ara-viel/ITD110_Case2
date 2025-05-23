import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Dash from './Dash';
import Officials from './Officials';
import Disaster from './Disaster';
import About from './About';
import CsvUpload from './CsvUpload';
import Certificate from './Certificate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/officials" element={<Officials />} />
        <Route path="/disaster" element={<Disaster />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload-csv" element={<CsvUpload />} />
        <Route path="/certificate" element={<Certificate />} />


      </Routes>
    </Router>
  );
}

export default App;

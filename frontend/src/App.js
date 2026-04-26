import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import VolunteerSignup from './pages/VolunteerSignup';
import VolunteerMatch from './pages/VolunteerMatch';
import Reports from './pages/Reports';
import Insights from './pages/Insights';
import './styles/global.css';
 
function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1a2e',
            color: '#e2e8f0',
            border: '1px solid rgba(99,179,237,0.2)',
            borderRadius: '12px',
            fontFamily: 'DM Sans, sans-serif',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadReport />} />
          <Route path="volunteer" element={<VolunteerSignup />} />
          <Route path="match" element={<VolunteerMatch />} />
          <Route path="reports" element={<Reports />} />
          <Route path="insights" element={<Insights />} />
        </Route>
      </Routes>
    </Router>
  );
}
 
export default App;
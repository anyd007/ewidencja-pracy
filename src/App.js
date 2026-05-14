import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeePanel from './pages/EmployeePanel';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import './styles/App-container.scss';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Widok główny dla pracowników */}
          <Route path="/" element={<EmployeePanel />} />

          {/* Logowanie dla właściciela */}
          <Route path="/login" element={<Login />} />

          {/* Panel zarządzania - docelowo zabezpieczony */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



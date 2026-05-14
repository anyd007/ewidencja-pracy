import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';

// Komponenty
import EmployeePanel from './pages/EmployeePanel';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import Loader from './components/Loader';

import './styles/App-container.scss';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Słuchacz stanu zalogowania
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      // Firebase traktuje usera jako zalogowanego nawet bez maila,
      // ale my w Login.js robimy signOut() jeśli nie ma weryfikacji.
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loader message="Inicjalizacja aplikacji..." />;
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Widok główny dla pracowników - dostępny dla każdego */}
          <Route path="/" element={<EmployeePanel />} />

          {/* Rejestracja i Logowanie */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* 
            Zabezpieczony Panel Admina.
            Wpuszczamy tylko jeśli:
            1. User jest zalogowany (user != null)
            2. Mail jest zweryfikowany (user.emailVerified === true)
          */}
          <Route 
            path="/admin" 
            element={
              user && user.emailVerified ? (
                <AdminPanel />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Catch-all: Przekierowanie nieznanych adresów na stronę główną pracownika */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
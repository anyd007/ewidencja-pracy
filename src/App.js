import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";

import EmployeePanel from "./pages/EmployeePanel";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import Loader from "./components/Loader";

import "./styles/App-container.scss";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
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

          {/* 👷 kiosk pracownika */}
          <Route path="/" element={<EmployeePanel />} />

          {/* 🔐 login admina */}
          <Route
            path="/admin"
            element={
              user ? <Navigate to="/admin/dashboard" /> : <AdminLogin />
            }
          />

          {/* 🧑‍💼 panel admina */}
          <Route
            path="/admin/dashboard"
            element={
              user && user.emailVerified ? (
                <AdminPanel />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
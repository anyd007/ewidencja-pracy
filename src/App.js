import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import EmployeePanel from "./pages/EmployeePanel";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import Loader from "./components/Loader";

import "./styles/App-container.scss";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        const userRole = snap.exists() ? snap.data().role : null;

        setUser(currentUser);
        setRole(userRole);
      } catch (error) {
        console.error("Role fetch error:", error);
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Czekamy na załadowanie stanu Auth z Firebase
  if (loading) {
    return <Loader message="Inicjalizacja aplikacji..." />;
  }
  

  // 2. Jeśli user się zalogował, ale wciąż czekamy na pobranie roli z Firestore, blokujemy renderowanie tras
  if (user && role === null) {
    return <Loader message="Sprawdzanie uprawnień..." />;
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 👷 kiosk pracownika */}
          <Route path="/" element={<EmployeePanel />} />

         

          {/* 🔐 admin login - jeśli zalogowany i ma rolę, przekieruj od razu do dashboardu */}
          <Route 
            path="/admin" 
            element={
              user && (role === "owner" || role === "admin") ? (
                <Navigate to="/admin/dashboard/*" replace />
              ) : (
                <AdminLogin />
              )
            } 
          />

          {/* 🧑‍💼 admin panel (ZABEZPIECZONY ROLE) - TYLKO JEDEN ROUTE */}
          <Route
            path="/admin/dashboard/*"
            element={
              user && (role === "owner" || role === "admin") ? (
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
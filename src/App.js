import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import EmployeePanel from "./pages/EmployeePanel";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import Loader from "./components/Loader";

import "./styles/App-container.scss";

// Poprawiony komponent chroniący ścieżki admina
const AdminRoute = ({ children }) => {
  const { user, loading, role } = useAuth(); // Usunięto nieistniejące isAdmin

  if (loading) {
    return <Loader message="Sprawdzanie dostępu..." />;
  }

  // Sprawdzamy, czy użytkownik jest zalogowany oraz czy jego rola to admin/owner
  const hasAdminAccess = role === "admin" || role === "owner";

  if (!user || !hasAdminAccess) {
    // Jeśli nie ma uprawnień, wyrzuć do ekranu logowania
    return <Navigate to="/admin" replace />;
  }

  // Jeśli wszystko jest ok, wyświetlamy zawartość (AdminPanel)
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            {/* 👷 kiosk pracownika */}
            <Route path="/" element={<EmployeePanel />} />

            {/* 🔐 login admin */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* 🧑‍💼 panel admin (chroniony rolą) */}
            <Route
              path="/admin/dashboard/*"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
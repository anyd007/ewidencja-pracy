import React from "react";
// import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = async () => {
  await logout();
  navigate("/admin", { replace: true });
};
 

  return (
    <div className="settings">
      <h2>Ustawienia dla konta {user.email}</h2>
      <div className="settings-logout">
        <button onClick={handleLogout}>wyloguj się</button>
      </div>
    </div>
  );
};

export default AdminSettings;

import React from "react";
// import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminSettings = ({ user }) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      console.log("Wylogowanie udane");
      navigate("/admin", { replace: true });
    } catch (error) {
      console.log("Nie udało się wylogować", error);
    }
  };

  return (
    <div className="settings">
      <h2>Ustawienia dla konta {user.email}</h2>
      <div className="settings-logout">
        <button onClick={handleLogOut}>wyloguj się</button>
      </div>
    </div>
  );
};

export default AdminSettings;

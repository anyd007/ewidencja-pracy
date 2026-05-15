import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import InfoModal from "../components/InfoModal";
import "../styles/AdminLogin.scss";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modalConfig, setModalConfig] = useState({
    message: "",
    type: ""
  });

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    await signInWithEmailAndPassword(auth, email, password);

    setModalConfig({
      message: "Logowanie udane! Przekierowywanie...",
      type: "success"
    });

    navigate("/admin/dashboard");

  } catch (error) {
    setModalConfig({
      message: "Nieprawidłowy email lub hasło",
      type: "error"
    });
  }
};

  return (
    <div className="admin-login">

      <div className="admin-login__card">
        <h1 className="admin-login__title">Panel Administratora</h1>
        <p className="admin-login__subtitle">Dostęp tylko dla autoryzowanych użytkowników</p>

        <form className="admin-login__form" onSubmit={handleLogin}>
          <input
            className="admin-login__input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="admin-login__input"
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="admin-login__button" type="submit">
            Zaloguj się
          </button>
        </form>
      </div>

      <InfoModal
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ message: "", type: "" })}
      />

    </div>
  );
};

export default AdminLogin;
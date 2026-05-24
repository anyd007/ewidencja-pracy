import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import InfoModal from "../components/InfoModal";
import "../styles/AdminLogin.scss";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState({
    message: "",
    type: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setModalConfig({
        message: "Logowanie udane! Przekierowywanie...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2500);

    } catch (error) {
      setModalConfig({
        message: "Nieprawidłowy email lub hasło",
        type: "error",
      });
    }
  };

  

  const handleResetPassword = async () => {
  if (!email) {
    setModalConfig({
      message: "W polu Email podaj swój mail do logowania, aby zresetować hasło.",
      type: "error"
    });
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    setModalConfig({
      message: "Wysłano link do resetu hasła na podany email.",
      type: "success"
    });

  } catch (error) {
    setModalConfig({
      message: "Nie udało się wysłać maila resetującego.",
      type: "error"
    });
  }
};

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">Panel Administratora</h1>
        <p className="admin-login__subtitle">
          Dostęp tylko dla autoryzowanych użytkowników
        </p>

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
          <button
            type="button"
            className="admin-login__forgot"
            onClick={handleResetPassword}
          >
            Nie pamiętam hasła
          </button>
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

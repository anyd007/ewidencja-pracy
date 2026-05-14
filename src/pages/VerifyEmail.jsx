import React, { useState } from "react";
import { auth } from "../firebase";
import InfoModal from "../components/InfoModal";
import Loader from "../components/Loader";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ message: "", type: "" });
  const user = auth.currentUser;

  const resendEmail = async () => {
    setLoading(true);
    try {
      await user.sendEmailVerification();
      setModal({ message: "Link został wysłany ponownie na Twój e-mail.", type: "success" });
    } catch (error) {
      setModal({ message: "Błąd: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader message="Wysyłanie..." />}
      
      <div className="login-card">
        <h1>Potwierdź swój e-mail</h1>
        <div className="verification-icon">📧</div>
        <p>
          Na Twój adres <strong>{user?.email}</strong> wysłaliśmy link aktywacyjny. 
          Kliknij w niego, aby uzyskać dostęp do panelu administratora.
        </p>
        
        <div className="btn-group">
          <button className="login-btn" onClick={resendEmail}>
            Wyślij link ponownie
          </button>
          <button className="modal-btn secondary" onClick={() => auth.signOut()}>
            Wróć do logowania
          </button>
        </div>
      </div>

      <InfoModal 
        message={modal.message} 
        type={modal.type} 
        onClose={() => setModal({ message: "", type: "" })} 
      />
    </div>
  );
};

export default VerifyEmail;
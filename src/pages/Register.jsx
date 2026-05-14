import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Importujemy db (Firestore)
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import InfoModal from '../components/InfoModal';
import '../styles/Login.scss';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: '', type: '' });
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sprawdzenie białej listy w Firestore ZANIM utworzymy konto
      const doc = await db.collection('config').doc('admin_access').get();
      
      if (!doc.exists) {
        throw new Error("Błąd konfiguracji systemu. Skontaktuj się z administratorem.");
      }

      const allowedEmails = doc.data().allowed_emails;

      // Jeśli wpisanego maila nie ma na liście w bazie
      if (!allowedEmails || !allowedEmails.includes(email)) {
        setModal({
          show: true,
          message: 'Podany e-mail nie znajduje się na liście dozwolonych użytkowników. Skontaktuj się z administratorem systemu.',
          type: 'error'
        });
        setLoading(false);
        return; // Zatrzymujemy proces rejestracji
      }

      // 2. Jeśli e-mail jest na liście, tworzymy konto w Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      
      // 3. Wysyłanie linku weryfikacyjnego
      await userCredential.user.sendEmailVerification();
      
      setModal({
        show: true,
        message: 'Konto administratora zostało wstępnie utworzone! Sprawdź pocztę i kliknij w link aktywacyjny, aby móc się zalogować.',
        type: 'success'
      });

    } catch (error) {
      let errorMsg = 'Wystąpił błąd podczas rejestracji.';
      if (error.code === 'auth/email-already-in-use') errorMsg = 'Ten e-mail jest już zarejestrowany.';
      if (error.code === 'auth/weak-password') errorMsg = 'Hasło musi mieć co najmniej 6 znaków.';
      
      setModal({ show: true, message: errorMsg || error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    const wasSuccess = modal.type === 'success';
    setModal({ show: false, message: '', type: '' });
    if (wasSuccess) {
      navigate('/login');
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader message="Weryfikacja uprawnień..." />}
      
      <form className="login-card" onSubmit={handleRegister}>
        <h1>Rejestracja Admina</h1>
        <p className="subtitle">Dostęp tylko dla uprawnionych adresów e-mail.</p>
        
        <div className="input-group">
          <label>Adres E-mail</label>
          <input 
            type="email" 
            placeholder="Wpisz dozwolony e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label>Hasło (min. 6 znaków)</label>
          <input 
            type="password" 
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="login-btn">
          Zarejestruj się
        </button>

        <p className="footer-text" onClick={() => navigate('/login')}>
          Masz już konto? Zaloguj się
        </p>
      </form>

      {modal.show && (
        <InfoModal 
          message={modal.message} 
          type={modal.type} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default Register;
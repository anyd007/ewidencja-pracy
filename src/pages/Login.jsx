import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import InfoModal from '../components/InfoModal';
import '../styles/Login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: '', type: '' });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Logowanie
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // 2. Sprawdzenie białej listy w Firestore
      const doc = await db.collection('config').doc('admin_access').get();
      const allowedEmails = doc.data()?.allowed_emails || [];

      if (!allowedEmails.includes(user.email)) {
        await auth.signOut();
        setModal({
          show: true,
          message: 'Brak uprawnień administratora dla tego konta.',
          type: 'error'
        });
        return;
      }

      // 3. Sprawdzenie weryfikacji maila (bez ponownego wysyłania)
      if (!user.emailVerified) {
        await auth.signOut(); // Wylogowujemy, bo nie potwierdził maila
        setModal({
          show: true,
          message: 'Twój adres e-mail nie został jeszcze zweryfikowany. Kliknij w link wysłany podczas rejestracji.',
          type: 'error'
        });
        return;
      }

      // Jeśli wszystko OK
      navigate('/admin');

    } catch (error) {
      let errorMsg = 'Błąd logowania.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMsg = 'Niepoprawny e-mail lub hasło.';
      }
      setModal({ show: true, message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader message="Logowanie..." />}
      
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Panel Admina</h1>
        <p className="subtitle">Zaloguj się do panelu zarządzania</p>
        
        <div className="input-group">
          <label>E-mail</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label>Hasło</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="login-btn">Zaloguj się</button>

        <p className="footer-text" onClick={() => navigate('/register')}>
          Załóż konto administratora
        </p>
      </form>

      {modal.show && (
        <InfoModal 
          message={modal.message} 
          type={modal.type} 
          onClose={() => setModal({ show: false, message: '', type: '' })} 
        />
      )}
    </div>
  );
};

export default Login;
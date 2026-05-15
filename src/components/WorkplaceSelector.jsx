import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Loader from './Loader'; // 1. Zaimportuj swój nowy Loader
import '../styles/WorkplaceSelector.scss';

const WorkplaceSelector = ({ employee, onSelect, onBack }) => {
  const [workplaces, setWorkplaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection("workplaces")
      .where("isActive", "==", true)
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWorkplaces(list);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loader message="Loading sites..." />;

  return (
    <div className="workplace-selector">
      <header>
        <h1>Witaj, {employee.firstName}!</h1>
        <p>Wybierz swoje miejsce pracy na dziś:</p>
      </header>

      <div className="tiles-grid">
        {workplaces.map((wp) => (
          <button 
            key={wp.id} 
            className="workplace-tile"
            onClick={() => onSelect(wp)}
          >
            <strong>{wp.name}</strong>
            <span>{wp.address}</span>
          </button>
        ))}
      </div>

      <button className="back-link" onClick={onBack}>
        ← To nie Ty? Wróć do wyboru pracownika
      </button>
    </div>
  );
};

export default WorkplaceSelector;
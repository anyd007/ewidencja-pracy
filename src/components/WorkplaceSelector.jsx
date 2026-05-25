import React from 'react';
import { useWorkplaces } from "../hooks/useWorkplaces";
import Loader from './Loader'; // 1. Zaimportuj swój nowy Loader
import '../styles/WorkplaceSelector.scss';

const WorkplaceSelector = ({ employee, onSelect, onBack }) => {
  const { workplaces, loading } = useWorkplaces();


  if (loading) return <Loader message="Wczytywanie strony..." />;

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
import React, { useState } from 'react';
import '../styles/TimeEntry.scss';

const TimeEntry = ({ employee, workplace, onSubmit, onBack }) => {
  // Domyślnie ustawiamy dzisiejszą datę
  const today = new Date().toISOString().split('T')[0];
  
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("15:00");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ date, startTime, endTime });
  };

  return (
    <div className="time-entry">
      <header>
        <h1>Wprowadź czasy pracy</h1>
        <p>{employee.firstName} {employee.lastName}</p>
        <p>{workplace.name}</p>
      </header>

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="input-group">
          <label>Data</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>

        <div className="time-row">
          <div className="input-group">
            <label>Od</label>
            <input 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Do</label>
            <input 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              required 
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Zapisz wpis</button>
      </form>

      <button className="back-link" onClick={onBack}>← Zmień miejsce pracy</button>
    </div>
  );
};

export default TimeEntry;
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
        <h1>Work Hours</h1>
        <p>{employee.firstName} {employee.lastName}</p>
        <p>{workplace.name}</p>
      </header>

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="input-group">
          <label>Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>

        <div className="time-row">
          <div className="input-group">
            <label>From</label>
            <input 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>To</label>
            <input 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              required 
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Save Log</button>
      </form>

      <button className="back-link" onClick={onBack}>← Change workplace</button>
    </div>
  );
};

export default TimeEntry;
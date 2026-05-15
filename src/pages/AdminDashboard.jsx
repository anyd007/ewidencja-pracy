import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

import "../styles/AdminDashboard.scss";

const AdminDashboard = () => {
  const [entries, setEntries] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  // 📅 Dodany stan dla wybranej daty (domyślnie dzisiaj)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Pobieranie wpisów czasu
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "timeEntries"), (snap) => {
      setEntries(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Pobieranie listy pracowników
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snap) => {
      setEmployees(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // 🎯 Logika Filtrowania
  const filteredEntries = entries.filter((e) => {
    // Filtr daty (jeśli wyczyszczone, pokazuje wszystko)
    const matchDate = selectedDate ? e.date === selectedDate : true;

    const matchEmployee = selectedEmployee
      ? e.employeeId === selectedEmployee
      : true;

    const matchWorkplace = selectedWorkplace
      ? e.workplaceId === selectedWorkplace
      : true;

    return matchDate && matchEmployee && matchWorkplace;
  });

  // 🕒 Obliczanie łącznej liczby godzin dla przefiltrowanych wpisów
  const totalHours = filteredEntries.reduce((acc, e) => {
    if (!e.startTime || !e.endTime) return acc;

    // Proste obliczenie na godzinach (można rozbudować o minuty)
    const start = parseInt(e.startTime.split(":")[0]);
    const end = parseInt(e.endTime.split(":")[0]);
    const diff = end - start;

    return acc + (diff > 0 ? diff : 0);
  }, 0);

  // Pobieranie unikalnych miejsc pracy z wpisów dla selecta
  const uniqueWorkplaces = [...new Set(entries.map((e) => e.workplaceId))]
    .map(id => {
      const entry = entries.find(e => e.workplaceId === id);
      return { id, name: entry?.workplaceName || "Nieznane miejsce" };
    });

  return (
    <div className="dashboard">
      <h1>📊 Panel główny</h1>

      {/* KARTY PODSUMOWANIA */}
      <div className="cards">
        <div className="card">
          <h3>👷 Pracownicy</h3>
          <p>{employees.length}</p>
        </div>

        <div className="card">
          <h3>⏱ Wpisy</h3>
          <p>{filteredEntries.length}</p>
        </div>

        <div className="card">
          <h3>🕒 Suma Godzin</h3>
          <p>{totalHours}h</p>
        </div>
      </div>

      {/* SEKCJA FILTRÓW */}
      <div className="filters">
        <div className="filter-group">
          <label>Data:</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
          <button className="clear-btn" onClick={() => setSelectedDate("")}>Wszystkie daty</button>
        </div>

        <div className="filter-group">
          <label>Pracownik:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Wszyscy pracownicy</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Budowa:</label>
          <select
            value={selectedWorkplace}
            onChange={(e) => setSelectedWorkplace(e.target.value)}
          >
            <option value="">Wszystkie miejsca</option>
            {uniqueWorkplaces.map((wp) => (
              <option key={wp.id} value={wp.id}>
                {wp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTA WPISÓW */}
      <div className="section">
        <h2>📋 Wyniki wyszukiwania</h2>

        {filteredEntries.length === 0 ? (
          <p className="empty">Brak wpisów dla wybranych kryteriów</p>
        ) : (
          <div className="list-container">
            {filteredEntries
              .sort((a, b) => b.date.localeCompare(a.date)) // Sortowanie od najnowszych
              .map((e) => (
                <div key={e.id} className="list-item">
                  <div className="left">
                    <strong>{e.employeeName}</strong>
                    <span>{e.workplaceName}</span>
                  </div>

                  <div className="right">
                    <small className="date">{e.date}</small>
                    <div className="time-range">
                      {e.startTime} - {e.endTime || "w trakcie"}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
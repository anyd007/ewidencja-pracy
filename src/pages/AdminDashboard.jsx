import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

import "../styles/AdminDashboard.scss";

const AdminDashboard = () => {
  const [entries, setEntries] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "timeEntries"), (snap) => {
      setEntries(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snap) => {
      setEmployees(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  // 📅 tylko dziś
  const todayEntries = entries.filter((e) => e.date === today);

  // 🎯 FILTR
  const filteredEntries = todayEntries.filter((e) => {
    const matchEmployee = selectedEmployee
      ? e.employeeId === selectedEmployee
      : true;

    const matchWorkplace = selectedWorkplace
      ? e.workplaceId === selectedWorkplace
      : true;

    return matchEmployee && matchWorkplace;
  });

  // 🕒 godziny
  const totalHoursToday = filteredEntries.reduce((acc, e) => {
    if (!e.startTime || !e.endTime) return acc;

    const start = parseInt(e.startTime.split(":")[0]);
    const end = parseInt(e.endTime.split(":")[0]);

    return acc + (end - start);
  }, 0);

  // 📅 format daty (ładny PL)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);

    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard">
      <h1>📊 Panel główny</h1>

      {/* KARTY */}
      <div className="cards">
        <div className="card">
          <h3>👷 Pracownicy</h3>
          <p>{employees.length}</p>
        </div>

        <div className="card">
          <h3>⏱ Wpisy (po filtrze)</h3>
          <p>{filteredEntries.length}</p>
        </div>

        <div className="card">
          <h3>🕒 Godziny (po filtrze)</h3>
          <p>{totalHoursToday}h</p>
        </div>
      </div>

      {/* FILTRY */}
      <div className="filters">
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

        <select
          value={selectedWorkplace}
          onChange={(e) => setSelectedWorkplace(e.target.value)}
        >
          <option value="">Wszystkie miejsca</option>

          {[...new Set(entries.map((e) => e.workplaceId))].map((id) => {
            const name = entries.find(
              (e) => e.workplaceId === id
            )?.workplaceName;

            return (
              <option key={id} value={id}>
                {name}
              </option>
            );
          })}
        </select>
      </div>

      {/* LISTA */}
      <div className="section">
        <h2>📋 Wpisy</h2>

        {filteredEntries.length === 0 ? (
          <p className="empty">Brak danych</p>
        ) : (
          filteredEntries
            .slice(-10)
            .reverse()
            .map((e) => (
              <div key={e.id} className="list-item">
                <div className="left">
                  <strong>{e.employeeName}</strong>
                  <span>{e.workplaceName}</span>
                </div>

                <div className="right">
                  <small className="date">
                    {formatDate(e.date)}
                  </small>
                  {e.startTime} - {e.endTime || "w trakcie"}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
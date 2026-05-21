import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import Loader from "../components/Loader";
import "../styles/AdminTimeEntries.scss";

const AdminTimeEntries = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // 🔥 Firestore - tylko employeeId
  useEffect(() => {
    //   if (!employee?.id) return;

    setLoading(true);

    const q = query(
      collection(db, "timeEntries"),
      // where("employeeId", "==", employee.id),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDetails(data);
        setLoading(false);
      },
      (err) => {
        console.error("Błąd pobierania danych:", err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const workplaces = useMemo(() => {
    const unique = new Map();

    details.forEach((d) => {
      unique.set(d.workplaceId, d.workplaceName);
    });

    return Array.from(unique, ([id, name]) => ({
      id,
      name,
    }));
  }, [details]);

  const employees = useMemo(() => {
    const unique = new Map();

    details.forEach((d) => {
      unique.set(d.employeeId, {
        firstName: d.firstName,
        lastName: d.lastName,
      });
    });

    return Array.from(unique, ([id, data]) => ({
      id,
      ...data,
    }));
  }, [details]);

  // 🔥 filtr + sort (React)
  const filteredDetails = useMemo(() => {
    let result = [...details];

    // filtr daty
    if (from) {
      result = result.filter((item) => item.date >= from);
    }

    if (to) {
      result = result.filter((item) => item.date <= to);
    }

    if (selectedWorkplace) {
      result = result.filter((item) => item.workplaceId === selectedWorkplace);
    }

    if (selectedEmployee) {
      result = result.filter((item) => item.employeeId === selectedEmployee);
    }

    // sortowanie (najnowsze na górze)
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [details, from, to, selectedWorkplace, selectedEmployee]);

  const hasData = filteredDetails.length > 0;

  return (
    <div className="time-entries">
      {loading && <Loader message="Pobieranie danych pracownika..." />}

      <h2>Czas pracy</h2>

      {/* FILTRY ZAWSZE WIDOCZNE */}
      <div className="filters-wrapper">
        <div className="filters-date">
          <input
            className="filters-input"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />

          <input
            className="filters-input"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <button className="reset-btn"
          onClick={() => { setFrom(""); setTo(""); }}>reset dat</button>
        </div>

        <div className="filters-pleace">
          <div className="filters-group">
            <label>Miejsce pracy</label>

            <select
              className="filter-pleace-select"
              value={selectedWorkplace}
              onChange={(e) => setSelectedWorkplace(e.target.value)}
            >
              <option value="">Wszystkie miejsca</option>

              {workplaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filters-group">
            <label>Pracownicy</label>

            <select
              className="filter-pleace-select"
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
        </div>
      </div>

      {/* STANY DANYCH */}
      {!loading && details.length === 0 ? (
        <p>Brak danych do wyświetlenia</p>
      ) : !loading && !hasData ? (
        <h3>Brak danych w wybranym zakresie</h3>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Imię Nazwisko</th>
                <th>Miejsce pracy</th>
                <th>Data</th>
                <th>Godziny Od - Do</th>
              </tr>
            </thead>

            <tbody>
              {filteredDetails.map((detail) => (
                <tr key={detail.id}>
                  <td>
                    {detail.firstName} {detail.lastName}
                  </td>
                  <td>{detail.workplaceName}</td>
                  <td>{detail.date}</td>
                  <td>
                    {detail.startTime} - {detail.endTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTimeEntries;

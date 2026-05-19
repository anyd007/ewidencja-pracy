import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Loader from "../../components/Loader";
import "../../styles/EmployeeInfo.scss";

const EmployeeInfo = ({ employee }) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // 🔥 Firestore - tylko employeeId
  useEffect(() => {
    if (!employee?.id) return;

    setLoading(true);

    const q = query(
      collection(db, "timeEntries"),
      where("employeeId", "==", employee.id),
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
  }, [employee.id]);

  
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
      result = result.filter(
        (item) => item.workplaceId === selectedWorkplace);
    }

    // sortowanie (najnowsze na górze)
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [details, from, to, selectedWorkplace]);

  const hasData = filteredDetails.length > 0;
   console.log(selectedWorkplace);
  return (
    <div className="details">
      {loading && <Loader message="Pobieranie danych pracownika..." />}

      <h2>Informacje o pracowniku</h2>

      <h3>
        {employee.firstName} {employee.lastName}
      </h3>

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
        </div>
        <div className="filters-pleace">
          <label>miejsce pracy</label><br />
          <select
            className="filter-pleace-select"
            value={selectedWorkplace}
            onChange={(e) => setSelectedWorkplace(e.target.value)}
          >
            <option value="">Wszytkie miejsca</option>
            {workplaces.map((w) =>(
                <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
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
                <th>Miejsce pracy</th>
                <th>Data</th>
                <th>Start</th>
                <th>Koniec</th>
              </tr>
            </thead>

            <tbody>
              {filteredDetails.map((detail) => (
                <tr key={detail.id}>
                  <td>{detail.workplaceName}</td>
                  <td>{detail.date}</td>
                  <td>{detail.startTime}</td>
                  <td>{detail.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeInfo;

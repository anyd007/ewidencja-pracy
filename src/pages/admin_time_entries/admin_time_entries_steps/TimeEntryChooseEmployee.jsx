import { useState } from "react";
import { useEmployees } from "../../../hooks/useEmployees";
import Loader from "../../../components/Loader";

import "../../../styles/TimeEntryChooseEmployee.scss";
const TimeEntryChooseEmployee = ({
  newTimeEntry,
  setNewTimeEntry,
  setMode,
}) => {
  const { employees, loading } = useEmployees();
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );


  return (
    <div className="employees">
      {loading && <Loader message="Pobieranie danych..." />}
      <h3>wybierz pracownika:</h3>
      <input
        type="text"
        placeholder="Szukaj po nazwie pracownika..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="employees-list">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="employee-card">
            <div className="employee-card__top">
              <div className="employee-card__logo">
                Remont<span>ER</span>
              </div>
            </div>

            <div className="employee-card__content">
              <h3 className="employee-card__name full-name">
                {emp.firstName} {emp.lastName}
              </h3>

              <button className="employee-card__button">wybierz...</button>
            </div>
          </div>
        ))}
      </div>

      <button className="back-btn" onClick={() => setMode("workplace")}>
        wróć do wyboru miejsca
      </button>
    </div>
  );
};

export default TimeEntryChooseEmployee;

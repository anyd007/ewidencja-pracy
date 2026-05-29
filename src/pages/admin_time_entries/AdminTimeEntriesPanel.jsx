import React, { useState } from "react";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useEmployees } from "../../hooks/useEmployees";
import { useWorkplaces } from "../../hooks/useWorkplaces";
import Loader from "../../components/Loader";
import "../../styles/AdminTimeEntriesPanel.scss";
import TimeEntryChooseWorkplace from "./admin_time_entries_steps/TimeEntryChooseWorkplace";
import TimeEntryFilters from "./TimeEntryFilters";

const AdminTimeEntries = () => {
  const [mode, setMode] = useState("list");

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    employeeId: "",
    workplaceId: "",
  });

  const { data, loading } = useTimeEntries(filters);
  const { employees } = useEmployees();
  const {workplaces} = useWorkplaces();

  const handleCloseAddModal = () => {
    setMode("list");
  };

  return (
    <div className="time-entries">

      {mode === "add" && (
        <TimeEntryChooseWorkplace onClose={handleCloseAddModal} />
      )}

      {mode === "list" && (
        <>
          {loading && (
            <Loader message="Pobieranie danych czasu pracy..." />
          )}

          <h2>Czas pracy</h2>

          <button
            className="add-time-entry-btn"
            onClick={() => setMode("add")}
          >
            dodaj wpis
          </button>

          {/* FILTRY */}
          <TimeEntryFilters
            filters={filters}
            setFilters={setFilters}
            employees={employees}
            workplaces={workplaces}
          />

          {/* DANE */}
          {!loading && data.length === 0 ? (
            <p>Brak danych do wyświetlenia</p>
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
                  {data.map((detail) => (
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
        </>
      )}
    </div>
  );
};

export default AdminTimeEntries;
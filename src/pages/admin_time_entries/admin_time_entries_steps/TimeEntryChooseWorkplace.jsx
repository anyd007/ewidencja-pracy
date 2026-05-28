import { useState } from "react";
import { useWorkplaces } from "../../../hooks/useWorkplaces";
import Loader from "../../../components/Loader";
import "../../../styles/TimeEntryChooseWorkplace.scss";
import TimeEntryChooseEmployee from "./TimeEntryChooseEmployee";
const TimeEntryChooseWorkplace = ({ onClose }) => {
  const { workplaces, loading } = useWorkplaces();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("workplace");
  const [newTimeEntry, setNewTimeEntry] = useState({
    workplaceName: "",
    workplaceId: "",
    employeeId: "",
    employeeFirstName: "",
    employeeLastName: "",
    startTime: "",
    endTime: "",
    date: "",
  });

  const filteredWorkplaces = workplaces.filter((wp) =>
    wp.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <div className="add add-time-entries">
      {loading && <Loader message="Pobieranie danych..." />}
      <div className="add-wrapper">
        <h2 className="add-wrapper__title">Dodaj wpis czasu pracy</h2>
        <button className="add-wrapper__close-btn" onClick={onClose}>
          zamknij
        </button>

        {/* STEP 1 */}
        {mode === "workplace" && (
          <div className="workplaces">
            <h3>wybierz miesce pracy:</h3>
            <input 
              type="text"
              placeholder="Szukaj po nazwie miejsca pracy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <div className="workplaces-list">
              {filteredWorkplaces.map((wp) => (
                <div key={wp.id} className="workplaces-item">
                  <h2 className="workplaces-item__name">{wp.name}</h2>
                  <button
                    className="workplaces-list__item-btn"
                    onClick={() => {
                      setNewTimeEntry((prev) => ({
                        ...prev,
                        workplaceId: wp.id,
                        workplaceName: wp.name,
                      }));
                      setMode("employee");
                    }}
                  >
                    wybierz
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {mode === "employee" && (
          <TimeEntryChooseEmployee
            newTimeEntry={newTimeEntry}
            setNewTimeEntry={setNewTimeEntry}
            setMode={setMode}
          />
        )}
      </div>
    </div>
  );
};

export default TimeEntryChooseWorkplace;

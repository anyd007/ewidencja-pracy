
import "../../styles/TimeEntryFilters.scss";
const TimeEntryFilters = ({ filters, setFilters, employees = [] , workplaces = []}) => {

  return (
    <div className="filters">
      <h2>filtry</h2>
  {/* DATA OD */}
        <div className="filters-group">

          <div className="filters-item">
            <label>Data od</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  from: e.target.value,
                }))
              }
            />
          </div>

          {/* DATA DO */}
          <div className="filters-item">
            <label>Data do</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  to: e.target.value,
                }))
              }
            />
          </div>

          {/* EMPLOYEE */}
          <div className="filters-item">
            <label>Pracownik</label>

            <select
              value={filters.employeeId}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  employeeId: e.target.value,
                }))
              }
            >
              <option value="">Wszyscy pracownicy</option>

              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* WORKPLACE */}
          <div className="filters-item">
            <label>Miejsce pracy</label>

            <select
              value={filters.workplaceId}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  workplaceId: e.target.value,
                }))
              }
            >
              <option value="">Wszystkie miejsca pracy</option>

              {workplaces.map((workplace) => (
                <option key={workplace.id} value={workplace.id}>
                  {workplace.name}
                </option>
              ))}
            </select>
          </div>

        </div>
   
    </div>
  );
};

export default TimeEntryFilters;
import { useState } from "react";
import { useWorkplaces } from "../../hooks/useWorkplaces";
import AddWorkplace from "./AddWorkplace";
import Loader from "../../components/Loader";
import "../../styles/AdminWorkplaces.scss";

const AdminWorkplaces = () => {
  const [addOpen, setAddOpen] = useState(false);

  const { workplaces, loading, error } = useWorkplaces();

  return (
    <div className="admin-workplaces">
      {loading && <Loader message="Pobieranie miejsc pracy..." />}

      {addOpen ? (
        <AddWorkplace onClose={() => setAddOpen(false)} />
      ) : (
        <div className="worplaces-wrapper">
          <h1 className="worplaces-wrapper__title">Miejsca wykonywanych prac</h1>

          <button
            className="worplaces-wrapper__add-btn"
            onClick={() => setAddOpen(true)}
          >
            dodaj miejsce pracy
          </button>

          <div className="workplaces-list"></div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkplaces;

import { useState } from "react";
import { useWorkplaces } from "../../hooks/useWorkplaces";
import AddWorkplace from "./AddWorkplace";
import AdminWorkplaceDetails from "./AdminWorkplaceDetails";
import Loader from "../../components/Loader";
import "../../styles/AdminWorkplaces.scss";

const AdminWorkplaces = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { workplaces, loading } = useWorkplaces();

  const handleChooseWorkplace = (workplace) => {
    setSelectedWorkplace(workplace);
    setOpenModal(true);
  };

  return (
    <div className="admin-workplaces">
      {loading && <Loader message="Pobieranie miejsc pracy..." />}

      {addOpen ? (
        <AddWorkplace onClose={() => setAddOpen(false)} />
      ) : (
        <div className="workplaces-wrapper">
          <h1 className="workplaces-wrapper__title">
            Miejsca pracy:
          </h1>
          <button
            className="workplaces-wrapper__add-btn"
            onClick={() => setAddOpen(true)}
          >
            dodaj miejsce pracy
          </button>
          {workplaces.length === 0 && !loading && (
            <p className="workplaces-wrapper__no-data">
              Brak miejsc pracy. Dodaj pierwsze miejsce pracy.
            </p>
          )}
          <div className="workplaces-list">
            {workplaces.map((workplace) => (
              <div key={workplace.id} className="workplaces-item">
                <h2 className="workplaces-item__name">{workplace.name}</h2>
                <div className="workplaces-address">
                  <p className="workplaces-address__city">
                    Miasto: <span>{workplace.city || "brak miasta"}</span>
                  </p>
                  <p className="workplaces-address__street">
                    Ulica: <span>{workplace.street || "brak ulicy"}</span>
                  </p>
                  <p className="workplaces-address__number">
                    Nr. budynku:{" "}
                    <span>{workplace.number || "brak numeru"}</span>
                  </p>
                </div>

                <button
                  className="workplaces-list__item-btn"
                  onClick={() => handleChooseWorkplace(workplace)}
                >
                  zobacz więcej
                </button>
              </div>
            ))}
          </div>

          {selectedWorkplace && openModal && (
            <AdminWorkplaceDetails
              workplace={selectedWorkplace}
              onClose={() => {
                setOpenModal(false);
                setSelectedWorkplace(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminWorkplaces;

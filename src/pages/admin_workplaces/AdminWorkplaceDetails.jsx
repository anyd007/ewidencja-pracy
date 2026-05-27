import { useState } from "react";
import "../../styles/AdminWorkplaceDetails.scss";
import AdminWorkplaceEdit from "./AdminWorkplaceEdit";
const AdminWorkplaceDetails = ({ workplace, onClose }) => {

const[mode, setMode] = useState("view")

const handleBackToView = () => {
  setMode("view");
};

  return (
    <div className="details-wrapper">
      { mode === "view" && (
        <div className="details">
        <div className="details-card">
          <div className="details-field">
            <span>NAZWA</span>
            <span>{workplace.name}</span>
          </div>
          <div className="details-field">
            <span>MIASTO</span>
            <span>{workplace.city}</span>
          </div>
          <div className="details-field">
            <span>ULICA</span>
            <span>{workplace.street}  {workplace.number}</span>
          </div>
          <div className="details-btns">
            <button className="details-btns__exit" onClick={onClose}>
              zamknij
            </button>
            <button className="details-btns__edit" onClick={() => setMode("edit")} onClose={handleBackToView}>edytuj dane</button>
            <button className="details-btns__del">usuń miejsce pracy</button>
          </div>
        </div>
      </div>
      )}
      {mode === "edit" && (
        <AdminWorkplaceEdit workplace={workplace} onClose={handleBackToView}/>
        )}
    </div>
  );
};

export default AdminWorkplaceDetails;

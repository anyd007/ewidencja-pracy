import "../../styles/AdminWorkplaceDetails.scss";
const AdminWorkplaceDetails = ({ workplace, onClose }) => {
  return (
    <div className="details-wrapper">
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
            <span>{workplace.street}, {workplace.number}</span>
          </div>
          <div className="details-btns">
            <button className="details-btns__exit" onClick={onClose}>
              zamknij
            </button>
            <button className="details-btns__edit">edytuj dane</button>
            <button className="details-btns__del">usuń miejsce pracy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkplaceDetails;

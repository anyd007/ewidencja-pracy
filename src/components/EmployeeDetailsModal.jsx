import "../styles/EmployeeDetailsModal.scss";
const EmployeeDetailsModal = ({ employee, onClose }) => {
  // const handleClose = () =>{
  //   onClose()
  //   stopproba
  // }
  return (
    <div className="employee-details-modal" onClick={onClose}>
      <div className="details" onClick={(e) => e.stopPropagation()}>
        <div className="details-card">
          <h2>Informacje o pracowniku</h2>

          <div className="employee-name">
            {employee.firstName} {employee.lastName}
          </div>

          <div className="employee-field">
            <span>PIN</span>
            <span>{employee.pin}</span>
          </div>

          <div className="employee-field">
            <span>Telefon</span>
            <span>{employee.phone || "brak danych"}</span>
          </div>
          <div className="emloyee-btns">
            <button className="emloyee-btns__exit" onClick={onClose}>zamknij</button>
            <button className="emloyee-btns__edit">edytuj dane</button>
            <button className="emloyee-btns__del">usuń pracownika</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;

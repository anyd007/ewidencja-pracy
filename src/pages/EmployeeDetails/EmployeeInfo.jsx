
import "../../styles/EmployeeInfo.scss";

const EmployeeInfo = ({ employee }) => {

console.log(employee);
  return (
    <div className="details">
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
      <span>{employee.phone}</span>
    </div>
  </div>
</div>
  );
};

export default EmployeeInfo;

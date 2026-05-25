

import "../../styles/EmployeeDeleteModal.scss";
const EmployeeDeleteModal = ({employee}) => {
    return ( 
        <div className="delete-modal">
            <h2>usuwanie pracownika: {employee.firstName} {employee.lastName}</h2>
            <h3>w celu usnięcia pracownika muisz podać hasło admintsatora</h3>
            <div className="delete-wrapper">

            </div>

        </div>
     );
}
 
export default EmployeeDeleteModal ;
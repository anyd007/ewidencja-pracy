import React from "react";
import {useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import "../styles/AdminEmployees.scss";
import Loader from "../components/Loader";
import EmployeeAdd from "./employeeDetails/EmployeeAdd";
import EmployeeDetailsModal from "./employeeDetails/EmployeeDetailsModal";
import WorkerImg from "../assets/worker-img.png"

const AdminEmployees = () => {
  const {employees,loading} = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeAdd, setEmployeeAdd] = useState(false);
  

  const handleEmployeeChoose = (employee) => {
    setSelectedEmployee(employee);
  };
 
  return (
    <div className="admin-employees">
      {loading && <Loader message="Pobieranie listy pracowników..." />}

      {!loading && (
        <>
          {employeeAdd ? (
            <EmployeeAdd setEmployeeAdd={setEmployeeAdd} />
          ) : (
            <>
              <h1 className="admin-employees__title">pracownicy:</h1>

                <button
                onClick={() => setEmployeeAdd(true)}
                className="add-employee-btn"
              >
                Dodaj pracownika
              </button>

              {!employees.length ? (
                <h3>Brak dodanych pracowników</h3>
              ) : (
                <div className="employees-list">
                  {employees.map((emp) => (
                    <div key={emp.id} className="employee-card">
                      <div className="employee-card__top">
                        <div className="employee-card__logo">
                          Remont<span>ER</span>
                        </div>
                      </div>

                      <div className="employee-card__image-wrapper">
                        <img
                          src={emp.photo || WorkerImg}
                          alt={`${emp.firstName} ${emp.lastName}`}
                          className="employee-card__image"
                        />
                      </div>

                      <div className="employee-card__content">
                        <h3 className="employee-card__name">
                          {emp.firstName} {emp.lastName}
                        </h3>

                        <button
                          className="employee-card__button"
                          onClick={() => handleEmployeeChoose(emp)}
                        >
                          Pokaż więcej...
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedEmployee && <EmployeeDetailsModal onClose={() => setSelectedEmployee(null)} employee={selectedEmployee} />}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminEmployees;

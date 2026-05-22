import React from "react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/AdminEmployees.scss";
import Loader from "../components/Loader";
import EmployeeAdd from "./EmployeeDetails/EmployeeAdd";
import EmployeeDetailsModal from "../components/EmployeeDetailsModal";
import WorkerImg from "../assets/worker-img.png"

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeAdd, setEmployeeAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Pobieranie pracowników (v9)
  useEffect(() => {
    const q = query(collection(db, "employees"), where("isActive", "==", true));

    // 1. Definiujemy funkcję sukcesu
    const next = (snapshot) => {
      const employeeList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeList);
      setLoading(false);
    };

    // 2. Definiujemy funkcję obsługi błędu (zastępuje catch/finally)
    const error = (err) => {
      console.error("Błąd pobierania pracowników:", err);
      // Tutaj możesz zapisać błąd w osobnym stanie, np. setError(err.message)
      setLoading(false);
    };

    // 3. Przekazujemy obie funkcje do onSnapshot
    const unsubscribe = onSnapshot(q, next, error);

    return () => unsubscribe();
  }, []);

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
              <h1 className="admin-employees__title">Wszyscy pracownicy</h1>

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
                          Pokaż więcej
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

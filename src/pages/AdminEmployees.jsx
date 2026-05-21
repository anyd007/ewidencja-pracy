import React from "react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/AdminEmployees.scss";
import Loader from "../components/Loader";
import EmployeeAdd from "./EmployeeDetails/EmployeeAdd";
import EmployeeInfo from "./EmployeeDetails/EmployeeInfo";

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
              <h2>Wszyscy pracownicy</h2>

              {!employees.length ? (
                <h3>Brak dodanych pracowników</h3>
              ) : (
                <div className="employees-list">
                  {employees.map((emp) => (
                    <button
                      key={emp.id}
                      className="employee-tile"
                      onClick={() => handleEmployeeChoose(emp)}
                    >
                      {emp.firstName} {emp.lastName}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setEmployeeAdd(true)}
                className="add-employee-btn"
              >
                Dodaj pracownika
              </button>

              {selectedEmployee && <EmployeeInfo employee={selectedEmployee} />}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminEmployees;

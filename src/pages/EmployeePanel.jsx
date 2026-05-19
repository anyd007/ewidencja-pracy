import React, { useEffect, useState } from "react";
import { db } from "../firebase";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import PinModal from "../components/PinModal";
import WorkplaceSelector from "../components/WorkplaceSelector";
import TimeEntry from "../components/TimeEntry";
import InfoModal from "../components/InfoModal";
import Loader from "../components/Loader";
import "../styles/EmployeePanel.scss";

const EmployeePanel = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalConfig, setModalConfig] = useState({ message: "", type: "" });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [pin, setPin] = useState("");
  const [step, setStep] = useState("select-employee");

  // 🔥 Pobieranie pracowników (v9)
  useEffect(() => {
    const q = query(
      collection(db, "employees"),
      where("isActive", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const employeeList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEmployees(employeeList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 PIN check
  useEffect(() => {
    if (pin.length === 4 && selectedEmployee) {
      if (pin === selectedEmployee.pin) {
        setStep("select-workplace");
        setPin("");
      } else {
        setModalConfig({ message: "Nieprawidłowy PIN!", type: "error" });
        setPin("");
      }
    }
  }, [pin, selectedEmployee]);

  // 🔁 reset po modalu
  const closeInfoModal = () => {
    if (modalConfig.type === "success") {
      setStep("select-employee");
      setSelectedEmployee(null);
      setSelectedWorkplace(null);
    }
    setModalConfig({ message: "", type: "" });
  };

  // 🏗 wybór miejsca pracy
  const handleWorkplaceSelect = (workplace) => {
    setSelectedWorkplace(workplace);
    setStep("enter-time");
  };

  // 💾 zapis czasu pracy (v9)
  const handleFinalLog = async (timeData) => {
    setIsSubmitting(true);

    try {
      const newEntry = {
        employeeId: selectedEmployee.id,
        firstName: `${selectedEmployee.firstName}`,
        lastName: `${selectedEmployee.lastName}`,
        workplaceId: selectedWorkplace.id,
        workplaceName: selectedWorkplace.name,
        date: timeData.date,
        startTime: timeData.startTime,
        endTime: timeData.endTime,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "timeEntries"), newEntry);

      setModalConfig({
        message: `Czas pracy zapisany dla ${selectedEmployee.firstName}!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error saving entry:", error);
      setModalConfig({
        message: "Błąd podczas zapisywania danych. Spróbuj ponownie.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="employee-panel">
      {loading && <Loader message="Pobieranie danych..." />}
      {isSubmitting && <Loader message="Zapisywanie czasu pracy..." />}

      {/* STEP 1 */}
      {step === "select-employee" && (
        <>
          <h1>Wybierz swoje dane:</h1>
          <div className="tiles-grid">
            {employees.map((emp) => (
              <button
                key={emp.id}
                className="employee-tile"
                onClick={() => setSelectedEmployee(emp)}
              >
                {emp.firstName}
                <span>{emp.lastName}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === "select-workplace" && (
        <WorkplaceSelector
          employee={selectedEmployee}
          onSelect={handleWorkplaceSelect}
          onBack={() => {
            setStep("select-employee");
            setSelectedEmployee(null);
          }}
        />
      )}

      {/* STEP 3 */}
      {step === "enter-time" && (
        <TimeEntry
          employee={selectedEmployee}
          workplace={selectedWorkplace}
          onSubmit={handleFinalLog}
          onBack={() => setStep("select-workplace")}
        />
      )}

      {/* PIN MODAL */}
      {selectedEmployee && step === "select-employee" && (
        <PinModal
          employee={selectedEmployee}
          pin={pin}
          setPin={setPin}
          onCancel={() => {
            setSelectedEmployee(null);
            setPin("");
          }}
        />
      )}

      {/* INFO MODAL */}
      <InfoModal
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={closeInfoModal}
      />
    </div>
  );
};

export default EmployeePanel;
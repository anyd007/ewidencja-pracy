import React, { useEffect, useState } from "react";
import { db } from "../firebase";
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

  // Stany dla InfoModala
  const [modalConfig, setModalConfig] = useState({ message: "", type: "" });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [pin, setPin] = useState("");
  const [step, setStep] = useState("select-employee");

  // Pobieranie pracowników
  useEffect(() => {
    const unsubscribe = db
      .collection("employees")
      .where("isActive", "==", true)
      .onSnapshot((snapshot) => {
        const employeeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // Logika sprawdzania PIN
  useEffect(() => {
    if (pin.length === 4 && selectedEmployee) {
      if (pin === selectedEmployee.pin) {
        setStep("select-workplace");
        setPin("");
      } else {
        setModalConfig({ message: "Wrong PIN! Try again.", type: "error" });
        setPin("");
      }
    }
  }, [pin, selectedEmployee]);

  // Zamknięcie modalu i ewentualny reset procesu
  const closeInfoModal = () => {
    if (modalConfig.type === "success") {
      setStep("select-employee");
      setSelectedEmployee(null);
      setSelectedWorkplace(null);
    }
    setModalConfig({ message: "", type: "" });
  };

  const handleWorkplaceSelect = (workplace) => {
    setSelectedWorkplace(workplace);
    setStep("enter-time");
  };

  const handleFinalLog = async (timeData) => {
    setIsSubmitting(true); // Pokazujemy loader
    try {
      const newLog = {
        employeeId: selectedEmployee.id,
        employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        workplaceId: selectedWorkplace.id,
        workplaceName: selectedWorkplace.name,
        date: timeData.date,
        startTime: timeData.startTime,
        endTime: timeData.endTime,
        createdAt: new Date(),
      };

      await db.collection("logs").add(newLog);
      
      setModalConfig({ 
        message: `Work hours saved for ${selectedEmployee.firstName}!`, 
        type: "success" 
      });
      
    } catch (error) {
      console.error("Error saving log:", error);
      setModalConfig({ message: "Error saving data. Try again.", type: "error" });
    } finally {
      setIsSubmitting(false); // Ukrywamy loader
    }

  };


  return (
    <div className="employee-panel">
        {/* Loader przy starcie */}
      {loading && <Loader message="Fetching employees..." />}

      {/* Loader przy zapisywaniu (blokuje ekran) */}
      {isSubmitting && <Loader message="Saving your time..." />}
      {/* KROK 1: Wybór pracownika */}
      {step === "select-employee" && (
        <>
          <h1>Select Your Name</h1>
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

      {/* KROK 2: Wybór budowy */}
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

      {/* KROK 3: Wybór daty i godzin */}
      {step === "enter-time" && (
        <TimeEntry 
          employee={selectedEmployee}
          workplace={selectedWorkplace}
          onSubmit={handleFinalLog}
          onBack={() => setStep("select-workplace")}
        />
      )}

      {/* MODAL PIN */}
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

      {/* MODAL INFORMACYJNY (Sukces/Błąd) */}
      <InfoModal 
        message={modalConfig.message} 
        type={modalConfig.type} 
        onClose={closeInfoModal} 
      />
    </div>
  );
};

export default EmployeePanel;
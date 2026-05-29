import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Loader from "../../../components/Loader";
import InfoModal from "../../../components/InfoModal";
import "../../../styles/TimeEntrySummary.scss";
import { useState } from "react";
const TimeEntrySummary = ({ newTimeEntry, setNewTimeEntry, setMode }) => {
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    type: "",
  });

  const handleConfirm = async () => {
    setLoading(true);

    if (newTimeEntry.startTime >= newTimeEntry.endTime) {
      setModalConfig({
        message: "Godzina zakończenia musi być późniejsza niż rozpoczęcia",
        type: "error",
      });

      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "timeEntries"), {
        workplaceName: newTimeEntry.workplaceName,
        workplaceId: newTimeEntry.workplaceId,
        employeeId: newTimeEntry.employeeId,
        firstName: newTimeEntry.firstName,
        lastName: newTimeEntry.lastName,
        date: newTimeEntry.date,
        startTime: newTimeEntry.startTime,
        endTime: newTimeEntry.endTime,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      });

      setNewTimeEntry({
        workplaceName: "",
        workplaceId: "",
        employeeId: "",
        firstName: "",
        lastName: "",
        date: "",
        startTime: "",
        endTime: "",
      });

      setModalConfig({
        message: "Dane zostały dodane pomyślnie",
        type: "success",
      });

      setTimeout(() => {
        setModalConfig({ message: "", type: "" });
        setMode("workplace");
      }, 2000);
    } catch (error) {
      console.error(error);

      setModalConfig({
        message: "Wystąpił błąd podczas dodawania danych...",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetDate = () => {
    setNewTimeEntry((prev) => ({
      ...prev,
      date: "",
      startTime: "",
      endTime: "",
    }));

    setMode("date");
  };

  return (
    <div className="summary">
      {loading && <Loader message="Zapisywanie danych czasu pracy..." />}
      <InfoModal
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ message: "", type: "" })}
      />

      <h2>podsumowanie</h2>
      <div className="summary-wrapper">
        <div className="summary-field">
          <span>MIEJSCE PRACY:</span>
          <span>{newTimeEntry.workplaceName}</span>
        </div>
        <div className="summary-field">
          <span>PRACOWNIK:</span>
          <span>
            {newTimeEntry.firstName} {newTimeEntry.lastName}
          </span>
        </div>
        <div className="summary-field">
          <span>DATA:</span>
          <span>{newTimeEntry.date}</span>
        </div>
        <div className="summary-field">
          <span>CZAS PRACY:</span>
          <span>
            {newTimeEntry.startTime} - {newTimeEntry.endTime}
          </span>
        </div>
      </div>
      <div className="summary-btns">
        <button className="btn back" onClick={resetDate}>
          wróć do wyboru czasu
        </button>
        <button
          className="btn confirm"
          onClick={handleConfirm}
        >
          zapisz wpis i wyjdz
        </button>
      </div>
    </div>
  );
};

export default TimeEntrySummary;

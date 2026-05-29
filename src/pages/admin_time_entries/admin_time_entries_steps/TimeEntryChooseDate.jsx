import { useState } from "react";
import "../../../styles/TimeEntryChooseDate.scss";

const TimesEntryChooseDate = ({ setMode, setNewTimeEntry, onClose }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleNext = () => {
    if (!date || !startTime || !endTime) return;

    setNewTimeEntry((prev) => ({
      ...prev,
      date,
      startTime,
      endTime,
    }));

    setMode("summary"); 
  };

  const resetEmployee = () => {
    setNewTimeEntry((prev) => ({
      ...prev,
      employeeId: "",
      firstName: "",
      lastName: "",
    }));

    setMode("employee");
  };

  return (
    <div className="date-step">
      <h3 className="date-step__title">
        Wybierz datę i godziny pracy
      </h3>

      <div className="date-step__form">
        <div className="field">
          <label>Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Godzina rozpoczęcia</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Godzina zakończenia</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="date-step__buttons">
        <button className="btn back" onClick={resetEmployee}>
          wróć to wyboru pracownika
        </button>

        <button className="btn next" onClick={handleNext}>
          dalej
        </button>
      </div>
    </div>
  );
};

export default TimesEntryChooseDate;
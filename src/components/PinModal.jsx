import React from "react";
import '../styles/PinModal.scss';

const PinModal = ({ employee, pin, setPin, onCancel }) => {

  if (!employee) return null;

  const handleNumberClick = (num) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
  };

  return (
    <div className="pin-modal">
      <div className="pin-content">

        <h2>Wprowadź PIN</h2>

        <h3>
          dla: {employee.firstName} {employee.lastName}
        </h3>

        {/* PIN DISPLAY */}
        <div className="pin-display">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="digit-slot">
              {pin[i] ? "●" : ""}
            </div>
          ))}
        </div>

        {/* KEYPAD */}
        <div className="keypad">
          {[1,2,3,4,5,6,7,8,9,'C',0,'Del'].map((val) => (
            <button
              key={val}
              type="button"
              disabled={pin.length >= 4 && typeof val === "number"}
              onClick={() => {
                if (val === 'C') handleClear();
                else if (val === 'Usuń') handleDelete();
                else handleNumberClick(val);
              }}
            >
              {val}
            </button>
          ))}
        </div>

        {/* CANCEL */}
        <button className="close-btn" onClick={onCancel}>
          Anuluj
        </button>

      </div>
    </div>
  );
};

export default PinModal;
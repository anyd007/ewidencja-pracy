import '../styles/PinModal.scss';

const PinModal = ({ employee, pin, setPin, onCancel }) => {
  
  const handleNumberClick = (num) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="pin-modal">
      <div className="pin-content">
        <h2>Enter PIN for </h2>
        <h3>{employee.firstName} {employee.lastName}</h3>
        <div className="pin-display">
          <div className="digit-slots">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="digit-slot">
                {pin[i] || ""}
              </div>
            ))}
          </div>
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'Del'].map((val) => (
            <button 
              key={val} 
              type="button"
              onClick={() => {
                if (val === 'C') setPin('');
                else if (val === 'Del') handleDelete();
                else handleNumberClick(val);
              }}
            >
              {val}
            </button>
          ))}
        </div>
        
        <button className="close-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default PinModal;
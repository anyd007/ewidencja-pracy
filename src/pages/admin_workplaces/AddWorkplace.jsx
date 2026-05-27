import { useState } from "react";
import Loader from "../../components/Loader";
import InfoModal from "../../components/InfoModal";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import "../../styles/AddWorkplace.scss";
const AddWorkplace = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    type: "",
  });
  const [newWorkplace, setNewWorkplace] = useState({
    name: "",
    city: "",
    street: "",
    number: "",
  });

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!newWorkplace.name.trim()) {
    setModalConfig({
      message: "Nazwa miejsca jest wymagana",
      type: "error",
    });
    return;
  }

  setLoading(true);

  try {
    await addDoc(collection(db, "workplaces"), {
      name: newWorkplace.name.trim(),
      city: newWorkplace.city.trim(),
      street: newWorkplace.street.trim(),
      number: newWorkplace.number,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    setNewWorkplace({ 
        name: "", 
        city: "",
        street: "",
        number: "",
    });

    setModalConfig({
      message: "miejsce pracy dodane pomyślnie",
      type: "success",
    });

    setTimeout(() => {
      onClose();
    }, 1500);

  } catch (error) {
    console.error(error);

    setModalConfig({
      message: "Wystąpił błąd podczas dodawania miejsca pracy",
      type: "error",
    });

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="add-workplace">
      {loading && <Loader message="Dodawanie miejsca pracy..." />}
      <InfoModal
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ message: "", type: "" })}
      />

      <button className="back-button" onClick={onClose}>
        wróć
      </button>

      <form className="add-workplace-wrapper" onSubmit={handleSubmit}>
        <div className="add-workplace-wrapper__name">
          <label htmlFor="name">nazwa miejsca pracy</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="podaj nazwę..."
            value={newWorkplace.name}
            onChange={(e) =>
              setNewWorkplace({ ...newWorkplace, name: e.target.value })
            }
            maxLength={30}
            required
          />
        </div>
        <div className="add-workplace-wrapper__city">
          <label htmlFor="city">podaj miasto (opcjonalnie)</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="podaj miasto..."
            value={newWorkplace.city}
            onChange={(e) =>
              setNewWorkplace({ ...newWorkplace, city: e.target.value })
            }
            maxLength={20}
          />
        </div>
        <div className="add-workplace-wrapper__street">
          <label htmlFor="street">podaj ulicę (opcjonalnie)</label>
          <input
            type="text"
            id="street"
            name="street"
            placeholder="podaj ulicę..."
            value={newWorkplace.street}
            onChange={(e) =>
              setNewWorkplace({ ...newWorkplace, street: e.target.value })
            }
            maxLength={30}
          />
        </div>
        <div className="add-workplace-wrapper__number">
          <label htmlFor="number">podaj nr budynku (opcjonalnie)</label>
          <input
            type="text"
            id="number"
            name="number"
            placeholder="podaj nr budynku..."
            value={newWorkplace.number}
            onChange={(e) =>
              setNewWorkplace({ ...newWorkplace, number: e.target.value })
            }
            maxLength={20}
          />
        </div>
        <button className="add-workplace-wrapper__save-btn" type="submit">
          zapisz
        </button>
      </form>
    </div>
  );
};

export default AddWorkplace;

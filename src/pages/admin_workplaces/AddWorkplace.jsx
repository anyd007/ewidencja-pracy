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
    address: "",
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
      address: newWorkplace.address.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    setNewWorkplace({ name: "", address: "" });

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
        <div className="add-workplace-wrapper__address">
          <label htmlFor="address">adres miejsca pracy</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="podaj adres..."
            value={newWorkplace.address}
            onChange={(e) =>
              setNewWorkplace({ ...newWorkplace, address: e.target.value })
            }
            maxLength={40}
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

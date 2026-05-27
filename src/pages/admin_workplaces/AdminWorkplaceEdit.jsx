import { useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import Loader from "../../components/Loader";
import InfoModal from "../../components/InfoModal";
import "../../styles/AdminWorkplaceEdit.scss";
const AdminWorkplaceEdit = ({ workplace, onClose }) => {
  const [loadanig, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    type: "",
  });
  const [editData, setEditData] = useState({
    name: workplace.name,
    city: workplace.city,
    street: workplace.street,
    number: workplace.number,
  });

  const handleSaveEdit = async () => {
    if (!editData.name.trim()) {
      setModalConfig({
        message: "Nazwa miejsca pracy nie może być pusta",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const ref = doc(db, "workplaces", workplace.id);

      await updateDoc(ref, {
        name: editData.name.trim(),
        city: editData.city.trim(),
        street: editData.street.trim(),
        number: editData.number.trim(),
        updatedAt: new Date().toISOString(),
      });

      setModalConfig({
        message: "Zmiany zapisane poprawnie",
        type: "success",
      });
    } catch (error) {
      console.error(error);

      setModalConfig({
        message: "Wystąpił błąd podczas zapisu",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseInfoModal = () => {
    setModalConfig({ message: "", type: "" });
    onClose();
  };

  return (
    <div className="edit-wrapper">
      {loadanig && <Loader message="Zmiana danych miejsca pracy.." />}
      <InfoModal
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={handleCloseInfoModal}
      />
      <h2>edytuj dane</h2>
      <div className="edit">
        <label htmlFor="name">Nazwa miejsca pracy:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder={
            workplace?.name ? `Aktualnie: ${workplace.name}` : "Podaj nazwę..."
          }
          maxLength={30}
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />
      </div>
      <div className="edit">
        <label htmlFor="city">Miasto: (opcjonalnie)</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder={
            workplace?.city ? `Aktualnie: ${workplace.city}` : "Podaj miasto..."
          }
          maxLength={30}
          value={editData.city}
          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
        />
      </div>
      <div className="edit">
        <label htmlFor="street">Ulica: (opcjonalnie)</label>
        <input
          type="text"
          id="street"
          name="street"
          placeholder={
            workplace?.street
              ? `Aktualnie: ${workplace.street}`
              : "Podaj ulicę..."
          }
          maxLength={30}
          value={editData.street}
          onChange={(e) => setEditData({ ...editData, street: e.target.value })}
        />
      </div>
      <div className="edit">
        <label htmlFor="number">Numer budynku: (opcjonalnie)</label>
        <input
          type="text"
          id="number"
          name="number"
          placeholder={
            workplace?.number
              ? `Aktualnie: ${workplace.number}`
              : "Podaj numer budynku..."
          }
          maxLength={15}
          value={editData.number}
          onChange={(e) => setEditData({ ...editData, number: e.target.value })}
        />
      </div>
      <div className="edit-btns">
        <button
          type="button"
          className="edit-btns__save"
          onClick={handleSaveEdit}
        >
          zapisz zminay
        </button>
        <button className="edit-btns__exit" onClick={onClose}>
          zamknij bez zmian
        </button>
      </div>
    </div>
  );
};

export default AdminWorkplaceEdit;

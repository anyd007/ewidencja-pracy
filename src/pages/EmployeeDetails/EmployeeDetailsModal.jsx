import { useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import EmployeeDeleteModal from "./EmployeeDeleteModal";
import Loader from "../../components/Loader";
import InfoModal from "../../components/InfoModal";
import "../../styles/EmployeeDetailsModal.scss";
const EmployeeDetailsModal = ({ employee, onClose }) => {
  const [editData, setEditData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    phone: employee.phone,
    pin: employee.pin,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    type: "",
  });

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleDelete = () =>{
    setIsDelete(true)
  
    
  }

  const handleSaveEdit = async () => {
    // Walidacja: upewniamy się, że PIN ma dokładnie 4 cyfry
    if (editData.pin && editData.pin.length !== 4) {
      setModalConfig({
        message: "Pin musi składać się z dokładnie 4 cyfr.",
        type: "error",
      });
      setIsEdit(true)
      return;
    }
    setLoading(true);

    try {
      await updateDoc(doc(db, "employees", employee.id), {
        firstName: editData.firstName.trim(),
        lastName: editData.lastName.trim(),
        pin: editData.pin,
        updatedAt: new Date().toISOString(),
        isActive: true,
      });

      setTimeout(() => {
        onClose();
      }, 1200);

      setModalConfig({
        message: "Zmiany wprowadzone poprawinie",
        type: "success",
      });
    } catch (error) {
      console.error("Błąd podczas wprowadzania zmian:", error);
      setModalConfig({
        message: "Wystąpił błąd podczas wprowadzania zmian",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="details-wrapper">
      <InfoModal
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ message: "", type: "" })}
      />
      {isDelete && <EmployeeDeleteModal employee={employee}/>}

      {loading && <Loader message="Zmiana danych pracownika..." />}
      <div className="details">
        <div className="details-card">
          <h2>Informacje o pracowniku</h2>
          {!isEdit ? (
            <>
              <div className="employee-name">
                {employee.firstName} {employee.lastName}
              </div>

              <div className="details-field">
                <span>PIN</span>
                <span>{employee.pin}</span>
              </div>

              <div className="details-field">
                <span>Telefon</span>
                <span>{employee.phone || "brak danych"}</span>
              </div>
              <div className="details-btns">
                <button className="details-btns__exit" onClick={onClose}>
                  zamknij
                </button>
                <button className="details-btns__edit" onClick={handleEdit}>
                  edytuj dane
                </button>
                <button className="details-btns__del" onClick={handleDelete}>usuń pracownika</button>
              </div>
            </>
          ) : (
            <div className="edit-wrapper">
              <h2>edytuj dane</h2>
              <div className="edit-first-name">
                <label htmlFor="fname">zmień imię: {employee.firstName}</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="zmień imię..."
                  maxLength={15}
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="edit-last-name">
                <label htmlFor="lname">
                  zmień nazwisko: {employee.lastName}
                </label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  placeholder="zmień nazwisko..."
                  maxLength={15}
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="edit-pin">
                <label htmlFor="pin">zmiń PIN</label>
                <input
                  type="text"
                  id="pin"
                  name="pin"
                  placeholder="zmień pin..."
                  minLength={4}
                  maxLength={4}
                  required
                  value={editData.pin}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      pin: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </div>
              <div className="edit-phone">
                <label htmlFor="phone">zmień telefon</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder={
                    editData.phone ? "zmień telefon..." : "dodaj nr telefonu..."
                  }
                  maxLength={15}
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </div>
              <div className="edit-btns">
                <button type="button" className="edit-btns__save" onClick={handleSaveEdit}>
                  zapisz zminay
                </button>
                <button className="edit-btns__exit" onClick={onClose}>
                  zamknij bez zmian
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;

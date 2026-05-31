// import bcrypt from "bcryptjs";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Loader from "../../components/Loader";
import InfoModal from "../../components/InfoModal";
import "../../styles/EmployeeAdd.scss";
import { useState } from "react";
const EmployeeAdd = ({ setEmployeeAdd }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pin, setPin] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Walidacja: upewniamy się, że PIN ma dokładnie 4 cyfry
    if  (!/^\d{4}$/.test(pin)){
      setModalConfig({
        message: "Pin musi składać się z dokładnie 4 cyfr.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {

      await addDoc(collection(db, "employees"), {
        firstName: firstName.trim() || "",
        lastName: lastName.trim() || "",
        phone: phone.trim() || "",
        pin: pin.trim() || "",
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      // Czyszczenie pól formularza po sukcesie
      setFirstName("");
      setLastName("");
      setPin("");
      setPhone("");
      setModalConfig({
        message: "Pracownik dodany pomyślnie",
        type: "success",
      });
      
    } catch(error) {
        console.error("Błąd podczas dodawania pracownika:", error);
      setModalConfig({
        message: "Wystąpił błąd podczas dodawania pracownika",
        type: "error",
      });
    } finally {
        setLoading(false)
    }
  };

  return (
    <div className="employee-add">
      <h2>dodaj nowego pracownika</h2>
      <button onClick={() => setEmployeeAdd(false)}>wróć</button>

      <form className="employee-add-wrapper" onSubmit={handleSubmit}>
        <div className="employee-add-wrapper__fname">
          <label htmlFor="fname">imię</label>
          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="podaj imię"
            value={firstName}
            maxLength={15}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="employee-add-wrapper__lname">
          <label htmlFor="lname">nazwisko</label>
          <input
            type="text"
            id="lname"
            name="lname"
            placeholder="podaj nazwisko"
            value={lastName}
            maxLength={15}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="employee-add-wrapper__pin">
          <label htmlFor="pin">4-cyfrowy pin</label>
          <input
            type="text"
            id="pin"
            name="pin"
            placeholder="podaj 4-cyfrowy pin"
            minLength={4}
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
        <div className="employee-add-wrapper__phone">
          <label htmlFor="phone">numer telefonu (opcjonalnie) </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="podaj numer tel."
          />
        </div>
        <button className="employee-add-submit" type="submit">
          Zapisz
        </button>
      </form>
      {loading && <Loader message="Dodawanie pracownika..." />}
      <InfoModal
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalConfig({ message: "", type: "" })}
      />
    </div>
  );
};

export default EmployeeAdd;

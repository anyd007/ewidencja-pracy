import { useState } from "react";
import { useWorkplaces } from "../../hooks/useWorkplaces";
import "../../styles/AdminTimeEntriesAdd.scss";
const AdminTimeEntriesAdd = () => {
    const { workplaces, loading } = useWorkplaces();
  const [newTimeEntry, setNewTimeEntry] = useState({
    workplaceName: "",
    workplaceId: "",
    employeeId: "",
    employeeFirstName: "",
    employeeLastName: "",
    startTime: "",
    endTime: "",
    date: "",
    createdAt: new Date().toISOString(),
    isActive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="add add-time-entries">
      <h2>Dodaj wpis czasu pracy</h2>
    </div>
  );
};

export default AdminTimeEntriesAdd;

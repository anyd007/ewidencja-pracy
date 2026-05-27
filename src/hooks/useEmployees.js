import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "employees"),
      where("isActive", "==", true)
    );

    const handleSuccess = (snapshot) => {
      const employeesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEmployees(employeesList);
      setLoading(false);
    };

    const handleError = (error) => {
      console.error(error);
      setError(error);
      setLoading(false);
    };

    const unsubscribe = onSnapshot(
      q,
      handleSuccess,
      handleError
    );

    return () => unsubscribe();

  }, []);

  return {
    employees,
    loading,
    error,
  };
};
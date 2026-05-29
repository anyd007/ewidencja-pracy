import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export const useTimeEntries = ({ from, to, employeeId, workplaceId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    let q = collection(db, "timeEntries");

    const constraints = [];

    if (employeeId) {
      constraints.push(where("employeeId", "==", employeeId));
    }

    if (workplaceId) {
      constraints.push(where("workplaceId", "==", workplaceId));
    }

    if (from) {
      constraints.push(where("date", ">=", from));
    }

    if (to) {
      constraints.push(where("date", "<=", to));
    }

    const finalQuery = query(q, ...constraints);

    const unsub = onSnapshot(finalQuery, (snap) => {
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [from, to, employeeId, workplaceId]);

  return { data, loading };
};
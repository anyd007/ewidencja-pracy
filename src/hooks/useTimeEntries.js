import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";

export const useTimeEntries = () => {
    const [timeEntries, setTimeEntries] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
}
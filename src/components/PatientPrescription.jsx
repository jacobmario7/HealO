import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User logged in:", user.uid);
        fetchPrescriptions(user.uid);
      } else {
        console.log("No user logged in.");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchPrescriptions = (uid) => {
    console.log("Fetching prescriptions for patient:", uid);

    const prescriptionsRef = collection(db, "prescriptions");
    const q = query(prescriptionsRef, where("patientId", "==", uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Firestore snapshot received:", snapshot.docs.length);

      if (snapshot.empty) {
        console.log("No prescriptions found for this patient.");
        setPrescriptions([]);
        localStorage.removeItem(`prescriptions_${uid}`);
      } else {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched prescriptions:", data);

        setPrescriptions(data);
        localStorage.setItem(`prescriptions_${uid}`, JSON.stringify(data));
      }

      setLoading(false);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const savedPrescriptions = localStorage.getItem(`prescriptions_${user.uid}`);
      if (savedPrescriptions) {
        setPrescriptions(JSON.parse(savedPrescriptions));
        setLoading(false);
      }
    }
  }, []);

  return (
    <div>
      <h2>My Prescriptions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : prescriptions.length === 0 ? (
        <p>No prescriptions available.</p>
      ) : (
        prescriptions.map((pres) => (
          <div key={pres.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <p><strong>Doctor:</strong> {pres.doctorName}</p>
            <p><strong>Diagnosis:</strong> {pres.diagnosis}</p>
            <p><strong>Notes:</strong> {pres.notes}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default PatientPrescriptions;

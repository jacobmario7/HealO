import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function PatientHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const historyQuery = query(
        collection(db, "patientHistory"),
        where("patientId", "==", user.uid)
      );

      const snapshot = await getDocs(historyQuery);
      const historyList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(historyList);
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Doctors Visited</h2>

      {history.length === 0 ? (
        <p>No past visits available.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
          {history.map((entry) => (
            <div
              key={entry.id}
              style={{ padding: "10px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}
            >
              <h3>Doctor: {entry.doctorName}</h3>
              <p><strong>Time Slot:</strong> {entry.timeSlot}</p>
              <p><strong>Diagnosis:</strong> {entry.diagnosis}</p>
              
              <h4>Medications</h4>
              {entry.medications.map((med, index) => (
                <p key={index}>
                  <strong>{med.medicationName}</strong> - {med.dosage}, {med.frequency}, {med.duration}
                </p>
              ))}

              <p><strong>Doctor's Notes:</strong> {entry.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientHistory;

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, getDocs, onSnapshot } from "firebase/firestore";

function DoctorHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const historyQuery = query(collection(db, "doctors", user.uid, "history"));

      const unsubscribe = onSnapshot(historyQuery, (snapshot) => {
        const historyList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHistory(historyList);
        localStorage.setItem("doctorHistory", JSON.stringify(historyList)); // Store in localStorage
      });

      return () => unsubscribe();
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem("doctorHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Consulted Patients</h2>

      {history.length === 0 ? (
        <p>No consultations yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {history.map((record) => (
            <div
              key={record.id}
              style={{
                padding: "20px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>
                <strong>Patient:</strong> {record.patientName || "Unknown"}
              </h3>
              <p><strong>Time Slot:</strong> {record.timeSlot}</p>
              <p><strong>Diagnosis:</strong> {record.diagnosis}</p>

              <h4>Medications:</h4>
              <ul style={{ paddingLeft: "20px" }}>
                {record.medications.map((med, index) => (
                  <li key={index}>
                    {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                  </li>
                ))}
              </ul>

              <p><strong>Notes:</strong> {record.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorHistory;

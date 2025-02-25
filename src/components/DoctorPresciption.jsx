import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function DoctorPrescription() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAppointments(user.uid);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchAppointments = async (doctorId) => {
    try {
      const appointmentQuery = query(
        collection(db, "appointments"),
        where("doctorId", "==", doctorId),
        where("status", "==", "booked")
      );

      const unsubscribe = onSnapshot(appointmentQuery, (snapshot) => {
        const appointmentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentList);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    localStorage.removeItem("selectedAppointment");
  }, []);

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setDiagnosis("");
    setNotes("");
    setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
    setSuccessMessage("");

    localStorage.setItem("selectedAppointment", JSON.stringify(appointment));
  };

  const handleSubmitPrescription = async () => {
    if (!selectedAppointment) {
      alert("Please select an appointment.");
      return;
    }
    if (!diagnosis || medications.some((med) => !med.name || !med.dosage || !med.frequency || !med.duration)) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const newPrescription = {
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patientId,
        doctorId: selectedAppointment.doctorId,
        doctorName: selectedAppointment.doctorName || "Unknown Doctor",
        patientName: selectedAppointment.patientName,
        timeSlot: selectedAppointment.timeSlot,
        diagnosis,
        medications,
        notes,
      };

      const patientPrescriptionsRef = collection(
        db,
        "patients",
        selectedAppointment.patientId,
        "prescriptions"
      );
      await addDoc(patientPrescriptionsRef, newPrescription);

      const doctorHistoryRef = collection(
        db,
        "doctors",
        selectedAppointment.doctorId,
        "history"
      );
      await addDoc(doctorHistoryRef, newPrescription);

      await deleteDoc(doc(db, "appointments", selectedAppointment.id));

      setAppointments(
        appointments.filter((appt) => appt.id !== selectedAppointment.id)
      );
      setSelectedAppointment(null);
      setSuccessMessage("Prescription successfully added!");

      localStorage.removeItem("selectedAppointment");
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Failed to add prescription.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Prescription</h2>
      {successMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
      )}

      <h3>Select an Appointment</h3>
      {appointments.length === 0 ? (
        <p>No available appointments.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            onClick={() => handleSelectAppointment(appointment)}
            style={{
              border: "1px solid black",
              margin: "10px",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            <p>
              <strong>Patient:</strong> {appointment.patientName}
            </p>
            <p>
              <strong>Time Slot:</strong> {appointment.timeSlot}
            </p>
          </div>
        ))
      )}

      {selectedAppointment && (
        <div>
          <h3>Prescription Details</h3>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Diagnosis"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
          ></textarea>

          <h4>Medications</h4>
          {medications.map((med, index) => (
            <div key={index}>
              <input
                type="text"
                value={med.name}
                onChange={(e) => {
                  const newMeds = [...medications];
                  newMeds[index].name = e.target.value;
                  setMedications(newMeds);
                }}
                placeholder="Medication Name"
              />
              <input
                type="text"
                value={med.dosage}
                onChange={(e) => {
                  const newMeds = [...medications];
                  newMeds[index].dosage = e.target.value;
                  setMedications(newMeds);
                }}
                placeholder="Dosage"
              />
              <select
                value={med.frequency}
                onChange={(e) => {
                  const newMeds = [...medications];
                  newMeds[index].frequency = e.target.value;
                  setMedications(newMeds);
                }}
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Thrice daily">Thrice daily</option>
              </select>
              <input
                type="text"
                value={med.duration}
                onChange={(e) => {
                  const newMeds = [...medications];
                  newMeds[index].duration = e.target.value;
                  setMedications(newMeds);
                }}
                placeholder="Duration"
              />
              <button
                onClick={() =>
                  setMedications(medications.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setMedications([
                ...medications,
                { name: "", dosage: "", frequency: "", duration: "" },
              ])
            }
          >
            + Add More Medication
          </button>
          <button onClick={handleSubmitPrescription}>Submit Prescription</button>
        </div>
      )}
    </div>
  );
}

export default DoctorPrescription;

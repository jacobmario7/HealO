import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs,getDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function DoctorAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [refresh, setRefresh] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAppointments(user.uid);
      }
    });
  
    return () => unsubscribe();
  }, [refresh]); 
  

  const fetchAppointments = async (doctorId) => {
    try {
      const appointmentQuery = query(
        collection(db, "appointments"),
        where("doctorId", "==", doctorId)
      );
      const appointmentSnapshot = await getDocs(appointmentQuery);
      let appointmentsList = [];

      appointmentSnapshot.forEach((doc) => {
        appointmentsList.push({ id: doc.id, ...doc.data() });
      });

      appointmentsList.sort((a, b) => (a.status === "booked" ? -1 : 1));
      setAppointments(appointmentsList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus, patientId) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { status: newStatus });
  
      if (patientId) {
        const patientAppointmentRef = doc(db, "users", patientId);
        const patientSnap = await getDoc(patientAppointmentRef);
        if (patientSnap.exists()) {
          await updateDoc(patientAppointmentRef, { lastAppointmentStatus: newStatus });
        }
      }
  
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div>
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "10px",
                backgroundColor:
                  appointment.status === "booked"
                    ? "#c3e6cb"
                    : appointment.status === "pending"
                    ? "#ffeeba"
                    : "#f5c6cb",
              }}
            >
              <p><strong>Patient:</strong> {appointment.patientName}</p>
              <p><strong>Time Slot:</strong> {appointment.timeSlot}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              <p><strong>Status:</strong> {appointment.status.toUpperCase()}</p>

              {appointment.status === "pending" && (
                <>
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, "booked", appointment.patientId)}
                    style={{
                      marginRight: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, "rejected", appointment.patientId)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </>
              )}

              {appointment.status === "booked" && (
                <button
                  onClick={() => updateAppointmentStatus(appointment.id, "canceled")}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ffc107",
                    color: "black",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointment;

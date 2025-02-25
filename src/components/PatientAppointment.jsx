import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
} from "firebase/firestore";

function PatientAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [clinicDetails, setClinicDetails] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [patientName, setPatientName] = useState(""); 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsRef = collection(db, "doctors");
        const doctorSnapshot = await getDocs(doctorsRef);
        let doctorList = [];

        doctorSnapshot.forEach((doc) => {
          doctorList.push({
            id: doc.id,
            name: doc.data().name,
          });
        });

        setDoctors(doctorList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);

    const clinicRef = doc(db, "clinics", doctor.id);
    const clinicSnap = await getDoc(clinicRef);

    if (clinicSnap.exists()) {
      const clinicData = clinicSnap.data();
      setClinicDetails(clinicData);
      setTimeSlots(clinicData.slots || []);
    } else {
      setClinicDetails(null);
      setTimeSlots([]);
    }

    const appointmentQuery = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctor.id),
      where("status", "in", ["pending", "booked"])
    );

    const appointmentSnapshot = await getDocs(appointmentQuery);
    const booked = appointmentSnapshot.docs.map((doc) => doc.data().timeSlot);
    setBookedSlots(booked);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !patientName.trim()) {
      alert("Please select a doctor, a time slot, and enter your name.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to book an appointment.");
        return;
      }

      await addDoc(collection(db, "appointments"), {
        doctorId: selectedDoctor.id,
        patientId: user.uid,
        patientName, 
        patientEmail: user.email,
        doctorName: selectedDoctor.name,
        clinicAddress: clinicDetails?.address,
        timeSlot: selectedSlot,
        status: "pending",
      });

      alert("Appointment request sent!");
      setBookedSlots([...bookedSlots, selectedSlot]);
      setSelectedSlot(null);
      setPatientName(""); 
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Book an Appointment</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            onClick={() => handleDoctorClick(doctor)}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: selectedDoctor?.id === doctor.id ? "#f0f0f0" : "white",
            }}
          >
            <h3>{doctor.name}</h3>
          </div>
        ))}
      </div>

      {selectedDoctor && clinicDetails && (
        <div style={{ marginTop: "20px" }}>
          <h3>Clinic Details</h3>
          <p><strong>Address:</strong> {clinicDetails.address}</p>
          <p><strong>Timings:</strong> {clinicDetails.startTime} - {clinicDetails.endTime}</p>

          <div style={{ marginTop: "10px" }}>
            <label><strong>Enter Patient's Name:</strong></label><br />
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter name"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <h3>Available Slots</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => !bookedSlots.includes(slot) && setSelectedSlot(slot)}
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  cursor: bookedSlots.includes(slot) ? "not-allowed" : "pointer",
                  backgroundColor: bookedSlots.includes(slot)
                    ? "red"
                    : selectedSlot === slot
                    ? "#0096c7"
                    : "white",
                  color: bookedSlots.includes(slot) ? "white" : selectedSlot === slot ? "white" : "black",
                }}
                disabled={bookedSlots.includes(slot)}
              >
                {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
              </button>
            ))}
          </div>
          <button
            onClick={handleBookAppointment}
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#0096c7",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}

export default PatientAppointment;

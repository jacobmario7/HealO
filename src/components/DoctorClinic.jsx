import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DoctorClinic = () => {
  const [clinic, setClinic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    startTime: "",
    endTime: "",
    duration: 15,
    slots: [],
  });
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchClinicData(currentUser.uid);
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchClinicData = async (uid) => {
    const savedClinic = localStorage.getItem(`clinic_${uid}`);
    if (savedClinic) {
      const data = JSON.parse(savedClinic);
      setClinic(data);
      setFormData(data);
      setSelectedSlots(data.slots || []);
      setIsEditing(false);
      setIsLoading(false);
    }

    const clinicRef = doc(db, "clinics", uid);
    const unsubscribe = onSnapshot(clinicRef, (clinicSnap) => {
      if (clinicSnap.exists()) {
        const data = clinicSnap.data();
        setClinic(data);
        setFormData(data);
        setSelectedSlots(data.slots || []);
        setIsEditing(false);
        setIsLoading(false);
        localStorage.setItem(`clinic_${uid}`, JSON.stringify(data)); 
      } else {
        setIsEditing(true);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTimeSlots = () => {
    const { startTime, endTime, duration } = formData;
    if (!startTime || !endTime || duration <= 0) return;

    const slots = [];
    let currentTime = new Date(`2023-01-01T${startTime}`);
    const endTimeObj = new Date(`2023-01-01T${endTime}`);

    while (currentTime < endTimeObj) {
      let nextTime = new Date(currentTime.getTime() + duration * 60000);
      if (nextTime > endTimeObj) break;
      slots.push(
        `${currentTime.toTimeString().slice(0, 5)} - ${nextTime
          .toTimeString()
          .slice(0, 5)}`
      );
      currentTime = nextTime;
    }
    setFormData({ ...formData, slots });
    setSelectedSlots([]);
  };

  const toggleSlotSelection = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = async () => {
    if (user) {
      const clinicRef = doc(db, "clinics", user.uid);
      const updatedData = { ...formData, slots: selectedSlots };
      await setDoc(clinicRef, updatedData);
      setClinic(updatedData);
      setIsEditing(false);
      localStorage.setItem(`clinic_${user.uid}`, JSON.stringify(updatedData)); 
    }
  };

  return (
    <div className="container">
      <h2>Doctor Clinic Details</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : clinic && !isEditing ? (
        <div>
          <p><strong>Clinic Name:</strong> {clinic.name}</p>
          <p><strong>Address:</strong> {clinic.address}</p>
          <p><strong>Timings:</strong> {clinic.startTime} - {clinic.endTime}</p>
          <p><strong>Slots:</strong> {clinic.slots?.join(", ") || "No slots selected"}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      ) : (
        <div>
          <div className="input-group">
            <label>Clinic Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Start Time:</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>End Time:</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Duration (mins per patient):</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
          </div>

          <button onClick={generateTimeSlots}>Generate Slots</button>

          <div className="time-slots">
            {formData.slots.length > 0 ? (
              formData.slots.map((slot) => (
                <div
                  key={slot}
                  className={`time-slot ${selectedSlots.includes(slot) ? "selected" : ""}`}
                  onClick={() => toggleSlotSelection(slot)}
                >
                  {slot}
                </div>
              ))
            ) : (
              <p>No slots generated yet.</p>
            )}
          </div>

          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default DoctorClinic;

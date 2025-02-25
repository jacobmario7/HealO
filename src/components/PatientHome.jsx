import appoin from '../assets/appointment.png';
import pres from '../assets/prescription.png';
import pat from '../assets/pathist.png';
import logo from '../assets/logo.png';
import React, { useEffect, useState } from "react";
import { User } from 'lucide-react';
import { db, auth } from "../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; 
import { onAuthStateChanged } from "firebase/auth";

function PatientHome() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation functions
  const patappoint = () => navigate('/patapp');
  const patpres = () => navigate('/patpres');
  const pathist = () => navigate('/pathist');

  // Function to fetch patient data
  const fetchPatientData = async (uid) => {
    const savedPatient = localStorage.getItem(`patient_${uid}`);
    if (savedPatient) {
      const data = JSON.parse(savedPatient);
      setPatientData(data);
      setIsLoading(false);
    }

    const q = query(collection(db, "patients"), where("uid", "==", uid));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setPatientData(doc.data());
          localStorage.setItem(`patient_${uid}`, JSON.stringify(doc.data())); // Store in localStorage
        });
      } else {
        console.log("No such document!");
        setPatientData(null);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setPatientData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPatientData(user.uid);
      } else {
        console.log("No user is logged in.");
        setIsLoading(false);
        setPatientData(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (isLoading) {
    return <div style={{fontSize:"60px",textAlign:"center",marginTop:"300px"}}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: "#9ACBD0", minHeight: "100vh" }}>
      <div className="home-container">
        <div className="profile">
          <div className="logocontainer">
            <div className="logo">
              <img src={logo} width="50px" alt="Logo" />
            </div>
            <div className="logotext">
              <h1>Heal<span style={{ color: "white" }}>O</span></h1>
            </div>
          </div>
          <div className="container">
            <div className="header">
              <div className="profile-section">
                <div className="avatar">
                  <User size="40" className="user-icon" />
                </div>
                <h3 className="name">{patientData?.name || "Patient"}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card-container">
          <div className="tophome">
            <h3 style={{ color: "white", letterSpacing: "1px", fontSize: "25px" }}>Dashboard</h3>
          </div>

          <div className="card wallet" style={{ marginLeft: "40px", cursor: "pointer" }} onClick={patappoint}>
            <div className="overlay"></div>
            <div className="circle">
              <img src={appoin} style={{ marginLeft: "10px" }} alt="Appointments" />
            </div>
            <p>Appointments</p>
          </div>

          <div className="card wallet" style={{ marginLeft: "70px", cursor: "pointer" }} onClick={patpres}>
            <div className="overlay"></div>
            <div className="circle">
              <img src={pres} alt="Add Prescription" />
            </div>
            <p>Prescriptions</p>
          </div>

          <div className="card wallet" style={{ marginLeft: "40px", cursor: "pointer" }} onClick={pathist}>
            <div className="overlay"></div>
            <div className="circle">
              <img src={pat} style={{ marginLeft: "10px" }} alt="Patient History" />
            </div>
            <p>History</p>
          </div>

          <div className="tophome" style={{ marginTop: "50px", height: "25px", borderBottomColor: "#0c5aa7" }}></div>
        </div>
      </div>
    </div>
  );
}

export default PatientHome;

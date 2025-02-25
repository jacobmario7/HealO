import appoin from '../assets/appointment.png';
import clinic from '../assets/clinic.png';
import pres from '../assets/prescription.png';
import pat from '../assets/pathist.png';
import logo from '../assets/logo.png';
import React from 'react';
import { useState,useEffect } from 'react';
import { 
  User, 
  Activity,  
  Award, 
  Users,
  Star,
  Settings,
  LogOut,
  Tally1
} from 'lucide-react';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";

function DoctorHome() {
  const navigate = useNavigate();

  const docappoint=()=>{
    navigate('/docapp');
  }
  const doccli=()=>{
    navigate('/doccli');
  }
  const docpres=()=>{
    navigate('/docpres');
  }
  const dochist=()=>{
    navigate('/dochist');
  }

  const [selectedMetric, setSelectedMetric] = useState('daily');
  const d=new Date().getDate();

  const [day, setDay] = useState('');
  useEffect(() => {
    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    setDay(currentDay);
  }, []);
  
  const performanceData = {
    daily: { patients: 12, rating: 4.9, efficiency: "98%" },
    weekly: { patients: 82, rating: 4.8, efficiency: "95%" },
    monthly: { patients: 345, rating: 4.85, efficiency: "96%" }
  };

  const upcomingAppointments = [
    { time: "10:00 AM", patient: "Sarah Johnson", type: "Check-up" },
    { time: "11:30 AM", patient: "Michael Smith", type: "Follow-up" },
    { time: "2:00 PM", patient: "Emma Davis", type: "Consultation" },
    { time: "4:00 PM", patient: "George Ball", type: "Checkup" }
  ];

  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login"); 
      } else {
        setUser(currentUser);
        fetchDoctorData(currentUser.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchDoctorData = async (userId) => {
    try {
      const docRef = doc(db, "doctors", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctorData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("doclogin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!doctorData) {
    return <div style={{fontSize:"60px",textAlign:"center",marginTop:"300px"}}>Loading...</div>;
  }

  return (
    <body style={{backgroundColor:"#9ACBD0"}}>
    <div className='home-container'>
      <div className='profile'>
        <div className='logocontainer'>
          <div className='logo'>
            <img src={logo} width="50px" />
          </div>
          <div className='logotext'>
            <h1>Heal<span style={{color:"white"}}>O</span></h1>
          </div>
        </div>
        <div className="container">
          <div className="header">
            
            <div className="profile-section">
              <div className="avatar">
                <User size="40" className="user-icon" />
              </div>
              <h3 className="name">Dr. {doctorData.name}</h3>
              <div className="designation">
                <Award size="16" className="award-icon" />
                <span className="role">{doctorData.speciality}</span>
              </div>
            </div>
          </div>

          <div className="metrics">
            <div className="metrics-header">
              <h4 className="metrics-title">Performance Metrics</h4>
              <div className="metrics-period">
                {['daily', 'weekly', 'monthly'].map((period) => (
                  <button
                    key={period}
                    className={`period-btn ${selectedMetric === period ? 'active' : ''}`}
                    onClick={() => setSelectedMetric(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="metrics-content">
              <div className="metric">
                <div className="metric-label">
                  <Users size="20" className="users-icon" color='green'/>
                  <span className="metric-name">Patients Seen</span>
                </div>
                <span className="metric-value">{performanceData[selectedMetric].patients}</span>
              </div>
              <div className="metric">
                <div className="metric-label">
                  <Star size="20" className="star-icon" color='yellow' />
                  <span className="metric-name">Rating</span>
                </div>
                <span className="metric-value">{performanceData[selectedMetric].rating}</span>
              </div>
              <div className="metric">
                <div className="metric-label">
                  <Activity size="20" className="activity-icon" color='red' />
                  <span className="metric-name">Efficiency</span>
                </div>
                <span className="metric-value">{performanceData[selectedMetric].efficiency}</span>
              </div>
              <div className='logocontainer' style={{gap:"10px",marginTop:"80px",textAlign:"center",marginLeft:"30px",cursor:"pointer"}}>
                <h3 style={{color:"white"}}>Settings</h3>
               <Settings size={20} color='white'/>
               <h3 style={{color:"white"}} onClick={handleLogout}>Logout</h3>
               <LogOut size={20} color='white'/>
              </div>
          </div>
          </div>
        </div>
      </div>
      <div className="card-container">
        <div className='tophome'>
            <h3 style={{color:"white",letterSpacing:"1px",fontSize:"25px"}}>Dashboard</h3>
        </div>
        <div className="card wallet" style={{marginLeft:"70px",cursor:"pointer"}} onClick={doccli}>
          <div className="overlay"></div>
          <div className="circle">
            <img src={clinic} alt="Clinic" style={{marginTop:"-8px"}} />
          </div>
          <p>Clinic</p>
        </div>

        <div className="card wallet" style={{marginLeft:"40px",cursor:"pointer"}} onClick={docappoint}>
          <div className="overlay"></div>
          <div className="circle">
            <img src={appoin} style={{ marginLeft: "10px" }} alt="Appointments" />
          </div>
          <p>Appointments</p>
        </div>

        <div className="card wallet" style={{marginLeft:"70px",cursor:"pointer"}} onClick={docpres}>
          <div className="overlay"></div>
          <div className="circle">
            <img src={pres} alt="Add Prescription" />
          </div>
          <p>Add Prescription</p>
        </div>

        <div className="card wallet" style={{marginLeft:"40px",cursor:"pointer"}} onClick={dochist}>
          <div className="overlay"></div>
          <div className="circle">
            <img src={pat} style={{ marginLeft: "10px" }} alt="Patient History" />
          </div>
          <p>Patients History</p>
        </div>
        <div className="tophome" style={{marginTop:"50px",height:"25px",borderBottomColor:"#0c5aa7"}}></div>
      </div>
      <div className='righthome'>
        <h1 style={{color:"aliceblue",background:"#1e3a8a",textAlign:"center"}}>{day}</h1>
        <h1 style={{fontSize:"80px",marginTop:"-8px",background:"#1e3a8a",textAlign:"center",borderBottom:"5px solid "}}>{d}</h1>
        <div className='logo1container'>
          <div className='logo1'>
            <Tally1 size={120} color='#1e3a8a'/>
          </div>
          <div className='logo1text'>
            <h3>Hi {doctorData.name}, you have <span style={{color:"aliceblue"}}>10 meetings</span> today</h3>
        </div>
        </div>
        
        <div style={{flex:"1",background:"aliceblue",marginTop:"80px",padding:"10px",borderTop:"5px solid"}}>
          <h3 style={{ color: "black", fontSize: "bold",marginLeft:"5px" }}>Today's Schedule</h3>
          <div style={{ marginTop: "1rem" }}>
            {upcomingAppointments.map((apt, index) => (
            <div key={index} style={{background: "#1e3a8a",padding: "12px",borderRadius: "8px",marginBottom: "12px",border:"5px solid"}}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "aliceblue", fontWeight: "600" }}>{apt.time}</p>
                <span style={{ fontSize: "0.875rem", color: "black" }}>{apt.type}</span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "#48A6A7", marginTop: "0.25rem" }}>{apt.patient}</p>
            </div>
            ))}
            <button style={{background:"#1e3a8a",color:"aliceblue",padding:"10px",border:"1",borderRadius:"25px",marginLeft:"63px",cursor:"pointer"}}>View all</button>
          </div>
        </div>     
      </div>
    </div>
  </body>
  );
}

export default DoctorHome;

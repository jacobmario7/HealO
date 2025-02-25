import { Route,Routes } from "react-router-dom";
import Reg from "./components/Reg";
import PatientRegister from "./components/PatientRegister";
import DoctorRegister from "./components/DoctorRegister";
import DoctorLogin from "./components/DoctorLogin";
import PatientLogin from "./components/PatientLogin";
import DoctorHome from "./components/DoctorHome";
import PatientHome from "./components/PatientHome";
import DoctorAppointment from "./components/DoctorAppointment";
import DoctorClinic from "./components/DoctorClinic";
import DoctorHistory from "./components/DoctorHistory";
import DoctorPrescription from "./components/DoctorPresciption";
import PatientAppointment from "./components/PatientAppointment";
import PatientHistory from "./components/PatientHistory";
import PatientPrescription from "./components/PatientPrescription";

function App(){
    return(
        <Routes>
            <Route path="/" element={<Reg/>}/>
            <Route path="/doctorreg" element={<DoctorRegister/>}/>
            <Route path="/patientreg" element={<PatientRegister/>}/>
            <Route path="/doclogin" element={<DoctorLogin/>}/>
            <Route path="/patlogin" element={<PatientLogin/>}/>
            <Route path="/dochome" element={<DoctorHome/>}/>
            <Route path="/pathome" element={<PatientHome/>}/>
            <Route path="/docapp" element={<DoctorAppointment/>}/>
            <Route path="/doccli" element={<DoctorClinic/>}/>
            <Route path="/dochist" element={<DoctorHistory/>}/>
            <Route path="/docpres" element={<DoctorPrescription/>}/>
            <Route path="/patpres" element={<PatientPrescription/>}/>
            <Route path="/patapp" element={<PatientAppointment/>}/>
            <Route path="/pathist" element={<PatientHistory/>}/>
        </Routes>
    );
}

export default App;
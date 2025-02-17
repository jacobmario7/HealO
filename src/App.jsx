import { Route,Routes } from "react-router-dom";
import Reg from "./components/Reg";
import PatientRegister from "./components/PatientRegister";
import DoctorRegister from "./components/DoctorRegister";
import DoctorLogin from "./components/DoctorLogin";
import PatientLogin from "./components/PatientLogin";
import DoctorHome from "./components/DoctorHome";
import PatientHome from "./components/PatientHome";


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
        </Routes>
    );
}

export default App;
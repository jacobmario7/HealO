import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";

function PatientLogin(){

    const navigate=useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
    
    const validateInputs = () => {
        const { email, password } = formData;
    
        if (!email || !password) {
          window.alert("Please enter both email and password.");
          return false;
        }
    
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          window.alert("Please enter a valid email.");
          return false;
        }
    
        if (password.length < 6) {
          window.alert("Password should be at least 6 characters long.");
          return false;
        }
    
        window.alert(""); 
        return true;
      };
    
    const handleLogin = async () => {
        if (!validateInputs()) return;
    
        try {
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
          navigate("/pathome");
        } catch (error) {
          window.alert("Invalid email or password.");
        }
      };

    const reg=()=>{
        navigate('/patientreg');
    }

    return(
        <div className="bg">
            <div className="reg" style={{height:"300px",marginTop:"220px"}}>
                <h2 style={{marginTop:"11px"}}>PATIENT LOGIN</h2>
                <div class="input-container">
                    <input class="input" name="text" type="text" placeholder='Enter your email'  onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                    <label class="label" for="input" style={{right:"317px"}}>Enter your Email</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>             
                <div class="input-container" style={{marginTop:"30px"}}>
                    <input class="input" name="text" type="text" placeholder='Enter your password' onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
                    <label class="label" for="input">Enter your Password</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>
                <button className='regbut' onClick={handleLogin} style={{width:"150px",height:"40px",marginTop:"25px",color:"black",backgroundColor:"#0096c7"}}>Submit</button><br></br>
                <button className='alrbut' onClick={reg} >Don't have an account? SignUp</button> 
            </div>
        </div>  
    );
}

export default PatientLogin;
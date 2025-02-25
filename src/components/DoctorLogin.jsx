import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function DoctorLogin() {
    const navigate = useNavigate();

    const reg=()=>{
        navigate('/doctorreg');
    }

    const [formData, setFormData] = useState({ email: "", password: "" });
  
    const validateInputs = () => {
      const { email, password } = formData;
  
      if (!email || !password) {
        window.alert("Please fill all fields.");
        return false;
      }
  
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        window.alert("Enter a valid email.");
        return false;
      }
  
      if (password.length < 6) {
        window.alert("Password should be at least 6 characters long.");
        return false;
      }
  
      return true;
    };
  
    const handleLogin = async () => {
      if (!validateInputs()) return;
  
      try {
          const userCredential = await signInWithEmailAndPassword(
              auth,
              formData.email,
              formData.password
          );
  
          const userId = userCredential.user.uid;
          const userDocRef = doc(db, "doctors", userId);
          const userDoc = await getDoc(userDocRef);
  
  
          if (userDoc.exists()) {
              const userData = userDoc.data(); 
              if (userData?.role === "doctor") {
                  navigate("/dochome");
              } else {
                  window.alert("Unauthorized access. Please check your credentials.");
              }
          } else {
              window.alert("No user data found. Contact support.");
          }
      } catch (error) {
          window.alert("Invalid email or password. Try again.");
      }
  };
  

    return(
        <div className="bg">
            <div className="reg" style={{height:"300px",marginTop:"220px"}}>
                <h2 style={{marginTop:"11px"}}>DOCTOR LOGIN</h2>
                <div class="input-container">
                    <input class="input" name="email" type="text" placeholder='Enter your email' onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                    <label class="label" style={{right:"317px"}}>Enter your Email</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>             
                <div class="input-container" style={{marginTop:"30px"}}>
                    <input class="input" name="password" type="text" placeholder='Enter your password' onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
                    <label class="label" >Enter your Password</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>
                <button className='regbut' onClick={handleLogin} type='submit' style={{width:"150px",height:"40px",marginTop:"25px",color:"black",backgroundColor:"#0096c7"}}>Submit</button><br></br>
                
                <button className='alrbut' onClick={reg}>Don't have an account? SignUp</button> 
            </div>
        </div>  
    );
}

export default DoctorLogin;

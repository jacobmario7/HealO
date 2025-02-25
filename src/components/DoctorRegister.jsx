import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function DoctorRegister() {
    const navigate = useNavigate();

    const login=()=>{
        navigate('/doclogin');
    }
    
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        license: "",
        speciality: "",
        email: "",
        username: "",
        password: "",
      });
    
      const validateInputs = () => {
        const { name, gender, license, speciality, email, username, password } = formData;
    
        if (!name || !gender || !license || !speciality || !email || !username || !password) {
            window.alert("Please fill all fields.");
            return false;
        }
    
        if (!/^[A-Za-z. ]+$/.test(name)) {
            window.alert("Name can only contain alphabets and '.'");
            return false;
        }
    
        if (!/^[A-Za-z ]+$/.test(gender)) {
            window.alert("Gender should only contain alphabets.");
            return false;
        }
    
        if (!/^[0-9]+$/.test(license)) {
            window.alert("License number should contain only numbers.");
            return false;
        }
    
        if (!/^[A-Za-z ]+$/.test(speciality)) {
            window.alert("Speciality should only contain alphabets and spaces.");
            return false;
        }
    
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            window.alert("Enter a valid email.");
            return false;
        }
    
        if (username.length < 6) {
            window.alert("Username should be at least 6 characters long.");
            return false;
        }
    
        if (password.length < 6) {
            window.alert("Password should be at least 6 characters long.");
            return false;
        }
    
        return true;
    };
    
    
      const handleRegister = async () => {
        if (!validateInputs()) return;
    
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
    
          const userId = userCredential.user.uid;
    
          await setDoc(doc(db, "doctors", userId), {
            name: formData.name,
            gender: formData.gender,
            license: formData.license,
            speciality: formData.speciality,
            email: formData.email,
            username: formData.username,
            role: "doctor",
          });
          window.alert("Registered Successfully")
          navigate("/doclogin");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
              window.alert("Email already exists");
            } else {
              window.alert("Registration failed. Try again.");
            }
          }
      };

    return (
        <div className="bg">
            <div className="reg">
                <h2 style={{marginTop:"11px"}}>DOCTOR SIGNUP</h2>
                <div className="input-container" >
                    <input class="input" name="name" type="text" placeholder='Enter your name' onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
                    <label class="label"  style={{right:"317px"}}>Enter your Name</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>             
                <div className="input-container">
                    <input class="input" name="gender" type="text" placeholder='Enter your gender' onChange={(e) => setFormData({ ...formData, gender: e.target.value })}/>
                    <label class="label"  style={{right:"317px"}}>Enter your Gender</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>       
                <div className="input-container">
                    <input class="input" name="license" type="text" placeholder='Enter your license number'onChange={(e) => setFormData({ ...formData, license: e.target.value })}/>
                    <label class="label"  style={{right:"317px"}}>Enter your License</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>       
                <div className="input-container">
                    <input class="input" name="specialty" type="text" placeholder='Enter your speciality'onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}/>
                    <label class="label" >Enter your Speciality</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>       
                <div className="input-container">
                    <input class="input" name="email" type="text" placeholder='Enter your email' onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                    <label class="label"  style={{right:"317px"}}>Enter your Email</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>
                <div className="input-container">
                    <input class="input" name="username" type="text" placeholder='Enter your username' onChange={(e) => setFormData({ ...formData, username: e.target.value })}/>
                    <label class="label" >Enter your Username</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>        
                <div className="input-container">
                    <input class="input" name="password" type="text" placeholder='Enter your password'onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
                    <label class="label" >Enter your Password</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div> 
                <button className='regbut' onClick={handleRegister} type='submit' style={{width:"150px",height:"40px",marginTop:"22px",color:"black",backgroundColor:"#0096c7"}}>Submit</button><br></br>           
            
            <button className='alrbut' onClick={login}>Already a User? Login</button>
            </div>
        </div>
    );
}

export default DoctorRegister;

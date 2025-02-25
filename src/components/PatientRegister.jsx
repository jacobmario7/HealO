import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";


function PatientRegister() {

    const navigate=useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        email: "",
        username: "",
        password: "",
      });
    
    const login=()=>{
        navigate('/patlogin');
    }

    const validateInputs = () => {
        const { name, age, gender, email, username, password } = formData;
    
        if (!name || !age || !gender || !email || !username || !password) {
          window.alert("Please fill all fields.");
          return false;
        }
    
        if (!/^[A-Za-z. ]+$/.test(name)) {
          window.alert("Name should contain only alphabets and '.'");
          return false;
        }
    
        if (!/^\d+$/.test(age) || age <= 0 || age > 200) {
          window.alert("Age should be a positive number not exceeding 200.");
          return false;
        }
    
        if (!/^[A-Za-z]+$/.test(gender)) {
          window.alert("Gender should contain only alphabets.");
          return false;
        }
    
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          window.alert("Please enter a valid email.");
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

      const handleSubmit = async () => {
        if (!validateInputs()) return;
    
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
    
          await addDoc(collection(db, "patients"), {
            uid: userCredential.user.uid,
            name: formData.name,
            age: formData.age,
            gender: formData.gender,
            email: formData.email,
            username: formData.username,
          });
          window.alert("Registered Successfully")
          navigate("/patlogin");
        }catch (error) {
            if (error.code === "auth/email-already-in-use") {
              window.alert("Email already exists");
              navigate("/patientreg");
            } else {
              window.alert("Registration failed. Try again.");
              navigate("/patientreg");
            }
        }
      };

    return (
        <div className="bg">
            <div className="reg" style={{height:"580px",marginTop:"70px"}}>
                <h2 style={{marginTop:"11px"}}>PATIENT SIGNUP</h2>
                <div class="input-container" style={{marginTop:"20px"}}>
                    <input class="input" name="name" type="text" placeholder='Enter your name' onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
                    <label class="label" for="input" style={{right:"317px"}}>Enter your Name</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>             
                <div class="input-container">
                    <input class="input" name="age" type="text" placeholder='Enter your age'  onChange={(e) => setFormData({ ...formData, age: e.target.value })}/>
                    <label class="label" for="input" style={{right:"317px"}}>Enter your Age</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>       
                <div class="input-container">
                    <input class="input" name="gender" type="text" placeholder='Enter your gender' onChange={(e) => setFormData({ ...formData, gender: e.target.value })}/>
                    <label class="label" for="input" style={{right:"317px"}}>Enter your Gender</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>             
                <div class="input-container">
                    <input class="input" name="email" type="text" placeholder='Enter your Email' onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                    <label class="label" for="input" style={{right:"317px"}}>Enter your Email</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>
                <div class="input-container">
                    <input class="input" name="username" type="text" placeholder='Enter your Username' onChange={(e) => setFormData({ ...formData, username: e.target.value })}/>
                    <label class="label" for="input">Enter your Username</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div>        
                <div class="input-container">
                    <input class="input" name="password" type="text" placeholder='Enter your password'  onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
                    <label class="label" for="input">Enter your Password</label>
                    <div class="topline"></div>
                    <div class="underline"></div>
                </div> 
                <button className='regbut' onClick={handleSubmit} style={{width:"150px",height:"40px",marginTop:"22px",color:"black",backgroundColor:"#0096c7"}}>Submit</button><br></br>
                <button className='alrbut' onClick={login}>Already a User? Login</button>      
            </div>
        </div>
    );
}

export default PatientRegister;

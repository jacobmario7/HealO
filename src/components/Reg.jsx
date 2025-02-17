import '../App.css';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';


function Reg(){

    const navigate=useNavigate();

    const doc=()=>{
        navigate('/doctorreg')
    };
    const pat=()=>{
        navigate('/patientreg')
    };

    return(
        <div className='bg'>
        <div className='register'>
            <img src={logo} style={{width:"100px",marginTop:"40px"}}/>
            <h1 style={{fontSize:"4rem",marginTop:"20px",color:"black"}}>Heal<span style={{color:"white"}}>O</span></h1>
            <button className='regbut' onClick={doc}>Register as Doctor</button>
            <button className='regbut'onClick={pat}>Register as Patient</button>
        </div>
        </div>
    );
}

export default Reg;
import React from "react";
import "../Styles/signUpLogin.css"
import { BrowserRouter as Router,Routes, Route, Link} from 'react-router-dom';

const Signup: React.FC = () => {
  return(
    <>
    <section className="siBody">
      <section id = "loginsection" >
        
        <form>
            <h1 id = "loginheader">SIGNUP</h1>
            <div className = 'lol'>
                <label htmlFor="username">Username</label>
                <input id = "username" type = "text" placeholder = "Enter username" className = "input" required></input>
            </div>
            
            <div className = 'lol'>
                <label htmlFor="password">Password</label>
                <input id = "password" type = "password" placeholder="Enter Password" className = "input" required></input>
            </div>

            <div className = 'lol'>
                <input id = "password" type = "password" placeholder="Confrim Password" className = "input" required></input>
            </div>

            <div className = 'lol'>
                <button className = "loginbutton" type = 'submit'>SIGN UP</button>
            </div>
            <section className = "divider">OR</section>

            <button className="google" type="button">
            <img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" width = "20" />Continue with Google
          </button>
            <p>Already have an account? <Link to="/login">log in</Link></p>
            
        </form>
        
    </section>
    </section>
    
    </>
  )
};

export default Signup;

import React from "react";
import Signup from "./signup";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <>
      <section id="loginsection">
        <form>
          <h1 id="loginheader">LOGIN</h1>
          <div className='lol'>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" placeholder="Enter username" className="input" required></input>
          </div>
          
          <div className='lol'>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Enter Password" className="input" required></input>
          </div>
          <div className='lol'>
            <button className="loginbutton" type='submit'>LOGIN</button>
          </div>
          <section className="divider">OR</section>

          <button className="google" type="button">
            <img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" width = "25" />Continue with Google
          </button>
          
          <p>are you new? <Link to="./signup">sign up</Link></p>
        </form>
      </section>
    </>
  )
};

export default Login;
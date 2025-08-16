import { useState } from 'react'
import Login from './login';
import Signup from './signup';
import { BrowserRouter as Router,Routes, Route, Link} from 'react-router-dom';


const App : React.FC = () => {

  return (
    <Router>
      <section className = "App">
        <Routes>
          <Route path = "/" element = {<Login/>} />
          <Route path = "/signup" element = {<Signup/>}/>
        </Routes>
      </section>
    </Router>
  )
}

export default App

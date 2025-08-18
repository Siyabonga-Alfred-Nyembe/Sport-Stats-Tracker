import Login from './pages/login';
import Signup from './pages/signup';
import LandingPage from './pages/landingPage.tsx'
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';


const App : React.FC = () => {

  return (
    <Router>
      <section className = "App">
        <Routes>
          <Route path ="/" element= {<LandingPage/>}/>
          <Route path = "/login" element = {<Login/>} />
          <Route path = "/signup" element = {<Signup/>}/>
        </Routes>
      </section>
    </Router>
  )
}

export default App


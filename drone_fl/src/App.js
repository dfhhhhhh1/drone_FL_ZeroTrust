import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './SignIn/Register';
import Login from './SignIn/Login';
import TwoFactorAuth from './SignIn/TwoFactorAuth'
import Profile from './SignIn/Profile';
import ProtectedRoute from './Authentication/ProtectedRoute';
import Home from './Dashboard/Home'
import ProjectList from './Project/Projects';
import ProjectCreate from './Project/Create';
import Event from './Dashboard/event';
import TriggerEvent from './Dashboard/event';
import MemberList from './Project/MemberList';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/twoFactorAuth' element={<TwoFactorAuth />} />
        <Route path="/home" element = {
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
        />
        <Route path="/projects/create" element={
          <ProtectedRoute>
            <ProjectCreate />
          </ProtectedRoute>
        }
        />
        <Route path="/projects" element={
          <ProtectedRoute>
            <ProjectList />
          </ProtectedRoute>
        }
        />
        <Route path="/event" element = {
          <ProtectedRoute>
            <TriggerEvent />
          </ProtectedRoute>
        }
        />
        <Route path="/projects/memberlist/:name" element = {
          <ProtectedRoute>
            <MemberList />
          </ProtectedRoute>
        }
        />
      </Routes>
    </Router>
  )
}

export default App;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
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
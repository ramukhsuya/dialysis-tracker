import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddPatient from './components/AddPatient';
import AddSession from './components/AddSession';
import PatientDetails from './components/PatientDetails';
import './App.css';

function App() {
  const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;
  return <div className="app-shell"><header className="site-header"><div className="brand"><div className="brand-mark">✦</div><div><p className="eyebrow">CLINICAL OPERATIONS</p><h1>Dialysis Tracker</h1></div></div><nav className="main-nav" aria-label="Main navigation"><NavLink end to="/" className={navClass}>Overview</NavLink><NavLink to="/add-patient" className={navClass}>Patients</NavLink><NavLink to="/add-session" className="nav-link nav-link-primary">Log session</NavLink></nav></header><main className="page-content"><Routes><Route path="/" element={<Dashboard />} /><Route path="/add-patient" element={<AddPatient />} /><Route path="/add-session" element={<AddSession />} /><Route path="/patient/:id" element={<PatientDetails />} /></Routes></main></div>;
}
export default App;

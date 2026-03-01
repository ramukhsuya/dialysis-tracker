import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddPatient from './components/AddPatient';
import AddSession from './components/AddSession';
import PatientDetails from './components/PatientDetails'; // <-- THIS WAS MISSING!

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1>Dialysis Tracker 🩺</h1>
      
      <nav style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Dashboard</Link>
        <Link to="/add-patient" style={{ marginRight: '15px' }}>+ Add Patient</Link>
        <Link to="/add-session">+ Log Session</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/add-session" element={<AddSession />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
      </Routes>
    </div>
  );
}

export default App;
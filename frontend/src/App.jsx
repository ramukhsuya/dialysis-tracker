import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1>Dialysis Tracker 🩺</h1>
      
      {/* Navigation Menu */}
      <nav style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Dashboard</Link>
        <Link to="/add-patient" style={{ marginRight: '15px' }}>+ Add Patient</Link>
        <Link to="/add-session">+ Log Session</Link>
      </nav>

      {/* Page Content Switcher */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-patient" element={<h3>Add Patient Form (Coming Next!)</h3>} />
        <Route path="/add-session" element={<h3>Add Session Form (Coming Next!)</h3>} />
      </Routes>
    </div>
  );
}

export default App;
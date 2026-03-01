import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [todaysSessions, setTodaysSessions] = useState([]);
  const [filterAnomalies, setFilterAnomalies] = useState(false); // NEW: State for our filter toggle

  useEffect(() => {
    // Fetch all patients
    axios.get('http://localhost:5000/api/patients')
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients:", error));

    // Fetch today's schedule
    axios.get('http://localhost:5000/api/sessions/today')
      .then(response => setTodaysSessions(response.data))
      .catch(error => console.error("Error fetching schedule:", error));
  }, []);

  // NEW: Filter the sessions before we display them!
  const displayedSessions = filterAnomalies 
    ? todaysSessions.filter(session => session.anomalies && session.anomalies.length > 0)
    : todaysSessions;

  // NEW: Helper function to calculate status based on current time
  const getSessionStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // If there is no end time (older sessions), just assume completed if start time has passed
    if (!endTime) return now > start ? <span style={{ color: '#388e3c', fontWeight: 'bold' }}>✅ Completed</span> : <span style={{ color: '#f57c00', fontWeight: 'bold' }}>⏳ Not Started</span>;

    if (now < start) return <span style={{ color: '#f57c00', fontWeight: 'bold' }}>⏳ Not Started</span>;
    if (now >= start && now <= end) return <span style={{ color: '#1976d2', fontWeight: 'bold' }}>🔄 In Progress</span>;
    return <span style={{ color: '#388e3c', fontWeight: 'bold' }}>✅ Completed</span>;
  };

  return (
    <div>
      {/* TODAY'S SCHEDULE SECTION */}
      <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #90caf9' }}>
        
        {/* NEW: Flexbox header to put the title and the filter toggle on the same line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#1565c0' }}>📅 Today's Dialysis Schedule</h2>
          
          <label style={{ cursor: 'pointer', background: 'white', padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              checked={filterAnomalies} 
              onChange={(e) => setFilterAnomalies(e.target.checked)} 
            />
            Show Anomalies Only
          </label>
        </div>

        {displayedSessions.length === 0 ? (
          <p>{filterAnomalies ? "No anomalous sessions found today! 🎉" : "No sessions scheduled for today yet."}</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {displayedSessions.map(session => (
              <li key={session._id} style={{ background: 'white', padding: '15px', marginBottom: '10px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '16px' }}>{session.patientId ? session.patientId.name : 'Unknown Patient'}</strong>
                  {/* Render the dynamic status */}
                  {getSessionStatus(session.startTime, session.endTime)}
                </div>
                
                <strong>Time:</strong> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                {session.endTime ? ` - ${new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''} <br/>
                
                <strong>Machine:</strong> {session.machineId} <br/>
                <strong>BP:</strong> {session.systolicBP}/{session.diastolicBP} | <strong>Pre-Weight:</strong> {session.preWeight} kg
                
                {session.anomalies && session.anomalies.length > 0 && (
                  <div style={{ marginTop: '10px', color: '#d32f2f', fontSize: '14px', fontWeight: 'bold', background: '#ffebee', padding: '8px', borderRadius: '4px' }}>
                     {session.anomalies.join(' | ')}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* REGISTERED PATIENTS SECTION */}
      <h2>Registered Patients</h2>
      {patients.length === 0 ? (
        <p>Loading patients...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {patients.map(patient => (
            <li key={patient._id} style={{ marginBottom: '10px', padding: '15px', border: '1px solid #ccc', background: 'white', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <Link to={`/patient/${patient._id}`} style={{ textDecoration: 'none', color: '#333', display: 'block' }}>
                <strong style={{ fontSize: '18px', color: '#007bff' }}>{patient.name}</strong> <br/>
                <span style={{ color: '#666' }}>MRN: {patient.mrn} | Dry Weight: {patient.dryWeight} kg</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [todaysSessions, setTodaysSessions] = useState([]);

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

  return (
    <div>
      {/* TODAY'S SCHEDULE SECTION */}
      <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #90caf9' }}>
        <h2 style={{ marginTop: 0, color: '#1565c0' }}>📅 Today's Dialysis Schedule</h2>
        {todaysSessions.length === 0 ? (
          <p>No sessions scheduled for today yet.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {todaysSessions.map(session => (
              <li key={session._id} style={{ background: 'white', padding: '10px', marginBottom: '10px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <strong>Time:</strong> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br/>
                <strong>Patient:</strong> {session.patientId ? session.patientId.name : 'Unknown Patient'} <br/>
                <strong>Machine:</strong> {session.machineId}
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
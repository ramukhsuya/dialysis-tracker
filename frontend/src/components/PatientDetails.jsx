import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PatientDetails() {
  const { id } = useParams(); // Grabs the ID from the URL
  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // 1. Fetch all patients and find the one we clicked on
    axios.get('http://localhost:5000/api/patients')
      .then(response => {
        const foundPatient = response.data.find(p => p._id === id);
        setPatient(foundPatient);
      })
      .catch(error => console.error("Error fetching patient:", error));

    // 2. Fetch the session history specifically for this patient
    axios.get(`http://localhost:5000/api/sessions/${id}`)
      .then(response => setSessions(response.data))
      .catch(error => console.error("Error fetching sessions:", error));
  }, [id]);

  if (!patient) return <p>Loading patient data...</p>;

  return (
    <div style={{ maxWidth: '600px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>← Back to Dashboard</Link>
      
      <h2 style={{ marginTop: '15px' }}>{patient.name}'s Profile</h2>
      <p><strong>MRN:</strong> {patient.mrn} | <strong>Dry Weight:</strong> {patient.dryWeight} kg</p>
      
      <h3 style={{ borderBottom: '2px solid #ddd', paddingBottom: '5px', marginTop: '30px' }}>Session History</h3>
      
      {sessions.length === 0 ? (
        <p>No dialysis sessions logged yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {sessions.map(session => (
            <li key={session._id} style={{ background: 'white', padding: '15px', marginBottom: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <strong>Date:</strong> {new Date(session.startTime).toLocaleString()} <br/>
              <strong>Pre-Weight:</strong> {session.preWeight} kg <br/>
              <strong>Blood Pressure:</strong> {session.systolicBP}/{session.diastolicBP} <br/>
              <strong>Machine:</strong> {session.machineId} <br/>
              {session.nurseNotes && <span><strong>Notes:</strong> {session.nurseNotes} <br/></span>}
              
              {/* Render Historical Anomalies if they exist! */}
              {session.anomalies && session.anomalies.length > 0 && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginTop: '10px', fontSize: '14px' }}>
                  <strong>⚠️ Alerts Triggered:</strong>
                  <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                    {session.anomalies.map((anomaly, idx) => (
                      <li key={idx}>{anomaly}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatientDetails;
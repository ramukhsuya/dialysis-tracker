import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  
  // NEW: State to handle which note is being edited
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  useEffect(() => {
    // Fetch patient info
    axios.get('http://localhost:5000/api/patients')
      .then(response => {
        const foundPatient = response.data.find(p => p._id === id);
        setPatient(foundPatient);
      })
      .catch(error => console.error("Error fetching patient:", error));

    // Fetch session history
    axios.get(`http://localhost:5000/api/sessions/${id}`)
      .then(response => setSessions(response.data))
      .catch(error => console.error("Error fetching sessions:", error));
  }, [id]);

  // NEW: Functions to handle editing
  const startEditing = (session) => {
    setEditingSessionId(session._id);
    setEditNoteContent(session.nurseNotes || '');
  };

  const saveNote = async (sessionId) => {
    try {
      await axios.put(`http://localhost:5000/api/sessions/${sessionId}/notes`, { nurseNotes: editNoteContent });
      // Update the local state so the UI changes instantly without refreshing!
      setSessions(sessions.map(s => s._id === sessionId ? { ...s, nurseNotes: editNoteContent } : s));
      setEditingSessionId(null); // Close the edit box
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Failed to save the note. Please try again.");
    }
  };

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
              <strong>Date:</strong> {new Date(session.startTime).toLocaleDateString()} <br/>
              <strong>Time:</strong> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                {session.endTime ? ` - ${new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''} <br/>
              <strong>Pre-Weight:</strong> {session.preWeight} kg <br/>
              <strong>Blood Pressure:</strong> {session.systolicBP}/{session.diastolicBP} <br/>
              <strong>Machine:</strong> {session.machineId} <br/>
              
              {/* NEW: The Edit Note UI */}
              <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '5px', border: '1px solid #eee' }}>
                {editingSessionId === session._id ? (
                  <div>
                    <textarea 
                      value={editNoteContent} 
                      onChange={(e) => setEditNoteContent(e.target.value)} 
                      rows="3" 
                      style={{ width: '95%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <div>
                      <button onClick={() => saveNote(session._id)} style={{ background: '#4caf50', color: 'white', border: 'none', padding: '5px 12px', cursor: 'pointer', borderRadius: '4px', marginRight: '8px', fontWeight: 'bold' }}>Save</button>
                      <button onClick={() => setEditingSessionId(null)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 12px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong>Notes:</strong> {session.nurseNotes ? session.nurseNotes : <em>No notes recorded.</em>}
                    <button onClick={() => startEditing(session)} style={{ marginLeft: '10px', background: '#ffeb3b', border: '1px solid #ccc', padding: '3px 8px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>✏️ Edit</button>
                  </div>
                )}
              </div>
              
              {/* Historical Anomalies */}
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
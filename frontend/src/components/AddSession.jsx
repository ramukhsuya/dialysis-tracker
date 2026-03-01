import { useState, useEffect } from 'react';
import axios from 'axios';

function AddSession() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    startTime: '',
    endTime: '', 
    preWeight: '',
    systolicBP: '',
    diastolicBP: '',
    machineId: '',
    nurseNotes: ''
  });
  const [message, setMessage] = useState('');
  const [anomalies, setAnomalies] = useState([]);

  // Fetch patients as soon as the component loads to populate the dropdown
  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAnomalies([]); // Clear previous anomalies
    
    try {
      const response = await axios.post('http://localhost:5000/api/sessions', formData);
      setMessage('Session successfully logged!');

      // If the backend detected anomalies, grab them and display them!
      if (response.data.anomalies && response.data.anomalies.length > 0) {
        setAnomalies(response.data.anomalies);
      }

      // Clear the form for the next entry (now includes endTime!)
      setFormData({ patientId: '', startTime: '', endTime: '', preWeight: '', systolicBP: '', diastolicBP: '', machineId: '', nurseNotes: '' });
    } catch (error) {
      console.error("Error adding session:", error);
      setMessage('Failed to log session. Please check the inputs.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
      <h2>Log Dialysis Session</h2>
      
      {message && <p style={{ fontWeight: 'bold' }}>{message}</p>}

      {/* THE ANOMALY ALERT BOX */}
      {anomalies.length > 0 && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '5px', marginBottom: '15px', border: '1px solid #ef9a9a' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Clinical Alerts Triggered!</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {anomalies.map((anomaly, index) => (
              <li key={index}><strong>{anomaly}</strong></li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Dropdown to select a patient */}
        <select name="patientId" value={formData.patientId} onChange={handleChange} required style={{ padding: '8px' }}>
          <option value="">-- Select Patient --</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>{p.name} (MRN: {p.mrn})</option>
          ))}
        </select>

        <label style={{ marginBottom: '-10px', fontSize: '14px', color: '#555' }}>Start Time:</label>
        <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required style={{ padding: '8px' }} />
        
        {/* NEW END TIME INPUT */}
        <label style={{ marginBottom: '-10px', fontSize: '14px', color: '#555' }}>End Time:</label>
        <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required style={{ padding: '8px' }} />
        
        <input type="number" name="preWeight" placeholder="Pre-Dialysis Weight (kg)" step="0.1" value={formData.preWeight} onChange={handleChange} required style={{ padding: '8px' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" name="systolicBP" placeholder="Systolic BP" value={formData.systolicBP} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
          <input type="number" name="diastolicBP" placeholder="Diastolic BP" value={formData.diastolicBP} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
        </div>

        <input type="text" name="machineId" placeholder="Machine ID (e.g., M-101)" value={formData.machineId} onChange={handleChange} required style={{ padding: '8px' }} />
        
        <textarea name="nurseNotes" placeholder="Nurse Notes / Observations" value={formData.nurseNotes} onChange={handleChange} rows="3" style={{ padding: '8px' }}></textarea>
        
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Log Session
        </button>
      </form>
    </div>
  );
}

export default AddSession;
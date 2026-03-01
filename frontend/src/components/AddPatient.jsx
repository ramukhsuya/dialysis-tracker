import { useState } from 'react';
import axios from 'axios';

function AddPatient() {
  const [formData, setFormData] = useState({
    name: '',
    mrn: '',
    dryWeight: '',
    dateOfBirth: '',
    gender: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/patients', formData);
      setMessage('Patient successfully registered!');
      // Clear the form after success
      setFormData({ name: '', mrn: '', dryWeight: '', dateOfBirth: '', gender: '' }); 
    } catch (error) {
      console.error("Error adding patient:", error);
      setMessage('Failed to add patient. Ensure MRN is unique.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
      <h2>Register New Patient</h2>
      
      {message && <p style={{ fontWeight: 'bold' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ padding: '8px' }} />
        
        <input type="text" name="mrn" placeholder="MRN (e.g., MRN-102)" value={formData.mrn} onChange={handleChange} required style={{ padding: '8px' }} />
        
        <input type="number" name="dryWeight" placeholder="Dry Weight (kg)" step="0.1" value={formData.dryWeight} onChange={handleChange} required style={{ padding: '8px' }} />
        
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={{ padding: '8px' }} />
        
        <select name="gender" value={formData.gender} onChange={handleChange} style={{ padding: '8px' }}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save Patient
        </button>
      </form>
    </div>
  );
}

export default AddPatient;
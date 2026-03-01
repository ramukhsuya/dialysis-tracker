import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // <-- THIS WAS MISSING!

function Dashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h2>Registered Patients</h2>
      {patients.length === 0 ? (
        <p>Loading patients...</p>
      ) : (
        <ul>
          {patients.map(patient => (
            <li key={patient._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', background: 'white', borderRadius: '5px' }}>
              <Link to={`/patient/${patient._id}`} style={{ textDecoration: 'none', color: '#333' }}>
                <strong style={{ fontSize: '18px', color: '#007bff' }}>{patient.name}</strong> <br/>
                MRN: {patient.mrn} | Dry Weight: {patient.dryWeight} kg
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
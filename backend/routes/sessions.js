const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Patient = require('../models/Patient');

// POST: Log a session and check for anomalies
router.post('/', async (req, res) => {
  try {
    const { patientId, preWeight, systolicBP, diastolicBP } = req.body;
    
    // Fetch patient to compare current weight against their target dry weight
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const anomalies = [];

    // Anomaly Check 1: Fluid Overload (e.g., gaining more than 4kg over dry weight)
    const weightGain = preWeight - patient.dryWeight;
    if (weightGain > 4) {
      anomalies.push(`High fluid weight gain: ${weightGain.toFixed(1)}kg over dry weight.`);
    }

    // Anomaly Check 2: Abnormal Blood Pressure
    if (systolicBP > 160 || diastolicBP > 100) {
      anomalies.push(`Hypertension alert: ${systolicBP}/${diastolicBP}`);
    } else if (systolicBP < 90 || diastolicBP < 60) {
      anomalies.push(`Hypotension alert: ${systolicBP}/${diastolicBP}`);
    }

    const newSession = new Session({
      ...req.body,
      anomalies: anomalies // Save the flagged anomalies directly to the database
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Fetch all sessions for a specific patient
router.get('/:patientId', async (req, res) => {
  try {
    // Sort by date descending (newest first)
    const sessions = await Session.find({ patientId: req.params.patientId }).sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
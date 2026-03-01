const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Patient = require('../models/Patient');

// --- CLINICAL CONFIGURATION THRESHOLDS ---
const CLINICAL_THRESHOLDS = {
  maxWeightGain: 4.0, // maximum acceptable kg gained over dry weight
  bp: {
    systolicHigh: 160,
    diastolicHigh: 100,
    systolicLow: 90,
    diastolicLow: 60
  },
  duration: {
    targetHours: 4.0,
    minHours: 3.0,
    maxHours: 5.0
  }
};
// POST: Log a session and check for anomalies
router.post('/', async (req, res) => {
  try {
    const { patientId, startTime, endTime, preWeight, systolicBP, diastolicBP } = req.body;
    
    // Fetch patient to compare current weight against their target dry weight
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const anomalies = [];

    // Anomaly Check 1: Fluid Overload
    const weightGain = preWeight - patient.dryWeight;
    if (weightGain > CLINICAL_THRESHOLDS.maxWeightGain) {
      anomalies.push(`High fluid weight gain: ${weightGain.toFixed(1)}kg over dry weight.`);
    }

    // Anomaly Check 2: Abnormal Blood Pressure
    if (systolicBP > CLINICAL_THRESHOLDS.bp.systolicHigh || diastolicBP > CLINICAL_THRESHOLDS.bp.diastolicHigh) {
      anomalies.push(`Hypertension alert: ${systolicBP}/${diastolicBP}`);
    } else if (systolicBP < CLINICAL_THRESHOLDS.bp.systolicLow || diastolicBP < CLINICAL_THRESHOLDS.bp.diastolicLow) {
      anomalies.push(`Hypotension alert: ${systolicBP}/${diastolicBP}`);
    }

    // Anomaly Check 3: Abnormal Session Duration
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
      
      if (durationHours < CLINICAL_THRESHOLDS.duration.minHours) {
        anomalies.push(`Short session duration: ${durationHours.toFixed(1)} hrs (Target: ${CLINICAL_THRESHOLDS.duration.targetHours} hrs)`);
      } else if (durationHours > CLINICAL_THRESHOLDS.duration.maxHours) {
        anomalies.push(`Prolonged session: ${durationHours.toFixed(1)} hrs (Target: ${CLINICAL_THRESHOLDS.duration.targetHours} hrs)`);
      }
    }

    // NOW create the session after ALL checks are done!
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

// GET: Fetch today's schedule
router.get('/today', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysSessions = await Session.find({
      startTime: { $gte: startOfDay, $lte: endOfDay }
    }).populate('patientId', 'name mrn'); 

    res.json(todaysSessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all sessions for a specific patient
router.get('/:patientId', async (req, res) => {
  try {
    const sessions = await Session.find({ patientId: req.params.patientId }).sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update nurse notes for a specific session
router.put('/:id/notes', async (req, res) => {
  try {
    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      { nurseNotes: req.body.nurseNotes },
      { new: true } 
    );
    if (!updatedSession) return res.status(404).json({ message: 'Session not found' });
    res.json(updatedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
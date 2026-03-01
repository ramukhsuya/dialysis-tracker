const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Patient = require('../models/Patient');

// POST: Log a session and check for anomalies
router.post('/', async (req, res) => {
  try {
    const { patientId, startTime, endTime, preWeight, systolicBP, diastolicBP } = req.body;
    
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

    // Anomaly Check 3: Abnormal Session Duration
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
      
      if (durationHours < 3) {
        anomalies.push(`Short session duration: ${durationHours.toFixed(1)} hrs (Target: 4 hrs)`);
      } else if (durationHours > 5) {
        anomalies.push(`Prolonged session: ${durationHours.toFixed(1)} hrs (Target: 4 hrs)`);
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
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find sessions happening today and pull in the patient's name and MRN
    const todaysSessions = await Session.find({
      startTime: { $gte: startOfDay, $lte: endOfDay }
    }).populate('patientId', 'name mrn'); // This connects the Session to the Patient model!

    res.json(todaysSessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all sessions for a specific patient
router.get('/:patientId', async (req, res) => {
  try {
    // Sort by startTime descending (newest first)
    const sessions = await Session.find({ patientId: req.params.patientId }).sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update nurse notes for a specific session
router.put('/:id/notes', async (req, res) => {
  try {
    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      { nurseNotes: req.body.nurseNotes },
      { new: true } // This tells MongoDB to return the updated document
    );
    if (!updatedSession) return res.status(404).json({ message: 'Session not found' });
    res.json(updatedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
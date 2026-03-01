const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  date: { type: Date, default: Date.now },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  preWeight: { type: Number, required: true }, // in kg
  postWeight: { type: Number }, // in kg
  systolicBP: { type: Number }, // Key vital for the anomaly check
  diastolicBP: { type: Number },
  machineId: { type: String, required: true },
  nurseNotes: { type: String },
  anomalies: [{ type: String }] // E.g., "High Post-Dialysis BP", "Excess Weight Gain","long sessions"
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
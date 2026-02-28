const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrn: { type: String, required: true, unique: true }, // Medical Record Number
  dryWeight: { type: Number, required: true }, // Target weight in kg
  dateOfBirth: { type: Date },
  gender: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
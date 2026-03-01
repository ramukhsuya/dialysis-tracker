const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const Session = require('./models/Session');

// Use the same local database URL from your server.js
const MONGO_URI = 'mongodb://localhost:27017/dialysis_tracker';
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear out the old data so we start fresh
    await Patient.deleteMany({});
    await Session.deleteMany({});
    console.log('Cleared existing database records.');

    // 2. Create Dummy Patients
    const patients = await Patient.insertMany([
      { name: 'John Doe', mrn: 'MRN-1001', dryWeight: 70.5 },
      { name: 'Jane Smith', mrn: 'MRN-1002', dryWeight: 62.0 },
      { name: 'Robert Johnson', mrn: 'MRN-1003', dryWeight: 85.0 }
    ]);
    console.log('Inserted 3 dummy patients.');

    // Helper variables for today's date
    const today = new Date();
    
    const pastStart = new Date(today);
    pastStart.setHours(8, 0, 0, 0); // 8:00 AM
    
    const pastEnd = new Date(today);
    pastEnd.setHours(12, 0, 0, 0); // 12:00 PM (4 hours - Normal)

    const shortStart = new Date(today);
    shortStart.setHours(13, 0, 0, 0); // 1:00 PM
    
    const shortEnd = new Date(today);
    shortEnd.setHours(15, 0, 0, 0); // 3:00 PM (2 hours - Short)

    // 3. Create Dummy Sessions for TODAY
    await Session.insertMany([
      // PERFECT NORMAL SESSION
      {
        patientId: patients[0]._id, // John Doe
        startTime: pastStart,
        endTime: pastEnd,
        preWeight: 72.0, // Only 1.5kg over dry weight (Normal)
        systolicBP: 120,
        diastolicBP: 80,
        machineId: 'M-101',
        nurseNotes: 'Patient tolerated treatment well. No complaints.',
        anomalies: [] // No anomalies
      },
      // ANOMALOUS SESSION (High BP, Short Duration, High Weight Gain)
      {
        patientId: patients[1]._id, // Jane Smith
        startTime: shortStart,
        endTime: shortEnd,
        preWeight: 67.5, // 5.5kg over dry weight (High)
        systolicBP: 175, // Hypertension
        diastolicBP: 110,
        machineId: 'M-102',
        nurseNotes: 'Patient complained of headache. Treatment shortened due to hypertension.',
        anomalies: [
          'High fluid weight gain: 5.5kg over dry weight.',
          'Hypertension alert: 175/110',
          'Short session duration: 2.0 hrs (Target: 4 hrs)'
        ]
      }
    ]);
    console.log('Inserted dummy dialysis sessions.');

    console.log('Database seeding complete! You can now start your server.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
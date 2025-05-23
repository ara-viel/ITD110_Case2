const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/residentDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));``



// Create Resident Schema and Model
const residentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  middle: { type: String, required: true },
  last: { type: String, required: true },
  birthDate: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  gender: { type: String, required: true },
  civil: { type: String, required: true },
  employment: { type: String, required: true },
  contact: { type: String, required: true }
});

const Resident = mongoose.model('Resident', residentSchema);

// Create Disaster Report Schema and Model
const disasterReportSchema = new mongoose.Schema({
  disasterName: { type: String, required: true },
  disasterType: { type: String }, // e.g., "Fire"
  location: { type: String },     // e.g., "Barangay 3"
  affectedResidents: { type: [String], required: true },
  casualties: { type: Number, required: true },
  reportedBy: { type: String },   // e.g., "001" or "Juan Dela Cruz"
  description: { type: String },
  reliefProvided: { type: String }, // optional
  severityLevel: { type: String },  // "Low", "Medium", "High"
    isDeleted: { type: Boolean, default: false }, // <--- Add this

  timestamp: { type: Date, default: Date.now }
});

const DisasterReport = mongoose.model('DisasterReport', disasterReportSchema);

// CRUD Operations

// Create (C)
app.post('/residents', async (req, res) => {
  const { id, name, middle, last, birthDate, age, address, gender, civil, employment, contact } = req.body;

  // Validate input fields
  if (!id || !name || !middle || !last || !birthDate || !age || !address || !gender || !civil || !employment || !contact) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new resident document
    const resident = new Resident({
      id,
      name,
      middle,
      last,
      birthDate,
      age,
      address,
      gender,
      civil,
      employment,
      contact
    });

    // Save resident to MongoDB
    await resident.save();

    // Respond with success message
    res.status(201).json({ message: 'Resident saved successfully' });
  } catch (error) {
    console.error('Error saving resident:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Resident with this ID already exists' });
    }
    
    res.status(500).json({ message: 'Failed to save resident' });
  }
});

// Read (R) - Get specific resident
app.get('/residents/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const resident = await Resident.findOne({ id }).select('-_id -__v');
    
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    res.json(resident);
  } catch (error) {
    console.error('Error retrieving resident:', error);
    res.status(500).json({ message: 'Failed to retrieve resident' });
  }
});

// Read all residents
app.get('/residents', async (req, res) => {
  try {
    const residents = await Resident.find().select('-_id -__v');
    res.json(residents);
  } catch (error) {
    console.error('Error retrieving residents:', error);
    res.status(500).json({ message: 'Failed to retrieve residents' });
  }
});

// Update (U)
app.put('/residents/:id', async (req, res) => {
  const id = req.params.id;
  const { name, middle, last, birthDate, age, address, gender, civil, employment, contact } = req.body;

  if (!name && !middle && !last && !birthDate && !age && !address && !gender && !civil && !employment && !contact) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    // Create an update object with only the provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (middle) updateData.middle = middle;
    if (last) updateData.last = last;
    if (birthDate) updateData.birthDate = birthDate;
    if (age) updateData.age = age;
    if (address) updateData.address = address;
    if (gender) updateData.gender = gender;
    if (civil) updateData.civil = civil;
    if (employment) updateData.employment = employment;
    if (contact) updateData.contact = contact;

    const result = await Resident.findOneAndUpdate(
      { id },
      updateData,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    res.status(200).json({ message: 'Resident updated successfully' });
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ message: 'Failed to update resident' });
  }
});

// Delete (D)
app.delete('/residents/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await Resident.findOneAndDelete({ id });
    
    if (!result) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    res.status(200).json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(500).json({ message: 'Failed to delete resident' });
  }
});


// DISASTER ROUTES
// Submit a disaster report
app.post('/disaster-report', async (req, res) => {
  const { disasterName, disasterType, location, reportedBy, description, reliefProvided,
    severityLevel,affectedResidents, casualties, timestamp } = req.body;

  if (!disasterName || !affectedResidents || casualties === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const report = new DisasterReport({
      disasterName,
        disasterType,
        location,
        reportedBy,
        description,
        reliefProvided,
        severityLevel,
      affectedResidents,
      casualties,
      timestamp: timestamp || new Date()
    });

    await report.save();

    res.status(201).json({ message: 'Disaster report submitted successfully' });
  } catch (error) {
    console.error('Error saving disaster report:', error);
    res.status(500).json({ message: 'Failed to submit disaster report' });
  }
});


// Get all disaster reports
// In your backend Express route:
app.get("/disaster-reports", async (req, res) => {
  try {
    const reports = await DisasterReport.find({ isDeleted: false }); // <--- filter
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve reports" });
  }
});


app.delete("/disaster-report/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await DisasterReport.findByIdAndUpdate(id, { isDeleted: true });

    if (!result) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report marked as deleted" });
  } catch (error) {
    console.error("Error marking report as deleted:", error);
    res.status(500).json({ message: "Failed to mark report as deleted" });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
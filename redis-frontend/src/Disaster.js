import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import "./Disaster.css";

const Disaster = () => {
  // State variables
  const [disasterName, setDisasterName] = useState("");
  const [disasterType, setDisasterType] = useState("");
  const [location, setLocation] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [description, setDescription] = useState("");
  const [reliefProvided, setReliefProvided] = useState("");
  const [severityLevel, setSeverityLevel] = useState("");
  const [affectedResidents, setAffectedResidents] = useState("");
  const [casualties, setCasualties] = useState("");
  const [reports, setReports] = useState([]); // To store reports

  // Fetch reports on page load
 useEffect(() => {
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/disaster-reports");
      // Filter out deleted reports
      const activeReports = response.data.filter(report => !report.deleted);
      setReports(activeReports); // Set active reports in state
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  fetchReports();
}, []); // This runs once on page load


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (
      !disasterName ||
      !affectedResidents ||
      !casualties ||
      !location ||
      !disasterType ||
      !reportedBy ||
      !severityLevel
    ) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      // Send data to the backend
      await axios.post("http://localhost:5000/disaster-report", {
        disasterName,
        disasterType,
        location,
        reportedBy,
        description,
        reliefProvided,
        severityLevel,
        affectedResidents: affectedResidents.split(",").map(id => id.trim()),
        casualties: parseInt(casualties),
        timestamp: new Date().toISOString()
      });

      toast.success("Report submitted successfully");

      // Fetch updated reports list after submission
      const response = await axios.get("http://localhost:5000/disaster-reports");
      setReports(response.data); // Update the reports state

      // Clear form fields
      setDisasterName("");
      setDisasterType("");
      setLocation("");
      setReportedBy("");
      setDescription("");
      setReliefProvided("");
      setSeverityLevel("");
      setAffectedResidents("");
      setCasualties("");
      toast.success('Report Submitted');
    } catch (error) {
      toast.error("Failed to submit disaster report");
      console.error("Submission error:", error);
    }
  };

 const handleDelete = async (id) => {
  console.log("Deleting report with ID:", id);

  try {
    // Mark report as deleted on the server side (soft delete)
    await axios.delete(`http://localhost:5000/disaster-report/${id}`);

    // Filter out the deleted report from the current state
    setReports((prevReports) => prevReports.filter((report) => report._id !== id));

    toast.success("Report deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete report");
  }
};



  
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <h1>Disaster Preparedness & Response</h1>
        <p>
          This page provides vital information on disaster preparedness,
          emergency contacts, and real-time updates to ensure the safety of our
          community.
        </p>

        {/* Disaster Report Form */}
        <div className="section">
          <h2>📝 Report a Disaster</h2>
          <form onSubmit={handleSubmit} className="disaster-form">
            {/* Form Fields */}
            <div>
              <label>Disaster Name</label>
              <input
                type="text"
                value={disasterName}
                onChange={(e) => setDisasterName(e.target.value)}
                placeholder="e.g. Typhoon Juan"
                required
              />
            </div>

            

            <div>
              <label>Disaster Type</label>
              <input
                type="text"
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value)}
                placeholder="e.g. Earthquake"
                required
              />
            </div>

            <div>
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. City XYZ"
                required
              />
            </div>

          

            <div>
              <label>Affected Residents</label>
              <textarea
                value={affectedResidents}
                onChange={(e) => setAffectedResidents(e.target.value)}
                placeholder="e.g. 001, 002, 003"
                required
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the disaster"
              />
            </div>

            <div>
              <label>Relief Provided</label>
              <textarea
                value={reliefProvided}
                onChange={(e) => setReliefProvided(e.target.value)}
                placeholder="e.g. Water, food, etc."
              />
            </div>

            

            <div>
              <label>Number of Casualties</label>
              <input
                type="number"
                value={casualties}
                onChange={(e) => setCasualties(e.target.value)}
                placeholder="e.g. 2"
                required
              />
            </div>

            <div>
              <label>Severity Level</label>
              <select
                value={severityLevel}
                onChange={(e) => setSeverityLevel(e.target.value)}
                required
              >
                <option value="">Select Severity Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            
            <div>
              <label>Reported By</label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
            </div>


            <button type="submit">📤 Submit Report</button>
          </form>
        </div>

        {/* Display List of Submitted Reports */}
        <div className="submitted-reports">
          <h2>Submitted Reports</h2>
          <ul>
            {reports.length === 0 ? (
              <p>No reports submitted yet.</p>
            ) : (
              reports.map((report) => (
                <li key={report._id}>
                  <h3>{report.disasterName}</h3>
                  <p>Location: {report.location}</p>
                  <p>Reported By: {report.reportedBy}</p>
                  <p>Severity Level: {report.severityLevel}</p>
                  <p>Casualties: {report.casualties}</p>
                  <p>Reported on: {new Date(report.timestamp).toLocaleString()}</p>
                  <button onClick={() => handleDelete(report._id)}>🗑 Delete</button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Disaster;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiFileText, FiBell } from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Sidebar from "./Sidebar";
import "./Dash.css";

Chart.register(...registerables);

const API_URL = "http://localhost:5000/residents"; // Adjust as needed

const Dash = () => {
  const [totalResidents, setTotalResidents] = useState(0);
  const [genderData, setGenderData] = useState({ male: 0, female: 0, other: 0 });
  const [employmentData, setEmploymentData] = useState({ employed: 0, unemployed: 0 });
  const [ageGroups, setAgeGroups] = useState({
    "0-10": 0, "11-20": 0, "21-30": 0, "31-40": 0, "41-50": 0, "51-60": 0, "61+": 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(API_URL);
      const residents = response.data;

      setTotalResidents(residents.length);

      let male = 0, female = 0, other = 0;
      let employed = 0, unemployed = 0;
      const ageGroupCounts = { "0-10": 0, "11-20": 0, "21-30": 0, "31-40": 0, "41-50": 0, "51-60": 0, "61+": 0 };

      residents.forEach((r) => {
        // Count gender
        if (r.gender === "Male") male++;
        else if (r.gender === "Female") female++;
        else other++;

        // Count employment
        if (r.employment === "Employed") employed++;
        else unemployed++;

        // Count age groups
        const age = r.age;
        if (age <= 10) ageGroupCounts["0-10"]++;
        else if (age <= 20) ageGroupCounts["11-20"]++;
        else if (age <= 30) ageGroupCounts["21-30"]++;
        else if (age <= 40) ageGroupCounts["31-40"]++;
        else if (age <= 50) ageGroupCounts["41-50"]++;
        else if (age <= 60) ageGroupCounts["51-60"]++;
        else ageGroupCounts["61+"]++;
      });

      setGenderData({ male, female, other });
      setEmploymentData({ employed, unemployed });
      setAgeGroups(ageGroupCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      {/* Banner Section */}
      <div className="dashboard-banner">
      <img src="/images/hindang2.jpg" 
        alt="Dashboard Banner" className="banner-image" />
        <h1 className="banner-text">Barangay Hindang</h1>
      </div>

      {/* Top Overview Section */}
      <div className="overview">
        <div className="info-card">
          <FiUsers size={30} />
          <h3>Total Residents</h3>
          <p>{totalResidents}</p>
        </div>
        <div className="info-card">
          <FiFileText size={30} />
          <h3>Employment</h3>
          <p>{((employmentData.employed / totalResidents) * 100).toFixed(0)}% Employed</p>
        </div>
        <div className="info-card">
          <FiBell size={30} />
          <h3>Gender</h3>
          <p>Male: {genderData.male}, Female: {genderData.female}, Other: {genderData.other}</p>
        </div>
      </div>

      {/* Data Visualization Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Gender Distribution</h3>
          <Pie
            data={{
              labels: ["Male", "Female", "Other"],
              datasets: [{
                data: [genderData.male, genderData.female, genderData.other],
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
              }]
            }}
          />
        </div>
        <div className="chart-container">
          <h3>Employment Status</h3>
          <Bar
            data={{
              labels: ["Employed", "Unemployed"],
              datasets: [{
                data: [employmentData.employed, employmentData.unemployed],
                backgroundColor: ["#4CAF50", "#F44336"],
              }]
            }}
            options={{ responsive: true }}
          />
        </div>
        <div className="chart-container">
          <h3>Age Group Distribution</h3>
          <Bar
            data={{
              labels: Object.keys(ageGroups),
              datasets: [{
                data: Object.values(ageGroups),
                backgroundColor: ["#1E88E5"],
              }]
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>

      
      
    </div>
  );
};

export default Dash;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'recharts';
import "./Reports.css";
import Sidebar from './Sidebar';

const Reports = () => {
  const [data, setData] = useState({ demographics: {}, socioEconomic: {} });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reports');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-xl font-bold mb-4">Reports & Analytics</h1>
      <Sidebar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Population */}
        <div className="report-card">
        <div className="report-card-content">
            <h2 className="text-lg font-semibold">Total Population</h2>
            <p>{data.demographics.totalPopulation || 0}</p>
        </div>
        </div>

        {/* Age Distribution */}
        <div className="report-card">
        <div className="report-card-content">
            <h2 className="text-lg font-semibold">Age Distribution</h2>
            <Bar data={data.demographics.ageDistribution} />
            </div>
            </div>

        {/* Gender Distribution */}
        <div className="report-card">
        <div className="report-card-content">
            <h2 className="text-lg font-semibold">Gender Distribution</h2>
            <Bar data={data.demographics.genderDistribution} />
            </div>
            </div>

        {/* Civil Status */}
        <div className="report-card">
        <div className="report-card-content">
            <h2 className="text-lg font-semibold">Civil Status</h2>
            <Bar data={data.demographics.civilStatus} />
            </div>
            </div>

        {/* Employment Status */}
        <div className="report-card">
        <div className="report-card-content">
            <h2 className="text-lg font-semibold">Employment Status</h2>
            <Bar data={data.socioEconomic.employmentStatus} />
            </div>
            </div>

        {/* Occupation Types */}
        <div className="report-card">
        <div className="report-card-content">
            <h2 className="text-lg font-semibold">Occupation Types</h2>
            <Bar data={data.socioEconomic.occupationTypes} />
            </div>
            </div>
      </div>
    </div>
  );
};

export default Reports;

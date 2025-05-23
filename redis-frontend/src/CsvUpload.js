// CsvUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

const CsvUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post('http://localhost:5000/upload-residents-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(response.data.message || 'Upload completed!');
    } catch (error) {
      toast.error('Upload failed');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="content" style={{ padding: '20px' }}>
        <h2>Upload Resident CSV</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload CSV</button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CsvUpload;

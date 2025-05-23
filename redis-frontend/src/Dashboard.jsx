import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import { QRCodeCanvas } from 'qrcode.react'; 
import { FaQrcode } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import './App.css';
import Sidebar from './Sidebar';


const API_URL = 'http://localhost:5000/residents';

function Dashboard() {
  const [formData, setFormData] = useState({ id: '', name: '', middle: '', last: '', birthDate: '', age: '', address: '', gender: '', civil: '', employment: '', contact: '' });
  const [residents, setresidents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);


  const fetchresidents = async () => {
    try {
      const response = await axios.get(API_URL);
      setresidents(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  useEffect(() => {
    fetchresidents();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // If birthDate changes, calculate age
    if (name === "birthDate") {
      const age = calculateAge(value);
      setFormData({ ...formData, birthDate: value, age: age.toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateAge = (birthDateStr) => {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      toast.success('Resident added successfully!');
      fetchresidents();
      setFormData({ id: '', name: '', middle: '', last: '', birthDate: '', age: '', address: '', gender: '', civil: '', employment: '', contact: '' });
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Error adding resident!');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.id}`, formData);
      toast.success('Resident updated successfully!');
      fetchresidents();
      setFormData({ id: '', name: '', middle: '', last: '', birthDate: '', age: '', address: '', gender: '', civil: '', employment: '', contact: '' });
      setIsEditing(false);
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Error updating resident!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Resident deleted!');
      fetchresidents();
    } catch (error) {
      toast.error('Error deleting resident!');
    }
  };

  const handleEdit = (resident) => {
    setFormData(resident);
    setIsEditing(true);
    setIsFormOpen(true);
  };


  const handleExportCSV = () => {
    const headers = Object.keys(residents[0] || {}).join(',');
    const rows = residents.map(res => Object.values(res).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'residents_backup.csv');
  };


  const handleShowQR = (resident) => {
    setSelectedResident(resident);
    setShowQRModal(true);
  };
  
  const handleDownloadQR = () => {
    const canvas = document.getElementById('qrCodeCanvas');
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${selectedResident.name}_QRCode.png`;
    link.click();
  };
  

  const filteredresidents = searchTerm.trim() === ''
  ? residents
  : residents.filter(resident =>
      resident.id?.toLowerCase() === searchTerm.toLowerCase() ||
      resident.name?.toLowerCase() === searchTerm.toLowerCase() ||
      resident.middle?.toLowerCase() === searchTerm.toLowerCase() ||
      resident.last?.toLowerCase() === searchTerm.toLowerCase() ||
      String(resident.age).toLowerCase() === searchTerm.toLowerCase() ||
      resident.gender?.toLowerCase() === searchTerm.toLowerCase() ||
      resident.address?.toLowerCase() === searchTerm.toLowerCase() ||
      resident.employment?.toLowerCase() === searchTerm.toLowerCase() ||
      resident.civil?.toLowerCase() === searchTerm.toLowerCase()
    );

  

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split("\n").filter(line => line.trim() !== '');
      const headers = lines[0].split(",").map(h => h.trim());
  
      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index];
        });
  
        obj.id = Number(obj.id);
        obj.age = Number(obj.age);
        return obj;
      });
  
      try {
        // Save to backend
        await Promise.all(data.map(resident => axios.post(API_URL, resident)));
        toast.success("CSV uploaded and saved!");
  
        fetchresidents(); // Refresh list to reflect in table
      } catch (error) {
        console.error("Upload error:", error);
       
      }
    };
  
    reader.readAsText(file);
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex' }}>
        <Sidebar />
      </div>
      <h1>Brgy. Hindang Profiling System</h1>

     
      <div style={{ marginBottom: 10 }}>
        
        
        <button className="btn" onClick={() => document.getElementById("csvInput").click()}>
        Upload CSV
          </button>
          <input
            type="file"
            id="csvInput"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleCSVUpload}
          />
      
        <button onClick={handleExportCSV}>📁 Export CSV</button>
        
      </div>
     
      <button onClick={() => setIsFormOpen(true)}>➕ Add Resident</button>

      {isFormOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsFormOpen(false)}>&times;</span>
            <h2>{isEditing ? "Edit Resident" : "Add Resident"}</h2>
            <form onSubmit={isEditing ? handleEditSubmit : handleAddSubmit}>
              <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required={!isEditing} disabled={isEditing} />
              <input type="text" name="name" placeholder="First Name" value={formData.name} onChange={handleChange} required />
              <input type="text" name="middle" placeholder="Middle Name" value={formData.middle} onChange={handleChange} required />
              <input type="text" name="last" placeholder="Last Name" value={formData.last} onChange={handleChange} required />
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
              <input type="text" name="address" placeholder="Purok/Zone" value={formData.address} onChange={handleChange} required />
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select name="civil" value={formData.civil} onChange={handleChange} required>
                <option value="">Select Civil Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
              <select name="employment" value={formData.employment} onChange={handleChange} required>
                <option value="">Select Employment Status</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
              </select>
              <input type="number" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
              <button type="submit">{isEditing ? "Update Resident" : "Add Resident"}</button>
            </form>
          </div>
        </div>
      )}

      <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />

      <h2>Resident List</h2>
      <table border="1" align="center" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Birth</th>
            <th>Age</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Civil</th>
            <th>Employment Status</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredresidents.map((resident) => (
            <tr key={resident.id}>
              <td>{resident.id}</td>
              <td>{`${resident.name} ${resident.middle} ${resident.last}`}</td>
              <td>{resident.birthDate}</td>
              <td>{resident.age}</td>
              <td>{resident.address}</td>
              <td>{resident.gender}</td>
              <td>{resident.civil}</td>
              <td>{resident.employment}</td>
              <td>{resident.contact}</td>
              

              <td>
                <button onClick={() => handleEdit(resident)}>✏️</button>
                <button onClick={() => handleDelete(resident.id)}>🗑️</button>
                <button onClick={() => handleShowQR(resident)} title="Show QR Code">  <FaQrcode size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showQRModal && selectedResident && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowQRModal(false)}>&times;</span>
            <h3>QR Code for {selectedResident.name}</h3>
            <QRCodeCanvas
              id="qrCodeCanvas"
              value={`ID: ${selectedResident.id}
                Name: ${selectedResident.name}
                Middle: ${selectedResident.middle}
                Last: ${selectedResident.last}
                Birth Date: ${selectedResident.birthDate}
                Age: ${selectedResident.age}
                Address: ${selectedResident.address}
                Gender: ${selectedResident.gender}
                Civil Status: ${selectedResident.civil}
                Employment: ${selectedResident.employment}
                Contact: ${selectedResident.contact}`}
              size={256}
              includeMargin={true}
            />
            <br />
            <button onClick={handleDownloadQR}>⬇️ Download Image</button>
          </div>
        </div>
      )}


      <ToastContainer />
      <Footer />
    </div>
  );
}

export default Dashboard;

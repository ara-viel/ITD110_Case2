import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Officials.css";

const Officials = () => {
  // State for officials
  const [officials, setOfficials] = useState([]);

  // Load officials from localStorage when the component mounts
  useEffect(() => {
    const storedOfficials = localStorage.getItem("officials");
    if (storedOfficials) {
      setOfficials(JSON.parse(storedOfficials));
    }
  }, []);

  // Function to update officials list and store it in localStorage
  const handleUpdateOfficials = (newOfficials) => {
    setOfficials(newOfficials);
    localStorage.setItem("officials", JSON.stringify(newOfficials));
  };

  // State for new official form
  const [newOfficial, setNewOfficial] = useState({
    name: "",
    position: "",
    photo: "",
  });

  // State for editing an official
  const [editOfficial, setEditOfficial] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setNewOfficial({ ...newOfficial, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewOfficial({ ...newOfficial, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new official
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newOfficial.name && newOfficial.position) {
      const newOfficialsList = [...officials, { ...newOfficial, id: Date.now() }];
      handleUpdateOfficials(newOfficialsList);
      setNewOfficial({ name: "", position: "", photo: "" });
    }
  };

  // Delete official
  const handleDelete = (id) => {
    const updatedOfficials = officials.filter((official) => official.id !== id);
    handleUpdateOfficials(updatedOfficials);
  };

  // Set official to edit mode
  const handleEdit = (official) => {
    setEditOfficial(official);
    setNewOfficial(official);
  };

  // Save edited official
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedOfficials = officials.map((official) =>
      official.id === editOfficial.id ? { ...newOfficial, id: official.id } : official
    );

    handleUpdateOfficials(updatedOfficials);
    setEditOfficial(null);
    setNewOfficial({ name: "", position: "", photo: "" });
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <h1>Barangay Officials</h1>

        {/* Add/Edit Official Form */}
        <form onSubmit={editOfficial ? handleSaveEdit : handleSubmit} className="official-form">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={newOfficial.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Enter Position"
            value={newOfficial.position}
            onChange={handleChange}
            required
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button type="submit">{editOfficial ? "💾 Save Changes" : "➕ Add Official"}</button>
        </form>

        {/* Officials Display (4-Column Grid) */}
        <div className="officials-grid">
          {officials.map((official) => (
            <div className="official-card" key={official.id}>
              <img src={official.photo || "/default-profile.png"} alt={official.name} className="official-photo" />
              <h3>{official.name}</h3>
              <p>{official.position}</p>
              <div className="official-actions">
                <button onClick={() => handleEdit(official)}>✏️ Edit</button>
                <button onClick={() => handleDelete(official.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Officials;
